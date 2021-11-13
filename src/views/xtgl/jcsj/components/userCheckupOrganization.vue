<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:left;">
        <el-select v-model="selectRoleId" size="mini" placeholder="请选择角色" @change="changeRole">
          <el-option v-for="(item,index) in userRole" :key="index" :label="item.role.name" :value="item.roleId" />
        </el-select>
      </el-col>
    </el-row>

    <el-tree
      ref="tree"
      :data="list"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="true"
      :check-strictly="true"
      :props="defaultProps"
    />
    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="save">保存</el-button>
      <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
    </div>
  </div>
</template>

<script>
// import { getOrganizationList } from '@/api/xtgl/organization'
import { getTree } from '@/utils/index'
// getUserCheckupOrganization
import { addUserCheckupOrganization, initUserCheckupOrganization } from '@/api/xtgl/role'

export default {
  name: 'UserCheckupOrganization',
  components: {
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: null,
      buttonLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      userRole: [],
      selectRoleId: null, // 下拉列表选中的角色
      UserCheckupOrganizationList: []
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.fetchData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.buttonLoading = true
      var postData = {}
      postData.personId = this.id
      await initUserCheckupOrganization(postData).then(response => {
        const { data1, data2, data3 } = response
        // 组织机构列表
        this.list = getTree(0, data2)
        // 初始化信息
        data1.forEach(e => {
          e.id = e.organizationId
        })
        this.UserCheckupOrganizationList = data1

        this.userRole = data3 // 绑定用户角色
        this.selectRoleId = data3[0].roleId// 设置下拉角色的默认值

        this.buttonLoading = false
      })
      // 初始化 审核范围 的值
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.UserCheckupOrganizationList.filter(f => f.roleId === this.selectRoleId))
      })

    //   await getOrganizationList().then(response => {
    //     this.list = getTree(0, response.data)
    //     this.buttonLoading = false
    //   })
    //   var postData = {}
    //   postData.personId = this.id
    //   await getUserCheckupOrganization(postData).then(response => {
    //     const { data } = response
    //     data.forEach(e => {
    //       e.id = e.organizationId
    //     })
    //     this.$refs.tree.setCheckedNodes(response.data)
    //   })
    },
    handleAdd() {
      this.currentRow = null
      this.pid = 0
      this.dialogTableVisible = true
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    save() {
      var nodes = this.$refs.tree.getCheckedNodes()
      var postData = {}
      postData.personId = this.id
      postData.orgIds = nodes.length > 0 ? nodes.map(m => { return m.id }).toString() : ''
      postData.roleId = this.selectRoleId
      this.buttonLoading = true

      addUserCheckupOrganization(postData).then(response => {
        this.$message(response.message)
        this.buttonLoading = false
      }).catch(() => {
        this.buttonLoading = false
      })
    },
    changeRole() {
      this.$refs.tree.setCheckedNodes(this.UserCheckupOrganizationList.filter(f => f.roleId === this.selectRoleId))
    }

  }
}
</script>
