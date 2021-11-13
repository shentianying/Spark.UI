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
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程名称：" prop="bussinessInfoId">
            <el-link @click="viewBussinessInfo(ruleForm.bussinessInfoId)">{{ ruleForm.bussinessInfo.projectName }}</el-link>
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
          <el-form-item label="发包单位：">
            {{ infoForm.developer }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="招标形式：">
            {{ infoForm.tenderMode }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="预估造价：">
            {{ infoForm.cost }}万元
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
          <el-form-item label="跟踪级别：">
            {{ infoForm.traceLevel }}
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
          <el-form-item label="持证项目经理：" prop="certificateProjectManager">
            <span v-if="ruleForm.person">{{ ruleForm.person.name }}</span>
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
          <el-form-item label="备注：" prop="remark">
            {{ ruleForm.remark }}
          </el-form-item>
        </el-col>
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
        show-summary
        :summary-method="getSummaries"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
        :span-method="setColSpan"
      >
        <el-table-column type="index" width="55" align="center" label="序号" />
        <el-table-column label="评分项目" align="center" min-width="50" prop="branchName">
          <template slot-scope="scope">
            {{ scope.row.branchName }}
          </template>
        </el-table-column>
        <el-table-column label="分值" align="center" min-width="50" prop="branchScore">
          <template slot-scope="scope">
            {{ scope.row.branchScore }}
          </template>
        </el-table-column>
        <el-table-column label="评分明细" align="center" min-width="50" prop="branchDetail">
          <template slot-scope="scope">
            {{ scope.row.branchDetail }}
          </template>
        </el-table-column>
        <el-table-column label="概要内容" align="center" min-width="50" prop="branchSummary">
          <template slot-scope="scope">
            {{ scope.row.branchSummary }}
          </template>
        </el-table-column>
        <el-table-column label="预估得分" align="center" min-width="100" prop="branchEstimatedScore">
          <template slot-scope="scope">
            {{ scope.row.branchEstimatedScore }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="50" prop="branchContent">
          <template slot-scope="scope">
            {{ scope.row.branchContent }}
          </template>
        </el-table-column>

      </el-table>
    </div>

    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :para="attitudePara"
    />
  </div>
</template>
<script>
import { getCreditBidAttitudeById } from '@/api/ywgl/creditBid'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'CreditBidDetail',
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
        certificateProjectManager: null,
        isRate: false,
        remark: '',
        score: 0,
        state: 0,
        billFlowId: 0,
        bussinessInfo: {
          projectName: ''
        },
        fileList: []
      },
      infoForm: {
        orgStr: '',
        tenderMode: '',
        developer: '',
        decorationArea: '',
        floors: '',
        cost: '',
        traceLevel: '',
        tenderEndDate: ''
      },
      creditBidId: null,

      bussinessInfoList: [],
      tenderModeList: [],
      traceLevelList: [],

      attitudePara: null,
      isLoad: false,
      billFlow: null,

      listIndex: 0,
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
        this.creditBidId = this.$route.query.id
      }
      if (this.creditBidId) {
        this.loading = true
        await getCreditBidAttitudeById({ id: this.creditBidId }).then(response => this.setData(response))
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
      const { data, billFlowData, orgStr, result1, result3 } = response
      this.tenderModeList = result1
      this.traceLevelList = result3

      var pom = []
      data.creditBidDetails.forEach(e => {
        pom.push({
          id: e.id,
          branchName: e.branchName,
          branchScore: e.branchScore,
          branchDetail: e.branchDetail,
          branchSummary: e.branchSummary,
          branchEstimatedScore: e.branchEstimatedScore,
          branchContent: e.branchContent
        })
      })
      // 填充 明细列表
      this.list = pom
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.infoForm.orgStr = orgStr
      this.infoForm.tenderMode = (data.bussinessInfo.tenderMode && this.tenderModeList) ? this.tenderModeList.find(f => f.value === data.bussinessInfo.tenderMode).name : ''
      this.infoForm.decorationArea = data.bussinessInfo.decorationArea ? this.utils.formatMoney(data.bussinessInfo.decorationArea, 2, 0) : null
      this.infoForm.floors = data.bussinessInfo.floors
      this.infoForm.traceLevel = (data.bussinessInfo.traceLevel && this.traceLevelList) ? this.traceLevelList.find(f => f.value === data.bussinessInfo.traceLevel).name : ''
      this.infoForm.developer = data.bussinessInfo.customer.name
      this.infoForm.tenderEndDate = data.bussinessInfo.tenderEndDate ? (data.bussinessInfo.tenderEndDate || '').split(' ')[0] : ''

      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.loading = false // loading 状态关闭
      this.isLoad = true // 加载审批组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    viewBussinessInfo(bussinessInfoId) {
      this.$router.push({ name: 'BussinessInfoDetail', query: { id: bussinessInfoId, refreshRouterName: this.$route.name }, params: { id: bussinessInfoId }})
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总分'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (column.property === 'branchEstimatedScore') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        }
      })
      this.ruleForm.score = sums[5]

      return sums
    },
    setColSpan() {
      // 表格合计行--单元格合并
      setTimeout(() => {
        if (this.$el.querySelector('#detailTable')) {
          var current = this.$el
            .querySelector('#detailTable')
            .querySelector('.el-table__footer-wrapper')
            .querySelector('.el-table__footer')
          var cell = current.rows[0].cells
          cell[1].style.display = 'none'
          cell[2].style.display = 'none'
          cell[3].style.display = 'none'
          cell[4].style.display = 'none'
          cell[6].style.display = 'none'
          cell[7].style.display = 'none'
          cell[5].colSpan = '7'
        }
      }, 50)
    }
  }
}
</script>
