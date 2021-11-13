<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <!-- <el-select v-model="selectRoleId" size="mini" placeholder="请选择角色" @change="changeRole">
          <el-option v-for="(item,index) in userRole" :key="index" :label="item.role.name" :value="item.roleId" />
        </el-select> -->
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
import { getTree, findPNode } from '@/utils/index'
import { addUserOrg, getUserDataRange } from '@/api/xtgl/role'

export default {
  name: 'UserDataRange',
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
      userOrg: [],
      orgList: []
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
    fetchData() {
      this.buttonLoading = true
      var postData = {}
      postData.userId = this.id
      getUserDataRange(postData).then(response => {
        const { data1, data2 } = response
        this.orgList = data2
        this.list = getTree(0, data2)
        this.userOrg = data1
        // 默认设置
        var orgIdArray = this.userOrg.map(m => m.organizationId)
        this.$refs.tree.setCheckedKeys(orgIdArray)
        this.buttonLoading = false
      }).catch(() => { this.buttonLoading = false })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    save() {
      var nodes = this.$refs.tree.getCheckedNodes()
      if (!nodes) {
        this.$message('请选择用户范围权限')
        return
      }
      // console.log('nodes:', nodes)
      const arr = []
      nodes.forEach(ele => {
        // 取最大父节点
        const pNodes = findPNode(this.orgList, ele.id)
        const pNode = pNodes.find(f => f.pid === 0)
        // 添加到数组
        arr.push({ userId: this.$route.query.id, companyId: pNode.id, organizationId: ele.id })
      })
      // console.log('拼装后的userorgList：', arr)
      this.buttonLoading = true
      addUserOrg(arr).then(response => {
        this.$message(response.message)
        this.buttonLoading = false
      }).catch(() => { this.buttonLoading = false })
    }
  }
}
</script>
<style>

</style>
