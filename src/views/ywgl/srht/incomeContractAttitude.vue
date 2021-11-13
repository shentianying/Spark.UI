<template>
  <div class="app-container details">
    <div>
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
            <el-form-item label="组织机构：" prop="orgId">
              {{ orgStr }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="来源形式：" prop="sourceType">
              <span v-if="sourceTypeList.length > 0 && ruleForm.sourceType">{{ sourceTypeList.find(f => f.value === ruleForm.sourceType).name }}</span>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="结构类型：">
              {{ buildingStructure }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="工程名称：" prop="bussinessInfoId">
              <el-link @click="viewBussinessInfo(ruleForm.bussinessInfoId)">{{ ruleForm.name }}</el-link>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="质量目标：">
              {{ ruleForm.qualityGoal }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目性质：" prop="projectProperty">
              <span v-if="projectPropertyList && ruleForm.projectProperty">{{ projectPropertyList.find(f => f.value === ruleForm.projectProperty).name }}</span>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="发包主体：">
              {{ ruleForm.developer }}
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
            <el-form-item label="计税方式：">
              <span v-if="taxTypeList.length >0 && ruleForm.taxType">{{ taxTypeList.find(f => f.value === ruleForm.taxType).name }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="计划签订日期：">
              {{ (ruleForm.planSignDate || '').split(' ')[0] }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="地址：">
              {{ ruleForm.address }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item v-show="ruleForm.sourceType < 3" label="合同金额：">
              {{ ruleForm.contractPrice.toFixed(2) }}元
            </el-form-item>
            <el-form-item v-show="ruleForm.sourceType === 3" label="总金额/变更金额：">
              {{ ruleForm.contractPrice.toFixed(2) }}元(变更金额：{{ ruleForm.changePrice.toFixed(2) }}元)
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="建筑面积：">
              {{ ruleForm.constructionArea.toFixed(2) }}平方米
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="质保期/质保金：">
              {{ ruleForm.guaranteePeriod }}天/{{ ruleForm.retentionMoney.toFixed(2) }}元
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="合同工期：">
              {{ ruleForm.contractDuration }}天
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="合同开工日期：">
              {{ (ruleForm.contractStartDate || '').split(' ')[0] }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="合同竣工日期：">
              {{ (ruleForm.contractFinishDate || '').split(' ')[0] }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="预估利润率：">
              {{ ruleForm.estimatedProfit.toFixed(2) }}%
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="施工范围：" prop="constructionScope">
              {{ ruleForm.constructionScope }}
            </el-form-item>

            <el-form-item label="付款条件：" prop="paymentTerms">
              {{ ruleForm.paymentTerms }}
            </el-form-item>

            <el-form-item label="履约担保约定：" prop="performanceGuarantee">
              {{ ruleForm.performanceGuarantee }}
            </el-form-item>

            <el-form-item label="价格调整：" prop="priceAdjust">
              {{ ruleForm.priceAdjust }}
            </el-form-item>

            <el-form-item label="竣工结算：" prop="completionSettlement">
              {{ ruleForm.completionSettlement }}
            </el-form-item>

            <el-form-item label="甲供材：" prop="materialsFirst">
              {{ ruleForm.materialsFirst }}
            </el-form-item>

            <el-form-item label="其他描述：" prop="remark">
              {{ ruleForm.remark }}
            </el-form-item>

            <el-form-item label="附件：">
              <up-file
                v-model="ruleForm.fileList"
                :size="50"
                :is-preview="true"
                :is-download="true"
                :file-list="ruleForm.fileList"
              />
            </el-form-item>

            <el-form-item v-if="ruleForm.state > 100" label="盖章附件：">
              <up-file
                v-model="ruleForm.signFileList"
                :size="50"
                :is-preview="true"
                :is-download="true"
                :file-list="ruleForm.signFileList"
              />
            </el-form-item>

            <el-form-item v-if="ruleForm.state > 1000" label="备案附件：">
              <up-file
                v-model="ruleForm.recordFileList"
                :size="50"
                :is-preview="true"
                :is-download="true"
                :file-list="ruleForm.recordFileList"
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

    </div>
    <template v-if="state === 100 && utils.IsNextPerson(billFlow)">
      <div class="title"><i class="el-icon-info" />盖章信息</div>
      <el-form
        ref="signForm"
        class="padding-20 my-form"
        :inline="true"
        :model="signForm"
        :rules="signForm"
        label-width="120px"
        :size="size"
      >
        <el-form-item label="盖章附件：">
          <up-file
            v-model="signForm.fileList"
            :size="50"
            :is-upfile="true"
            :is-preview="true"
            :is-download="true"
            :is-delete="true"
            :is-rename="true"
            :file-list="signForm.fileList"
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-if="state === 1000 && utils.IsNextPerson(billFlow)">
      <div class="title"><i class="el-icon-info" />备案信息</div>
      <el-form
        ref="recordForm"
        class="padding-20 my-form"
        :inline="true"
        :model="recordForm"
        :rules="recordForm"
        label-width="120px"
        :size="size"
      >
        <el-form-item label="备案附件：">
          <up-file
            v-model="recordForm.fileList"
            :size="50"
            :is-upfile="true"
            :is-preview="true"
            :is-download="true"
            :is-delete="true"
            :is-rename="true"
            :file-list="recordForm.fileList"
          />
        </el-form-item>
      </el-form>
    </template>
    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      show
      :para="attitudePara"
      @update="updateFlow"
    >
      <template v-slot:saveBtn="{attitudeType}">
        <el-button v-if="state===100 && (attitudeType === 1 || attitudeType===2)" :loading="signLoading" type="primary" :size="size" @click="sign()">盖章</el-button>
        <el-button v-else-if="state===1000 && (attitudeType === 1 || attitudeType===2)" :loading="recordLoading" type="primary" :size="size" @click="record()">备案</el-button>
        <el-button v-else-if="attitudeType === 1 || attitudeType===2" :loading="loading" type="primary" :size="size" @click="submit()">保存</el-button>
      </template>
    </flow-attitude>
  </div>
</template>

<script>
import { getIncomeContractAttitudeById, CheckIncomeContract, SignIncomeContract, RecordIncomeContract } from '@/api/ywgl/incomeContract'
import UpFile from '@/components/UpLoad/UpFile'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'

export default {
  name: 'IncomeContractAttitude',
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
        name: '',
        projectProperty: null,
        sourceType: null,
        certificateProjectManager: null,
        qualityGoal: '',
        planSignDate: null,
        taxType: null,
        developer: '',
        contractPrice: 0,
        changePrice: 0,
        address: '',
        constructionArea: 0,
        contractDuration: 0,
        guaranteePeriod: 0,
        retentionMoney: 0,
        contractStartDate: null,
        contractFinishDate: null,
        estimatedProfit: 0,
        constructionScope: '',
        paymentTerms: '',
        performanceGuarantee: '',
        priceAdjust: '',
        completionSettlement: '',
        materialsFirst: '',
        remark: '',
        score: 0,
        state: 0,
        billFlowId: 0,
        fileList: [],
        signFileList: [],
        recordFileList: []
      },
      signForm: { // 盖章表单
        fileList: []
      },
      recordForm: { // 备案表单
        fileList: []
      },
      size: 'mini',
      orgStr: '',
      buildingStructure: '',
      incomeContractId: null,

      taxTypeList: [],
      sourceTypeList: [],
      projectPropertyList: [],

      signLoading: false,
      recordLoading: false,
      loading: false,

      isLoad: false,
      attitudePara: null,
      loadFlow: false,
      billFlow: null
    }
  },
  computed: {
    state() {
      return this.ruleForm?.state
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
        this.incomeContractId = this.$route.query.id
      }
      if (this.incomeContractId) {
        await getIncomeContractAttitudeById({ id: this.incomeContractId }).then(response => this.setData(response))
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
      const { data, billFlowData, orgStr, result1, result2, result3 } = response
      this.taxTypeList = result1
      this.sourceTypeList = result2
      this.projectPropertyList = result3

      this.orgStr = orgStr
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.ruleForm.signFileList = data.signUpFile
      this.ruleForm.recordFileList = data.recordUpFile

      this.signForm.fileList = data.signUpFile
      this.recordForm.fileList = data.recordUpFile

      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true // 加载审批组件
    },
    submit() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        const attitude = this.$refs.flowAttitude.getPostData()

        this.loading = true
        const postData = {
          attitude,
          id: this.incomeContractId
        }
        CheckIncomeContract(postData).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.closeThePage() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      })
    },
    sign() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        this.signLoading = true
        let tempIds = []

        if (this.signForm.fileList.length > 0) {
          tempIds = this.signForm.fileList.map(m => {
            return { id: m.id, addFlag: m.addFlag }
          })
        } else {
          this.$message('必须上传附件!')
          this.signLoading = false
          return
        }
        const attitude = this.$refs.flowAttitude.getPostData()
        const postData = {
          attitude,
          id: this.incomeContractId,
          fileList: tempIds
        }
        SignIncomeContract(postData).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.closeThePage() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.signLoading = false
        })
      })
    },
    record() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        this.recordLoading = true

        let tempIds = []

        if (this.recordForm.fileList.length > 0) {
          tempIds = this.recordForm.fileList.map(m => {
            return { id: m.id, addFlag: m.addFlag }
          })
        } else {
          this.$message('必须上传附件!')
          this.recordLoading = false
          return
        }

        const attitude = this.$refs.flowAttitude.getPostData()
        const postData = {
          attitude,
          id: this.incomeContractId,
          fileList: tempIds
        }
        RecordIncomeContract(postData).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.closeThePage() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.recordLoading = false
        })
      })
    },
    updateFlow(state) {
      // 直接返回
      this.closeThePage()
    },
    viewBussinessInfo(bussinessInfoId) {
      if (this.ruleForm.sourceType === 1) {
        this.$router.push({ name: 'BussinessInfoDetail', query: { id: bussinessInfoId, refreshRouterName: this.$route.name }, params: { id: bussinessInfoId }})
      } else if (this.ruleForm.sourceType === 3) {
        this.$router.push({ name: 'ProjectDetail', query: { id: bussinessInfoId, refreshRouterName: this.$route.name }, params: { id: bussinessInfoId }})
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>
<style lang="scss" scoped>
.details {
  .padding-20{
    padding: 10px 20px;
  }
  padding-bottom: 70px;
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }

}
</style>
