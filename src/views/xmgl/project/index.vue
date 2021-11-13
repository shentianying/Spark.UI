<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="searchText" placeholder="名称" size="mini" clearable maxlength="11" style="width:120px;" />
        <el-button type="primary" size="mini" icon="el-icon-search" @click="goSearch">搜索</el-button>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button v-has="'PROJECT_ADD'" type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>

    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
        tooltip-effect="light"
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column type="index" width="55" align="center" />
        <el-table-column align="center" label="地区" min-width="10" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.organization.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目名称" min-width="10" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目类型" min-width="10" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.typeId }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="是否使用" min-width="10">
          <template slot-scope="scope">
            <i v-if="scope.row.inUse" class="el-icon-check" />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
              <el-button v-has="'PROJECT_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
              <el-button size="mini" class="el-icon-view" plain circle @click="handleDetail(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="text-align:center;margin:10px 0;">
      <el-pagination
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
import { getProjectPaging } from '@/api/xmgl/project'
// import { getTree } from '@/utils/index'
// import ProjectAdd from './projectAdd'
export default {
  name: 'Project',
  components: {
    // ProjectAdd
  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      postTypeList: [],
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      searchText: ''
      // ,
      // comName: 'ProjectAdd'
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.name = this.searchText
      getProjectPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleDelete() {
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleEdit(row) {
      // this.currentRow = row
      // this.dialogTableVisible = true
      this.$router.push({ name: 'ProjectEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleAdd() {
      // this.currentRow = null
      // this.dialogTableVisible = true
      this.$store.dispatch('tagsView/delView', { name: 'ProjectEdit' })
        .then(() => {
          this.$router.push({ name: 'ProjectEdit', query: { refreshRouterName: this.$route.name }})
        })
    },
    handleDetail(row) {
      this.$router.push({ name: 'ProjectDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    goSearch() {
      this.fetchData()
    }
  }
}
</script>
