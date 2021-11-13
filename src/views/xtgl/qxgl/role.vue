<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="searchText" size="mini" clearable maxlength="11" placeholder="名称" style="width:120px;" />&nbsp;&nbsp;
        <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
      </el-col>
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'ROLE_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>

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
      <el-table-column label="名称" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户列表">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.personList" :key="index" type="primary">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-has="'ROLE_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <!-- <el-dropdown split-button size="small" @click="handleEdit(scope.row)">
            <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
              <i class="el-icon-edit" />
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="alert('11')">重置密码</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
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
        width="70%"
        :modal-append-to-body="false"
        @close="dialogClose"
      >
        <component :is="comName" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolePaging } from '@/api/xtgl/role'
import RoleFrame from './roleFrame'
export default {
  name: 'Role',
  components: {
    RoleFrame
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogTableVisible: false,
      dialogTitle: '保存',
      comName: 'RoleFrame',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

      searchText: '',
      currentRow: null
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
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
      postData.companyId = this.$store.state.user.selectOrgId
      postData.name = this.searchText

      getRolePaging(postData).then(response => {
        this.list = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd(row) {
      this.$router.push({ name: 'RoleFrame', query: { refreshRouterName: this.$route.name }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'RoleFrame', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit' }, params: { id: row.id }})
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    goSearch() {
      this.fetchData()
    }
  }
}
</script>
