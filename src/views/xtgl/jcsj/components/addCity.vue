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
      <el-input v-model="ruleForm.name" maxlength="20" />
    </el-form-item>
    <el-form-item label="排序号" prop="sort">
      <el-input-number v-model="ruleForm.sort" :min="1" :max="999" />
    </el-form-item>
    <el-form-item label="是否可用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putCity, addCity } from '@/api/xtgl/city'
export default {
  name: 'AddCity',
  props: {
    obj: {
      type: Object,
      default: null
    },
    pid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        sort: 1,
        inUse: true
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
          var postData = {}
          postData.sort = this.ruleForm.sort
          postData.name = this.ruleForm.name
          postData.inUse = this.ruleForm.inUse
          if (this.obj) {
            this.buttonLoading = true
            postData.id = this.ruleForm.id
            putCity(postData).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            this.buttonLoading = true
            newObj.pid = this.pid
            addCity(newObj).then(response => {
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
