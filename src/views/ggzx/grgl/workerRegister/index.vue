<template>
  <div class="app-container workerRegister">
    <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="handelSearch" />
    <div class="action">
      <div>
        <el-button v-has="'GRBD_ADD'" :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('')">新建</el-button>
      </div>
      <el-radio-group v-model="filter.type" class="checkbox-group" :size="size" @change="typeChange">
        <el-radio-button v-for="item in filter.typeOptions" :key="item.value" :label="item.value">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      v-loading="table.loading"
      :size="size"
      :data="table.list"
      header-cell-class-name="table-header"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @row-dblclick="handleDetails"
    >
      <el-table-column align="center" label="编号" min-width="10">
        <template slot-scope="scope">
          <el-link :underline="false" style="font-size: 12px;" @click="handelDetail(scope.row)">{{ scope.row.number }}</el-link>
          <!-- {{ scope.row.number }} -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="报到日期" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.registerDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="10">
        <template slot-scope="scope">
          <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="20">
        <template slot-scope="scope">
          <el-popover trigger="hover" :content="scope.row.remark" placement="top">
            <span slot="reference" class="ellipsis-2">{{ scope.row.remark }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="待审批人" min-width="10" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ getPerson(scope.row.billFlow) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="制单人" min-width="10">
        <template slot-scope="scope">
          <!-- {{ scope.row.createUserName }} -->
          <el-popover trigger="hover" placement="top">
            <p>制单人: {{ scope.row.createUserName }}&nbsp;&nbsp;&nbsp;制单时间: {{ scope.row.createDate }}</p>
            <p>更新人: {{ scope.row.lastEditUserName }}&nbsp;&nbsp;&nbsp;更新时间: {{ scope.row.lastEditDate }}</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.createUserName }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template v-slot="{ row }">
          <el-button v-if="row.state===0" v-has="'GRBD_EDIT'" :size="size" type="text" @click="handleEdit(row.id)">编辑</el-button>
          <el-button v-if="row.state>0&&row.state<10000" v-has="'GRBD_EDIT'" :size="size" type="text" @click="attitude(row.id)">审批</el-button>
          <el-button v-if="row.state===10000" v-has="'GRTC_ATTITUDE'" :size="size" type="text" @click="attitude(row.id)">审批详细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination

        background
        :hide-on-single-page="false"
        layout="prev, pager, next, sizes, jumper"
        :total="table.total"
        :current-page.sync="table.currentPage"
        :page-size="table.pageSize"
        @current-change="fetchData"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import { getWorkerRegisterPaging } from '@/api/ggzx/workerRegister'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'
export default {
  name: 'WorkerRegister',
  components: {
    SearchBar
  },
  data() {
    return {
      size: 'mini',
      searchData: searchData, // 渲染搜索栏数据
      filter: { // 过滤数据
        type: '3', // 类型
        typeOptions: [ // 类型数组
          {
            value: '0',
            name: '我发起的'
          },
          {
            value: '1',
            name: '待审批'
          },
          {
            value: '2',
            name: '已审批'
          },
          {
            value: '3',
            name: '列表'
          }
        ]
      },
      /* 列表数据相关 */
      table: {
        list: [],
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: this.utils.getPersonalSettings().pageSize
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData()
    })
  },
  methods: {
    /**
     * 类型重新选择的事件
     */
    typeChange() {
      this.fetchData()
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    async fetchData() {
      this.table.loading = true
      try {
        // 获取请求参数
        const postData = this.getSearchData()
        const { currentPage, pageSize } = this.table
        // 请求开始
        const response = await getWorkerRegisterPaging({
          ...postData,
          currentPage,
          pageSize,
          type: this.filter.type
        })
        const { data, count } = response

        // 列表数据初始化
        this.table.list = data
        this.table.total = count
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.table.loading = false
      }
    },
    /**
     * @description: 搜索栏数据转换
     * @return {Object} request数据
     */
    getSearchData() {
      const lastSearch = {}
      this.searchData.forEach(item => {
        const { value, transformType, name } = item
        if (transformType === 'property-serial') {
          value.forEach((ele, index) => {
            const serial = index + 1
            lastSearch[name + serial] = ele
          })
        } else {
          lastSearch[name] = value
        }
      })
      return lastSearch
    },
    /**
     * @description: 设置分页大小
     * @param {Number} val
     */
    sizeChange(val) {
      this.table.pageSize = val
      this.fetchData()
    },
    /**
     * @description: 搜索回调
     */
    handelSearch() {
      this.table.currentPage = 1 // 返回第一页
      this.fetchData()
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'WorkerRegisterDetail', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} id
     */
    handleEdit(id) {
      this.$router.push({ name: 'WorkerRegisterEdit', query: { id, refreshRouterName: this.$route.name }})
    },
    getFormState(row) {
      if (!row.billFlow) { return '流程空' }
      const formState = row.billFlow.form.formState
      this.formState = formState
      const state = row.state
      if (state === -1) return '作废'
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    // 审批
    attitude(id) {
      this.$router.push({ name: 'WorkerRegisterAttitude', query: { id, refreshRouterName: this.$route.name }})
    },
    // 详情
    handelDetail(row) {
      this.$router.push({ name: 'WorkerRegisterDetail', query: { id: row.id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.workerRegister {
  .link-decoration {
    text-decoration: underline;
  }
  .state{
    display: flex;
    justify-content: center;
    align-items: center;

    .circle.primary{
      background-color: #1890FF;
    }
    .circle.success{
      background-color: #52C41A;
    }
    .circle.error{
      background-color: #F5222D;
    }
    .circle.wran{
      background-color: #FA8C16;
    }
    .circle{
      border-radius: 50%;
      width: 5px;
      height: 5px;
      margin-right: 5px;
      background-color: rgba(145, 145, 145, 100);
    }
  }
  .action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    .excel-export{
      margin-left:10px;
      display: inline-block;
    }
    .checkbox-group {
      width: auto;
    }
  }
  .cout {
    color: #606266;
    font-size: 13px;
    border-radius: 2px;
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 10px;
    .el-icon-warning {
      padding: 0 5px;
      color: #1890ff;
    }
  }
  .page {
    text-align: right;
    margin: 10px 0;
  }

  /deep/.table-header {
    background-color: #f7f7f7;
    font-weight: normal;
    color: #606266;
  }
}
</style>
