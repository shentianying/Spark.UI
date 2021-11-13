<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class
      size="mini"
    >
      <el-form-item label="调研信息：" prop="content">
        <el-input v-model="ruleForm.content" type="textarea" :rows="4" maxlength="500" />
      </el-form-item>

      <el-form-item label="附件：">
        <up-file
          v-model="ruleForm.fileList"
          :size="50"
          :is-upfile="true"
          :is-preview="true"
          :is-download="true"
          :is-delete="true"
          :is-rename="true"
          :file-list="ruleForm.fileList"
        >
          提示：上传相关附件
        </up-file>
      </el-form-item>

    </el-form>

    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
    </div>

  </div>
</template>

<script>
import { putCustomerSurvey, addCustomerSurvey } from '@/api/ywgl/customer'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'CustomerSurveyAdd',
  components: {
    UpFile
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    customer: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        formId: 0,
        billId: 0,
        title: '客户调研',
        content: '',
        operation: '调研',
        fileList: [],
        attitudeType: 2,
        backGroup: 0, // 0 制单
        type: 6
      },
      buttonLoading: false,
      refreshRouterName: '',
      rules: {
        content: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var postData = JSON.parse(JSON.stringify(this.ruleForm))
          postData.formId = this.customer
          postData.billId = this.customer
          let tempIds = []
          if (postData.fileList.length > 0) {
            tempIds = postData.fileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.fileList = tempIds
          if (this.obj) {
            this.buttonLoading = true
            putCustomerSurvey(postData)
              .then((response) => {
                this.$message(response.message)
                this.buttonLoading = false
                this.$emit('dialogClose')
              }).catch(() => { this.buttonLoading = false })
          } else {
            this.buttonLoading = true
            addCustomerSurvey(postData)
              .then((response) => {
                this.$message(response.message)
                this.buttonLoading = false
                this.$emit('dialogClose')
              })
              .catch(() => {
                this.buttonLoading = false
              })
          }
        }
      })
    },
    fetchData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm = newObj
        this.ruleForm.fileList = newObj.upFiles
      }
    }
  }
}
</script>
