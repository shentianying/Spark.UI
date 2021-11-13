<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <el-input v-model="searchText" size="mini" clearable maxlength="11" placeholder="姓名或者工号" style="width:120px;" />&nbsp;&nbsp;
          <org-select2
            v-model="orgValue"
            :data-mode="0"
            size="mini"
            :collapse-tags="false"
            :show-all-levels="true"
            :multiple="false"
            :filterable="true"
            placeholder="部门"
            :check-strictly="false"
            select-style="width:120px;margin-right:10px;"
          />
          <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      size="mini"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="80">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="公司" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.company.name }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="部门" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属岗位" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.post">{{ scope.row.post.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center" min-width="100">
        <template slot-scope="scope">
          <i v-if="scope.row.inUse" class="el-icon-check" />
          <!-- <el-switch
            v-model="scope.row.inUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          /> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-dropdown split-button size="small" @click="handleEdit(scope.row)">
            <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
              <i class="el-icon-edit" />
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-tooltip class="item" effect="dark" content="默认密码：666666" placement="left">
                  <span @click="setDefaultPassword(scope.row)">重置密码</span>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- </el-main> -->
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
        title="设置"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
      >
        <component :is="comName" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPersonPaging, setDefaultPassword } from '@/api/rsgl/person'
import SelectRole from '@/views/xtgl/qxgl/component/selectRole'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UserFrame from './userFrame'
export default {
  name: 'Users',
  components: {
    SelectRole,
    UserFrame,
    OrgSelect2
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      searchText: '',
      comName: '',
      orgValue: [],
      loadOrg: true
    }
  },
  mounted() {
    this.fetchData()
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
      this.loadOrg = false
      this.$nextTick(() => {
        this.loadOrg = true
      })
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.name = this.searchText
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.orgId = this.orgValue

      getPersonPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    goSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      // this.currentRow = null
      // this.comName = 'AddUsers'
      // this.dialogTableVisible = true

      this.$router.push({ name: 'UserFrame', query: { id: 0, refreshRouterName: this.$route.name, showTag: 1 }})
    },
    handleEdit(row) {
      // this.$router.push({ path: '/xtgl/users/addUsers', query: { userId: row.id }})
      // this.$router.push({ name: 'AddUsers', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
      this.$router.push({ name: 'UserFrame', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit', showTag: 1 }, params: { id: row.id }})
    },
    setDefaultPassword(row) {
      setDefaultPassword({ id: row.id }).then(response => {
        this.$message(response.message)
        this.fetchData()
      })
    },
    handleAddRole(row) {
      this.currentRow = row
      this.comName = 'SelectRole'
      this.dialogTableVisible = true
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }

}
</script>
<style scoped>
.flexDiv{
  display:flex;align-items:center;
}
</style>
