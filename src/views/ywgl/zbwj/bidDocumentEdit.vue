<template>
  <div class="app-container">
    <div>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写单据" icon="el-icon-edit" />
        <el-step title="确认流程" icon="el-icon-refresh" />
      </el-steps>
    </div>
    <div v-show="active===0 || active===2">
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号：">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="工程名称：" prop="bussinessInfoId">
              <el-input v-model="bussinessInfoName" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectBussinessInfo()" />
              </el-input>
              <select-bussiness-info ref="bussinessInfoRef" :multiple="false" @getBussinessInfo="getBussinessInfo" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item v-if="orgList" label="组织机构：" prop="orgId">
              <org-select2
                v-if="orgList"
                :key="keyOrg"
                v-model="ruleForm.orgId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :options="orgList"
                :disabled="true"
                :select-data="ruleForm.orgId"
                select-style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="招标形式：">
              <el-input v-model="infoForm.tenderMode" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="可靠级别：">
              <el-input v-model="infoForm.reliableLevel" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="工程地点：">
              <el-input v-model="infoForm.area" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="装饰面积：">
              <el-input v-model="infoForm.decorationArea" readonly="readonly" size="mini" maxlength="50">
                <i slot="suffix" style="margin-right: 10px;">平方米</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="幢数层数：">
              <el-input v-model="infoForm.floors" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="发包单位：">
              <el-input v-model="infoForm.developer" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="房屋性质：">
              <el-input v-model="infoForm.houseProperty" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="信息来源：">
              <el-input v-model="infoForm.informationSource" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="投资金额：">
              <el-input v-model="infoForm.cost" readonly="readonly" size="mini" maxlength="50">
                <i slot="suffix" style="margin-right: 10px;">万元</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="计划开/竣工时间：">
              <el-input v-model="infoForm.startFinishDate" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="投标开始日期：" prop="tenderStartDate">
              <el-date-picker
                v-model="ruleForm.tenderStartDate"
                type="date"
                placeholder="请选择"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="投标截止日期：">
              <el-input v-model="infoForm.tenderEndDate" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="投标保证金金额：" prop="bidDeposit">
              <el-input v-model="ruleForm.bidDeposit" type="number" maxlength="100">
                <i slot="suffix" style="margin-right: 10px;">万元</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="保证金缴纳截止时间：" prop="depositPayEndDate">
              <el-date-picker
                v-model="ruleForm.depositPayEndDate"
                type="date"
                placeholder="请选择"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="质量目标：" prop="qualityGoal">
              <el-input v-model="ruleForm.qualityGoal" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="答疑截止时间：" prop="qaEndDate">
              <el-date-picker
                v-model="ruleForm.qaEndDate"
                type="date"
                placeholder="请选择"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="承包内容：" prop="contractContent">
              <el-input v-model="ruleForm.contractContent" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="取费标准：" prop="feeStandard">
              <el-input v-model="ruleForm.feeStandard" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="付款条件：" prop="paymentTerms">
              <el-input v-model="ruleForm.paymentTerms" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="材料供应方式：" prop="materialSupplyWay">
              <el-input v-model="ruleForm.materialSupplyWay" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="违约责任：" prop="breachLiability">
              <el-input v-model="ruleForm.breachLiability" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="评标办法：" prop="bidEvaluationMethod">
              <el-input v-model="ruleForm.bidEvaluationMethod" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="履约担保方式：" prop="performanceGuaranteeWay">
              <el-input v-model="ruleForm.performanceGuaranteeWay" type="textarea" :rows="4" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="主要竞争对手：">
              <el-input v-model="infoForm.competitors" readonly="readonly" type="textarea" :rows="4" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="附件：">
              <up-file
                v-model="ruleForm.fileList"
                :size="50"
                :is-upfile="true"
                :is-preview="true"
                :is-download="true"
                :is-delete="true"
                :is-rename="true"
                :file-list="ruleForm.fileList"
              >
                提示：含特殊条款及特殊条件附件
              </up-file>
            </el-form-item>

          </el-col>
        </el-row>

      </el-form>
    </div>

    <!--流程显示-->
    <flow-select v-show="active > 0" v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
    <div style="text-align:center;margin-top:10px;">
      <el-button v-show="active !== 0" v-if="ruleForm.state === 0" size="mini" type="info" :loading="buttonLoading" @click="previous()"><i class="el-icon-back el-icon--left" />上一步</el-button>
      <el-button v-show="active === 0" size="mini" type="success" :loading="buttonLoading" @click="getDynamicFlow('ruleForm')">下一步<i class="el-icon-right el-icon--right" /></el-button>
      <el-button v-show="active > 0" v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="buttonLoading" @click="cancel()">作废</el-button>
      <el-button v-show="active > 0" v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="primary" :loading="buttonLoading" @click="submitForm('ruleForm',1)">提交</el-button>
      <el-button v-show="active > 0" v-if="ruleForm.state === 0" size="mini" type="success" :loading="buttonLoading" @click="submitForm('ruleForm',0)">保存</el-button>
    </div>

  </div>
