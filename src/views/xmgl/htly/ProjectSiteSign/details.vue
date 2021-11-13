<template>
  <div class="app-container details">
    <el-collapse v-if="myDetails" v-model="activeNames">
      <el-collapse-item name="0" disabled>
        <template v-slot:title>
          <div class="title">对外签证</div>
        </template>
        <Detailsedit
          status="checkInfo"
          :info-list="infoList"
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
    />
  </div>
</template>

<script>
import { GetProjectSiteSignAttitudeById, DeleteProjectSiteSign } from '@/api/xmgl/ProjectSiteSign.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'ProjectSiteSignDetails',
  components: {
    // UpFile,
    FlowDisplay,
    FlowAttitude,
    Detailsedit
    // AcceptanceCheckList
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
            name,
            reportAmount,
            approveAmount,
            costAmount,
            firstRepresent,
            occurDate,
            predictFinishDate,
            firstPartyContent,
            noTransactReason,
            coordinateContent,
            remark,
            sendDate,
            transactDate,
            upFile,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate,
            submitUserName,
            submitDate
          },
          progressType,
          coordinateType,
          stateName
        }
      } = this
      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr

      return [
        { label: '编号', value: number, monopolize: true },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },
        { label: '签证名称', value: name },
        { label: '上报值', value: m(reportAmount), unit: '元' },
        { label: '审定值', value: m(approveAmount), unit: '元' },
        { label: '成本值', value: m(costAmount), unit: '元' },
        { label: '甲方代表', value: firstRepresent },
        { label: '发生日期', value: d(occurDate) },
        { label: '预计完成日期', value: d(predictFinishDate) },
        { label: '是否协助', value: coordinateType.name },
        { label: '甲方指令内容', value: firstPartyContent },
        { label: '未办理原因', value: noTransactReason },
        { label: '协调配合内容', value: coordinateContent },
        { label: '备注', value: remark },
        { label: '进度', value: progressType.name, monopolize: true },
        { label: '上报日期', value: d(sendDate) },
        { label: '办理日期', value: d(transactDate) },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },

        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '提交人', value: submitUserName },
        { label: '提交时间', value: submitDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: stateName }
      ]
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
      // 直接返回
      this.goBack()
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      this.loading = true
      try {
        // To do
        const res = await GetProjectSiteSignAttitudeById({ id: this.myId })
        this.billFlowData = res.billFlowData
        this.myDetails = res
        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.data.billFlowId, planId: res.data.id }
        console.log('attitudeParaattitudeParaattitudePara', this.attitudePara)
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.loading = false
      }
    },
    /**
     * 作废
     */
    deleteIt() {
      this.$confirm('作废以后将无法编辑和审批，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteProjectSiteSign({ id: this.myId })
      }).then((res) => {
        this.$message.success(res.message)

        this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
      }).catch(err => {
        console.log(err)
        // this.$message.error(err.errorMsg || '操作失败')
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
