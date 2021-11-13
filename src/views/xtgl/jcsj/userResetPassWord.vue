<template>
  <div style="margin-top:40px;">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
    >
      <el-form-item label="原密码" prop="oldPassWord">
        <el-input v-model="ruleForm.oldPassWord" maxlength="12" style="width:300px;" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassWord1">
        <el-input v-model="ruleForm.newPassWord1" maxlength="12" style="width:300px;" />
      </el-form-item>
      <el-form-item label="确认密码" prop="newPassWord2">
        <el-input v-model="ruleForm.newPassWord2" maxlength="12" style="width:300px;" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { resetPassWord } from '@/api/rsgl/person'
export default {
  name: 'ResetPassWord',
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('长度最少6个字符!'))
      } else {
        if (this.ruleForm.newPassWord2 !== '') {
          this.$refs.ruleForm.validateField('newPassWord2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassWord1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        oldPassWord: '',
        newPassWord1: '',
        newPassWord2: ''
      },
      buttonLoading: false,
      rules: {
        oldPassWord: [{ required: true, message: '不能为空', trigger: 'blur' },
          { min: 6, message: '长度最少6个字符', trigger: 'blur' }],
        newPassWord1: [{ validator: validatePass, trigger: 'blur' }],
        newPassWord2: [{ validator: validatePass2, trigger: 'blur' }]
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
          this.buttonLoading = true
          const { oldPassWord, newPassWord1 } = this.ruleForm
          resetPassWord({ oldPassWord: oldPassWord, newPassWord: newPassWord1 })
            .then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.resetForm()
            }).catch(() => {
              this.buttonLoading = false
            })
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    initData() {}
  }
}
</script>
