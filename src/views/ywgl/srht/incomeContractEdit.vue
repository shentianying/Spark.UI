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
        label-width="160px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号：" prop="number">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="组织机构：" prop="orgId">
              <org-select2
                v-if="orgList"
                v-show="ruleForm.sourceType === 2"
                v-model="ruleForm.orgId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :options="orgList"
                :select-data="ruleForm.orgId"
                select-style="width:100%;"
              />
              <el-input v-show="ruleForm.sourceType !== 2" v-model="orgStr" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="来源形式：" prop="sourceType">
              <el-select v-model="ruleForm.sourceType" placeholder="请选择" filterable clearable style="width:100%" @change="selectChange($event)">
                <el-option
                  v-for="(item,index) in sourceTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="结构类型：">
              <el-input v-model="buildingStructure" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="工程名称：" prop="name">
              <el-input v-show="ruleForm.sourceType === 1" v-model="ruleForm.name" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectBussinessInfo()" />
              </el-input>
              <select-bussiness-info ref="bussinessInfoRef" :multiple="false" @getBussinessInfo="getBussinessInfo" />

              <el-input v-show="ruleForm.sourceType === 2" v-model="ruleForm.name" size="mini" maxlength="50" />
              <el-input v-show="ruleForm.sourceType === 3" v-model="ruleForm.name" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectProject()" />
              </el-input>
              <select-project ref="projectRef" :multiple="false" @getProject="getProject" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="质量目标：" prop="qualityGoal">
              <el-input v-model="ruleForm.qualityGoal" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目性质：" prop="projectProperty">
              <el-cascader
                v-model="ruleForm.projectProperty"
                :options="projectPropertyList"
                :show-all-levels="false"
                clearable
                style="width:100%"
                :props="{
                  checkStrictly : true ,
                  emitPath : false ,
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="发包主体：" prop="developer">
              <el-input v-model="ruleForm.developer" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="持证项目经理：" prop="certificateProjectManager">
              <el-input v-model="certificateProjectManagerName" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectPerson()" />
              </el-input>
              <select-person ref="personRef" :multiple="false" @getPersons="getPersons" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="计税方式：" prop="taxType">
              <el-select v-model="ruleForm.taxType" placeholder="请选择" filterable clearable style="width:100%">
                <el-option
                  v-for="(item,index) in taxTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="计划签订日期：" prop="planSignDate">
              <el-date-picker
                v-model="ruleForm.planSignDate"
                type="date"
                placeholder="请选择"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="地址：" prop="address">
              <el-input v-model="ruleForm.address" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item v-show="ruleForm.sourceType < 3" label="合同金额：" prop="contractPrice">
              <el-input v-model="ruleForm.contractPrice" size="mini" type="number" :precision="2">
                <i slot="suffix" style="margin-right: 10px;">元</i>
              </el-input>
            </el-form-item>
            <el-form-item v-show="ruleForm.sourceType === 3" label="总金额：" prop="contractPrice">
              <el-input v-model="ruleForm.contractPrice" size="mini" type="number" :precision="2">
                <i slot="suffix" style="margin-right: 10px;">元</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="建筑面积：" prop="constructionArea">
              <el-input v-model="ruleForm.constructionArea" size="mini" type="number" :precision="2">
                <i slot="suffix" style="margin-right: 10px;">平方米</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item v-show="ruleForm.sourceType === 3" label="变更金额：" prop="changePrice">
              <el-input v-model="ruleForm.changePrice" size="mini" type="number" :precision="2">
                <i slot="suffix" style="margin-right: 10px;">元</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="质保期：" prop="guaranteePeriod">
              <el-input v-model="ruleForm.guaranteePeriod" size="mini" type="number">
                <i slot="suffix" style="margin-right: 10px;">天</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="质保金：" prop="retentionMoney">
              <el-input v-model="ruleForm.retentionMoney" size="mini" type="number" :precision="2">
                <i slot="suffix" style="margin-right: 10px;">元</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="合同开工日期：" prop="contractStartDate">
              <el-date-picker
                v-model="ruleForm.contractStartDate"
                type="date"
                placeholder="请选择"
                style="width:100%"
                @change="dayDiff"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="合同竣工日期：" prop="contractFinishDate">
              <el-date-picker
                v-model="ruleForm.contractFinishDate"
                type="date"
                placeholder="请选择"
                style="width:100%"
                @change="dayDiff"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="合同工期：" prop="contractDuration">
              <el-input v-model="ruleForm.contractDuration" size="mini" type="number" :disabled="true">
                <i slot="suffix" style="margin-right: 10px;">天</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="预估利润率：">
              <el-input v-model="ruleForm.estimatedProfit" size="mini" type="number" :precision="2">
                <i slot="suffix" style="margin-right: 10px;">%</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="施工范围：" prop="constructionScope">
              <el-input v-model="ruleForm.constructionScope" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

            <el-form-item label="付款条件：" prop="paymentTerms">
              <el-input v-model="ruleForm.paymentTerms" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

            <el-form-item label="履约担保约定：" prop="performanceGuarantee">
              <el-input v-model="ruleForm.performanceGuarantee" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

            <el-form-item label="价格调整：" prop="priceAdjust">
              <el-input v-model="ruleForm.priceAdjust" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

            <el-form-item label="竣工结算：" prop="completionSettlement">
              <el-input v-model="ruleForm.completionSettlement" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

            <el-form-item label="甲供材：" prop="materialsFirst">
              <el-input v-model="ruleForm.materialsFirst" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

            <el-form-item label="其他描述：" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

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
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow('ruleForm')">下一步➜</el-button>
      </div>

    </div>
    <!--流程显示-->
    <div v-show="active===1 || active===2">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm',1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm('ruleForm',0)">保存</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>
    <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div>
  </div>
