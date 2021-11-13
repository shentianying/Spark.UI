<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'MENULIST_ADD'" type="primary" size="mini" @click="handleAddPage">+添加菜单</el-button>
        <!-- <el-button type="warning" size="mini" @click="handleEditPage">编辑菜单</el-button> -->
        <!-- <el-button v-has="'Page_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
        <el-button v-has="'Page_EDIT'" type="warning" size="mini" @click="handleEdit">编辑</el-button>
        <el-button v-has="'Page_DEL'" type="danger" size="mini" @click="handleDelete">删除</el-button> -->
      </el-col>
    </el-row>

    <div>
      <el-table
        :data="list"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        size="mini"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        class="list"
      >
        <el-table-column label="菜单/路由名称">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.routerIcon" />
            {{ scope.row.routerTitle }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="路由名称" width="150">
          <template slot-scope="scope">
            {{ scope.row.routerName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="路由路径" width="200">
          <template slot-scope="scope">
            {{ scope.row.routerPath }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="路由组件" width="210">
          <template slot-scope="scope">
            {{ scope.row.routerComponent }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="重定向" width="100">
          <template slot-scope="scope">
            {{ scope.row.routerRedirect }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否显示" width="80">
          <template slot-scope="scope">
            {{ scope.row.routerHidden?'否':'是' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否页面" width="80">
          <template slot-scope="scope">
            {{ scope.row.isPage?'是':'否' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" width="60">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
              <el-button v-has="'MENULIST_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEditPage(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
import { GetAllList } from '@/api/xtgl/page'
import { getTree } from '@/utils/index'
import PageAdd from './pageAdd'
export default {
  name: 'PageList',
  components: {
    PageAdd
  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      comName: 'PageAdd'
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      GetAllList().then(response => {
        this.list = getTree(0, response.data)
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleDelete() {
    },
    handleEditPage(row) {
      this.currentRow = row
      this.dialogTableVisible = true
    },
    handleAddPage() {
      this.currentRow = null
      this.dialogTableVisible = true
    }
  }
}
</script>
