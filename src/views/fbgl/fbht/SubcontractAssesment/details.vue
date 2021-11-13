<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />分包合同</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :label-width="120"
      :info-list="infoList"
    />
    <div class="title"><i class="el-icon-info" />附件列表</div>
    <div class="file-list">
      <h5>施工合同及其清单</h5>
      <up-file :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="getFileList('listUpFile')" />
      <div class="line" />
      <h5>授权委托书</h5>
      <up-file :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="getFileList('authorizationUpFile')" />
      <div class="line" />
      <h5>其他</h5>
      <up-file :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="getFileList('upFile')" />

      <template v-if="getFileList('sealUpFile').length">
        <div class="line" />
        <h5>用章附件</h5>
        <up-file :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="getFileList('sealUpFile')" />
      </template>
      <template v-if="getFileList('copyUpFile').length">
        <div class="line" />
        <h5>清单复印件</h5>
        <up-file :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="getFileList('copyUpFile')" />
      </template>

    </div>
    <!-- <up-file :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="getFileList('upFile')" /> -->
    <div v-if="utils.IsNextPerson(billFlowData) && (myDetails.showSaveStartButton || myDetails.showSealStartButton)">
      <div class="title"><i class="el-icon-info" />{{ myDetails.showSealStartButton?'发起用章':'存档' }}</div>
      <div class="upload">
        <h5 class="label">{{ myDetails.showSealStartButton?'用章附件':'清单复印件' }}:</h5><up-file v-model="fileList" :file-size="100" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="fileList" />
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
      <template v-slot:saveBtn>

        <el-button
          v-if="state === 100 || state === 1000"
          :loading="saveLoading"
          type="success"
          :size="size"
          @click="saveFlow()"
        >
          {{ state === 100?'用章':'存档' }}
        </el-button>
        <el-button
          v-else
          :loading="saveLoading"
          type="success"
          :size="size"
          @click="saveFlow()"
        >保存</el-button>
      </template>
    </flow-attitude>
  </div>
</template>

<script>
import { GetSubcontractAssesmentAttitudeById, SealSubcontractAssesment, SaveSubcontractAssesment, CheckSubcontractAssesment, DeleteSubcontractSignSet } from '@/api/fbgl/subcontractAssesment.js'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'SubcontractAssesmentDetails',
  components: {
    FlowDisplay,
    FlowAttitude,
    Detailsedit,
    UpFile
  },
  data() {
    return {
      type: 'details', // 审核:approval 详情:details 支付:pay
      size: 'mini',
      filter: {
        stateOptions: [ // 状态数组
        ]
      },
      fileList: [],
      activeNames: ['0', '1', '2'], // 展开的折叠面板
      saveLoading: false,
      myDetails: null, // 详情数据
      billFlowData: null, // 流程信息
      attitudePara: null // 审批信息
    }
  },
  computed: {
    state() {
      return this.myDetails?.data?.state
    },
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          data: {
            orgName,
            name,
            number,
            subcontractType,
            projectName,
            subcontractor,
            corporation,
            subcontractPeople,
            secondParty,
            remark,
            isSeal,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate,
            contractStartDate,
            contractFinishDate,
            contractAmount,
            contractDuration,
            repairYear,
            taxRate,
            settlePaymentScale,
            subPart,
            paymentTerms,
            acceptenceScale,
            settleReportScale,
            progressPaymentScale,
            submitUserName,
            submitDate,
            state
          }

        }
      } = this

      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      // const a = this.utils.amountInWords
      const info = [
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '提交人', value: submitUserName },
        { label: '提交时间', value: submitDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: this.filter.stateOptions.find(item => item.value === state).name }
      ]
      return [
        { label: '合同编号', value: number },
        { label: '合同名称', value: name },
        { label: '合同类型', value: subcontractType },
        { label: '是否用章', value: isSeal ? '是' : '否' },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },
        { label: '分包单位', value: subcontractor },
        { label: '法定代表人', value: corporation },
        { label: '代理人', value: subcontractPeople },
        { label: '乙方代表', value: secondParty },
        { label: '合同开工日期', value: d(contractStartDate) },
        { label: '合同竣工日期', value: d(contractFinishDate) },
        { label: '合同工期', value: contractDuration },
        { label: '合同额', value: m(contractAmount) },
        { label: '开票税率', value: taxRate },
        { label: '保修年限', value: repairYear },
        { label: '进度款付款比例', value: progressPaymentScale },
        { label: '结算上报比例', value: settleReportScale },
        { label: '竣工验收比例', value: acceptenceScale },
        { label: '结算付款比例', value: settlePaymentScale },
        { label: '分包部位', value: subPart },
        { label: '付款条款', value: paymentTerms },
        { label: '备注', value: remark, monopolize: true },
        // { label: '附件', value: upFile || [], component: 'UpFile' },
        ...(state === 10000 ? info : [])
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData()
    })
  },
  methods: {
    getFileList(key, def = []) {
      const data = this.myDetails?.data
      return data ? (data[key] || def) : def
    },
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
    saveFlow() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        const { showSaveStartButton, showSealStartButton } = this.myDetails
        if (!this.fileList.length && (showSaveStartButton || showSealStartButton)) {
          const type = showSealStartButton ? '用章附件' : '清单复印件'
          return this.$message.error(`请上传${type}`)
        }

        let request = CheckSubcontractAssesment // 默认接口
        if (showSealStartButton) { // 用章发起
          request = SealSubcontractAssesment
        } else if (showSaveStartButton) { // 存档
          request = SaveSubcontractAssesment
        }

        this.saveLoading = true
        const attitude = this.$refs.flowAttitude.getPostData()
        request({ attitude, id: this.myDetails.data.id, fileList: this.fileList }).then(res => {
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
      GetSubcontractAssesmentAttitudeById({ id: this.myId }).then(res => {
        this.billFlowData = res.billFlowData
        this.filter.stateOptions = res.billFlowData?.form?.formState || []
        this.myDetails = res
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
  .line{
    width: 100%;
    height: 1px;
    margin:5px 0 8px 0;
    background-color:  #DCDFE6;
  }
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }
  .file-list{
    padding: 0 64px;
    h5{
      margin: 0;
    }
  }
  .upload{
    display: flex;

    .label{
      margin: 0 5px 0 64px;
      line-height: 20px;
    }
  }
}
</style>