</template>

<script>
import { putIncomeContract, addIncomeContract, getIncomeContractEditInit, getIncomeContractById, getBillFlow, deleteIncomeContract, getBussinessInfoById } from '@/api/ywgl/incomeContract'
// import { getProjectById } from '@/api/xmgl/project'
import { getTree } from '@/utils'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SelectBussinessInfo from '@/components/Other/ywgl/selectBussinessInfo'
import SelectProject from '@/components/Other/xmgl/selectProject'
import SelectPerson from '@/components/Other/selectPerson.vue'
export default {
  name: 'IncomeContractEdit',
  components: {
    FlowSelect,
    UpFile,
    OrgSelect2,
    SelectProject,
    SelectBussinessInfo,
    SelectPerson
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        companyId: this.$store.state.user.selectOrgId,
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
        fileList: []
      },
      orgStr: '',
      buildingStructure: '',
      incomeContractId: null,

      taxTypeList: [],
      sourceTypeList: [],
      projectPropertyList: [],
      orgList: null,

      attitudePara: null,
      loadFlow: false,
      billFlow: null,

      certificateProjectManagerName: '',

      active: 0,
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        orgId: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractPrice: [{ required: true, message: '请输入', trigger: 'blur' }],
        certificateProjectManager: [{ required: true, message: '请输入', trigger: 'blur' }],
        changePrice: [{ required: true, message: '请输入', trigger: 'blur' }],
        planSignDate: [{ required: true, message: '请输入', trigger: 'change' }],
        sourceType: [{ required: true, message: '请输入', trigger: 'change' }],
        contractStartDate: [{ required: true, message: '请输入', trigger: 'change' }],
        contractFinishDate: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  watch: {
    'ruleForm.sourceType': {
      handler: function(value) {
        if (value === 3) { this.rules.changePrice[0].required = true } else { this.rules.changePrice[0].required = false }
      },
      immediate: true
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
              this.$message('必须上传附件!')
              return
            }
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
          this.loading = true

          if (this.incomeContractId) {
            putIncomeContract(newObj).then(response => {
              if (response.errorMsg) {
              // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => {
              this.loading = false
              this.active = 0
            })
          } else {
            addIncomeContract(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
              // this.setData(response)
            }).catch(() => {
              this.loading = false
              this.active = 0
            })
          }
        }
      })
    },
    initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.incomeContractId = this.$route.query.id
      }
      new Promise((resolve, reject) => {
        getIncomeContractEditInit().then(response => {
          const { orgList, result1, result2, result3 } = response
          this.orgList = orgList
          this.sourceTypeList = result1
          this.taxTypeList = result3
          result2.forEach(element => {
            element.pid = element.pId
            element.label = element.name
          })
          this.projectPropertyList = getTree(0, result2)
          resolve(orgList)
        })
      }).then(orgList => {
        if (this.incomeContractId) {
          getIncomeContractById({ id: this.incomeContractId }).then(response => {
            const { data } = response
            this.ruleForm = data
            this.certificateProjectManagerName = data.person.name
            if (data.upFile) {
              this.ruleForm.fileList = data.upFile
            }
            this.orgStr = data.organization.name
            this.keyProjectProperty += 1
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
          console.log(newObj)
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
        this.loading = true
        deleteIncomeContract({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    selectChange(val) {
      this.ruleForm.bussinessInfoId = 0
      this.ruleForm.name = ''
      this.orgStr = ''
      this.ruleForm.orgId = null
      this.ruleForm.companyId = this.$store.state.user.selectOrgId
      this.ruleForm.contractPrice = 0
      this.ruleForm.estimatedProfit = 0
      this.selectValue = []
    },
    dayDiff() {
      if (this.ruleForm.contractStartDate && this.ruleForm.contractFinishDate) {
        var dateBegin = new Date(this.ruleForm.contractStartDate)
        var dateEnd = new Date(this.ruleForm.contractFinishDate)
        var dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
        this.ruleForm.contractDuration = dayDiff
      }
    },
    selectBussinessInfo() {
      this.$refs.bussinessInfoRef.openDialog()
    },
    selectProject() {
      this.$refs.projectRef.openDialog()
    },
    selectPerson() {
      this.$refs.personRef.openDialog()
    },
    getBussinessInfo(data) {
      if (data.length > 0) {
        this.ruleForm.bussinessInfoId = data[0].id
        this.ruleForm.name = data[0].projectName
        this.ruleForm.orgId = data[0].orgId
        this.ruleForm.companyId = data[0].companyId
        this.orgStr = data[0].orgStr
        getBussinessInfoById({ id: this.ruleForm.bussinessInfoId }).then((response) => {
          const { data } = response
          if (data) {
            this.ruleForm.contractPrice = data.planForeignQuotation
            this.ruleForm.estimatedProfit = data.estimatedProfit
          }
        })
      }
    },
    getProject(data) {
      if (data.length > 0) {
        this.ruleForm.bussinessInfoId = data[0].id
        this.ruleForm.name = data[0].name
        this.ruleForm.orgId = data[0].orgId
        this.ruleForm.companyId = data[0].companyId
        this.orgStr = data[0].orgStr
      }
    },
    getPersons(data) {
      if (data.length > 0) {
        this.ruleForm.certificateProjectManager = data[0].id
        this.certificateProjectManagerName = data[0].name
      }
    }
  }
}
</script>
