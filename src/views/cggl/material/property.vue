<template>
  <div class="app-container">
    <div>
      <!-- <el-row style="margin-bottom:10px;">
        <el-col :span="24">
          选择公司：<el-select v-model="organizationId" size="mini" placeholder="请选择公司" @change="getPorperty">
            <el-option v-for="(item,index) in orgList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
      </el-row> -->
      <el-row style="margin-bottom:10px;">
        <el-col :span="24" style="text-align:right;">
          <el-button v-has="'MATERIAL_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
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
      >
        <el-table-column type="index" width="40" />
        <el-table-column align="center" label="名称" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="编号" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序号" min-width="50">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否必选" min-width="50">
          <template slot-scope="scope">
            <i v-if="scope.row.isRequired" class="el-icon-check" />
            <i v-else class="el-icon-close" />
            <!-- <el-switch
              v-model="scope.row.isRequired"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled
            /> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="字段名" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.materialField }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否使用" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.inUse"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button v-has="'MATERIAL_EDIT'" plain circle size="mini" class="el-icon-edit" title="编辑" @click="handleEdit(scope.row)" />
            <!-- <el-button type="primary" size="mini" @click="handleDel(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        @close="dialogClose"
      >
        <add-material-property :obj="currentRow" :organization-id="organizationId" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllMaterialProperty, deleteMaterialProperty } from '@/api/cggl/material'
import AddMaterialProperty from './components/addMaterialProperty'
export default {
  name: 'MaterialProperty',
  components: {
    AddMaterialProperty
  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '物料属性编辑',

      currentRow: null,
      buttonLoading: false,

      organizationId: this.$store.state.user.selectOrgId
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
      this.listLoading = true
      var postData = {}
      postData.organizationId = this.organizationId
      getAllMaterialProperty(postData).then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    dialogClose() {
      this.dialogTableVisible = false
      // this.fetchData()
      this.getPorperty()
    },
    handleAdd() {
      this.currentRow = null
      // this.organizationId = 0
      this.dialogTableVisible = true
    },
    handleEdit(row) {
      this.currentRow = row
      this.dialogTableVisible = true
    },
    handleDel(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMaterialProperty({ id: id }).then(response => {
          this.getPorperty()
          this.$message.success(response.message)
        })
      }).catch(() => {
        this.$message.info('已经取消删除')
      })
    }
  }
}
</script>
