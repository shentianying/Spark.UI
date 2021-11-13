<template>
  <div class="app-container">
    <div>
      <el-row style="margin-bottom:10px;">
        <el-col :span="24" style="text-align:right;">
          <el-button type="primary" size="mini" @click="add">添加</el-button>
        </el-col>
      </el-row>

      <el-tree
        :data="list"
        node-key="id"
        :default-expand-all="false"
        :props="defaultProps"
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(node,data)">
              添加
            </el-button>
            <el-button type="text" size="mini" @click="() => update(data)">
              修改
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
      >
        <add-city :obj="currentRow" :pid="pid" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCityList } from '@/api/xtgl/city'
import AddCity from './components/addCity'
import { getTree } from '@/utils/index'
export default {
  name: 'City',
  components: {
    AddCity
  },
  data() {
    return {
      list: [],
      loading: true,
      dialogTableVisible: false,
      dialogTitle: '保存',
      currentRow: null,
      pid: 0,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.getPorperty()
    },
    getPorperty() {
      getCityList().then(response => {
        const { data } = response
        this.list = getTree(0, data)
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.getPorperty()
    },
    update(data) {
      this.currentRow = data
      this.dialogTableVisible = true
    },
    append(node, data) {
      this.currentRow = null
      this.pid = data.id
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.pid = 0
      this.dialogTableVisible = true
    }
  }
}
</script>
