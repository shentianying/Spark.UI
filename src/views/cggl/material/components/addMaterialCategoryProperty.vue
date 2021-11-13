<template>

  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="分类名称">
      <span>{{ obj.name }}</span>
    </el-form-item>

    <el-form-item label="选择属性">
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
        <el-table-column type="selection" align="center" />
        <el-table-column align="center" label="属性名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="允许手动输入">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.canInput"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否可用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.inUse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllMaterialProperty, addMaterialCategoryProperty, getMaterialCategoryPropertyByCategoryId } from '@/api/cggl/material'
export default {
  name: 'AddMaterialCategoryProperty',
  props: {
    obj: {
      type: Object,
      default: null
    },
    organizationId: {
      type: Number,
      default: 0
    }

  },
  data() {
    return {
      ruleForm: {},
      list: null,
      listLoading: false,
      buttonLoading: false,
      selectionItem: [],
      rules: {
        // propertyArray: [{ type: 'array', required: true, message: '请选择', trigger: 'change' }]
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
          this.selectionItem.forEach(element => {
            const row = {}
            row.categoryId = this.obj.id
            row.propertyId = element.propertyId
            row.canInput = element.canInput
            row.inUse = element.inUse
            postData.push(row)
          })
          this.buttonLoading = true
          addMaterialCategoryProperty(postData).then(response => {
            this.$message(response.message)
            this.buttonLoading = false
            this.$emit('dialogClose')
          }).catch(() => { this.buttonLoading = false })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    fetchData() {
      this.listLoading = true
      new Promise((resolve, reject) => {
        var postData = {}
        postData.organizationId = this.organizationId
        getAllMaterialProperty(postData).then(response => {
          const data = []
          response.data.forEach(ele => {
            const row = {}
            row.name = ele.name
            row.inUse = true
            row.canInput = true
            row.propertyId = ele.id
            data.push(row)
          })
          this.list = data
          resolve(data)
        })
      }).then(res => {
        getMaterialCategoryPropertyByCategoryId({ categoryId: this.obj.id }).then(response => {
          response.data.forEach(ele => {
            res.forEach(row => {
              if (row.propertyId === ele.propertyId) {
                row.inUse = ele.inUse
                row.canInput = ele.canInput
              }
            })
            this.$refs.selectTable.toggleRowSelection(res.find(item => item.propertyId === ele.propertyId))
          })
          this.listLoading = false
        })
      }).catch(() => { this.listLoading = false })
    },
    handleSelectionChange(val) {
      this.selectionItem = val
    }
  }
}
</script>
