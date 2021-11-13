<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />签证立项信息</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="infoList"
    />
    <!-- <div v-if="utils.IsNextPerson(billFlowData)">
      <div class="title"><i class="el-icon-info" />{{ myDetails.data.state === 1000?'支付信息':'批准金额' }}</div>
      <div class="pay">
        <div v-if="myDetails.data.state === 1" class="input-wrap">
          <div><span class="label">批准金额</span><el-input :value="amount" placeholder="请输入，流程中可编辑" :size="size" class="input-width" @input="amount=$event.replace(/[^\d.]/g, '')" /></div>
          <div><span class="label">金额大写</span><el-input :value="utils.amountInWords(amount)" disabled placeholder="自动生成" :size="size" class="input-width" /></div>
        </div>
        <div v-if="myDetails.data.state===1000">
          <span class="label">支付方式</span><CapitalSelect v-model="capitalType" placeholder="请选择" class="input-width" :multiple="false" :show-all-levels="false" />
        </div>
      </div>
    </div> -->
    <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      show
      :para="attitudePara"
      @update="updateFlow"
    >
      <!-- <template v-slot:saveBtn="{attitudeType}">
        <el-button v-if="showPayButton && (attitudeType === 1 || attitudeType===2)" :loading="payLoading" type="primary" :size="size" @click="wantToPay2()">支付</el-button>
        <el-button v-else-if="attitudeType===1 || attitudeType===2" :loading="saveLoading" type="success" :size="size" @click="saveFlow()">保存</el-button>
      </template> -->
    </flow-attitude>
  </div>
</template>

<script>
import { GetSubcontractSignSetAttitudeById, DeleteSubcontractSignSet } from '@/api/fbgl/subcontractSignSet.js'
// import CapitalSelect from '@/components/SearchBar/form/CapitalSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'SubcontractSignSetDetails',
  components: {
    FlowDisplay,
    FlowAttitude,
    Detailsedit
    // CapitalSelect
  },
  data() {
    return {
      type: 'details', // 审核:approval 详情:details 支付:pay
      size: 'mini',
      // capitalType: 1,
      // amount: '',
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
          subcontract: {
            orgName,
            subcontractName,
            projectName,
            subcontractNumber,
            subcontractPeople,
            subcontractor
          },
          data: {
            subReferee,
            number,
            amount,
            orderMode,
            signType,
            orderPeople,
            remark,
            summary,
            orderDate,
            upFile,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate,
            submitUserName,
            submitDate,
            state,
            workPart,
            content
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
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate }
      ]
      return [
        { label: '编号', value: number },
        { label: '合同号', value: subcontractNumber },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },
        { label: '合同名称', value: subcontractName },
        { label: '分包单位', value: subcontractor },
        { label: '分包人', value: subcontractPeople },
        { label: '指令人', value: orderPeople },
        { label: '签订类型', value: signType },
        { label: '分包人代表', value: subReferee },
        { label: '指令下达方式', value: orderMode },
        { label: '指令下达日期', value: orderDate },
        { label: '预估金额', value: m(amount), monopolize: true },
        { label: '事由', value: summary },
        { label: '备注', value: remark },
        { label: '施工部位', value: workPart },
        { label: '工作内容', value: content },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },
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
        return DeleteSubcontractSignSet({ id: this.myId })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    // saveFlow() {
    //   this.$confirm('是否确定保存？', '提示', {
    //     type: 'warning'
    //   }).then(() => {
    //     const attitude = this.$refs.flowAttitude.getPostData()
    //     if (attitude.attitudeType === 1 || attitude.attitudeType === 2) {
    //       if (!this.amount) {
    //         return this.$message.error('请填写批准金额')
    //       }
    //       if (Number(this.amount) > this.myDetails.data.applicationAmount) {
    //         return this.$message.error('批准金额不能大于申请金额')
    //       }
    //     }
    //     this.saveLoading = true

    //     CheckSubcontractAssesment({ attitude, id: this.myDetails.data.id, amount: this.amount }).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success(res.message)
    //         this.goBack() // 跳转
    //       } else {
    //         this.$message.error(res.message)
    //       }
    //     }).finally(() => {
    //       this.saveLoading = false
    //     })
    //   })
    // },
    // wantToPay2() {
    //   this.$confirm('确定要支付吗?', '提示', {
    //     type: 'warning'
    //   }).then(() => {
    //     this.payLoading = true
    //     const { data: { id }} = this.myDetails
    //     const attitudeData = this.$refs.flowAttitude.getPostData()
    //     PayFor({ attitude: attitudeData, id, capitalType: this.capitalType }).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success(res.message)
    //         this.goBack() // 跳转
    //       } else {
    //         this.$message.error(res.message)
    //       }
    //     }).finally(() => {
    //       this.payLoading = false
    //     })
    //   })
    // },
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
      GetSubcontractSignSetAttitudeById({ id: this.myId }).then(res => {
        this.billFlowData = res.billFlowData
        this.filter.stateOptions = res.billFlowData?.form?.formState || []
        this.myDetails = res
        // this.capitalType = res.capitalType || this.capitalType
        // this.amount = res?.data?.amount || ''
        // this.showPayButton = res.showPayButton
        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.data.billFlowId, planId: res.data.id }
        // this.$nextTick(() => {
        //   this.$refs['flowAttitude'].ruleForm.content = res.showPayButton ? '已支付' : ''
        // })
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
      line-height: 28px;
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

