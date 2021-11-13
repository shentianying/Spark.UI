<template>
  <div class="container ProjectSiteSignEdit">
    <template v-if="active === 1">
      <el-card class="info-card">
        {{ title }}
      </el-card>
      <el-card class="form-card">
        <my-form
          ref="firstForm"
          :form-data="firstForm"
          :rules="firstRules"
          :form-node="formNodeData"
          :size="size"
          @projectIdChange="handelProjectSelect"
        />
        <h3>质保期/质保金</h3>
        <el-form
          :inline="true"
          label-width="120px"
          :size="size"
        >
          <template v-for="item in warrantyList">
            <el-form-item :key="`days-${item.label}`" :label="item.label">
              <el-input :value="item.days" disabled class="input-width">
                <span slot="suffix" class="unit">天</span>
              </el-input>
            </el-form-item>
            <el-form-item :key="`rate-${item.label}`" label="比例">
              <el-input :value="item.rate" disabled class="input-width">
                <span slot="suffix" class="unit">%</span>
              </el-input>
            </el-form-item>
          </template>
        </el-form>
        <div class="actions">
          <el-button :size="size" type="primary" @click="nextStep('firstForm')">下一步</el-button>
        </div>
      </el-card>
    </template>
    <!--流程显示-->
    <template v-else-if="active===2">
      <flow-select v-if="firstForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="firstForm.billFlow" />
      <div class="botton-box">
        <el-button v-if="firstForm.state === 0" :size="size" type="primary" @click="submitForm(1)">提交审批</el-button>
        <el-button v-if="firstForm.state === 0" :size="size" type="promary" @click="submitForm(0)">保存</el-button>
        <el-button :size="size" type="promary" @click="setActive(1)">返回</el-button>
        <el-button v-if="firstForm.id && firstForm.state === 0" :size="size" @click="invalidForm()">作废</el-button>
        <el-button :size="size" type="promary" @click="back()">取消</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import FlowSelect from '@/components/Flow/flowSelect'
import { validate } from '@/utils/validate'
import { GetBillFlow, GetProjectSettleById, AddProjectSettle, PutProjectSettle, DeleteProjectSettle } from '@/api/xmgl/ProjectSettle.js'
import { getProjectById } from '@/api/xmgl/project.js'
import { GetProjectOutputSumById } from '@/api/xmgl/projectOutput.js'
import MyForm from '@/components/MyForm'

