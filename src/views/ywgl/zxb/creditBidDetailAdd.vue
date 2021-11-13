<template>
  <div class="app-container">
    <div>
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class=""
        size="mini"
      >
        <el-form-item label="评分项目" prop="postId">
          <el-input v-model="ruleForm.branchName" type="textarea" :rows="3" placeholder="请输入" size="mini" maxlength="500" show-word-limit />
        </el-form-item>

        <el-form-item label="分值">
          <el-input-number v-model="ruleForm.branchScore" size="mini" controls-position="right" :precision="2" />
        </el-form-item>

        <el-form-item label="评分明细">
          <el-input v-model="ruleForm.branchDetail" type="textarea" :rows="3" placeholder="请输入" size="mini" maxlength="500" show-word-limit />
        </el-form-item>

        <el-form-item label="概要内容" prop="adminLeaderId">
          <el-input v-model="ruleForm.branchSummary" type="textarea" :rows="3" placeholder="请输入" size="mini" maxlength="500" show-word-limit />
        </el-form-item>

        <el-form-item label="预估得分" prop="lineLeaderId">
          <el-input-number v-model="ruleForm.branchEstimatedScore" size="mini" controls-position="right" :precision="2" />
        </el-form-item>

        <el-form-item label="备注" prop="lineLeaderId">
          <el-input v-model="ruleForm.branchContent" type="textarea" :rows="3" placeholder="请输入" size="mini" maxlength="500" show-word-limit />
        </el-form-item>

        <el-form-item align="center">
          <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreditBidDetailAdd',
  components: {

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
        branchName: '',
        branchScore: 0.00,
        branchDetail: '',
        branchSummary: '',
        branchEstimatedScore: 0.00,
        branchContent: ''
      },
      buttonLoading: false,
      comName: '',
      rules: {
        branchName: [{ required: true, message: '请输入', trigger: 'blur' }],
        branchScore: [{ required: true, message: '请输入', trigger: 'blur' }],
        branchDetail: [{ required: true, message: '请输入', trigger: 'blur' }],
        branchSummary: [{ required: true, message: '请输入', trigger: 'blur' }],
        branchEstimatedScore: [{ required: true, message: '请输入', trigger: 'blur' }],
        branchContent: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {

  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // console.log('修改后返回的值:', newObj)
          if (this.obj) {
            this.$emit('dialogClose', newObj, 'update')
          } else {
            this.$emit('dialogClose', newObj, 'add')
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
