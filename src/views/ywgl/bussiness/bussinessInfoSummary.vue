<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class=""
      size="mini"
    >

      <el-form-item label="定标日期：">
        <el-date-picker
          v-model="ruleForm.bidDate"
          type="date"
          placeholder="请选择"
          style="width:100%"
        />
      </el-form-item>

      <el-form-item label="中标单位：">
        <el-input v-model="ruleForm.bidWinner" maxlength="100" />
      </el-form-item>

      <el-form-item label="中标价格：">
        <el-input v-model="ruleForm.bidWinnerPrice" maxlength="100" />
      </el-form-item>

      <el-form-item label="投标排名：">
        第<el-input-number v-model="ruleForm.bidRank" controls-position="right" />（数字）名
      </el-form-item>

      <el-form-item label="总结：">
        <el-switch v-model="ruleForm.isSummaryFinish" active-text="已完成" inactive-text="未完成" />
      </el-form-item>

    </el-form>

    <el-form
      ref="summaryForm"
      status-icon
      :model="summaryForm"
      label-width="200px"
      class=""
      size="mini"
    >
      <el-form-item label="总结内容：" prop="content">
        <el-input v-model="summaryForm.content" placeholder="请输入" type="textarea" :rows="4" maxlength="500" show-word-limit />
      </el-form-item>

      <el-form-item label="上传附件">
        <up-file
          v-model="summaryForm.fileList"
          :size="50"
          :is-upfile="true"
          :is-preview="true"
          :is-download="true"
          :is-delete="true"
          :is-rename="true"
          :file-list="summaryForm.fileList"
        >
          提示：上传相关附件
        </up-file>
      </el-form-item>

      <el-form-item align="center">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { putBussinessInfoBid, addBussinessInfoReply } from '@/api/ywgl/bussinessInfo'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'BussinessInfoSummary',
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
        bidWinner: '',
        bidDate: '',
        bidWinnerPrice: '',
        bidRank: 0,
        isSummaryFinish: false
      },
      summaryForm: {
        id: 0,
        formId: 0,
        billId: 0,
        title: '投标总结',
        content: '',
        operation: '投标总结',
        fileList: [],
        attitudeType: 2,
        backGroup: 0, // 0 制单
        type: 5
      },
      buttonLoading: false,
      refreshRouterName: '',
      rules: {

      }
    }
  },
  mounted() {
    this.initData()
  },
  activated() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.obj) {
        this.ruleForm = this.obj
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.buttonLoading = false
          var postData = JSON.parse(JSON.stringify(this.ruleForm))
          putBussinessInfoBid(postData)
            .then((response) => {
              if (response.code === 200) {
                this.addSummary(response.data)
              }
              this.buttonLoading = false
            })
            .catch(() => {
              this.buttonLoading = false
            })
        }
      })
    },
    addSummary(data) {
      this.$refs['summaryForm'].validate((valid) => {
        if (valid) {
          var attitudeData = JSON.parse(JSON.stringify(this.summaryForm))
          attitudeData.formId = this.obj.id
          attitudeData.billId = this.obj.id
          if (attitudeData.content) {
            attitudeData.content = '【投标总结：' + attitudeData.content + '】' + data
          } else {
            attitudeData.content = data
          }
          let tempIds = []
          if (attitudeData.fileList.length) {
            tempIds = attitudeData.fileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          attitudeData.fileList = tempIds
          addBussinessInfoReply(attitudeData)
            .then((response) => {
              this.$message(response.message)
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
