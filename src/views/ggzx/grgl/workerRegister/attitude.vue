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
          <el-form-item label="报到日期" prop="registerDate">
            {{ ruleForm.registerDate | dateFormat }}
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
      <el-table-column label="报到日期" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.registerDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="是否办理工伤保险" align="center" width="200">
        <template slot-scope="scope">
          <el-switch
            v-if="ruleForm.state!==10000"
            v-model="scope.row.isWithInsurance"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
          <label v-if="ruleForm.state===10000">{{ scope.row.isWithInsurance?'已办理':'未办理' }}</label>
          <!-- {{ scope.row.isWithInsurance?'已办理':'未办理' }} -->
        </template>
      </el-table-column>
      <el-table-column label="工伤保险开始日期" align="center" width="200">
        <template slot-scope="scope">
          <el-date-picker
            v-if="ruleForm.state!==10000"
            v-model="scope.row.insuranceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            style="width:100%"
            size="mini"
          />
          <label v-if="ruleForm.state===10000">{{ scope.row.insuranceDate | dateFormat }}</label>
          <!-- {{ scope.row.insuranceDate | dateFormat }} -->
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :show="true"
      :para="attitudePara"
      @update="updateFlow"
    >
      <template #saveBtn>
        <!--当前审批人拥有支付的操作-->
        <!-- <el-button v-if="showPayButton" size="mini" type="success">特殊操作，支付</el-button> -->
        <!--调用单据中controller操作-->
        <el-button size="mini" type="success" :loading="loading" @click="submitForm()">保存</el-button>
      </template>
      <template #otherBtn>
        <!-- <el-button size="mini" type="der">测试其他插槽</el-button> -->
      </template>
    </flow-attitude>

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
import { getFormById, addAttitude } from '@/api/ggzx/workerRegister'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
export default {
  name: 'WorkerRegisterAttitude',
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
        orgId: null,
        registerDate: null,
        remark: '',
        state: null,
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
      const { data, orgStr, billFlowData } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.list = data.workerRegisterDetails
      this.orgStr = orgStr
      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true
      this.loading = false // loading 状态关闭
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    },
    submitForm() {
      // 保存审批步骤
      // 1.调用组件中的验证
      // 2.获取表单参数数据
      // 3.请求 审批

      const result = this.$refs.flowAttitude.checkValidate()
      if (result) {
        var attitudeData = this.$refs.flowAttitude.getPostData()
        var newObj = JSON.parse(JSON.stringify(this.ruleForm))
        var formData = {}
        formData.id = newObj.id
        const details = []
        this.list.forEach(e => {
          details.push({
            id: e.id,
            workerId: e.worker.id,
            registerDate: e.registerDate,
            isWithInsurance: e.isWithInsurance,
            insuranceDate: e.insuranceDate,
            remark: e.remark
          })
        })
        formData.workerRegisterDetails = details
        // 提交数据
        var postData = {
          attitude: attitudeData,
          workerRegister: formData
        }
        this.loading = true
        addAttitude(postData).then(res => {
          if (res.success) {
            this.$message.success('保存成功')
            // 如果只填写意见不转下一步 需要子组件更新流程审批信息
            // if (this.type !== 2) {
            //   this.list = attitudeList
            // }
            this.closeThePage() // 跳转
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        }).catch(() => { this.loading = false })
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
