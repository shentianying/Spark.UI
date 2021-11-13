<template>
  <div class="app-container">
    <!-- <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model.number="search.year" placeholder="年度" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-input v-model="search.workerName" placeholder="工人名称" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-input v-model="search.idNumber" placeholder="证件号" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-button v-has="'WHITELIST_INDEX'" type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="searchData(1)">搜索</el-button>
        <el-button v-has="'WHITELIST_ADD'" type="primary" :loading="listLoading" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row> -->
    <SearchBar ref="SearchBar" v-model="searchData" size="mini" :search="handelSearch" />
    <div class="action">
      <div>
        <el-button v-has="'WHITELIST_ADD'" type="primary" :loading="listLoading" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </div>
      <!-- <el-radio-group v-model="filter.type" class="checkbox-group" :size="size" @change="typeChange">
        <el-radio-button v-for="item in filter.typeOptions" :key="item.value" :label="item.value">{{ item.name }}</el-radio-button>
      </el-radio-group> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
      :header-cell-style="{'text-align': 'center'}"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="年度" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.year }}
        </template>
      </el-table-column>
      <el-table-column label="工号" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="工人姓名" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="证件号码" align="center" width="240">
        <template slot-scope="scope">
          {{ scope.row.idNumber }}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="140">
        <template slot-scope="scope">
          {{ whitelistTypeList.find(f=>f.value===scope.row.type).name }}
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center" min-width="140">
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="待审批人" min-width="10" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ getPerson(scope.row.billFlow.billFlowNode) }}
        </template>
      </el-table-column> -->
      <el-table-column label="制单人" align="center" width="120">
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
      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-has="'WHITELIST_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <!-- <el-tooltip content="移除" effect="light" placement="left-start" :enterable="false">
            <el-button size="mini" class="el-icon-delete" plain circle @click="handleDelete(scope.row)" />
          </el-tooltip> -->
          <!-- <el-tooltip content="审查" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state>0 && scope.row.state<10000" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
          </el-tooltip>
          <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===10000" size="mini" class="el-icon-view" plain circle @click="attitude(scope.row)" />
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align:center;margin:10px 0;">
      <el-pagination
        background
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="fetchData"
        @size-change="sizeChange"
      />
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        width="50%"
        :modal-append-to-body="false"
        @close="dialogClose"
      >
        <component :is="comName" :obj="currentRow" :list="whitelistTypeList" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getWhitelistPaging, deleteData } from '@/api/ggzx/workerWhitelist'
import { getDictionaryList } from '@/api/xtgl/dictionary'
import { getDefaultOptions } from '@/api/ggzx/worker'
import Edit from './edit'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'
export default {
  name: 'WorkerWhitelist',
  components: {
    Edit,
    SearchBar
  },
  data() {
    return {
      list: null,
      searchData: searchData,
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '工人白名单',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      currentRow: null,
      comName: 'Edit',
      search: {
        year: null,
        workerName: '',
        idNumber: ''
      },
      whitelistTypeList: null
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
    }
    getDictionaryList({ type: 'whitelistType' }).then(response => {
      const { data } = response
      this.whitelistTypeList = data
    })
    getDefaultOptions().then(op => {
      const { yearOptions } = op
      // 搜索栏数据初始化
      this.searchData = this.searchData.map(item => {
        item.options =
          item.name === 'year' ? yearOptions : item.options
        return item
      })
    })
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const postData = this.getSearchData()
      const currentPage = this.currentPage
      const pageSize = this.pageSize
      getWhitelistPaging({
        ...postData,
        currentPage,
        pageSize
      }).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      })
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
      this.currentPage = 1 // 返回第一页
      this.fetchData()
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.currentRow = null
      this.dialogTableVisible = true
      // this.$router.push({ name: 'WorkerBlacklistEdit', query: { refreshRouterName: this.$route.name }})
    },
    handleEdit(row) {
      this.currentRow = row
      this.dialogTableVisible = true
      // this.$router.push({ name: 'WorkerBlacklistEdit', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit' }, params: { id: row.id }})
    },
    handleDelete(row) {
      this.$confirm('确定要移除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteData({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.listLoading = false
          } else {
            this.$message.error(res.message)
            this.listLoading = false
          }
        }).finally(() => {
          this.listLoading = false
        })
      })
    },
    // attitude(row) {
    //   this.$router.push({ name: 'TargetCostAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    // },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    radioChange(value) {
      // 清空条件
      this.search = {
        workerName: '',
        idNumber: ''
      }
      // 填充数据
      this.fetchData()
    }
  }
}
</script>

<style>
  .el-table .review-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
