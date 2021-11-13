<template>
  <div class="app-container details">
    <el-collapse v-if="myDetails" v-model="activeNames">
      <el-collapse-item name="0" disabled>
        <template v-slot:title>
          <div class="title">项目结算</div>
        </template>
        <Detailsedit
          status="checkInfo"
          :info-list="infoList"
        />
        <el-divider />
        <div class="title">质保期/质保金</div>
        <Detailsedit
          status="checkInfo"
          :info-list="warrantyList"
        />
      </el-collapse-item>
    </el-collapse>
    <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      :show="true"
      :para="attitudePara"
      @update="updateFlow"
    >
      <template v-slot:saveBtn>
        <el-button type="primary" :size="size" @click="submitApproval()">保存</el-button>
      </template>
    </flow-attitude>
  </div>
</template>

<script>
import { GetProjectSettleAttitudeById, CheckProjectSettle } from '@/api/xmgl/ProjectSettle.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'ProjectSettleDetails',
  components: {
    // UpFile,
    // AcceptanceCheckList,
    FlowDisplay,
    FlowAttitude,
    Detailsedit
  },
  data() {
    return {
      size: 'mini',
      activeNames: ['0', '1', '2'], // 展开的折叠面板
      loading: false, // 请求未完成
      myDetails: null, // 详情数据
      billFlowData: null, // 流程信息
      attitudePara: null // 审批信息
    }
  },
  computed: {
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          projectName,
          orgName,
          data: {
            number,
            settleDate,
            settleAmount,
            project,
            receivableAccounts,
            externalOutputs,
            externalOutputAdjust,
            internalOutputs,
            internalOutputAdjust,
            firstSupplyAmount,
            IsReport,
            remark,
            upFile,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate,
            submitUserName,
            submitDate
          },
          stateName
        }
      } = this
      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr

      return [
        { label: '编号', value: number, monopolize: true },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },
        { label: '审定日期', value: d(settleDate) },
        // { label: '审定金额', value: m(settleAmount) },
        { label: '审定值', value: m(settleAmount), unit: '元' },
        { label: '建筑面积', value: `${project?.area || 0}㎡` },
        { label: '合同工期', value: project?.contractDuration, unit: '天' },
        { label: '甲供材', value: m(firstSupplyAmount) },
        { label: '开累应收款', value: receivableAccounts },
        { label: '开累外部产值', value: externalOutputs },
        { label: '外部产值调整', value: externalOutputAdjust },
        { label: '开累内部产值', value: internalOutputs },
        { label: '内部产值调整', value: internalOutputAdjust },
        { label: '报告', value: IsReport ? '有' : '无', monopolize: true },
        { label: '备注', value: remark },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },

        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '提交人', value: submitUserName },
        { label: '提交时间', value: submitDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: stateName }
      ]
    },
    /**
     * 计算质保数组
     */
    warrantyList() {
      const project = this.myDetails?.data?.project
      const showList = []
      const list = ['一', '二', '三', '四']
      list.forEach((v, i) => {
        showList.push({ label: `${v}阶段`, value: `${project?.[`warrantyRate${i + 1}`]}天` })
        showList.push({ label: '比例', value: `${project?.[`warrantyDays${i + 1}`]}%` })
      })
      return showList
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
    },
    /**
     * 提交审批意见以后的回调函数
     */
    updateFlow() {
      this.goBack()
    },
    /**
     * 合同履约部分专有的提交审批
     */
    submitApproval() {
      const result = this.$refs.flowAttitude.checkValidate()
      if (result) {
        var postData = this.$refs.flowAttitude.getPostData()
        this.loading = true
        CheckProjectSettle({ attitude: postData, id: this.myId }).then(({ message }) => {
          this.$message.success(message)
          this.updateFlow() // 跳转
        }).finally(() => { this.loading = false })
      }
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      this.loading = true
      GetProjectSettleAttitudeById({ id: this.myId }).then(res => {
        this.billFlowData = res.billFlowData
        this.myDetails = res
        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.data.billFlowId, planId: res.data.id }
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      }).finally(() => {
        this.loading = false
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
