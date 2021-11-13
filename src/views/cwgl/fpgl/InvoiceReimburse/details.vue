<template>
  <div class="app-container details">
    <div slot="title" class="title"><i class="el-icon-info" />发票报销</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="infoList"
    />
    <TableEx
      class="padding-20"
      :show-count="false"
      :show-actions="false"
      :show-pagination="false"
      :size="size"
      :columns="invoiceTable.columns"
      :table-loading="invoiceTable.loading"
      :list="invoiceTable.list"
    />
    <template v-if="state === 1000 && utils.IsNextPerson(billFlowData)">
      <div class="title"><i class="el-icon-info" />支付信息</div>
      <el-form
        ref="payForm"
        class="padding-20 my-form"
        :inline="true"
        :model="payForm"
        :rules="payForm"
        label-width="120px"
        :size="size"
      >
        <el-form-item prop="bank" label="开户行:" :rules="payRules.text">
          <el-input v-model="payForm.bank" placeholder="请输入" class="input-width" />
        </el-form-item>
        <el-form-item prop="account" label="账号:" :rules="payRules.text">
          <el-input v-model="payForm.account" placeholder="请输入" class="input-width" />
        </el-form-item>
        <el-form-item prop="imprestAmount" label="冲备用金金额:" :rules="payRules.amount">
          <el-input :value="payForm.imprestAmount" placeholder="请输入" class="input-width" @input="(val)=>payForm.imprestAmount = val.replace(/[^\d.]/g, '')" />
        </el-form-item>
        <el-form-item prop="capitalType" label="支付方式:" :rules="payRules.text">
          <CapitalSelect v-model="payForm.capitalType" placeholder="请选择" class="input-width" :multiple="false" :show-all-levels="false" />
        </el-form-item>
        <el-form-item prop="balance" label="付款金额:" :rules="payRules.amount">
          <el-input :value="payForm.balance" placeholder="请输入" class="input-width" @input="(val)=>payForm.balance = val.replace(/[^\d.]/g, '')" />
        </el-form-item>
      </el-form>
    </template>
    <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      show
      :para="attitudePara"
      @update="updateFlow"
    >
      <template v-slot:saveBtn="{attitudeType}">
        <el-button v-if="state===1000 && (attitudeType === 1 || attitudeType===2)" :loading="payLoading" type="primary" :size="size" @click="wantToPay2()">支付</el-button>
        <el-button v-else-if="attitudeType===1 || attitudeType===2" :loading="saveLoading" type="success" :size="size" @click="saveFlow()">保存</el-button>
      </template>
    </flow-attitude>
  </div>

</template>

