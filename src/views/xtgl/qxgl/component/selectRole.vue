<template>
  <div>
    <el-divider content-position="left">用户角色</el-divider>
    <!-- <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-button type="primary" size="mini" @click="addUserRole">+添加用户角色</el-button>
      </el-col>
    </el-row> -->

    <el-table
      ref="UserRoleTable"
      v-loading="listLoading"
      :data="userRoleList"
      border
      size="mini"
    >
      <el-table-column align="center" label="角色名称" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.role ? scope.row.role.name : '' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" min-width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editUsreRole(scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="delUserRole(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-divider content-position="left">权限信息</el-divider>
    <el-table
      :data="userRolePermit"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      size="mini"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" width="250">
        <template slot-scope="scope">
          {{ scope.row.routerTitle }}
        </template>
      </el-table-column>

      <el-table-column align="left" label="权限">
        <template slot-scope="scope">
          <el-checkbox-group
            v-model="checkList"
          >
            <el-checkbox
              v-for="(item,index) in permit.filter(f=>f.pageId===scope.row.id)"
              :key="index"
              :label="item.id"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="dialogTableVisible">
      <el-dialog
        title="操作"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        @close="dialogClose"
      >
        <component
          :is="comName"
          :id="id"
          :obj="currentRow"
          @dialogClose="dialogClose"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUserRole, getRolePermitByRoleId } from '@/api/xtgl/role'
import { GetPageAndPermit } from '@/api/xtgl/page'
import UserRoleAdd from './userRoleAdd'
import { getTree } from '@/utils/index'
export default {
  name: 'SelectRole',
  components: {
    UserRoleAdd
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,

      selection: [],
      buttonLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      comName: '',
      // componentName: RolePermit,
      // render: false,
      userRoleList: null,
      userRolePermit: [],
      roleIds: null,
      checkList: [],
      permit: [],
      pageList: []
    }
  },
  computed: {
  },
  mounted() {
    this.fetchData()
  },
  activated() {
    if (this.$route.params.id) {
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize

      getUserRole({ userId: this.$route.query.id }).then(response => {
        const { data } = response
        // this.list = ua
        this.userRoleList = data
        this.roleIds = data.map(m => { return m.roleId }).toString()

        this.getUserRolePermit()
        this.listLoading = false
      })
    },
    getUserRolePermit() {
      new Promise((resolve, reject) => {
        GetPageAndPermit().then(response => {
          const { permitData, pageData } = response.data
          this.permit = permitData
          this.pageList = pageData
          this.userRolePermit = getTree(0, pageData)
          resolve()
        })
      }).then(res => {
        // 设置 角色的 节点
        getRolePermitByRoleId({ roleId: this.roleIds }).then(response => {
          this.checkList = response.data.map(m => { return m.permitId })
        })
      }).catch(() => {})
    },
    // delUserRole(row) {
    //   this.$confirm('是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     deleteUserRole({ id: row.id }).then(response => {
    //       this.fetchData()
    //       this.$message.success('删除成功')
    //       // this.render = false
    //       // this.$nextTick(() => {
    //       //   this.render = true
    //       // })
    //     })
    //   }).catch(() => {})
    // },
    // addUserRole() {
    //   this.comName = 'UserRoleAdd'
    //   this.currentRow = null
    //   this.dialogTableVisible = true
    // },
    // editUsreRole(row) {
    //   this.currentRow = row
    //   this.comName = 'UserRoleAdd'
    //   this.dialogTableVisible = true
    // },
    // handleSelectionChange(val) {
    //   this.selection = val
    // },
    dialogClose() {
      this.dialogTableVisible = false
      // this.render = false
      // this.$nextTick(() => {
      //   this.render = true
      // })
      this.fetchData()
    }
  }
}
</script>
