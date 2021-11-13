<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
      size="mini"
    >

      <el-form-item label="进展情况：" prop="title">
        <el-select v-model="ruleForm.title" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in contentTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="内容：" prop="content">
        <el-input v-model="ruleForm.content" placeholder="请输入" type="textarea" :rows="4" maxlength="500" show-word-limit />
      </el-form-item>

      <el-form-item label="上传附件">
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

      <el-form-item label="是否已完成：">
        <el-switch v-model="isFinish" active-text="是" active-color="#13ce66" inactive-text="否" inactive-color="#ff4949" />
      </el-form-item>

      <el-form-item align="center">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { addBussinessInfoReply } from '@/api/ywgl/bussinessInfo'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'BussinessInfoReplyAdd',
  components: {
    UpFile
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        formId: 0,
        billId: 0,
        title: '',
        content: '',
        operation: '回复',
        fileList: [],
        attitudeType: 2,
        backGroup: 0, // 0 制单
        type: 3
      },
      contentTypeList: [{
        value: '项目现状',
        label: '项目现状'
      }, {
        value: '拓展思路',
        label: '拓展思路'
      }, {
        value: '工作计划',
        label: '工作计划'
      }, {
        value: '其他',
        label: '其他'
      }],
      isFinish: false,
      buttonLoading: false,
      refreshRouterName: '',
      rules: {
        content: [{ required: true, message: '不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var postData = JSON.parse(JSON.stringify(this.ruleForm))
          postData.formId = this.obj.id
          postData.billId = this.obj.id
          let tempIds = []
          if (postData.fileList.length) {
            tempIds = postData.fileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.fileList = tempIds
          this.buttonLoading = true
          addBussinessInfoReply(postData)
            .then((response) => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            })
            .catch(() => {
              this.buttonLoading = false
            })
        }
      })
    }
  }
}
</script>

