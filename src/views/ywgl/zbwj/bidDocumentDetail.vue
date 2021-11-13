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
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="编号：">
            {{ ruleForm.number }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程名称：" prop="bussinessInfoId">
            <el-link @click="viewBussinessInfo(ruleForm.bussinessInfoId)">{{ ruleForm.bussinessInfo.projectName }}</el-link>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="组织机构：" prop="orgId">
            {{ orgStr }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="招标形式：">
            {{ infoForm.tenderMode }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="可靠级别：">
            {{ infoForm.reliableLevel }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程地点：">
            {{ infoForm.area }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="装饰面积：">
            {{ infoForm.decorationArea }}平方米
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="幢数层数：">
            {{ infoForm.floors }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="发包单位：">
            {{ infoForm.developer }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="房屋性质：">
            {{ infoForm.houseProperty }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="信息来源：">
            {{ infoForm.informationSource }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="投资金额：">
            {{ infoForm.cost }}万元
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="计划开/竣工时间：">
            {{ infoForm.startFinishDate }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标开始日期：" prop="tenderStartDate">
            {{ (ruleForm.tenderStartDate || '').split(' ')[0] }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标截止日期：">
            {{ infoForm.tenderEndDate }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标保证金金额：" prop="bidDeposit">
            {{ ruleForm.bidDeposit }}万元
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="保证金缴纳截止时间：" prop="depositPayEndDate">
            {{ (ruleForm.depositPayEndDate || '').split(' ')[0] }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="质量目标：" prop="qualityGoal">
            {{ ruleForm.qualityGoal }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="答疑截止时间：" prop="qaEndDate">
            {{ (ruleForm.qaEndDate || '').split(' ')[0] }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="承包内容：" prop="contractContent">
            {{ ruleForm.contractContent }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="取费标准：" prop="feeStandard">
            {{ ruleForm.feeStandard }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="付款条件：" prop="paymentTerms">
            {{ ruleForm.paymentTerms }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="材料供应方式：" prop="materialSupplyWay">
            {{ ruleForm.materialSupplyWay }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="违约责任：" prop="breachLiability">
            {{ ruleForm.breachLiability }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="评标办法：" prop="bidEvaluationMethod">
            {{ ruleForm.bidEvaluationMethod }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="履约担保方式：" prop="performanceGuaranteeWay">
            {{ ruleForm.performanceGuaranteeWay }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="主要竞争对手：">
            {{ infoForm.competitors }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="附件：">
            <up-file
              v-model="ruleForm.fileList"
              :size="50"
              :is-preview="true"
              :is-download="true"
              :file-list="ruleForm.fileList"
            />
          </el-form-item>

        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="创建人">
            {{ ruleForm.createUserName }}
          </el-form-item>
          <el-form-item label="提交人">
            {{ ruleForm.submitUserName }}
          </el-form-item>
          <el-form-item label="更新人">
            {{ ruleForm.lastEditUserName }}
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="创建日期">
            {{ ruleForm.createDate }}
          </el-form-item>
          <el-form-item label="提交日期">
            {{ ruleForm.submitDate }}
          </el-form-item>
          <el-form-item label="更新日期">
            {{ ruleForm.lastEditDate }}
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :para="attitudePara"
      @update="updateFlow"
    />

  </div>
</template>

<script>
import { getBidDocumentAttitudeById } from '@/api/ywgl/bidDocument'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'BidDocumentDetail',
  components: {
    FlowAttitude,
    FlowDisplay,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        companyId: this.$store.state.user.selectOrgId,
        bussinessInfoId: null,
        tenderStartDate: null,
        bidDeposit: null,
        depositPayEndDate: null,
        qualityGoal: '',
        qaEndDate: null,
        contractContent: '',
        feeStandard: '',
        paymentTerms: '',
        materialSupplyWay: '',
        breachLiability: '',
        bidEvaluationMethod: '',
        performanceGuaranteeWay: '',
        state: 0,
        billFlowId: 0,
        bussinessInfo: {
          projectName: ''
        },
        fileList: []
      },
      infoForm: {
        startFinishDate: null,
        tenderMode: '',
        reliableLevel: '',
        area: '',
        decorationArea: '',
        floors: '',
        developer: '',
        houseProperty: '',
        informationSource: '',
        cost: null,
        tenderEndDate: null,
        competitors: ''
      },
      orgStr: '',
      tenderModeList: [],
      informationSourceList: [],
      housePropertyList: [],
      reliableLevelList: [],
      bidDocumentId: null,
      isLoad: false,
      billFlow: null,
      attitudePara: {}
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.ruleForm.orgId = null // 刷新 org 列表
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.ruleForm.orgId = null // 刷新 org 列表
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    async initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.bidDocument = this.$route.query.id
      }
      if (this.bidDocument) {
        this.loading = true
        await getBidDocumentAttitudeById({ id: this.bidDocument }).then(response => this.setData(response))
      }
    },
    setData(response) {
      // 验证
      if (!response.success) {
        this.$alert(response.message, {
          callback: action => {
            this.closeThePage()
          }
        })
      }
      const { data, billFlowData, orgStr, result1, result2, result3, result4 } = response
      this.orgStr = orgStr
      this.tenderModeList = result1
      this.informationSourceList = result3
      this.housePropertyList = result4
      this.reliableLevelList = result2

      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      const startDate = data.bussinessInfo.startDate ? (data.bussinessInfo.startDate || '').split(' ')[0] : ''
      const finishDate = data.bussinessInfo.finishDate ? (data.bussinessInfo.finishDate || '').split(' ')[0] : ''
      this.infoForm.startFinishDate = startDate + '/' + finishDate
      this.infoForm.tenderMode = (data.bussinessInfo.tenderMode && this.tenderModeList) ? this.tenderModeList.find(f => f.value === data.bussinessInfo.tenderMode).name : ''
      this.infoForm.reliableLevel = (data.bussinessInfo.reliableLevel && this.reliableLevelList) ? this.reliableLevelList.find(f => f.value === data.bussinessInfo.reliableLevel).name : ''
      this.infoForm.area = data.address
      this.infoForm.decorationArea = data.bussinessInfo.decorationArea ? this.utils.formatMoney(data.bussinessInfo.decorationArea, 2, 0) : null
      this.infoForm.floors = data.bussinessInfo.floors
      this.infoForm.developer = data.bussinessInfo.customer.name
      this.infoForm.houseProperty = (data.bussinessInfo.houseProperty && this.housePropertyList) ? this.housePropertyList.find(f => f.value === data.bussinessInfo.houseProperty).name : ''
      this.infoForm.informationSource = (data.bussinessInfo.informationSource && this.informationSourceList) ? this.informationSourceList.find(f => f.value === data.bussinessInfo.informationSource).name : ''
      this.infoForm.cost = data.cost ? this.utils.formatMoney(data.cost, 2, 0) : null
      this.infoForm.tenderEndDate = data.bussinessInfo.tenderEndDate ? (data.bussinessInfo.tenderEndDate || '').split(' ')[0] : ''
      this.infoForm.competitors = data.bussinessInfo.competitors

      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true // 加载审批组件
    },
    updateFlow() {
      this.closeThePage()
    },
    viewBussinessInfo(bussinessInfoId) {
      this.$router.push({ name: 'BussinessInfoDetail', query: { id: bussinessInfoId, refreshRouterName: this.$route.name }, params: { id: bussinessInfoId }})
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }

}
</script>
