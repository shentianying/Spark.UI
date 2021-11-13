<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'WORKERTYPE_ADD'" type="primary" size="mini" @click="handleAdd">添加工种</el-button>
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
        <el-table-column label="工种名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="值">
          <template slot-scope="scope">
            {{ scope.row.value }}
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="是否可用" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.inUse"
              disabled
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
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
              <el-button v-has="'WORKERTYPE_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
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
import { getAllList } from '@/api/ggzx/workType'
import { getTree } from '@/utils/index'
import Edit from './edit'
export default {
  name: 'WorkType',
  components: {
    Edit
  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      comName: 'Edit'
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAllList().then(response => {
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
    handleEdit(row) {
      this.currentRow = row
      this.dialogTableVisible = true
    },
    handleAdd() {
      this.currentRow = null
      this.dialogTableVisible = true
    }
  }
}
</script>
