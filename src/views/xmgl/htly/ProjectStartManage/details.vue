<template>
  <div class="app-container details">
    <el-collapse v-if="myDetails" v-model="activeNames">
      <el-collapse-item name="0" disabled>
        <template v-slot:title>
          <div class="title">项目开工</div>
        </template>
        <div class="info-content">
          <Detailsedit
            status="checkInfo"
            :info-list="infoList"
          />
        </div>
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
import { GetProjectStartManageAttitudeById, CheckProjectStartManage } from '@/api/xmgl/ProjectStartManage.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'ProjectStartManageDetails',
  components: {
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
            remark,
            upFile,
            startDate,
            orderUnit,
            orderPeople,
            contractDuration,
            computeFinishDate,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate
            // submitUserName,
            // submitDate
          },
          startType,
          stateName
        }
      } = this
      // const m = (val) => this.utils.formatMoney(val, 2, 4)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr

      return [
        { label: '编号', value: number, monopolize: true },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },

        { label: '实际开工日期', value: d(startDate) },
        { label: '开工类型', value: startType.name },
        { label: '指令单位', value: orderUnit },
        { label: '指令人', value: orderPeople },
        { label: '合同约定工期', value: contractDuration, unit: '天' },
        { label: '计算竣工日期', value: d(computeFinishDate) },
        { label: '备注', value: remark },

        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        // { label: '提交人', value: submitUserName },
        // { label: '提交时间', value: submitDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: stateName }
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
      const { id } = this.$route.query
      this.myId = id
      this.fetchData()
    },
    /**
     * 提交审批意见以后的回调函数
     */
    async updateFlow(state) {
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
        CheckProjectStartManage({ attitude: postData, id: this.myId }).then(({ message }) => {
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
        const res = await GetProjectStartManageAttitudeById({ id: this.myId })
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

