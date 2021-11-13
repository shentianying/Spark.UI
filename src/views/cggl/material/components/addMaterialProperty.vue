<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="编号" prop="number">
      <el-input v-model="ruleForm.number" />
    </el-form-item>
    <el-form-item label="字段名" prop="number">
      <el-input v-model="ruleForm.materialField" />
    </el-form-item>
    <el-form-item label="排序号" prop="sort">
      <el-input-number v-model="ruleForm.sort" :min="1" :max="999" />
    </el-form-item>
    <el-form-item label="是否必选" prop="isRequired">
      <el-switch
        v-model="ruleForm.isRequired"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="是否目标成本必选" prop="isTargetRequired">
      <el-switch
        v-model="ruleForm.isTargetRequired"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="是否可用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putMaterialProperty, addMaterialProperty } from '@/api/cggl/material'
export default {
  name: 'AddMaterialProperty',
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
      ruleForm: {
        name: '',
        number: '',
        sort: 10,
        inUse: true,
        isRequired: false,
        isTargetRequired: false
      },
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          if (this.obj) {
            this.buttonLoading = true
            putMaterialProperty(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            this.buttonLoading = true
            addMaterialProperty(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    initData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm = newObj
      }
    }
  }
}
</script>
