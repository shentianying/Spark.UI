<template>
  <div class="app-container">
    <el-row :span="24">
      <el-col>
        <!-- <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
      </el-col>
    </el-row>

    <el-table
      :data="list"
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
      <el-table-column v-if="showSubmitButton" align="center" width="80">
        <template slot="header">
          <el-checkbox @change="handleCheckAll">全选</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox @change="checked=>handleSelectAll(checked,scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column v-if="showSubmitButton" align="center" width="80">
        <template slot="header">
          <el-checkbox @change="handleSelectAllView">查看</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox @change="checked=>handleSelectView(checked,scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column align="left" label="权限">
        <template slot-scope="scope">
          <el-checkbox-group
            v-model="checkList"
            style="word-break: break-all;width: 100%;"
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
    <div v-if="showSubmitButton" style="text-align:center;margin-top:20px;">
      <el-button v-has="'ROLEPERMIT'" type="primary" size="mini" :loading="buttonLoading" @click="handleSave">保存</el-button>
      <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { GetPageAndPermit } from '@/api/xtgl/page'
import { addRolePermit, getRolePermitByRoleId } from '@/api/xtgl/role'
import { getTree, getLeafNodes } from '@/utils/index'

export default {
  name: 'RolePermit',
  components: {

  },
  props: {
    showSubmitButton: {
      type: Boolean,
      default: true
    },
    roleIds: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      buttonLoading: false,
      // currentRow: null,
      checkList: [],
      permit: [],
      pageList: [],
      defaultProps: {
        children: 'children',
        label: 'routerTitle'
      }
    }
  },
  computed: {

  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      new Promise((resolve, reject) => {
        GetPageAndPermit().then(response => {
          this.permit = response.data.permitData
          this.pageList = response.data.pageData
          this.list = getTree(0, response.data.pageData)
          resolve()
        })
      }).then(res => {
        // 设置 角色的 节点
        if (this.roleIds) {
          var postData = {}
          postData.roleId = this.roleIds
          getRolePermitByRoleId(postData).then(response => {
            this.checkList = response.data.map(m => { return m.permitId })
          })
        }
      }).catch(err => this.$message.info(err))
    },

    handleSave() {
      // const items = this.$refs.tree.getCheckedNodes(false, true)
      var postData = []
      this.checkList.forEach(e => {
        postData.push({ roleId: this.$route.query.id, permitId: e })
      })
      this.buttonLoading = true
      addRolePermit(postData).then(response => {
        this.$message.info(response.message)
        this.buttonLoading = false
        this.$emit('dialogClose')
      }).catch(() => { this.buttonLoading = false })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    getPermitId(pageId, view = null) {
      var _permit = this.permit
      let arr1 = []
      // 根据菜单id 生成树形结构
      var treeNode1 = getTree(pageId, this.pageList)
      // 根据树形结构，找出叶子节点
      var childTreeNodes = getLeafNodes({ children: treeNode1 }, [])
      // 根据菜单id 选出权限
      if (childTreeNodes.length) {
        // 数据不为空，不是叶子节点
        arr1 = _permit.filter(f => childTreeNodes.includes(f.pageId))
      } else {
        // 是叶子节点
        arr1 = _permit.filter(f => f.pageId === pageId)
      }
      if (view) {
        // 过滤所有查看
        arr1 = arr1.filter(f => f.isView)
      }
      return arr1.map(m => { return m.id })
    },
    handleCheckAll(checked) {
      if (checked) {
        var arr = this.getPermitId(0)
        this.checkList = arr
      } else {
        this.checkList = []
      }
    },
    handleSelectAllView(checked) {
      if (checked) {
        var arr = this.getPermitId(0, true)
        this.checkList = arr
      } else {
        this.checkList = []
      }
    },
    handleSelectView(checked, id) { // 选择查看
      var arr = this.getPermitId(id, true)
      this.checkProgress(checked, arr)
    },
    handleSelectAll(checked, id) { // 选择全选
      // 获取节点
      var arr = this.getPermitId(id)
      this.checkProgress(checked, arr)
    },
    checkProgress(checked, arr) {
      if (checked) {
        // 已经选中的和选中的和合并数组
        this.checkList = [...new Set([...this.checkList, ...arr])]
      } else {
        //  数组差集
        var arr1 = [...this.checkList].filter(x => !arr.some(ele => ele === x))
        this.checkList = [...new Set(arr1)]
      }
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
