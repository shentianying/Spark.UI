<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />资金调拨信息</div>
    <div v-if="myDetails">
      <Detailsedit
        status="checkInfo"
        :info-list="infoList"
      />
    </div>
    <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      :show="showForm"
      :para="attitudePara"
      @update="updateFlow"
    >
      <template v-if="showPayButton" v-slot:saveBtn="{attitudeType}">
        <el-button v-if="attitudeType===1" :loading="loading" type="primary" :size="size" @click="wantToPay()">确认支付</el-button>
      </template>
    </flow-attitude>
    <acceptance-check-list v-if="myDetails" ref="acceptanceLIst" v-model="dialogVisible" :type="myDetails.capitalType" :size="size" @onchange="cdCheck($event)" />
  </div>
</template>

<script>
import { GetFundAllocationById, InitiFundAllocation, PayFor } from '@/api/cwgl/zjgl/FundAllocation.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import AcceptanceCheckList from '@/components/Other/AcceptanceCheckList' // 未支出承兑单弹窗
import Detailsedit from '@/components/Detailsedit'

export default {
  name: 'ZiJinDiaoBoDetails',
  components: {
    // UpFile,
    FlowDisplay,
    FlowAttitude,
    AcceptanceCheckList,
    Detailsedit
  },
  data() {
    return {
      size: 'mini',
      activeNames: ['0', '1', '2'], // 展开的折叠面板
      dialogVisible: false, // 显示未支出承兑选择框
      loading: false, // 请求未完成
      myDetails: null, // 详情数据
      showPayButton: false, // 是否显示支付按钮
      billFlowData: null, // 流程信息
      attitudePara: null, // 审批信息
      // _或$开头的变量不会被代理,访问方式this.$data._value
      // eslint-disable-next-line vue/no-reserved-keys
      _capitalTypeList: null // 资金形式列表
    }
  },
  computed: {
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          number,
          amount,
          remark,
          capitalType,
          orgStr,
          orgInStr,
          createUserName,
          createDate,
          payer,
          payDate,
          lastEditUserName,
          lastEditDate,
          state
        },
        billFlowData: {
          form: {
            formState
          }
        },
        $data: {
          _capitalTypeList
        }
      } = this
      const stateArr = formState.filter((item) => { return item.value === state })
      return [
        { label: '编号', value: number, monopolize: true },
        { label: '调出部门', value: orgStr },
        { label: '调入部门', value: orgInStr },
        { label: '资金形式', value: _capitalTypeList && _capitalTypeList.find(v => v.value === capitalType).name },
        { label: '金额', value: this.utils.formatMoney(amount, 2, 0) },
        { label: '备注', value: remark, monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单日期', value: createDate },
        { label: '支付人', value: payer?.name },
        { label: '支付日期', value: payDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新日期', value: lastEditDate },
        { label: '状态', value: stateArr[0]?.name }
      ]
    },
    /**
     * 判断是否是承兑
     */
    isChengdui() {
      const { capitalType } = this.myDetails
      return capitalType === 2 || capitalType === 3
    },
    /**
     * 计算是否显示审批表单
     */
    showForm() {
      const { state } = this.myDetails
      return state === 1 || state === 1000
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initDat()
    })
  },
  methods: {
    /**
     * @description: 初始化数据
     */
    initDat() {
      const { id } = this.$route.query
      this.myId = id
      this.fetchData()
      this.getCapitalList()
    },
    /**
     * 提交审批意见以后的回调函数
     */
    updateFlow() {
      // 直接返回
      this.goBack()
    },
    /**
     * 获取调拨详情信息
     */
    async fetchData() {
      if (!this.myId) return
      this.loading = true
      try {
        // To do
        const { billFlowData, data, orgInStr, orgStr, showPayButton } = await GetFundAllocationById(this.myId)
        this.billFlowData = billFlowData
        this.myDetails = { ...data, orgInStr, orgStr }
        this.showPayButton = showPayButton
        this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
        this.$nextTick(() => {
          if (showPayButton) { this.$refs.flowAttitude.ruleForm.content = '支付' }
        })
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取资金形式列表
     */
    getCapitalList() {
      InitiFundAllocation()
        .then(({ capitalTypeList }) => {
          this.$data._capitalTypeList = capitalTypeList
        })
    },
    /**
     * 点确定支付按钮
     */
    wantToPay() {
      if (this.isChengdui) {
        this.$refs['acceptanceLIst'].params.orgids = [this.myDetails.orgId]
        this.dialogVisible = true
      } else {
        this.$confirm('确定要支付吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.payIt()
        })
      }
    },
    /**
     * 支付
     * @param {Array} list 非必填,当是承兑类型的时候传过来的
     */
    payIt(list) {
      const { id, orgId, orgIdIn, capitalType, amount, remark, billFlowId, state } = this.myDetails
      const req = { id, orgId, orgIdIn, capitalType, amount, remark, BillFlowId: billFlowId, state }
      if (list) req.acceptance = list.map(v => { return { id: v.id } })

      const attitudeData = this.$refs.flowAttitude.getPostData()
      attitudeData.content = '审批支付'
      this.loading = true
      PayFor({ attitude: attitudeData, fundAllocation: req }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.goBack() // 跳转
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    /**
     * 确认选取承兑
     */
    cdCheck(list) {
      const { orgId } = this.myDetails
      const sum = this.utils.sum(list.map(v => v.amount)).toFixed(2)
      const amount = this.myDetails.amount.toFixed(2)
      if (sum !== amount) {
        this.$message.error('选择承兑票金额与调拨单金额不一致')
      } else if (list.find(v => v.orgId !== orgId)) {
        this.$message.error('承兑部门与调出部门不一致')
      } else {
        this.payIt(list)
      }
    },
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  padding-bottom: 70px;
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
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
