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
          <el-form-item label="编号：" prop="number">
            {{ ruleForm.number }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="组织机构：">
            {{ infoForm.orgStr }}
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
          <el-form-item label="业务类型：" prop="bussinessType">
            <span v-if="bussinessTypeList && ruleForm.bussinessType">{{ bussinessTypeList.find(f => f.value === ruleForm.bussinessType).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="装饰面积：">
            {{ infoForm.decorationArea }}平方米
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="质量目标：" prop="qualityTarget">
            {{ ruleForm.qualityTarget }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="计划开/竣工日期：">
            {{ infoForm.startDate }}/{{ infoForm.finishDate }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="技术标形式：" prop="technicalType">
            <span v-if="technicalTypeList && ruleForm.technicalType">{{ technicalTypeList.find(f => f.value === ruleForm.technicalType).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标截止日期：">
            {{ infoForm.tenderEndDate }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否参与评分：">
            <span v-if="ruleForm.isRate">是</span>
            <span v-else>否</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="资信标信息：">
            <el-link v-for="(creditBid,index) in creditBidList" :key="index" @click="handleDetail(creditBid.id)">{{ creditBid.number }}&nbsp;</el-link>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="备注：" prop="remark">
            {{ ruleForm.remark }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
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
          <el-form-item label="创建人：">
            {{ ruleForm.createUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="创建日期：">
            {{ ruleForm.createDate }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="提交人：">
            {{ ruleForm.submitUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="提交日期：">
            {{ ruleForm.submitDate }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="更新人：">
            {{ ruleForm.lastEditUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="更新日期：">
            {{ ruleForm.lastEditDate }}
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- 评分细则及估值 -->
    <div>
      <el-table
        id="detailTable"
        v-loading="loading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column type="index" width="55" align="center" label="序号" />
        <el-table-column label="评分项目" align="center" min-width="50" prop="branchName">
          <template slot-scope="scope">
            {{ scope.row.branchName }}
          </template>
        </el-table-column>
        <el-table-column label="评分明细" align="center" min-width="50" prop="branchDetail">
          <template slot-scope="scope">
            {{ scope.row.branchDetail }}
          </template>
        </el-table-column>
        <el-table-column label="分值" align="center" min-width="50" prop="branchScore">
          <template slot-scope="scope">
            {{ scope.row.branchScore }}
          </template>
        </el-table-column>

      </el-table>
    </div>

    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :show="true"
      :para="attitudePara"
      @update="updateFlow"
    />
  </div>
</template>
<script>
import { getTechnicalBidAttitudeById } from '@/api/ywgl/technicalBid'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'TechnicalBidAttitude',
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
        bussinessInfoId: null,
        bussinessType: null,
        qualityTarget: '',
        technicalType: null,
        isRate: false,
        remark: '',
        state: 0,
        billFlowId: 0,
        bussinessInfo: {
          projectName: ''
        },
        fileList: []
      },
      infoForm: {
        orgStr: '',
        decorationArea: '',
        startDate: null,
        finishDate: null,
        tenderEndDate: null
      },
      technicalBidId: null,

      bussinessInfoList: [],
      technicalTypeList: [],
      bussinessTypeList: [],
      creditBidList: [],

      attitudePara: null,
      isLoad: false,
      billFlow: null,

      list: [],

      loading: false
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {

  },
  methods: {
    async initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.technicalBidId = this.$route.query.id
      }
      if (this.technicalBidId) {
        this.loading = true
        await getTechnicalBidAttitudeById({ id: this.technicalBidId }).then(response => this.setData(response))
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
      const { data, billFlowData, orgStr, result3, result4, creditBidList } = response
      this.technicalTypeList = result3
      this.bussinessTypeList = result4

      var pom = []
      data.technicalBidDetails.forEach(e => {
        pom.push({
          id: e.id,
          branchName: e.branchName,
          branchScore: e.branchScore,
          branchDetail: e.branchDetail
        })
      })
      // 填充 明细列表
      this.list = pom
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.infoForm.orgStr = orgStr
      this.infoForm.decorationArea = data.bussinessInfo.decorationArea ? this.utils.formatMoney(data.bussinessInfo.decorationArea, 2, 0) : null
      this.infoForm.tenderEndDate = data.bussinessInfo.tenderEndDate ? (data.bussinessInfo.tenderEndDate || '').split(' ')[0] : ''
      this.infoForm.startDate = data.bussinessInfo.startDate ? (data.bussinessInfo.startDate || '').split(' ')[0] : ''
      this.infoForm.finishDate = data.bussinessInfo.finishDate ? (data.bussinessInfo.finishDate || '').split(' ')[0] : ''
      this.creditBidList = creditBidList
      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.loading = false // loading 状态关闭
      this.isLoad = true // 加载审批组件
    },
    updateFlow() {
      this.closeThePage()
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    viewBussinessInfo(bussinessInfoId) {
      this.$router.push({ name: 'BussinessInfoDetail', query: { id: bussinessInfoId, refreshRouterName: this.$route.name }, params: { id: bussinessInfoId }})
    },
    handleDetail(id) {
      this.$router.push({ name: 'CreditBidDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    }
  }
}
</script>
