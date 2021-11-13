<template>
  <el-tabs v-model="currTab" class="app-container details">
    <el-tab-pane name="details">
      <div slot="label" class="title"><i class="el-icon-info" />保证金申请</div>
      <Detailsedit
        v-if="myDetails"
        status="checkInfo"
        :info-list="infoList"
      />
      <TableEx
        class="padding-50"
        :show-count="false"
        :show-actions="false"
        :show-pagination="false"
        :size="size"
        :columns="alterationTable.columns"
        :table-loading="alterationTable.loading"
        :list="alterationTable.list"
        @rowClick="alterationClick"
      />
      <div class="title"><i class="el-icon-info" />回收记录</div>
      <TableEx
        class="padding-50"
        :show-count="false"
        :show-actions="false"
        :show-pagination="false"
        :size="size"
        :columns="recycleTable.columns"
        :table-loading="recycleTable.loading"
        :list="recycleTable.list"
      />
      <template v-if="state !== 1001">
        <div v-if="myDetails && myDetails.data.state === 1 && utils.IsNextPerson(billFlowData)">
          <div class="title"><i class="el-icon-info" />批准金额</div>
          <div class="pay">
            <div class="input-wrap">
              <div><span class="label">批准金额</span><el-input :value="amount" placeholder="请输入，流程中可编辑" :size="size" class="input-width" @input="amount=$event.replace(/[^\d.]/g, '')" /></div>
              <div><span class="label">金额大写</span><el-input :value="utils.amountInWords(amount)" disabled placeholder="自动生成" :size="size" class="input-width" /></div>
            </div>
          </div>
        </div>
        <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
        <flow-attitude
          v-if="attitudePara"
          ref="flowAttitude"
          show
          :para="attitudePara"
          @update="updateFlow"
        >
          <template v-slot:saveBtn="{attitudeType}">
            <el-button v-if="state===1000 && (attitudeType===1 || attitudeType===2)" :loading="payLoading" type="primary" :size="size" @click="wantToPay2()">{{ attitudeType===2?'保存':'支付' }}</el-button>
            <el-button v-else-if="attitudeType===1 || attitudeType===2" :loading="saveLoading" type="success" :size="size" @click="saveFlow()">保存</el-button>
          </template>
        </flow-attitude>
      </template>
      <template v-else>
        <div class="title"><i class="el-icon-info" />回收保证金</div>
        <el-form
          ref="recycleForm"
          class="padding-50 recycleForm"
          :inline="true"
          :model="recycleForm"
          :rules="recycleRules"
          label-width="120px"
          :size="size"
        >
          <el-form-item prop="amount" label="回收金额:">
            <el-input v-model="recycleForm.amount" placeholder="请输入" class="input-width" />
          </el-form-item>
          <el-form-item label="回收日期:" prop="returnDate">
            <el-date-picker
              v-model="recycleForm.returnDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
              class="input-width"
            />
          </el-form-item>
          <el-form-item prop="remark" label="备注:">
            <el-input v-model="recycleForm.remark" placeholder="请输入" class="input-width" type="textarea" />
          </el-form-item>
          <el-form-item />
          <el-form-item label=" ">
            <el-button :size="size" type="primary" @click="addRecycle">添加</el-button>
            <el-button :size="size" @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-tab-pane>
    <el-tab-pane v-for="(item,key) in alterationTable.list" :key="key" label="变更" :name="item.id.toString()">
      <div slot="label" class="title">变更{{ key+1 }}</div>
      <Detailsedit
        v-if="myDetails"
        status="checkInfo"
        :info-list="alterationInfo"
      />
      <Alteration type="approval" :details="myDetails" :alteration="item" />
    </el-tab-pane>
    <el-tab-pane v-if="type === 'alteration'" label="变更" name="addAlteration">
      <div slot="label" class="title">变更{{ alterationTable.list.length+1 }}</div>
      <Detailsedit
        v-if="myDetails"
        status="checkInfo"

        :info-list="alterationInfo"
      />
      <Alteration :details="myDetails" type="add" :alteration="alterationTable.list[alterationTable.list.length -1]" />
    </el-tab-pane>

  </el-tabs>

</template>

