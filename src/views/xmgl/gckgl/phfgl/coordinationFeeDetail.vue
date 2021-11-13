<template>
  <div class="app-container">
    <div>
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="160px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号：">
              {{ ruleForm.number }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目：">
              <span v-if="ruleForm.project">{{ ruleForm.project.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="组织机构：">
              {{ orgName }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="日期：">
              {{ ruleForm.date | dateFormat }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="金额：">
              {{ utils.formatMoney(ruleForm.amount, 2, 0) }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="备注：">
              {{ ruleForm.remark }}
            </el-form-item>

            <el-form-item label="附件：">
              <up-file
                v-model="ruleForm.fileList"
                :size="50"
                :is-preview="true"
                :is-download="true"
                :file-list="ruleForm.fileList"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="创建人：">
              {{ ruleForm.createUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="创建日期：">
              {{ ruleForm.createDate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="提交人：">
              {{ ruleForm.submitUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="提交日期：">
              {{ ruleForm.submitDate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="更新人：">
              {{ ruleForm.lastEditUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="更新日期：">
              {{ ruleForm.lastEditDate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="状态：">
              {{ getFormState(ruleForm.state) }}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

    </div>

    <!--流程显示-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="false" :bill-flow="billFlow" />
    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :para="attitudePara"
    />
  </div>
</template>

<script>
import { getCoordinationFeeAttitudeById } from '@/api/xmgl/coordinationFee'
import UpFile from '@/components/UpLoad/UpFile'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
export default {
  name: 'CoordinationFeeDetail',
  components: {
    FlowDisplay,
    FlowAttitude,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        companyId: this.$store.state.user.selectOrgId,
        projectId: null,
        date: null,
        amount: null,
        remark: '',
        state: 0,
        billFlowId: 0,
        fileList: []
      },
      coordinationFeeId: null,
      orgName: '',

      attitudePara: null,
      isLoad: false,
      billFlow: null,

      rules: {
      }
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.initData()
    }
  },
  methods: {
    initData() {
      // 有参数id
      if (this.$route.query.id) {
        this.coordinationFeeId = this.$route.query.id
      }
      if (this.coordinationFeeId) {
        this.loading = true
        getCoordinationFeeAttitudeById({ id: this.coordinationFeeId }).then(response => {
          const { data, billFlowData, orgName } = response
          this.ruleForm = data
          this.orgName = orgName
          this.ruleForm.fileList = data.upFile
          this.billFlow = billFlowData
          this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
          this.isLoad = true // 加载审批组件
        })
      }
    },
    /**
     * @description: 单据状态
     * @param {Number} val
     */
    getFormState(val) {
      if (!this.billFlow) { return '流程空' }
      const formState = this.billFlow.form.formState
      const state = val
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
