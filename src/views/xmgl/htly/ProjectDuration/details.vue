<template>
  <div class="app-container details">
    <el-collapse v-if="myDetails" v-model="activeNames">
      <el-collapse-item name="0" disabled>
        <template v-slot:title>
          <div class="title">项目顺延</div>
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
import { GetProjectDurationAttitudeById, CheckProjectDuration } from '@/api/xmgl/ProjectDuration.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'ProjectDurationDetails',
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
          orderType,
          data: {
            project: {
              contractDuration,
              contractStartDate,
              realStartDate,
              contractFinishDate
            },
            number,
            computeFinishDate,
            adjustDays,
            totalAdjustDays,
            totalDuration,
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
      // const m = (val) => this.utils.formatMoney(val, 2, 4)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      return [
        { label: '编号', value: number },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },
        { label: '合同工期', value: `${contractDuration}天` },
        { label: '合同开工日期', value: d(contractStartDate) },
        { label: '合同竣工日期', value: d(contractFinishDate) },
        { label: '实际开工日期', value: d(realStartDate) },
        { label: '计算竣工日期', value: d(computeFinishDate) },
        { label: '本次顺延天数', value: adjustDays },
        { label: '累计顺延天数', value: totalAdjustDays },
        { label: '变更后总工期', value: totalDuration, unit: '天' },
        { label: '指令类型', value: orderType.name },
        { label: '备注', value: remark, monopolize: true },
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
    updateFlow(state) {
      // 直接返回
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
        CheckProjectDuration({ attitude: postData, id: this.myId }).then(({ message }) => {
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
      try {
        // To do
        const res = await GetProjectDurationAttitudeById({ id: this.myId })
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