<script>
import { GetDepositAttitudeById, PayFor, CheckDeposit, GetDepositDetailById, ReturnDeposit, DeleteDeposit } from '@/api/cwgl/Deposit.js'
import TableEx from '@/components/TableEx'
import FlowDisplay from '@/components/Flow/flowDisplay'
import { validate } from '@/utils/validate'
import Alteration from './Alteration'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
// import CapitalSelect from '@/components/SearchBar/form/CapitalSelect'
export default {
  name: 'DepositDetails',
  components: {
    FlowDisplay,
    FlowAttitude,
    Detailsedit,
    TableEx,
    Alteration
    // CapitalSelect
  },
  data() {
    return {
      type: 'details', // 审核:approval 详情:details 支付:pay 变更:alteration 回收:recycle
      amount: '',
      size: 'mini',
      capitalType: 1,

      // 过滤器
      filter: {
        stateOptions: []
      },

      currTab: 'details', // 当前标签页

      /* 列表数据相关 */
      alterationTable: { // 变更列表
        columns: [
          {
            label: '序号', // 表头
            minWidth: '80', // 最小宽度
            type: 'index'
          },
          {
            label: '变更前经手人', // 表头
            prop: 'formerPerson.name', // 渲染的属性
            minWidth: '120' // 最小宽度
          },
          {
            label: '变更前回收日期',
            format: 'date',
            prop: 'formerReturnDate',
            minWidth: '120'
          },
          {
            label: '变更后经手人',
            prop: 'person.name',
            minWidth: '120'
          },
          {
            label: '变更后回收日期',
            format: 'date',
            prop: 'returnDate',
            minWidth: '120'
          },
          {
            label: '变更原因',
            prop: 'reason',
            minWidth: '120'
          },
          {
            label: '状态', // 表头
            prop: 'state', // 渲染的属性
            format: (val, format, row) => {
              return row?.billFlow?.form?.formState?.find(e => e.value === val)?.name
            },
            minWidth: '85' // 最小宽度
          },
          {
            label: '待处理',
            prop: 'billFlow',
            format: (val, format, row) => row.state !== -1 ? this.utils.getPerson(val) : null,
            width: '100'
          },
          {
            business: 'createUser' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          }
        ],
        list: [],
        loading: false
      },
      // 回收相关
      recycleTable: {
        columns: [
          {
            label: '序号', // 表头
            minWidth: '80', // 最小宽度
            type: 'index'
          },
          {
            align: 'right',
            label: '回收金额',
            format: 'money',
            prop: 'amount',
            minWidth: '150'
          },
          {
            label: '回收日期',
            format: 'date',
            prop: 'returnDate',
            minWidth: '120'
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '120'
          },
          {
            label: '回收人',
            prop: 'createUserName',
            width: '100'
          }
        ],
        list: [],
        loading: false
      },
      recycleForm: {
        id: 0,
        returnDate: '',
        amount: '',
        remark: ''
      },
      recycleRules: {
        returnDate: [{ required: true, message: '请输入日期', trigger: 'change' }],
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
      attitudePara: null, // 审批信息
      showPayButton: false
    }
  },
  computed: {
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          orgStr,
          depositType,
          data: {
            person,
            number,
            bussinessMan,
            planReturnDate,
            amount,
            summary,
            applicationAmount,
            payoutUserName,
            payoutDate,
            returnUserName,
            returnDate,
            remark,
            upFile,
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
      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      const a = this.utils.amountInWords

      // 制单部分信息
      const info = [
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '提交人', value: submitUserName },
        { label: '提交时间', value: submitDate },
        { label: '支付人', value: payoutUserName },
        { label: '支付时间', value: payoutDate },
        { label: '回收人', value: returnUserName },
        { label: '回收时间', value: returnDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: this.filter.stateOptions.find(item => item.value === state).name }
      ]

      const amountArr = [
        { label: '批准金额', value: m(amount) },
        { label: '金额大写', value: a(amount) }
      ]
      return [
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        { label: '保证金类型', value: depositType },
        { label: '回收日期', value: d(planReturnDate) },
        { label: '工号', value: person.number },
        { label: '姓名', value: person.name },
        { label: '申请金额', value: m(applicationAmount) },
        { label: '金额大写', value: a(applicationAmount) },
        ...(amount ? amountArr : []),
        { label: '客商', value: bussinessMan },
        { label: '用途', value: summary },
        { label: '备注', value: remark, monopolize: true },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },
        ...((state === 10000) || (state === 1001) ? info : [])
      ]
    },
    alterationInfo() {
      let data = this.myDetails.data
      // console.log(this.alterationTable.list[this.currTab])
      const row = this.alterationTable.list.find(item => item.id.toString() === this.currTab)
      // console.log(row, this.currTab, 222222)
      if (row) {
        const { formerPerson: person, formerReturnDate: planReturnDate } = row
        data = { person, planReturnDate }
      }
      const {
        orgStr,
        depositType,
        data: {
          number,
          bussinessMan,
          amount,
          summary,
          applicationAmount,
          remark,
          upFile
        }
      } = this.myDetails
      // person planReturnDate
      const { person, planReturnDate } = data
      // 数据格式化
      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      const a = this.utils.amountInWords

      return [
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        { label: '保证金类型', value: depositType },
        { label: '回收日期', value: d(planReturnDate) },
        { label: '工号', value: person.number },
        { label: '姓名', value: person.name },
        { label: '申请金额', value: m(applicationAmount) },
        { label: '金额大写', value: a(applicationAmount) },
        { label: '批准金额', value: m(amount) },
        { label: '金额大写', value: a(amount) },
        { label: '客商', value: bussinessMan },
        { label: '用途', value: summary },
        { label: '备注', value: remark, monopolize: true },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true }
      ]
    },
    state() {
      return this.myDetails?.data?.state
    }
  },
  // watch: {
  //   '$route.query.type'(val) {
  //     this.type = val
  //   }
  // },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData()
    })
  },
  methods: {
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteDeposit({ id: this.myId })
      }).then(() => {
        this.$message.success('操作成功')
        this.goback()
      })
    },
    addRecycle() {
      this.$refs['recycleForm'].validate((valid) => {
        if (valid) {
          const req = {
            ...this.recycleForm,
            depositId: this.myId
          }
          this.$confirm('是否添加回收？', '提示', {
            type: 'warning'
          }).then(() => {
            ReturnDeposit(req).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.goBack() // 跳转
              } else {
                this.$message.error(res.message)
              }
            })
          })
        }
      })
    },
    saveFlow() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        const attitude = this.$refs.flowAttitude.getPostData()
        if (attitude.attitudeType === 1 || attitude.attitudeType === 2) {
          if (!this.amount) {
            return this.$message.error('请填写批准金额')
          }
          if (Number(this.amount) > this.myDetails.data.applicationAmount) {
            return this.$message.error('批准金额不能大于申请金额')
          }
        }
        this.saveLoading = true

        CheckDeposit({ attitude, id: this.myDetails.data.id, amount: this.amount }).then(res => {
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
      this.$confirm('确定要支付吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.payLoading = true
        const { data: { id }} = this.myDetails
        const attitudeData = this.$refs.flowAttitude.getPostData()
        PayFor({ attitude: attitudeData, id }).then(res => {
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
    },
    /**
     * @description: 变更列表点击跳转至相应tab
     */
    alterationClick(row) {
      this.currTab = row.id.toString()
    },
    /**
     * @description: 初始化数据
     */
    initData() {
      const { id, type } = this.$route.query
      this.type = type
      this.myId = id
      if (type === 'alteration') {
        this.currTab = 'addAlteration'
      } else {
        this.currTab = 'details'
      }
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
      GetDepositDetailById({ id: this.myId }).then(res => {
        this.alterationTable.list = res.depositModifyList
        this.recycleTable.list = res.depositReturnList
      })
      GetDepositAttitudeById({ id: this.myId }).then(res => {
        this.billFlowData = res.billFlowData
        this.filter.stateOptions = res.billFlowData?.form?.formState || []
        if (res.data.state === 1) {
          this.amount = res?.data?.amount || ''
        }
        this.myDetails = res
        this.capitalType = res.capitalType || this.capitalType
        this.showPayButton = res.showPayButton
        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.data.billFlowId, planId: res.data.id }
        if (this.attitudePara && this.state !== 1001) {
          this.$nextTick(() => {
            this.$refs['flowAttitude'].ruleForm.content = res.showPayButton ? '已支付' : ''
          })
        }
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      })
    },
    /**
     * 作废
     */
    // deleteIt() {
    //   this.$confirm('作废以后将无法编辑和审批，是否确定作废？', '提示', {
    //     type: 'warning'
    //   }).then(() => {
    //     return DeleteImprestAppliaction({ id: this.myId })
    //   }).then((res) => {
    //     this.$message.success(res.message)

    //     this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    //   }).catch(err => {
    //     console.log(err)
    //     // this.$message.error(err.errorMsg || '操作失败')
    //   })
    // },
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  /deep/.el-form.recycleForm {
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
  .padding-50{
    padding: 10px 50px;
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

