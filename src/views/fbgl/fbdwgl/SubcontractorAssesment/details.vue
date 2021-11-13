<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />分包单位</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="infoList"
      :label-width="labelWidth"
    />
    <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      :to-content="!showPayButton"
      show
      :para="attitudePara"
      @update="updateFlow"
    >
      <template v-slot:saveBtn="{attitudeType}">
        <el-button v-if="attitudeType === 1 || attitudeType===2" :loading="saveLoading" type="success" :size="size" @click="saveFlow()">保存</el-button>
      </template>
    </flow-attitude>
  </div>
</template>

<script>
import Detailsedit from '@/components/Detailsedit'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import { GetSubcontractorAssesmentAttitudeById, CheckSubcontractorAssesment } from '@/api/fbgl/subcontractorAssesment'
export default {
  name: 'SubcontractorAssesmentDetails',
  components: {
    Detailsedit,
    FlowDisplay,
    FlowAttitude
  },
  data() {
    return {
      size: 'mini',
      showPayButton: false,
      labelWidth: 140,
      type: 'approval', // 审核:approval 详情:details 支付:pay 变更:alteration 回收:recycle, reviewStar: 评审星级
      saveLoading: false,
      myDetails: null, // 详情数据
      billFlowData: null, // 流程信息
      attitudePara: null // 审批信息
    }
  },
  computed: {
    infoList() {
      const {
        myDetails: {
          data: {
            number,
            orgStr,
            name,
            subcontractorType,
            address,
            postAddress,
            capital,
            mainBusiness,
            corporation,
            entrustedAgent,
            phone,
            tel,
            fax,
            email,
            regDate,
            taxpayerType,
            workerNum,
            isForbidden,
            bussinessType,
            projectType,
            businessCity,
            postCertificate,
            remark,
            createDate,
            createUserName,
            currentRateDate,
            lastEditUserName,
            lastEditDate,
            rate,
            licenseUpFile,
            licenseStart,
            licenseEnd,
            accountUpFile,
            corporationUpFile,
            infoUpFile,
            deliveryStatementUpFile,
            taxpayerCerUpFile,
            qualificationUpFile,
            qualificationNum,
            regScopeStart,
            regScopeEnd,
            safetyUpFile,
            safetyCerNum,
            safetyPeriodStart,
            safetyPeriodEnd,
            financeReportUpFile,
            upFile
          }
        }
      } = this
      // 数据格式化
      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      return [
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        { label: '单位名称', value: name },
        { label: '分包类型', value: subcontractorType },
        { label: '注册地址', value: address },
        { label: '邮寄地址', value: postAddress },
        { label: '注册资本', value: m(capital), unit: '万元' },
        { label: '经营范围', value: mainBusiness },
        { label: '法定代表人', value: corporation },
        { label: '委托代理人', value: entrustedAgent },
        { label: '手机', value: phone },
        { label: '固话', value: tel },
        { label: '传真', value: fax },
        { label: '邮箱', value: email },
        { label: '成立日期', value: d(regDate) },
        { label: '纳税人性质', value: taxpayerType },
        { label: '工人数量', value: workerNum },
        { label: '是否禁用', value: isForbidden ? '是' : '否' },
        { label: '可承接业务类型', value: bussinessType.join('、') },
        { label: '可承接工程类型', value: projectType.join('、') },
        { label: '可施工区域', monopolize: true, value: businessCity.join('、') },
        { label: '上岗证书', value: postCertificate },
        { label: '备注', value: remark },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '星级', value: rate },
        { label: '评审时间', value: currentRateDate },
        { label: '营业执照', monopolize: true, component: 'UpFile', value: licenseUpFile },
        { label: '营业期限', monopolize: true, value: `${d(licenseStart)} 至 ${d(licenseEnd)}` },
        { label: '开户许可证', monopolize: true, component: 'UpFile', value: accountUpFile },
        { label: '法定代表人身份证明', monopolize: true, component: 'UpFile', value: corporationUpFile },
        { label: '分包考察资料', monopolize: true, component: 'UpFile', value: infoUpFile },
        { label: '送达声明', monopolize: true, component: 'UpFile', value: deliveryStatementUpFile },
        { label: '纳税人信息证明', monopolize: true, component: 'UpFile', value: taxpayerCerUpFile },
        { label: '施工资质证书  ', monopolize: true, component: 'UpFile', value: qualificationUpFile },
        { label: '编号', value: qualificationNum },
        { label: '登记范围', value: `${regScopeStart}${regScopeEnd}` },
        { label: '安全生产许可证', monopolize: true, component: 'UpFile', value: safetyUpFile },
        { label: '编号', value: safetyCerNum },
        { label: '有效期', value: `${d(safetyPeriodStart) || ''} 至 ${d(safetyPeriodEnd) || ''}` },
        { label: '财务审计报告', monopolize: true, component: 'UpFile', value: financeReportUpFile },
        { label: '其他附件', monopolize: true, component: 'UpFile', value: upFile }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData()
    })
  },
  methods: {
    /**
     * @description: 初始化数据
     */
    initData() {
      const { id, type } = this.$route.query
      this.myId = id
      this.type = type
      this.fetchData()
    },
    async fetchData() {
      if (!this.myId) return
      GetSubcontractorAssesmentAttitudeById({ id: this.myId }).then(res => {
        this.myDetails = res
        this.billFlowData = res.billFlowData
        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.billFlowData.id, planId: res.data.id }
      })
    },
    saveFlow() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        const attitude = this.$refs.flowAttitude.getPostData()
        CheckSubcontractorAssesment({ attitude, entertainmentPlan: this.entertainmentPlan }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.goBack() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.saveLoading = false
        }).catch(() => {
          this.saveLoading = false
        })
      })
    },
    /**
     * 提交审批意见以后的回调函数
     */
    updateFlow() {
      // 直接返回
      this.goBack()
    },
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  /deep/.el-form.firstForm {
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
  .common-content {
    margin-bottom: 20px;
  }
  .padding-50{
    padding: 10px 50px;
  }
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .actions{
    margin-left: 100px;
  }
  .botton-box {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
