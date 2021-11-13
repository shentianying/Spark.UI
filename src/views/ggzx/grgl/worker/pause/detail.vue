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
          <el-form-item label="年度">
            {{ ruleForm.year }}
          </el-form-item>
          <el-form-item label="编号">
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="暂退原因">
            {{ ruleForm.pauseReason }}
          </el-form-item>
          <el-form-item label="附件">
            <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
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
          <el-form-item label="所属部门" prop="orgId">
            {{ orgStr }}
          </el-form-item>
          <el-form-item label="备注">
            {{ ruleForm.remark }}
          </el-form-item>
          <el-form-item label="暂退日期">
            {{ ruleForm.pauseDate | dateFormat }}
          </el-form-item>
          <el-form-item label=" ">
            &nbsp;
          </el-form-item>
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
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column label="年度" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.worker.year }}
        </template>
      </el-table-column>
      <el-table-column label="工号" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.worker.number }}
        </template>
      </el-table-column>
      <el-table-column label="工人姓名" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.worker.name }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.worker.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="证件号码" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.worker.idNumber }}
        </template>
      </el-table-column>
      <el-table-column label="暂退原因" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.pauseReason }}
        </template>
      </el-table-column>
      <el-table-column label="暂退日期" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.pauseDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>

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
import { getFormById } from '@/api/ggzx/workerPause'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
export default {
  name: 'WorkerPauseDetail',
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
        year: null,
        number: '',
        orgId: null,
        pauseReason: '',
        pauseDate: null,
        remark: '',
        fileList: []
      },
      list: [],
      loading: false,
      orgStr: '',
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
      const { data, orgStr, billFlowData } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.list = data.workerPauseDetails
      this.orgStr = orgStr
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
