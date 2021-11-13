<template>
  <div class="app-container">
    <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="handelSearch" />
    <div class="action">
      <div>
        <el-button v-has="'WORKERORG_EDIT'" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd">新建</el-button>
      </div>
    </div>
    <el-table
      v-loading="table.loading"
      :data="table.list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      size="mini"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      class="list"
    >
      <el-table-column align="center" label="姓名" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属项目" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工性质" min-width="10">
        <template slot-scope="scope">
          {{ getTypeName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="职务" min-width="10">
        <template slot-scope="scope">
          {{ getPostName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="工号"
        :show-overflow-tooltip="true"
        width="130"
      >
        <template slot-scope="scope">
          <!-- {{ scope.row.number }} -->
          <a class="link-decoration" href="javascript:;" @click="handleEdit(scope.row)">{{ scope.row.number }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.post.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="上级姓名" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.parentPerson.name }}
        </template>
      </el-table-column> -->
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
          <el-button v-has="'WORKERORG_EDIT'" :size="size" type="text" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="dialogTableVisible">
      <el-dialog
        title="保存"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
      >
        <component :is="comName" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getWorkerOrganizationList, getDefaultOptions } from '@/api/ggzx/workerOrg'
import { getTree } from '@/utils/index'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'
import WorkerOrgEdit from './workerOrgEdit'
export default {
  name: 'WorkerOrg',
  components: {
    SearchBar,
    WorkerOrgEdit
  },
  data() {
    return {
      size: 'mini',
      searchData: searchData, // 渲染搜索栏数据
      /* 列表数据相关 */
      table: {
        list: [],
        loading: false,
        total: 0
      },
      personTypeList: [],
      postTypeList: [],
      dialogTableVisible: false,
      currentRow: null,
      comName: 'WorkerOrgEdit'
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getOptions()
      vm.fetchData()
    })
  },
  methods: {
    getOptions() {
      // 初始化数据获取
      getDefaultOptions().then(default_options => {
        const { personTypeOptions, postTypeOptions } = default_options
        // 搜索栏数据初始化
        personTypeOptions.forEach(ele => {
          // 人员类别选项数据转换
          ele.label = ele.name
        })
        postTypeOptions.forEach(ele => {
          // 职务选项数据转换
          ele.label = ele.name
        })
        this.personTypeList = personTypeOptions
        this.postTypeList = postTypeOptions
        this.searchData = this.searchData.map(item => {
          item.options =
            item.name === 'posts' ? postTypeOptions : item.options
          return item
        })
      })
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
        // 请求开始
        const response = await getWorkerOrganizationList({
          ...postData
        })
        // this.table.list = response.data
        this.table.list = getTree(0, response.data)
        if (this.table.list.length === 0) {
          response.data.forEach(e => {
            this.table.list = getTree(e.pid, response.data)
          })
        }
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
     * @description: 搜索回调
     */
    handelSearch() {
      this.fetchData()
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleEdit(row) {
      this.currentRow = row
      this.dialogTableVisible = true
    },
    handleAdd() {
      this.currentRow = null
      this.dialogTableVisible = true
    },
    getTypeName(row) {
      var v = this.personTypeList.find(f => f.value === row.personType)
      if (v) {
        return v.name
      } else {
        return ''
      }
    },
    getPostName(row) {
      var v = this.postTypeList.find(f => f.value === row.postTypeId)
      if (v) {
        return v.name
      } else {
        return ''
      }
    }
  }
}
</script>
<style scoped lang="scss">
.shouKuan {
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
