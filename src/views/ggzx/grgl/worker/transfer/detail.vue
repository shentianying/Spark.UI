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
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="编号">
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="调出项目">
            {{ orgInStr }}
          </el-form-item>
          <el-form-item label="工号">
            {{ ruleForm.worker.number }}
          </el-form-item>
          <el-form-item label="备注">
            {{ ruleForm.remark }}
          </el-form-item>
          <el-form-item label="创建人">
            {{ ruleForm.createUserName }}
          </el-form-item>
          <el-form-item label="提交人">
            {{ ruleForm.submitUserName }}
          </el-form-item>
          <el-form-item label="最后修改人">
            {{ ruleForm.lastEditUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="调出日期">
            {{ ruleForm.date | dateFormat }}
          </el-form-item>
          <el-form-item label="调入项目">
            {{ orgOutStr }}
          </el-form-item>
          <el-form-item label="姓名">
            {{ ruleForm.worker.name }}
          </el-form-item>
          <el-form-item label="附件">
            <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
          </el-form-item>
          <!-- <el-form-item label=" ">
            &nbsp;
          </el-form-item> -->
          <el-form-item label="创建日期">
            {{ ruleForm.createDate }}
          </el-form-item>
          <el-form-item label="提交日期">
            {{ ruleForm.submitDate }}
          </el-form-item>
          <el-form-item label="最后修改日期">
            {{ ruleForm.lastEditDate }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :file-list="fileList" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getFormById } from '@/api/ggzx/workerTransfer'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
export default {
  name: 'WorkerTransferDetail',
  components: {
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude
  },
  data() {
    return {
      id: null,
      ruleForm: {
        id: 0,
        number: '',
        orgInId: null,
        orgOutId: null,
        workerId: null,
        worker: {
          id: null,
          number: '',
          name: ''
        },
        date: null,
        remark: '',
        fileList: []
      },
      loading: false,
      orgInStr: '',
      orgOutStr: '',
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      billFlow: null,
      isLoad: false,
      attitudePara: {},
      rules: {}
    }
  },
  watch: {
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        await getFormById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      console.log(response)
      const { data, orgInStr, orgOutStr, billFlowData } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.orgInStr = orgInStr
      this.orgOutStr = orgOutStr
      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true
      this.loading = false // loading 状态关闭
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
