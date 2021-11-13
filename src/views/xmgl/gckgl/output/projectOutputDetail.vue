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
            <el-form-item label="年度：">
              {{ ruleForm.outputYear }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="月份：">
              <span v-if="ruleForm.outputMonth!=null">{{ monthList.find(f => f.value === ruleForm.outputMonth).label }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目经理：">
              {{ ruleForm.projectManagerName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="对内产值：">
              {{ utils.formatMoney(ruleForm.internalOutput, 2, 0) }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="对外产值：">
              {{ utils.formatMoney(ruleForm.externalOutput, 2, 0) }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="应收款：">
              {{ utils.formatMoney(ruleForm.receivable, 2, 0) }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="定额甲供：">
              {{ utils.formatMoney(ruleForm.quotaFirstSupply, 2, 0) }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="实际甲供：">
              {{ utils.formatMoney(ruleForm.realFirstSupply, 2, 0) }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="当前比例：">
              {{ ruleForm.currentRate }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="累计比例：">
              {{ ruleForm.totalRate }}
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
import { getProjectOutputAttitudeById } from '@/api/xmgl/projectOutput'
import UpFile from '@/components/UpLoad/UpFile'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
export default {
  name: 'ProjectOutputDetail',
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
        outputYear: null,
        outputMonth: null,
        projectManagerId: null,
        internalOutput: '',
        externalOutput: '',
        receivable: '',
        remark: '',
        state: 0,
        billFlowId: 0,
        fileList: []
      },
      monthList: [{
        value: 1,
        label: '1月'
      }, {
        value: 2,
        label: '2月'
      }, {
        value: 3,
        label: '3月'
      }, {
        value: 4,
        label: '4月'
      }, {
        value: 5,
        label: '5月'
      }, {
        value: 6,
        label: '6月'
      }, {
        value: 7,
        label: '7月'
      }, {
        value: 8,
        label: '8月'
      }, {
        value: 9,
        label: '9月'
      }, {
        value: 10,
        label: '10月'
      }, {
        value: 11,
        label: '11月'
      }, {
        value: 12,
        label: '12月'
      }, {
        value: 0,
        label: '年度调节'
      }],
      projectOutputId: null,
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
        this.projectOutputId = this.$route.query.id
      }
      if (this.projectOutputId) {
        this.loading = true
        getProjectOutputAttitudeById({ id: this.projectOutputId }).then(response => {
          const { data, billFlowData, orgName } = response
          this.ruleForm = data
          this.orgName = orgName
          this.ruleForm.fileList = data.upFile
          this.billFlow = billFlowData
          if (this.billFlow != null) {
            this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
            this.isLoad = true // 加载审批组件
          }
        })
      }
    },
    /**
     * @description: 单据状态
     * @param {Number} val
     */
    getFormState(val) {
      if (!this.billFlow) {
        if (val === 10000) {
          return '完成'
        } else {
          return '流程空'
        }
      }
      const formState = this.billFlow.form.formState
      const state = val
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