</template>

<script>
import { putBidDocument, addBidDocument, getBidDocumentEditInit, getBidDocumentById, getBillFlow, deleteBidDocument } from '@/api/ywgl/bidDocument'
import { getBussinessInfoById } from '@/api/ywgl/bussinessInfo'
import UpFile from '@/components/UpLoad/UpFile'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowSelect from '@/components/Flow/flowSelect'
import { validate } from '@/utils/validate'
import SelectBussinessInfo from '@/components/Other/ywgl/selectBussinessInfo'
export default {
  name: 'BidDocumentEdit',
  components: {
    UpFile,
    OrgSelect2,
    FlowSelect,
    SelectBussinessInfo
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
      keyOrg: 0,
      orgList: null,
      tenderModeList: [],
      informationSourceList: [],
      housePropertyList: [],
      reliableLevelList: [],
      billFlow: null,

      bidDocumentId: null,
      bussinessInfoName: '',

      active: 0,
      buttonLoading: false,
      rules: {
        bussinessInfoId: [{ required: true, message: '请输入', trigger: 'change' }],
        bidDeposit: [{ validator: validate.dbl, required: true, message: '必须为数字格式', trigger: 'blur' }],
        tenderStartDate: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        depositPayEndDate: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        qaEndDate: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        qualityGoal: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractContent: [{ required: true, message: '请输入', trigger: 'blur' }],
        feeStandard: [{ required: true, message: '请输入', trigger: 'blur' }],
        paymentTerms: [{ required: true, message: '请输入', trigger: 'blur' }],
        materialSupplyWay: [{ required: true, message: '请输入', trigger: 'blur' }],
        breachLiability: [{ required: true, message: '请输入', trigger: 'blur' }],
        bidEvaluationMethod: [{ required: true, message: '请输入', trigger: 'blur' }],
        performanceGuaranteeWay: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
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
    if (!this.$route.params.id) {
      this.initData()
      this.activate = true
    }
  },
  methods: {
    submitForm(formName, state) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          let tempIds = []
          if (newObj.fileList.length > 0) {
            tempIds = newObj.fileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          } else {
            if (state === 1) {
              this.$message('必须上传附件')
              return
            }
          }

          if (!this.infoForm.tenderEndDate) {
            this.$message('请完善经营信息中投标截止日期!')
            return
          }

          if (state === 1 && (!this.infoForm.reliableLevel || !this.infoForm.floors || !this.infoForm.houseProperty || !this.infoForm.informationSource || !this.infoForm.developer || !this.infoForm.decorationArea)) {
            this.$message('经营信息不全，无法提交!')
            return
          }
          newObj.fileList = tempIds
          newObj.state = state

          if (this.billFlow) {
            // 获取流程组件中的数据
            const billFlow = this.$refs.flowSelect.getBillFlow()
            if (!billFlow) {
              return false
            }
            newObj.billFlow = billFlow
          } else {
            this.$message('流程数据不能为空')
            return
          }
          this.buttonLoading = true

          if (this.bidDocumentId) {
            putBidDocument(newObj).then(response => {
              if (response.errorMsg) {
              // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.buttonLoading = false
              this.closeThePage()
            }).catch(() => {
              this.buttonLoading = false
              this.active = 0
            })
          } else {
            addBidDocument(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.buttonLoading = false
              this.closeThePage()
              // this.setData(response)
            }).catch(() => {
              this.buttonLoading = false
              this.active = 0
            })
          }
        }
      })
    },
    initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.bidDocumentId = this.$route.query.id
      }
      new Promise((resolve, reject) => {
        getBidDocumentEditInit().then(response => {
          const { orgList, result1, result2, result3, result4 } = response
          this.orgList = orgList
          this.tenderModeList = result1
          this.reliableLevelList = result2
          this.informationSourceList = result3
          this.housePropertyList = result4
          resolve(orgList)
        })
      }).then(orgList => {
        if (this.bidDocumentId) {
          getBidDocumentById({ id: this.bidDocumentId }).then(response => {
            const { data } = response
            this.ruleForm = data
            this.keyOrg += 1
            this.ruleForm.fileList = data.upFile
            this.bussinessInfoName = data.bussinessInfo.projectName
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
          })
        }
      }).catch(() => {
        this.$message.error('信息错误')
      })
    },
    getDynamicFlow(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))

          getBillFlow(newObj).then(response => {
            if (response.success) {
              this.billFlow = response.data.billFlow
              this.active = 1
            } else {
              this.$message(response.message)
            }
          })
        }
      })
    },
    previous() {
      // 上一步
      this.active--
      this.billFlow = null
    },
    cancel() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.active = 2
        this.buttonloading = true
        deleteBidDocument({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.buttonloading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    selectBussinessInfo() {
      this.$refs.bussinessInfoRef.openDialog()
    },
    getBussinessInfo(data) {
      if (data.length > 0) {
        this.ruleForm.bussinessInfoId = data[0].id
        this.bussinessInfoName = data[0].projectName
        getBussinessInfoById({ id: this.ruleForm.bussinessInfoId }).then((response) => {
          const { data } = response
          this.ruleForm.orgId = data.orgId
          this.keyOrg += 1
          this.ruleForm.companyId = data.companyId

          const startDate = data.startDate ? (data.startDate || '').split(' ')[0] : ''
          const finishDate = data.finishDate ? (data.finishDate || '').split(' ')[0] : ''
          this.infoForm.startFinishDate = startDate + '/' + finishDate
          this.infoForm.tenderMode = (data.tenderMode && this.tenderModeList) ? this.tenderModeList.find(f => f.value === data.tenderMode).name : ''
          this.infoForm.reliableLevel = (data.reliableLevel && this.reliableLevelList) ? this.reliableLevelList.find(f => f.value === data.reliableLevel).name : ''
          this.infoForm.area = data.address
          this.infoForm.decorationArea = data.decorationArea ? this.utils.formatMoney(data.decorationArea, 2, 0) : null
          this.infoForm.floors = data.floors
          this.infoForm.developer = data.customer.name
          this.infoForm.houseProperty = (data.houseProperty && this.housePropertyList) ? this.housePropertyList.find(f => f.value === data.houseProperty).name : ''
          this.infoForm.informationSource = (data.informationSource && this.informationSourceList) ? this.informationSourceList.find(f => f.value === data.informationSource).name : ''
          this.infoForm.cost = data.cost ? this.utils.formatMoney(data.cost, 2, 0) : null
          this.infoForm.tenderEndDate = data.tenderEndDate ? (data.tenderEndDate || '').split(' ')[0] : ''
          this.infoForm.competitors = data.competitors
        })
      }
    }
  }
}
</script>