<script>
import { GetInvoiceReimburseAttitudeById, GetInvoiceReimburseDetailById, PayFor, CheckInvoiceReimburse } from '@/api/cwgl/InvoiceReimburse.js'
import TableEx from '@/components/TableEx'
import FlowDisplay from '@/components/Flow/flowDisplay'
import { validate } from '@/utils/validate'
import { formatMoney } from '@/utils'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
import CapitalSelect from '@/components/SearchBar/form/CapitalSelect'
export default {
  name: 'DepositDetails',
  components: {
    FlowDisplay,
    FlowAttitude,
    Detailsedit,
    TableEx,
    CapitalSelect
  },
  data() {
    return {
      type: 'InvoiceReimburseDetails', // 审核:approval 详情:details 支付:pay 变更:alteration 回收:recycle
      size: 'mini',
      // 过滤器
      filter: {
        stateOptions: []
      },

      /* 列表数据相关 */
      invoiceTable: { // 变更列表
        columns: [
          {
            label: '序号', // 表头
            minWidth: '50', // 最小宽度
            type: 'index'
          },
          {
            label: '发票类别', // 表头
            prop: 'invoiceCategoryName', // 渲染的属性
            minWidth: '80' // 最小宽度
          },
          {
            label: '发票代码',
            prop: 'invoiceCode',
            minWidth: '100'
          },
          {
            label: '票号',
            prop: 'invoiceNum',
            minWidth: '120'
          },
          {
            align: 'right',
            label: '申请金额(含税)',
            format: 'money',
            prop: 'applicationAmount',
            minWidth: '120'
          },
          {
            label: '税率',
            prop: 'tax',
            format: (val) => `${val * 100}%`,
            minWidth: '80'
          },
          {
            align: 'right',
            format: 'money',
            label: '税额',
            prop: 'taxAmount',
            minWidth: '80'
          },
          {
            align: 'right',
            label: '金额(不含税)',
            format: 'money',
            prop: 'excludeTaxAmount',
            minWidth: '120'
          },
          {
            // align: 'right',
            // label: '批准金额',
            // format: 'money',
            // prop: 'amount',
            // minWidth: '120'
            render: (h) => {
              return (<el-table-column
                class='TableExColumn'
                label='批准金额'
                min-width='120'
                align='right'
                scopedSlots={{
                  default: ({ row }) => {
                    const { size } = this
                    if (this.state === 1) {
                      return (
                        <el-input
                          value={row.amount}
                          placeholder='请输入，流程中可编辑'
                          size={size}
                          onInput={(val) => {
                            console.log(val)
                            this.$set(row, 'amount', val.replace(/[^\d.]/g, ''))
                          }}
                        />
                      )
                    } else {
                      return formatMoney(row.amount, 2, 0)
                    }
                  }
                }}
              />)
            }
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '120'
          }
        ],
        list: [],
        loading: false
      },
      payForm: { // 支付表单
        id: 0,
        bank: '',
        account: '',
        imprestAmount: '',
        balance: '',
        capitalType: '1'
      },
      payRules: {
        text: [{ required: true, message: '请输入内容', trigger: 'change' }],
        amount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ]
      },

      saveLoading: false,
      payLoading: false,
      myDetails: null, // 详情数据
      billFlowData: null, // 流程信息
      attitudePara: null // 审批信息
    }
  },
  computed: {
    state() {
      return this.myDetails?.data?.state
    },
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {

          data: {
            orgStr,
            costPlanNumber,
            reimburseTypeName,
            account,
            // NCAccountSetName,
            accountName,
            capitalType,
            balance,
            bank,
            imprestAmount,
            number,
            invoiceType,
            invoiceDate,
            invoiceCategory,
            entertainmentPlanNumber,
            entertainmentPlanId,

            summary,
            costPlanId,
            personName,
            IsBussinessFee,
            personNumber,
            applicationAmount,
            payoutUserName,
            payoutDate,
            remark,
            upFile,
            invoiceUpFile,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate,

            submitUserName,
            submitDate,
            state
          }

        }
      } = this

      // 数据格式化
      const m = (val) => this.utils.formatMoney(val, 2, 4)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      // const a = this.utils.amountInWords

      // 制单部分信息
      const info = [
        { label: '开户行', value: bank },
        { label: '账户', value: account },
        { label: '冲备用金金额', value: imprestAmount },
        { label: '支付方式', value: capitalType },
        { label: '付款金额', value: balance, monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '提交人', value: submitUserName },
        { label: '提交时间', value: submitDate },
        { label: '支付人', value: payoutUserName },
        { label: '支付时间', value: payoutDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: this.filter.stateOptions.find(item => item.value === state).name }
      ]

      return [
        { label: '报销类型', value: reimburseTypeName },
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        // { label: '账套', value: NCAccountSetName },
        { label: '账套', value: accountName },
        { label: '发票类型', value: invoiceType },
        { label: '发票日期', value: d(invoiceDate) },
        { label: '发票类别', value: invoiceCategory },
        { label: '费用计划号',
          value: costPlanNumber || entertainmentPlanNumber,
          class: 'link',
          click: () => this.toCostPlanDetails(
            costPlanId || entertainmentPlanId,
            costPlanId ? 'costPlan' : 'entertainmentPlan')
        },
        { label: '工号', value: personNumber },
        { label: '姓名', value: personName },
        { label: '项目营销费用', value: IsBussinessFee ? '是' : '否' },
        { label: '金额', value: m(applicationAmount) },
        { label: '事由', value: summary },
        { label: '备注', value: remark },
        { label: '发票附件', value: invoiceUpFile || [], component: 'UpFile' },
        { label: '其他附件', value: upFile || [], component: 'UpFile' },

        // { label: '金额大写', value: a(applicationAmount) },
        // { label: '批准金额', value: m(amount) },
        // { label: '金额大写', value: a(amount) },
        // { label: '客商', value: bussinessMan },

        ...((state === 10000) || (this.type === 'recycle') ? info : [])
      ]
    },
    amount() {
      let count = 0
      this.invoiceTable.list.forEach(item => {
        count += Number(item.amount) || 0
      })
      return count
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData()
    })
  },
  methods: {
    toCostPlanDetails(id, type) {
      this.$router.push({
        name: type === 'costPlan' ? 'CostPlanDetails' : 'EntertainmentPlanDetails',
        query: { type: '', id, refreshRouterName: this.$route.name }
      })
    },
    // 作废
    saveFlow() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        const attitude = this.$refs.flowAttitude.getPostData()

        if (attitude.attitudeType === 1 || attitude.attitudeType === 2) {
          let errCount = 0
          this.invoiceTable.list.forEach(({ amount }) => {
            if (/[^\d.]/g.test(amount) && amount !== 0) errCount++
          })
          if (errCount) {
            return this.$message.error('请填写批准金额')
          }
          if (Number(this.amount) > this.myDetails.data.applicationAmount) {
            return this.$message.error('批准金额不能大于申请金额')
          }
        }

        this.saveLoading = true
        const postData = {
          attitude,
          id: this.myDetails.data.id,
          amount: this.amount,
          invoiceReimburseDetails: this.invoiceTable.list
        }
        CheckInvoiceReimburse(postData).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.goBack() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.saveLoading = false
        })
      })
    },
    wantToPay2() {
      if (this.payForm.balance > this.myDetails.data.amount) {
        return this.$message.error('付款金额不能大于批准金额')
      }
      const { imprestAmount, balance } = this.payForm
      if (this.myDetails.data.amount !== (Number(imprestAmount) + Number(balance))) {
        return this.$message.error('冲备用金金额、付款金额之和必须与批准金额一致')
      }
      this.$refs['payForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定要支付吗?', '提示', {
            type: 'warning'
          }).then(() => {
            this.payLoading = true
            const { data: { id }} = this.myDetails
            const attitudeData = this.$refs.flowAttitude.getPostData()
            PayFor({ ...this.payForm, attitude: attitudeData, id }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.goBack() // 跳转
              } else {
                this.$message.error(res.message)
              }
            }).finally(() => {
              this.payLoading = false
            })
          })
        }
      })
    },
    /**
     * @description: 初始化数据
     */
    initData() {
      const { id, type } = this.$route.query
      this.type = type
      this.myId = id
      this.fetchData()
    },
    /**
     * 提交审批意见以后的回调函数
     */
    updateFlow() {
      // 直接返回
      this.goBack()
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      GetInvoiceReimburseDetailById({ id: this.myId }).then(res => {
        this.billFlowData = res.billFlowData
        this.invoiceTable.list = res.data.invoiceReimburseDetails
        this.filter.stateOptions = res.billFlowData?.form?.formState || []
        this.myDetails = res

        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.billFlowData.id, planId: res.data.id }
        this.$nextTick(() => {
          this.$refs['flowAttitude'].ruleForm.content = res.data.state === 1000 ? '已支付' : ''
        })
      })
      GetInvoiceReimburseAttitudeById({ id: this.myId }).then(res => {
        this.payForm = {
          ...this.payForm,
          account: res.data.account,
          bank: res.data.bank,
          capitalType: res.capitalType || this.payForm.capitalType,
          imprestAmount: res.data.imprestAmount,
          balance: res.data.balance

        }
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      })
    },
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  /deep/.link {
  cursor: pointer;
  text-decoration: underline;
  }
  /deep/.el-form.my-form {
  .el-form-item{
    width:45%
  }
  .input-width {
    width: 272px;
  }
  .el-form-item__label{
    font-weight: normal;
    color: #101010;
    }
  }
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

  .pay{
    padding: 0 32px;
    .input-wrap{

    display: flex;
    &>div{
      width: 50%;
      display: flex;
      align-items: center;
    }
  }
    .label{
      width: 100px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .input-width{
    width: 250px;
  }
  }

  .affirm{
    padding:16px 0 16px 56px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 64px;
    background-color: white;
  }
}
</style>

