<template>
  <div class="app-container">

    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      label-width="200px"
      class=""
      size="mini"
    >
      <el-form-item label="目前现场情况：" prop="currentStatus">
        <el-input v-model="ruleForm.currentStatus" placeholder="请输入" type="textarea" :rows="4" maxlength="500" show-word-limit />
      </el-form-item>

      <el-form-item label="跟踪级别：" prop="traceLevel">
        <el-select v-if="ruleForm.state === 10000" v-model="ruleForm.traceLevel" placeholder="请选择" style="width:100%">
          <el-option
            v-for="(item,index) in traceLevelList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="进展情况：" prop="progress">
        <el-select v-model="ruleForm.progress" placeholder="请选择" style="width:100%">
          <el-option
            v-for="(item,index) in progressList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="跟进要求：" prop="trackLevel">
        <el-select v-model="ruleForm.trackLevel" placeholder="请选择" style="width:100%">
          <el-option
            v-for="(item,index) in trackLevelList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="可靠程度：" prop="reliableLevel">
        <el-select v-model="ruleForm.reliableLevel" placeholder="请选择" style="width:100%">
          <el-option
            v-for="(item,index) in reliableLevelList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="重要程度：" prop="isImportant">
        <el-switch v-model="ruleForm.isImportant" active-text="重要" inactive-text="一般" />
      </el-form-item>

      <el-form-item align="center">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import { getBussinessInfoEditInit, putBussinessInfoProgress } from '@/api/ywgl/bussinessInfo'
export default {
  name: 'BussinessInfoProgress',
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
        id: 0,
        formId: 0,
        billId: 0,
        title: '进展情况',
        content: '',
        operation: '进展情况',
        fileList: [],
        attitudeType: 2,
        backGroup: 0, // 0 制单
        type: 5
      },
      progressList: [],
      reliableLevelList: [],
      trackLevelList: [],
      traceLevelList: [],
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
      getBussinessInfoEditInit().then(response => {
        const { result4, result12, result13, result14, result15 } = response
        this.progressList = result4
        this.importantTypeList = result12
        this.reliableLevelList = result13
        this.trackLevelList = result14
        this.traceLevelList = result15
        if (this.obj) {
          this.ruleForm = this.obj
        }
      }).catch(() => {
        this.$message.error('信息错误')
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.buttonLoading = false
          var postData = JSON.parse(JSON.stringify(this.ruleForm))
          putBussinessInfoProgress(postData)
            .then((response) => {
              this.$message(response.message)
              this.$emit('dialogClose')
              this.buttonLoading = false
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
