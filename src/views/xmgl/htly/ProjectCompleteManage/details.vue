<template>
  <div class="app-container details">
    <el-collapse v-if="myDetails" v-model="activeNames">
      <el-collapse-item name="0" disabled>
        <template v-slot:title>
          <div class="title">项目竣工</div>
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
    >
      <template v-slot:saveBtn>
        <el-button type="primary" :size="size" @click="submitApproval()">保存</el-button>
      </template>
    </flow-attitude>
  </div>
</template>

<script>
import { GetProjectCompleteManageAttitudeById, CheckProjectCompleteManage } from '@/api/xmgl/ProjectCompleteManage.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'ProjectCompleteManageDetails',
  components: {
    FlowDisplay,
    FlowAttitude,
    Detailsedit
    // UpFile
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
            completDate,
            remark,
            upFile,
            project: {
              area,
              contractDuration,
              contractStartDate,
              contractFinishDate,
              realStartDate,
              computeFinishDate,
              warrantyDays
            },
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate
          },
          orderType,
          stateName
        }
      } = this
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      const addDate = (date, days) => date ? this.$moment(date).add(days, 'days').format('YYYY-MM-DD') : ''

      return [
        { label: '编号', value: number, monopolize: true },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },
        { label: '竣工验收日期', value: d(completDate) },
        { label: '指令类型', value: orderType.name },
        { label: '建筑面积', value: `${area.toFixed(2)}㎡` },
        { label: '合同工期', value: `${contractDuration}天` },
        { label: '合同开工日期', value: d(contractStartDate) },
        { label: '合同竣工日期', value: d(contractFinishDate) },
        { label: '开工日期说明', value: d(contractStartDate), monopolize: true },
        { label: '实际开工日期', value: d(realStartDate) },
        { label: '计算竣工日期', value: d(computeFinishDate) },
        { label: '质保完成日期', value: addDate(completDate, warrantyDays), monopolize: true },
        { label: '质保期', value: `${warrantyDays ? warrantyDays + '天' : ''}`, monopolize: true },
        { label: '备注', value: remark, monopolize: true },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
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
        CheckProjectCompleteManage({ attitude: postData, id: this.myId }).then(({ message }) => {
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
      GetProjectCompleteManageAttitudeById({ id: this.myId }).then(res => {
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
