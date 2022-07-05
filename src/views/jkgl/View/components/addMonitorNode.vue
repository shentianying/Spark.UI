<template>

  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="选择分类" prop="pid">
      <org-select2
        v-if="list"
        v-model="ruleForm.pid"
        size="mini"
        :collapse-tags="false"
        :show-all-levels="true"
        :multiple="false"
        :options="list"
        :disabled="obj!==null"
        :filterable="true"
        expand-trigger="hover"
        placeholder="选择分类"
        :check-strictly="true"
        select-style="width:220px;"
      />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input
        v-model="ruleForm.name"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllMonitorNode, addMonitorNode, getMonitorById } from '@/api/jkgl/monitor'
export default {
  name: 'AddMonitorNode',
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
          addMonitorNode(postData).then(response => {
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
        getAllMonitorNode(postData).then(response => {
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
        getMonitorById({ categoryId: this.obj.id }).then(response => {
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
