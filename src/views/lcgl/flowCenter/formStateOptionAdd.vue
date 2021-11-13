<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class=""
    size="mini"
  >
    <el-form-item label="可选操作名称" prop="name">
      <el-input v-model="ruleForm.name" size="mini" maxlength="50" />
    </el-form-item>
    <el-form-item label="值" prop="value">
      <el-input-number v-model="ruleForm.value" style="" :min="1" :max="99" :controls="false" />
    </el-form-item>

    <el-form-item label="是否使用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>

    <el-form-item style=" text-align:right;">
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AddFormStateOption',
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        formId: 0,
        name: '',
        value: 0,
        inUse: true
      },
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        value: [{ required: true, message: '请输入', trigger: 'blur' }]
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
            this.$emit('dialogCloseFormStateOption', newObj, 'update')
          } else {
            this.$emit('dialogCloseFormStateOption', newObj, 'add')
          }
        }
      })
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
