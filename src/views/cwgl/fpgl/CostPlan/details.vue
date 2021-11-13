<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />费用计划信息</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="infoList"
    />
    <div v-if="utils.IsNextPerson(billFlowData)">
      <div class="title"><i class="el-icon-info" />{{ type==='check'?'验收计划':'批准金额' }}</div>
      <div class="wrap">
        <div v-if="myDetails.data.state===1" class="input-wrap">
          <div><span class="label">批准金额</span><el-input :value="approvalData.amount" placeholder="请输入，流程中可编辑" :size="size" class="input-width" @input="approvalData.amount=$event.replace(/[^\d.]/g, '')" /></div>
          <!-- <div><span class="label">金额大写</span><el-input :value="utils.amountInWords(amount)" disabled placeholder="自动生成" :size="size" class="input-width" /></div> -->
        </div>
        <div v-if="myDetails.data.state===1000" class="input-wrap">
          <div>
            <span class="label">实际金额</span>
            <el-input :value="approvalData.amount" placeholder="请输入，流程中可编辑" :size="size" class="input-width" @input="approvalData.amount=$event.replace(/[^\d.]/g, '')" />
          </div>
          <div>
            <span class="label">验收附件</span>
            <up-file
              v-model="approvalData.acceptFile"
              :is-upfile="true"
              :file-size="100"
              :is-preview="true"
              :is-delete="true"
            />
          </div>
        </div>
      </div>
    </div>
    <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      :to-content="!showPayButton"
      :show-stay="!showPayButton"
      show
      :para="attitudePara"
      @update="updateFlow"
    >
      <template v-slot:saveBtn="{attitudeType}">
        <el-button v-if="myDetails.data.state===1000 && attitudeType === 1" :loading="payLoading" type="primary" :size="size" @click="wantToPay2()">验收</el-button>
        <el-button v-else-if="attitudeType===1 || attitudeType===2" :loading="saveLoading" type="success" :size="size" @click="saveFlow()">保存</el-button>
      </template>
    </flow-attitude>
  </div>
</template>

<script>
import { GetCostPlanAttitudeById, AcceptCostPlan, CheckCostPlan, DeleteCostPlan } from '@/api/cwgl/CostPlan.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'CostPlanDetails',
  components: {
    FlowDisplay,
    FlowAttitude,
    Detailsedit,
    UpFile
  },
  data() {
    return {
      type: 'details', // 审核:approval 详情:details 验收:check
      size: 'mini',
      approvalData: {
        id: '',
        amount: '', // 批准金额
        acceptFile: [] // 文件
      },

      filter: {
        stateOptions: [ // 状态数组
        ]
      },
      activeNames: ['0', '1', '2'], // 展开的折叠面板
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
          costType,
          data: {
            amount,
            number,
            applicationAmount,
            summary,
            person,
            remark,
            upFile,
            supplier,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate,
            submitUserName,
            submitDate,
            state,
            acceptDate,
            acceptUserName,
            acceptUpFile,
            realAmount
          }

        }
      } = this

      const m = (val) => this.utils.formatMoney(val, 2, 0)
      // const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      // const a = this.utils.amountInWords
      const info = [
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '提交人', value: submitUserName },
        { label: '提交时间', value: submitDate },
        { label: '验收人', value: acceptUserName },
        { label: '验收时间', value: acceptDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: this.filter.stateOptions.find(item => item.value === state).name }
      ]
      const realAmount1 = [{ label: '实际金额', value: realAmount }]
      const acceptUpFile1 = [{ label: '验收附件', component: 'UpFile', value: acceptUpFile }]
      const amount1 = [{ label: '批准金额', value: amount ? m(amount) : '', monopolize: !realAmount }]
      return [
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        { label: '姓名', value: person.name },
        { label: '供应商', value: supplier },
        { label: '费用类型', value: costType },
        { label: '计划金额', value: m(applicationAmount) },
        ...(amount ? amount1 : []),
        ...(realAmount ? realAmount1 : []),
        { label: '事由', value: summary },
        { label: '备注', value: remark },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: !(acceptUpFile && acceptUpFile.length) },
        ...(acceptUpFile && acceptUpFile.length ? acceptUpFile1 : []),
        ...(state === 10000 ? info : [])
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData()
    })
  },
  // watch: {
  //   '$route.query.type'(val) {
  //     this.type = val
  //   }
  // },
  methods: {
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteCostPlan({ id: this.myId })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    saveFlow() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        const attitude = this.$refs.flowAttitude.getPostData()
        if (attitude.attitudeType === 1 || attitude.attitudeType === 2) {
          const { applicationAmount } = this.myDetails.data
          const amount = this.approvalData.amount
          if (!amount) {
            return this.$message.error('请填写批准金额')
          }
          if (Number(amount) > applicationAmount) {
            return this.$message.error('批准金额不能大于申请金额')
          }
        }
        this.saveLoading = true

        CheckCostPlan({ ...this.approvalData, attitude }).then(res => {
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
      this.$confirm('确定要验收吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const attitude = this.$refs.flowAttitude.getPostData()
        if (attitude.attitudeType === 1) {
          const { applicationAmount } = this.myDetails.data
          const amount = this.approvalData.amount
          if (!amount) {
            return this.$message.error('请填写实际金额')
          }
          if (Number(amount) > applicationAmount) {
            return this.$message.error('实际金额不能大于申请金额')
          }
        }
        this.payLoading = true

        AcceptCostPlan({ ...this.approvalData, attitude }).then(res => {
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
     * @description: 初始化数据
     */
    initData() {
      const { id, type } = this.$route.query
      this.type = type
      this.myId = id
      this.approvalData.id = id
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
      GetCostPlanAttitudeById({ id: this.myId }).then(res => {
        this.billFlowData = res.billFlowData
        this.filter.stateOptions = res.billFlowData?.form?.formState || []
        this.myDetails = res
        this.showPayButton = res.showPayButton
        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.data.billFlowId, planId: res.data.id }
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
  padding-bottom: 70px;
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }

  .wrap{
    padding: 0 32px;
    .input-wrap{
    &>div{
      margin-bottom: 15px;
      display: flex;
      line-height: 27px;
    }
  }
    .label{
      line-height: 28px;
      width: 100px;
      text-align: right;
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

