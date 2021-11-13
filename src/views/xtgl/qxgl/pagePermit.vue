<template>
  <div class="app-container">
    <el-container style="height:calc(100vh - 124px)">
      <el-aside width="240px">
        <el-tree
          ref="tree"
          :data="treeList"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span><svg-icon :icon-class="data.routerIcon" /> {{ node.label }}</span>
          </span>
        </el-tree>
      </el-aside>
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="2" :offset="22" style="text-align:right;">
              <el-button v-has="'PERMIT_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            size="mini"
            fit
            highlight-current-row
            style="margin-top:10px;"
          >
            <el-table-column align="center" label="说明" width="140">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="标识" width="140">
              <template slot-scope="scope">
                {{ scope.row.code }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="controller">
              <template slot-scope="scope">
                {{ scope.row.controller }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="action">
              <template slot-scope="scope">
                {{ scope.row.action }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="排序" width="50">
              <template slot-scope="scope">
                {{ scope.row.sort }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否查看" width="100">
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.isView"
                  disabled
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="所属页面" width="120">
              <template slot-scope="scope">
                {{ scope.row.page.routerTitle }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button v-has="'PERMIT_EDIT'" type="warning" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button v-has="'PERMIT_DEL'" type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>

    <div v-if="dialogTableVisible">
      <el-dialog
        title="保存"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
      >
        <component :is="comName" :obj="currentRow" :current-page="currentPage" @dialogClose="dialogClose" />
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { GetAllList, getPermit, deletePermit } from '@/api/xtgl/page'
import { getTree } from '@/utils/index'
import PageButtonAdd from './pageButtonAdd'
export default {
  name: 'Permit',
  components: {
    PageButtonAdd
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      currentRow: null, // 选中的右边的权限编辑项目
      currentPage: null, // 选中的左边的菜单项目
      comName: '',
      treeList: null
    }
  },
  mounted() {
    this.initTree()
    // new Promise(resolve => {
    //   this.initTree()
    //   resolve()
    // }).then(res => {
    //   this.fetchData()
    // })
  },
  methods: {
    fetchData() {
      var postData = {}
      postData.PageId = this.currentPage.id
      this.listLoading = true
      getPermit(postData).then(response => {
        const { data } = response
        this.list = data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    initTree() {
      this.listLoading = true
      GetAllList().then(response => {
        const { data } = response
        data.forEach(ele => {
          ele.label = ele.routerTitle
        })
        this.treeList = getTree(0, data)
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.currentRow = null
      this.comName = 'PageButtonAdd'
      this.dialogTableVisible = true
    },
    handleEdit(row) {
      this.currentRow = row
      this.comName = 'PageButtonAdd'
      this.dialogTableVisible = true
    },
    handleNodeClick(data, node) {
      if (node.isLeaf) {
        // 多次点击同一个节点不请求
        if (this.currentPage) {
          if (data.id === this.currentPage.id) {
            return
          }
        }
        // console.log('data:', data)
        this.currentPage = data
        this.fetchData()
      } else {
        this.list = []
      }
    },
    handleDelete(id) {
      this.listLoading = true
      deletePermit({ id: id }).then(response => {
        this.listLoading = false
        this.$message(response.message)
        this.fetchData()
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
