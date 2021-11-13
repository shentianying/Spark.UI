<template>
  <div>
    <!-- <el-alert :closable="false" show-icon title="为所选类别批量添加属性（只针对复选框选中的属性有效，所有属性只添加不删除）" /> -->
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="60px"
      size="mini"
    >
      <el-form-item>
        <span class="notes"><i class="el-icon-info" />为所选类别批量添加属性（只针对复选框选中的属性有效，所有属性只添加不删除）</span>
      </el-form-item>
      <el-form-item label="类别">
        <el-tag v-for="(item,index) in nodes" :key="index">{{ item.label }}</el-tag>
      </el-form-item>
      <el-form-item label="属性">
        <el-table
          ref="selectTable"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" :selectable="checkboxT" width="40" />
          <el-table-column align="center" label="属性名称" width="120">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="允许手动输入" width="70">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.canInput"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否必输" width="70">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isRequired2"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否目标成本必输" width="70">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isTargetRequired"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="可选项">
            <template slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.MCPItem" :key="index" type="primary">{{ item.name }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" title="添加可选项" @click="handleEdit(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>

    <div v-if="dialogTableVisible">
      <el-dialog
        title="添加可选项"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        append-to-body
      >
        <component :is="comName" :obj="currentRow" @addItemClose="addItemClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllMaterialProperty, addMaterialCategoryProperty } from '@/api/cggl/material'
import AddMCPItem2 from './addMCPItem2'
export default {
  name: 'AddRangeMCP',
  components: {
    AddMCPItem2
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    organizationId: {
      type: Number,
      default: 0
    },
    nodes: {
      type: Array,
      default: null
    }

  },
  data() {
    return {
      ruleForm: {},
      list: null,
      listLoading: false,
      buttonLoading: false,
      selectionItem: [],
      dialogTableVisible: false,
      currentRow: null,
      rules: {
        propertyArray: [{ type: 'array', required: true, message: '请选择', trigger: 'change' }],
        sort: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.selectionItem.length <= 0) {
            this.$message.error('请选择属性')
            return false
          }
          const postData = []
          var categoryIds = this.nodes.map(m => { return m.id })
          categoryIds.forEach(ele1 => {
            this.selectionItem.forEach(ele2 => {
              const row = {}
              row.categoryId = ele1
              row.propertyId = ele2.propertyId
              row.canInput = ele2.canInput
              row.isRequired = ele2.isRequired2
              row.MCPItem = ele2.MCPItem
              row.isTargetRequired = ele2.isTargetRequired
              postData.push(row)
            })
          })
          this.buttonLoading = true
          addMaterialCategoryProperty(postData).then(response => {
            this.$message(response.message)
            this.buttonLoading = false
            this.$emit('addProClose')
          }).catch(() => { this.buttonLoading = false })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.organizationId = this.organizationId
      getAllMaterialProperty(postData).then(response => {
        const data = []
        const selectionRow = []
        response.data.forEach(ele => {
          const row = {}
          row.id = ele.id
          row.name = ele.name
          row.canInput = false
          row.propertyId = ele.id
          row.MCPItem = []
          row.isRequired = ele.isRequired // 属性的必选
          row.isRequired2 = true
          row.isTargetRequired = true
          if (ele.isRequired) { selectionRow.push(row) }
          data.push(row)
        })

        this.list = data
        this.$nextTick(() => {
          selectionRow.forEach(row => {
            this.$refs.selectTable.toggleRowSelection(row)
          })
        })

        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.selectionItem = val
    },
    handleEdit(row) {
      this.currentRow = row
      this.comName = 'AddMCPItem2'
      this.dialogTableVisible = true
    },
    addItemClose(data) {
      // 查询出选中对象所在 list 中的对象
      const list0 = this.list.find(f => f.id === this.currentRow.propertyId)
      // list 对象中添加属性 值为传过来的对象
      list0.MCPItem = data
      // 可选项不为空时，设置该行为选中状态
      if (data.length > 0) this.$refs.selectTable.toggleRowSelection(list0, true)

      this.dialogTableVisible = false
    },
    checkboxT(row, index) {
      // 必选的行，就 禁用
      if (row.isRequired) { return false } else { return true }
    }
  }
}
</script>
