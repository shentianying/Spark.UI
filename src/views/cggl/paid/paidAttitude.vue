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
          <el-form-item label="采购付款编号">
            {{ ruleForm.number }}
            <!-- <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" /> -->
          </el-form-item>
          <el-form-item label="合同编号">
            <!-- <el-input v-model="ruleForm.contract.number" :disabled="true" placeholder="请选择" size="mini" maxlength="50">
              <el-button slot="append" :disabled="disabled" icon="el-icon-search" @click="checkContract()" />
            </el-input> -->
            <el-link :underline="false" @click="openContract(ruleForm.contractId)">{{ ruleForm.contract.number }}</el-link>
          </el-form-item>
          <el-form-item label="入库金额">
            {{ utils.formatMoney(ruleForm.storageAmount,2,0) }}
          </el-form-item>
          <el-form-item label="应付金额">
            {{ utils.formatMoney(ruleForm.dues,2,0) }}
          </el-form-item>
          <el-form-item label="已付金额">
            {{ utils.formatMoney(ruleForm.paid,2,0) }}
          </el-form-item>
          <el-form-item label="支付金额">
            <label v-if="isPaid===false||ruleForm.capitalType===2||ruleForm.capitalType===3">{{ utils.formatMoney(ruleForm.amount,2,0) }}</label>
            <el-input-number v-if="isPaid===true&&ruleForm.capitalType!==2&&ruleForm.capitalType!==3" v-model="ruleForm.amount" controls-position="right" size="mini" :step="0.0001" :min="0" :max="ruleForm.attitudeAmount" />
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
          <el-form-item label="项目">
            {{ orgStr }}
          </el-form-item>
          <el-form-item label="发票金额">
            {{ utils.formatMoney(ruleForm.invoice,2,0) }}
          </el-form-item>
          <el-form-item label="支付比例">
            {{ ruleForm.payScale }}%
          </el-form-item>
          <el-form-item label="申请金额">
            {{ utils.formatMoney(ruleForm.applyAmount,2,0) }}
          </el-form-item>
          <el-form-item label="审批金额" prop="attitudeAmount">
            <!-- {{ utils.formatMoney(ruleForm.attitudeAmount,2,0) }} -->
            <label v-if="isPaid===true||ruleForm.state===10000">{{ utils.formatMoney(ruleForm.attitudeAmount,2,0) }}</label>
            <el-input-number v-else v-model="ruleForm.attitudeAmount" size="mini" :step="0.0001" :min="0" :max="ruleForm.dues-ruleForm.paid" />
          </el-form-item>
          <el-form-item label="总支付金额">
            {{ utils.formatMoney(ruleForm.sumAmount,2,0) }}
          </el-form-item>
          <el-form-item label="资金形式">
            <label v-if="ruleForm.state===10000||(ruleForm.state===1000&&isPaid===false)">{{ getPayModeName(ruleForm.capitalType) }}</label>
            <org-select2
              v-else
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
    <div v-if="isPaid===true && (ruleForm.capitalType===2 || ruleForm.capitalType===3)">
      <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="checkAcceptance()">选择承兑</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="acceptanceList"
        border
        highlight-current-row
        size="mini"
        @row-dblclick="openAcceptance"
      >
        <el-table-column type="index" width="55" align="center" />
        <el-table-column label="票号" min-width="10">
          <template slot-scope="scope">
            <el-link :underline="false" size="mini" style="font-size: 12px;" @click="openAcceptance(scope.row)">{{ scope.row.ticketNumber }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款部门" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.orgName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.capitalType }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开票日期" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.ticketDate | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期日期" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.expiration | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="付款人" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.payer }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款银行" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.bank }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额" min-width="10">
          <template slot-scope="scope">
            {{ utils.formatMoney(scope.row.amount,2,0) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="10">
          <template slot-scope="scope">
            <el-popover trigger="hover" :content="scope.row.remark" placement="top">
              <span slot="reference" class="ellipsis-2">{{ scope.row.remark }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="10">
          <template slot-scope="scope">
            <div class="state">
              <div :class="{circle:true,success:scope.row.state===1}" />
              {{ scope.row.stateName }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <el-table
      v-loading="loading"
      :data="payModes"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
      style="margin-top:20px"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column label="付款方式" align="center" min-width="100">
        <template slot-scope="scope">
          {{ getPayModeName(scope.row.payMode) }}
        </template>
      </el-table-column>
      <el-table-column label="申请金额" header-align="center" align="right" min-width="80">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.applyAmount,2,3) }}
        </template>
      </el-table-column>
      <el-table-column label="审批金额" header-align="center" prop="attitudeAmount" align="right" min-width="150">
        <template slot-scope="scope">
          <el-input v-if="ruleForm.state<99" v-model="scope.row.attitudeAmount" :disabled="isPaid" size="mini" />
          <label v-if="ruleForm.state>=99">{{ utils.formatMoney(scope.row.attitudeAmount,2,3) }}</label>
        </template>
      </el-table-column>
      <el-table-column v-if="isPaid===true" label="支付金额" header-align="center" align="right" min-width="80">
        <template slot-scope="scope">
          <el-link :underline="false" size="mini" style="font-size: 12px;" @click="openAcceptance(scope.row)">{{ utils.formatMoney(scope.row.paid) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          <el-input v-if="ruleForm.state<99" v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
          <label v-if="ruleForm.state>=99">{{ scope.row.remark }}</label>
        </template>
      </el-table-column>
      <el-table-column v-if="isPaid===true" label="操作" align="center" min-width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.payMode===2 || scope.row.payMode===3" type="primary" size="mini" @click="checkAcceptance(scope.row)">选择承兑</el-button>
        </template>
      </el-table-column>
    </el-table> -->

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
        <el-button v-show="!isPaid" size="mini" type="success" :loading="loading" @click="save()">保存</el-button>
      </template>
      <template #otherBtn>
        <!-- <el-button size="mini" type="der">测试其他插槽</el-button> -->
        <el-button v-show="isPaid" type="primary" size="mini" @click="wantToPay()">确认支付</el-button>
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
        <component :is="comName" :obj="currentRow" :is-preview="true" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import { getCGPaidById, addAttitude, payFor } from '@/api/cggl/paid'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import AcceptanceList from './AcceptanceList'
import CheckAcceptance from './CheckAcceptance'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'PaidAttitude',
  components: {
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    AcceptanceList,
    CheckAcceptance,
    OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        fileList: [],
        quotation: {},
        supplier: {},
        contract: [],
        sumAmount: 0,
        amount: 0,
        attitudeAmount: 0
      },
      loading: false,
      activate: true,
      orgStr: '',
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
      isLoad: false,
      attitudePara: {},
      loadFlow: false,
      rules: {},
      isPaid: false,
      attitudeAmount: 0,
      acceptanceList: []
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
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        if (this.obj && this.obj.id) {
          this.id = this.obj.id
        } else {
          this.id = this.$route.query.id
        }
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getCGPaidById({ id: this.id }).then(response => this.setData(response))
      }
      getDictionarysByTypes({ types: 'CapitalType' })
        .then((response) => {
          const { data } = response
          var optionList = []
          data.forEach(element => {
            element.pid = element.pId
            optionList.push(element)
          })
          this.payModeOptions = optionList
          this.keyPayMode += 1
        })
    },
    setData(response) {
      const { data, orgStr, billFlowData, sumAmount } = response
      // 检查当前 状态 是否有特殊操作
      var filterOption = billFlowData.billFlowNode.filter(f => f.isCurrentState)
      if ((filterOption || []).length) {
        if (filterOption[0].option > 0) {
          // alert('当前节点有特殊操作')
          var userId = this.$store.state.user.info.uid
          if (filterOption[0].option === 99 && filterOption[0].personId === userId) {
            // 特殊操作为支付
            this.isPaid = true
          }
        }
      }

      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.ruleForm.sumAmount = sumAmount
      this.attitudeAmount = data.attitudeAmount
      this.orgStr = orgStr
      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true
      // 填充 明细列表
      this.payModes = data.cgPaidDetails
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    },
    openContract(id) {
      this.$router.push({ name: 'ContractDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    getPayModeName(type) {
      if (type !== null) {
        var entryType = this.payModeOptions.find(f => f.value === type)
        if (entryType !== undefined) {
          return entryType.name
        } else {
          return ''
        }
      } else {
        return ''
      }
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
      sums[2] = Number(sums[2]).toFixed(4)
      this.ruleForm.attitudeAmount = sums[2]
      return sums
    },
    save() {
      // 保存审批步骤
      // 1.调用组件中的验证
      // 2.获取表单参数数据
      // 3.请求 审批

      const result = this.$refs.flowAttitude.checkValidate()
      if (result) {
        var attitudeData = this.$refs.flowAttitude.getPostData()
        var newObj = JSON.parse(JSON.stringify(this.ruleForm))
        var paidData = {}
        paidData.id = newObj.id
        paidData.attitudeAmount = newObj.attitudeAmount
        paidData.storageAmount = newObj.storageAmount
        paidData.dues = newObj.dues
        paidData.invoice = newObj.invoice
        paidData.capitalType = newObj.capitalType
        // 提交数据
        var postData = {
          attitude: attitudeData,
          cgPaid: paidData
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
    },
    // openAcceptance(row) {
    //   if (row.payMode === 2 || row.payMode === 3) {
    //     var total_list = []
    //     this.acceptanceList.forEach(e => {
    //       if (e.capitalType === this.getPayModeName(row.payMode)) {
    //         total_list.push(e)
    //       }
    //     })
    //     var data = {
    //       list: total_list
    //     }
    //     this.currentRow = data
    //     this.dialogTitle = this.getPayModeName(row.payMode) + '已选择承兑明细'
    //     this.comName = 'AcceptanceList'
    //     this.dialogWidth = '60%'
    //     this.dialogTableVisible = true
    //   }
    // },
    openAcceptance(row, type) {
      this.$router.push({ name: 'ChengDuiXinXiDetails', query: { id: row.id, type, refreshRouterName: this.$route.name }})
    },
    checkAcceptance() {
      // 选择承兑
      // if (row.payMode === 2 || row.payMode === 3) {
      //   var data = {
      //     id: row.id,
      //     capitalType: row.payMode,
      //     list: this.acceptanceList
      //   }
      //   this.currentRow = data
      //   this.dialogTitle = this.getPayModeName(row.payMode) + '选择承兑明细'
      //   this.comName = 'CheckAcceptance'
      //   this.dialogWidth = '60%'
      //   this.dialogTableVisible = true
      // }
      var _data = this.ruleForm
      if (_data.capitalType === 2 || _data.capitalType === 3) {
        var data = {
          id: _data.id,
          capitalType: _data.capitalType,
          list: this.acceptanceList
        }
        this.currentRow = data
        this.dialogTitle = this.getPayModeName(_data.capitalType) + '选择承兑明细'
        this.comName = 'CheckAcceptance'
        this.dialogWidth = '60%'
        this.dialogTableVisible = true
      }
    },
    dialogClose(data, state) {
      this.addAcceptance(data, state)
      this.dialogTableVisible = false
    },
    addAcceptance(data, state) {
      // if (state === 'add') {
      //   if (data.amount > this.payModes.find(f => f.id === data.id).attitudeAmount) {
      //     this.$message.error('支付金额不可大于审批金额')
      //   } else {
      //     var total_list = []
      //     this.acceptanceList.forEach(e => {
      //       if (e.capitalType !== this.getPayModeName(data.capitalType)) {
      //         total_list.push(e)
      //       }
      //     })
      //     data.list.forEach(e => {
      //       total_list.push(e)
      //     })
      //     this.acceptanceList = total_list
      //     this.payModes.find(f => f.id === data.id).paid = data.amount
      //   }
      // }
      if (state === 'add') {
        if (data.amount > this.ruleForm.attitudeAmount) {
          this.$message.error('支付金额不可大于审批金额')
        } else {
          this.acceptanceList = data.list
          this.ruleForm.amount = data.amount
        }
      }
    },
    wantToPay() {
      // const { flowAttitude } = this.$refs
      // flowAttitude.$refs['ruleForm'].validate(valid => {
      //   if (valid) {
      //     const newObj = JSON.parse(JSON.stringify(flowAttitude.ruleForm))
      //     newObj.billId = flowAttitude.para.planId
      //     newObj.formId = flowAttitude.para.formId

      //     newObj.operation = flowAttitude.data.find(f => f.value === flowAttitude.ruleForm.attitudeType).text
      //     if (flowAttitude.ruleForm.attitudeType === 3) {
      //       if (flowAttitude.ruleForm.backGroup === 0) {
      //         newObj.operation += '制单'
      //       } else {
      //         newObj.operation += flowAttitude.billFlowNodeList.find(f => f.value === flowAttitude.ruleForm.backGroup).name
      //       }
      //     }
      //     this.$confirm('是否确定', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       if (flowAttitude.ruleForm.attitudeType !== 3) {
      //         var newObj2 = JSON.parse(JSON.stringify(this.ruleForm))
      //         if (newObj2.amount === 0) {
      //           this.$message.error('支付金额不可为0')
      //         } else if (this.acceptanceList.length < 1 && (newObj2.capitalType === 2 || newObj2.capitalType === 3)) {
      //           this.$message.error('请选择承兑列表')
      //         } else {
      //           var postData = {}
      //           postData.id = newObj2.id
      //           // postData.paid = newObj2.paid
      //           postData.amount = newObj2.amount
      //           postData.capitalType = newObj2.capitalType
      //           var acceptances = []
      //           this.acceptanceList.forEach(e => {
      //             var data = {
      //               id: e.id
      //             }
      //             acceptances.push(data)
      //           })
      //           postData.acceptanceList = acceptances
      //           payFor(postData).then(() => {
      //             this.$refs['flowAttitude'].add(newObj)
      //           })
      //         }
      //       } else {
      //         this.$refs['flowAttitude'].add(newObj)
      //       }
      //     })
      //   }
      // })

      // 保存审批步骤
      // 1.调用组件中的验证
      // 2.获取表单参数数据
      // 3.请求 审批

      const result = this.$refs.flowAttitude.checkValidate()
      if (result) {
        var attitudeData = this.$refs.flowAttitude.getPostData()
        var newObj = JSON.parse(JSON.stringify(this.ruleForm))
        var paidData = {}
        paidData.id = newObj.id
        paidData.amount = newObj.amount
        paidData.capitalType = newObj.capitalType
        var acceptances = []
        this.acceptanceList.forEach(e => {
          var data = {
            id: e.id
          }
          acceptances.push(data)
        })
        paidData.acceptanceList = acceptances
        // 提交数据
        var postData = {
          attitude: attitudeData,
          cgPaid: paidData
        }
        this.loading = true
        payFor(postData).then(res => {
          if (res.success) {
            this.$message.success('支付成功')
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
    // openSupplier(id) {
    //   this.$router.push({ name: 'SupplierDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    // },
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