export default {
  name: 'ProjectSettleEdit',
  components: {
    FlowSelect,
    MyForm
  },
  data() {
    return {
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        projectId: null, // 项目id
        companyId: 2, // 中南装饰的
        id: 0, // 新增为0
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        orgName: '', // 部门名称
        settleDate: '', // 审定日期
        settleAmount: '', // 审定值
        firstSupplyAmount: '', // 甲供材
        isReport: false, // 有无报告
        remark: '', // 备注
        fileList: [], // 附件
        state: 0, // 状态
        billFlow: [] // 单据流程
      },
      firstRules: {
        projectId: [
          { required: true, message: '请选择项目' }
        ],
        settleDate: [
          { required: true, message: '请选择审定日期' }
        ],
        settleAmount: [
          { required: true, message: '请输入审定值金额' }
        ],
        firstSupplyAmount: [
          { required: true, message: '请输入甲供材金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额' }
        ]
      },
      project: {}, // 项目数据
      output: {} // 外部产值
    }
  },
  computed: {
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '项目结算'
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      const {
        project: {
          area,
          contractDuration,
          orgName
        },
        output: {
          externalOutputs,
          internalOutputs
        },
        receivableAccounts,
        externalOutputAdjust,
        internalOutputAdjust
      } = this
      return [
        { label: '编码:', monopolize: true, keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '项目:', keyword: 'projectId', component: 'ProjectSelect', props: { projectState: [2] }},
        { label: '组织机构:', value: orgName, props: { disabled: true, placeholder: '请选择有项目的部门' }},
        { label: '审定日期:', keyword: 'settleDate', component: 'el-date-picker', props: { type: 'date', placeholder: '请选择', valueFormat: 'yyyy-MM-dd' }},
        { label: '审定值:', keyword: 'settleAmount', component: 'Input', props: { unit: '元' }},
        { label: '建筑面积:', value: area, component: 'Input', props: { disabled: true, placeholder: '自动带出', unit: '㎡' }},
        { label: '合同工期:', value: contractDuration, props: { disabled: true, placeholder: '自动带出' }},
        { label: '甲供材:', keyword: 'firstSupplyAmount', props: { placeholder: '甲供材金额未计入结算额的应填0' }},
        { label: '开累应收款:', value: receivableAccounts, props: { disabled: true, placeholder: '自动计算' }},
        { label: '开累外部产值:', value: externalOutputs, props: { disabled: true, placeholder: '自动带出' }},
        { label: '外部产值调整:', value: externalOutputAdjust, props: { disabled: true, placeholder: '自动计算' }},
        { label: '开累内部产值:', value: internalOutputs, props: { disabled: true, placeholder: '自动带出' }},
        { label: '内部产值调整:', value: internalOutputAdjust, props: { disabled: true, placeholder: '自动带出' }},
        { label: '报告:', monopolize: true, render: h => (<el-checkbox v-model={this.firstForm.isReport}>无报告</el-checkbox>) },
        { label: '备注:', keyword: 'remark', monopolize: true, props: { type: 'textarea' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true }}
      ]
    },
    /**
     * 计算质保数组
     */
    warrantyList() {
      return ['一', '二', '三', '四'].map((v, i) => {
        return {
          label: `${v}阶段`,
          rate: this.project[`warrantyRate${i + 1}`],
          days: this.project[`warrantyDays${i + 1}`]
        }
      })
    },
    /**
     * 开累应收款 = 审定值 - 甲供材 - 质保金
     * 质保金 = 审定值*（四个阶段的质保比例）/100
     */
    receivableAccounts() {
      const { settleAmount, firstSupplyAmount = 0 } = this.firstForm
      const { warrantyRate1, warrantyRate2, warrantyRate3, warrantyRate4 } = this.project
      const warrantyAmount = settleAmount * (warrantyRate1 + warrantyRate2 + warrantyRate3 + warrantyRate4) / 100
      if (settleAmount) return settleAmount - firstSupplyAmount - warrantyAmount
      return ''
    },
    /**
     * 外部产值调整 = 审定值 - 开累外部产值
     */
    externalOutputAdjust() {
      const { settleAmount } = this.firstForm
      const { externalOutputs = 0 } = this.output
      if (settleAmount) return settleAmount - externalOutputs
      else return ''
    },
    /**
     * 内部产值调整 = 审定值 - 开累内部产值
     */
    internalOutputAdjust() {
      const { settleAmount } = this.firstForm
      const { internalOutputs = 0 } = this.output
      if (settleAmount) return settleAmount - internalOutputs
      else return ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const newId = vm.$route.query.id
      const oldId = vm.firstForm.id
      if (newId && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.firstForm.id = newId
        vm.initDataById(newId)
        vm.active = 1
      } else if (!newId && oldId) {
        // 说明是打开一个新建页面
        // 将data数据初始成定义时的状态
        Object.assign(vm.$data, vm.$options.data())
        vm.$nextTick(() => {
          vm.$refs.firstForm.resetFields()
        })
      }
    })
  },
  methods: {
    /**
     * 处理项目选择器选择事件
     */
    handelProjectSelect(val) {
      Object.assign(this.firstForm, {
        orgId: val.orgId,
        companyId: val.companyId
      })
      this.getProjectMessage()
      this.getOutput()
    },
    /**
     * @description: 根据id获取数据
     */
    initDataById(id) {
      GetProjectSettleById({ id }).then(({ data, billFlowData }) => {
        Object.keys(this.firstForm).forEach(key => {
          if (Object.hasOwnProperty.call(data, key)) {
            this.firstForm[key] = data[key] || this.firstForm[key]
          }
        })
        Object.assign(this.firstForm, {
          fileList: data.upFile,
          billFlow: billFlowData,
          completDate: this.$moment(data.completDate).format('YYYY-MM-DD')
        })
        this.getProjectMessage()
      })
    },
    /**
     * 根据id获取项目信息
     */
    getProjectMessage() {
      const req = {
        id: this.firstForm.projectId
      }
      const formatDate = date => date ? this.$moment(date).format('YYYY-MM-DD') : ''
      getProjectById(req).then(({ data }) => {
        this.project = {
          ...data,
          orgName: data.organization.name,
          contractStartDate: formatDate(data.contractStartDate),
          contractFinishDate: formatDate(data.contractFinishDate),
          realStartDate: formatDate(data.realStartDate),
          computeFinishDate: formatDate(data.computeFinishDate)
        }
      })
    },
    /**
     * 获取外部产值
     */
    getOutput() {
      const req = {
        id: this.firstForm.projectId
      }
      GetProjectOutputSumById(req).then(({ externalOutputs, internalOutputs }) => {
        this.output = {
          externalOutputs,
          internalOutputs
        }
      })
    },
    getBillFlow() {
      // 获取流程数据
      const { state, billFlow } = this.firstForm
      const req = {
        ...this.firstForm,
        state: state || 0
      }
      if (billFlow) req.billFlowId = billFlow.id
      delete req.billFlow
      GetBillFlow(req).then(({ data, success, message }) => {
        if (success) {
          this.firstForm.billFlow = data.billFlow
          this.setActive(2)
        } else {
          this.$message.error(message)
        }
      })
    },
    /**
     * 修改填报进度
     */
    setActive(active) {
      this.active = active
    },
    /**
     * 下一步
     */
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getBillFlow()
        }
      })
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteProjectSettle({ id: this.firstForm.id })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交
     */
    submitForm(state) {
      const { receivableAccounts, output: { externalOutputs, internalOutputs }, externalOutputAdjust, internalOutputAdjust } = this
      const req = {
        ...this.firstForm,
        isReport: !this.firstForm.isReport,
        receivableAccounts,
        externalOutputs,
        internalOutputs,
        externalOutputAdjust,
        internalOutputAdjust,
        state
      }
      delete req.number
      delete req.orgName
      if (this.firstForm.billFlow) {
        // 获取流程组件中的数据
        const billFlow = this.$refs.flowSelect.getBillFlow()
        if (!billFlow) {
          return false
        }
        req.billFlow = billFlow
      } else {
        this.$message.error('流程数据不能为空')
        return
      }
      if (req.id) {
        PutProjectSettle(req).then(() => {
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddProjectSettle(req).then(() => {
          this.$message.success('提交成功')
          this.back()
        })
      }
    },
    /**
     * 返回上一页，并关闭当前页
     */
    back() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style scoped lang="scss">
.ProjectSiteSignEdit{
  // 修改的样式
/deep/.el-form {
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
  .actions{
    margin-left: 100px;
  }
  .info-card {
    margin: 16px 24px 0 24px;
    height: 48px;
    line-height: 12px;
    font-size: 16px;
    font-weight: 600;
  }
  .form-card {
    margin: 0 24px;
  }

  .botton-box {
    margin-top: 40px;
    text-align: center;
  }
}

</style>
