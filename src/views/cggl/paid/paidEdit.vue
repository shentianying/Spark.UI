<template>
  <div class="app-container">
    <div v-show="active===0">
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
            <el-form-item label="采购付款编号">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
            <!-- <el-form-item label="供应商名称">
              <el-link :underline="false" @click="openSupplier(ruleForm.contract.supplier.id)">{{ ruleForm.contract.supplier.name }}</el-link>
            </el-form-item> -->
            <el-form-item
              v-if="activate"
              label="项目"
              prop="orgId"
            >
              <org-select2
                :key="orgKey"
                v-model="ruleForm.orgId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :select-data="ruleForm.orgId"
                select-style="width:100%;"
              />
            </el-form-item>
            <el-form-item label="入库金额">
              {{ ruleForm.storageAmount }}元
            </el-form-item>
            <el-form-item label="应付金额">
              {{ ruleForm.dues }}元
            </el-form-item>
            <el-form-item label="已付金额">
              {{ ruleForm.paid }}元
            </el-form-item>
            <el-form-item label="申请金额" prop="applyAmount">
              <!-- {{ ruleForm.applyAmount }}元 -->
              <el-input-number v-model="ruleForm.applyAmount" size="mini" :step="0.0001" :min="0" :max="ruleForm.dues-ruleForm.paid" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <!-- <el-form-item label="供应商">
              <el-input v-model="ruleForm.supplierName" disabled="true" size="mini" maxlength="50" />
            </el-form-item> -->
            <el-form-item label="合同编号" prop="contractNumber">
              <el-input v-model="ruleForm.contractNumber" :disabled="true" placeholder="请选择" size="mini" maxlength="50">
                <el-button slot="append" :disabled="disabled" icon="el-icon-search" @click="checkContract()" />
              </el-input>
              <!-- <el-link :underline="false" @click="openContract(ruleForm.contractId)">{{ ruleForm.contract.name }}</el-link> -->
            </el-form-item>
            <el-form-item label="供应商">
              {{ ruleForm.supplierName }}
            </el-form-item>
            <el-form-item label="资金形式" prop="capitalType">
              <org-select2
                :key="keyPayMode"
                v-model="ruleForm.capitalType"
                size="mini"
                :collapse-tags="false"
                props-value="value"
                :show-all-levels="false"
                :multiple="false"
                :filterable="true"
                :options="payModeOptions"
              />
            </el-form-item>
            <el-form-item label="附件">
              <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
            </el-form-item>
            <!-- <el-form-item label=" ">
              &nbsp;
            </el-form-item> -->
            <el-form-item label="发票金额">
              {{ ruleForm.invoice }}元
            </el-form-item>
            <el-form-item label="审批金额" prop="attitudeAmount">
              {{ ruleForm.attitudeAmount }}元
              <!-- <el-input-number v-model="ruleForm.attitudeAmount" size="mini" :step="0.0001" :min="0" :max="ruleForm.dues-ruleForm.paid" /> -->
            </el-form-item>
            <!-- <el-form-item label="日期" prop="contractDate">
              <el-date-picker
                v-model="ruleForm.contractDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                style="width:100%"
                size="mini"
              />
            </el-form-item> -->
            <!-- <el-form-item label="供货方式" prop="howSupply">
              <el-input v-model="ruleForm.howSupply" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
      <!-- <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="add()">+添加付款方式</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="payModes"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column label="付款方式" align="center" min-width="100">
          <template slot-scope="scope">
            <org-select2
              :key="scope.row.index"
              v-model="scope.row.payMode"
              size="mini"
              :collapse-tags="false"
              props-value="value"
              :show-all-levels="false"
              :multiple="false"
              :filterable="true"
              :options="payModeOptions"
            />
          </template>
        </el-table-column>
        <el-table-column label="申请金额" header-align="center" prop="applyAmount" align="right" min-width="80">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.applyAmount" controls-position="right" size="mini" :step="0.0001" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="80">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table> -->
      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
      </div>
    </div>

    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" @dialogClose="dialogClose" />
      </el-dialog>
    </div>

    <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div>
  </div>
