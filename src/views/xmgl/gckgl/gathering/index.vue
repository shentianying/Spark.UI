<template>
  <div class="app-container output">
    <SearchBar ref="SearchBar" v-model="searchData" :search="handelSearch" :size="size" />
    <div class="action">
      <el-button v-has="'PROJECTGATHERING_ADD'" :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('','add')">新建</el-button>
      <div style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">制单</el-radio-button>
          <el-radio-button :label="1">未拆分</el-radio-button>
          <el-radio-button :label="2">已拆分</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <el-table
      v-loading="table.loading"
      :size="size"
      :data="table.list"
      border
      header-cell-class-name="table-header"
      element-loading-text="Loading"
      fit
      tooltip-effect="light"
      highlight-current-row
      @row-dblclick="handleDetails"
    >
      <el-table-column
        align="center"
        label="编号"
        width="150"
      >
        <template slot-scope="scope">
          <a class="link-decoration" href="javascript:;" @click="handleDetails(scope.row)">{{ scope.row.number }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组织机构" width="120">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称" width="120">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目状态" width="120">
        <template slot-scope="scope">
          {{ scope.row.projectState }}
        </template>
      </el-table-column>
      <el-table-column align="right" header-align="center" label="实收款" width="120">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.gatheringAmount, 2, 0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="120">
        <template slot-scope="scope">
          {{ scope.row.capitalType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款类型" width="120">
        <template slot-scope="scope">
          {{ scope.row.gatheringType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款日期" width="120">
        <template slot-scope="scope">
          {{ scope.row.gatheringDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="经手人" width="120">
        <template slot-scope="scope">
          {{ scope.row.personName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getType(scope.row.state)" size="mini" effect="plain">{{ getFormState(scope.row.state) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="制单人" width="120">
        <template slot-scope="scope">
          <el-tooltip placement="top" :enterable="false" effect="light">
            <div slot="content">
              制单人：{{ scope.row.createUserName }} 制单时间：{{ scope.row.createDate }}<br>
              更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate }}
            </div>
            <span>{{ scope.row.createUserName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state==0" v-has="'PROJECTGATHERING_EDIT'" :size="size" type="text" @click="handleEdit(scope.row.id,'edit')">编辑</el-button>
          <el-button v-else-if="scope.row.state==1" v-has="'PROJECTGATHERING_SPLIT'" :size="size" type="text" @click="handleSplit(scope.row)">拆分</el-button>
          <el-button v-else :size="size" type="text" @click="handleDetails(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="cout">
      <i class="el-icon-warning" />符合查询条件的实收款是：{{ utils.formatMoney(amount, 2, 0) }}
    </div>

    <div class="page">
      <el-pagination
        background
        :hide-on-single-page="false"
        layout="total, prev, pager, next, sizes, jumper"
        :total="table.total"
        :current-page.sync="table.currentPage"
        :page-size="table.pageSize"
        @current-change="handelSearch"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import { getProjectGatheringPaging } from '@/api/xmgl/projectGathering'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'

export default {
  name: 'ProjectGathering',
  components: {
    SearchBar
  },
  data() {
    return {
      tabPosition: 1,
      size: 'mini', // 整体大小 medium / small / mini
      searchData: searchData, // 渲染搜索栏数据
      amount: 0, // 统计收款

      /* 列表数据相关 */
      table: {
        list: [],
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: this.utils.getPersonalSettings().pageSize
      },
      formState: [{
        name: '制单',
        value: 0
      },
      {
        name: '未拆分',
        value: 1
      },
      {
        name: '已拆分',
        value: 10000
      },
      {
        name: '作废',
        value: -1
      }]
    }
  },
  activated() {
    console.info('actived')
    this.fetchData()
  },
  created() {
    console.info('created')
    this.fetchData()
  },
  methods: {

    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    async fetchData() {
      this.table.loading = true
      try {
        // 获取请求参数
        const postData = this.getSearchData()
        postData.currentPage = this.table.currentPage
        postData.pageSize = this.table.pageSize
        postData.type = this.tabPosition
        console.log('fetchData:请求数据', postData)

        // 请求开始
        const response = await getProjectGatheringPaging(postData)
        const {
          data,
          count,
          gathering,
          projectStateList,
          gatheringTypeList,
          capitalTypeList
        } = response

        this.amount = gathering
        // 搜索栏数据初始化
        projectStateList.forEach(ele => {
          // 项目状态选项数据转换
          ele.label = ele.name
        })
        capitalTypeList.forEach(ele => {
          ele.label = ele.name
        }) // 资金形式选项数据转换
        gatheringTypeList.forEach(ele => {
          ele.label = ele.name
        }) // 收款类型选项数据转换

        this.searchData = this.searchData.map(item => {
          item.options = item.name === 'projectState' ? projectStateList : item.options
          item.options = item.name === 'gatheringTypes' ? gatheringTypeList : item.options
          item.options = item.name === 'capitalTypes' ? capitalTypeList : item.options
          return item
        })

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
      const data = {}
      this.searchData.forEach(item => {
        const val = item.value
        if (item.name === 'yearmonth') {
          data.gatheringYear = val[0]
          data.gatheringMonth = val[1]
        } else if (item.name === 'year') {
          data.year = new Date(val).getFullYear()
        } else {
          data[item.name] = item.value
        }
      })
      return data
    },
    /**
     * @description: type栏数据转换
     * @param {Number} val
     */
    radioChange(val) {
      // 清空和切换条件
      this.searchData = searchData
      this.tabPosition = val
      // 填充数据
      this.fetchData()
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
    async handelSearch() {
      await this.fetchData()
    },
    /**
     * @description: 单据状态
     * @param {Object} row
     */
    getFormState(state) {
      const obj = this.formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    getType(state) {
      var type = 'primary'
      switch (state) {
        case 0:type = 'info'
          break
        case 1:type = 'warning'
          break
        case 1000:type = 'primary'
          break
        case 10000:type = 'success'
          break
        case -1:type = 'danger'
          break
      }
      return type
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'ProjectGatheringDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleSplit(row) {
      this.$router.push({ name: 'ProjectGatheringSplit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ProjectGatheringEdit', query: { type, id, refreshRouterName: this.$route.name }, params: { id: id, type: 3 }})
    }
  }
}
</script>
<style scoped lang="scss">
.output {
  .excel-export{
    margin-left:10px;
    display: inline-block;
  }
  .link-decoration {
    text-decoration: underline;
  }
  .action {
    margin-bottom: 22px;
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