</template>
<script>
import { getCGPaidById, addCGPaid, putCGPaid, getBillFlow, deleteCGPaid, getContractDetail } from '@/api/cggl/paid'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import QuotationSuppliersCheck from '@/views/cggl/quotation/quotationSuppliersCheck'
import ContractCheck from '@/views/cggl/contract/contractCheck'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
export default {
  name: 'PaidEdit',
  components: {
    OrgSelect2,
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    QuotationSuppliersCheck,
    ContractCheck
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        contractNumber: null,
        orgId: null,
        fileList: [],
        contract: {},
        dues: 0,
        paid: 0,
        invoice: 0,
        applyAmount: 0,
        attitudeAmount: 0,
        storageAmount: 0
      },
      loading: false,
      activate: true,
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      list: [],
      payModes: [],
      payModeOptions: [],
      keyPayMode: 0,
      billFlow: null,
      attitudePara: null,
      loadFlow: false,
      orgKey: 0,
      fileListKey: 0,
      disabled: false,
      rules: {
        orgId: [{ required: true, message: '请选择', trigger: 'blur' }],
        contractNumber: [{ required: true, message: '请选择', trigger: 'blur' }]
        // applyAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
        // breachDuty: [{ required: true, message: '请输入', trigger: 'blur' }],
        // attitudeAmount: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'ruleForm.applyAmount': {
      handler: function(value, oldvalue) {
        if (value > this.ruleForm.dues - this.ruleForm.paid) {
          this.$message.error('超出可申请金额范围！')
        }
      }, deep: true
    }
  },
  activated() {
    this.initData()
  },
  mounted() {
  },
  methods: {
    // 根据表单获取流程
    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {}
          postData.number = newObj.number
          postData.contractId = newObj.contract.id
          postData.orgId = newObj.orgId
          postData.dues = newObj.dues
          postData.paid = newObj.paid
          postData.invoice = newObj.invoice
          postData.applyAmount = newObj.applyAmount
          postData.attitudeAmount = newObj.attitudeAmount
          postData.storageAmount = newObj.storageAmount
          postData.billFlowId = newObj.billFlowId
          postData.capitalType = newObj.capitalType
          postData.fileList = newObj.fileList
          if (this.id) {
            postData.id = this.id
          }
          if (newObj.applyAmount > newObj.dues - newObj.paid) {
            this.$message.error('超出可申请金额范围！')
            this.loading = false
          } else {
            getBillFlow(postData).then(response => {
              this.loading = false
              if (response.success) {
                this.billFlow = response.data.billFlow
                this.active = 1
              } else {
                this.$message(response.message)
              }
            }).catch(() => { this.loading = false })
          }
        }
      })
    },
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.ruleForm.state = state
          this.loading = true
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {}
          postData.number = newObj.number
          postData.contractId = newObj.contract.id
          postData.orgId = newObj.orgId
          postData.dues = newObj.dues
          postData.paid = newObj.paid
          postData.invoice = newObj.invoice
          postData.applyAmount = newObj.applyAmount
          postData.attitudeAmount = newObj.attitudeAmount
          postData.storageAmount = newObj.storageAmount
          postData.billFlowId = newObj.billFlowId
          postData.capitalType = newObj.capitalType
          postData.fileList = newObj.fileList
          postData.state = newObj.state

          // 获取流程组件中的数据
          if (state === 1) {
            // 如果是提交，验证流程人员的完整信息
            const checkBillFlow = this.$refs.flowSelect.checkBillFlow()
            if (!checkBillFlow) {
              this.$message('流程错误，流程中审批人员不能为空')
              return false
            }
          }

          const billFlow = this.$refs.flowSelect.getBillFlow()
          console.log('获取的billFlow:', billFlow)
          this.ruleForm.billFlow = billFlow
          postData.billFlow = billFlow

          if (this.id) {
            postData.id = this.id
            putCGPaid(postData).then(response => {
              this.closeThePage()
            })
          } else {
            postData.id = 0
            addCGPaid(postData).then(response => {
              this.closeThePage()
            })
          }
        }
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    async initData() {
      getDictionarysByTypes({ types: 'CapitalType' })
        .then((response) => {
          var payModesOptions = []
          const { data } = response
          data.forEach(element => {
            element.pid = element.pId
            payModesOptions.push(element)
          })
          this.keyPayMode += 1
          this.payModeOptions = payModesOptions
        })
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getCGPaidById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.ruleForm.contractNumber = data.contract.number
      this.orgKey++ // 重新加载项目组件
      this.fileListKey++ // 重新加载文件组件
      // 填充 明细列表
      this.payModes = data.cgPaidDetails
      this.keyPayMode++ // 重新加载付款方式组件
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      if (state === 'checkContract') {
        this.ruleForm.contract = data
        this.ruleForm.contractNumber = data.number
        getContractDetail({ contractId: data.id }).then(response => {
          const { dues, paid, invoice, storageAmount, supplierName } = response.data
          this.ruleForm.dues = dues
          this.ruleForm.paid = paid
          this.ruleForm.invoice = invoice
          this.ruleForm.storageAmount = storageAmount
          this.ruleForm.supplierName = supplierName
        })
      }
      this.dialogTableVisible = false
    },
    cancel() { // 作废
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteCGPaid({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    openContract(id) {
      this.$router.push({ name: 'ContractAttitude', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    // openSupplier(id) {
    //   this.$router.push({ name: 'SupplierDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    // },
    handleChange() {
      //
    },
    add() {
      var pom = {
        payMode: null,
        applyAmount: null,
        remark: ''
      }
      this.payModes.push(pom)
    },
    del(d) {
      // 列表删除
      this.payModes.splice(d.$index, 1)
    },
    checkContract() {
      this.dialogTitle = '选择合同'
      this.comName = 'ContractCheck'
      this.currentRow = null
      this.dialogWidth = '100%'
      this.fileList = []
      this.dialogTableVisible = true
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = curr
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })
      sums[1] = Number(sums[1]).toFixed(4)
      this.ruleForm.applyAmount = sums[1]
      this.ruleForm.attitudeAmount = sums[1]
      return sums
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-top:10px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
