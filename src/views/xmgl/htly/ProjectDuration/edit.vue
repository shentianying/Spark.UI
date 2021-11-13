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
        <div class="actions">
          <el-button v-if="firstForm.state === 0" :size="size" type="primary" @click="nextStep('firstForm')">下一步</el-button>
          <el-button v-if="firstForm.state === 1" :size="size" type="primary" @click="submitForm(0)">保存</el-button>
          <!-- <el-button :size="size" @click="back()">取消</el-button> -->
        </div>
      </el-card>
    </template>
    <!--流程显示-->
    <template v-else-if="active===2">
      <flow-select v-if="firstForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="firstForm.billFlow" />
      <div class="botton-box">
        <el-button v-if="firstForm.state === 0" :size="size" type="primary" @click="submitForm(1)">提交审批</el-button>
        <el-button v-if="firstForm.state === 0" :size="size" @click="submitForm(0)">保存</el-button>
        <el-button :size="size" @click="setActive(1)">返回</el-button>
        <el-button v-if="firstForm.id && firstForm.state === 0" :size="size" @click="invalidForm()">作废</el-button>
        <el-button :size="size" @click="back()">取消</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { validate } from '@/utils/validate'
import FlowSelect from '@/components/Flow/flowSelect'
import MyForm from '@/components/MyForm'
import { getProjectById } from '@/api/xmgl/project.js'
import {
  GetBillFlow,
  GetProjectDurationAttitudeById,
  InitProjectDuration,
  AddProjectDuration,
  PutProjectDuration,
  DeleteProjectDuration
} from '@/api/xmgl/ProjectDuration.js'
export default {
  name: 'ProjectDurationEdit',
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
        companyId: '', // 公司id
        projectId: '', // 项目id
        id: 0, // 新增为0
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        adjustDays: '', // 本次申请顺延天数
        totalAdjustDays: 0, // 累计顺延工期
        totalDuration: 0, // 变更后总工期
        orderType: 1, // 指令类型
        reason: '', // 变更原因
        remark: '',
        fileList: [], // 附件
        state: 0, // 状态
        billFlow: [] // 单据流程
      },
      firstRules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        orderType: [
          { required: true, message: '请选择指令类型', trigger: 'change' }
        ],
        adjustDays: [
          { required: true, message: '请输入顺延天数', trigger: 'change' },
          { validator: validate.int, message: '请输入整数', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入变更原因', trigger: 'change' }
        ]
      },

      filter: {
        orderTypeList: []
      },
      project: {}
    }
  },
  computed: {
    /**
     * 累计顺延工期 = 实际工期 - 合同工期 + 本次顺延
     */
    totalAdjustDays() {
      let { realDuration, contractDuration } = this.project
      let adjustDays = this.firstForm.adjustDays
      adjustDays = Number(adjustDays) || 0
      realDuration = Number(realDuration) || 0
      contractDuration = Number(contractDuration) || 0
      return realDuration - contractDuration + adjustDays
    },
    /**
     * 变更后总工期 = 合同工期 + 累计顺延工期
     */
    totalDuration() {
      const contractDuration = Number(this.project.contractDuration) || 0
      return contractDuration + this.totalAdjustDays
    },
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '项目顺延'
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      const {
        project: {
          orgName,
          contractDuration,
          contractStartDate,
          contractFinishDate,
          realStartDate,
          computeFinishDate
        },
        inputPlaceholder,
        selectPlaceholder,
        autoPlaceholder,
        totalAdjustDays,
        totalDuration,
        filter: {
          orderTypeList
        }
      } = this
      return [
        { label: '编号:', monopolize: true, keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '项目:', keyword: 'projectId', component: 'ProjectSelect', props: { placeholder: selectPlaceholder, projectState: [1] }},
        { label: '组织机构:', value: orgName, props: { disabled: true, placeholder: '请选择有项目的部门' }},
        { label: '合同工期:', monopolize: true, value: contractDuration, component: 'Input', props: { disabled: true, placeholder: autoPlaceholder, unit: '天' }},
        { label: '合同开工日期:', value: contractStartDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '合同竣工日期:', value: contractFinishDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '实际开工日期:', value: realStartDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '计算竣工日期:', value: computeFinishDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '本次申请顺延:', keyword: 'adjustDays', component: 'Input', props: { placeholder: inputPlaceholder, unit: '天' }},
        { label: '累计顺延工期:', value: totalAdjustDays, component: 'Input', props: { disabled: true, placeholder: '自动计算', unit: '天' }},
        { label: '变更后总工期:', value: totalDuration, props: { disabled: true, placeholder: '自动计算' }},
        { label: '指令类型:', keyword: 'orderType', component: 'Select', props: { propsLabel: 'name', options: orderTypeList, placeholder: selectPlaceholder }},
        { label: '变更原因:', keyword: 'reason', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true }}
      ]
    }
  },
  watch: {
    '$store.state.user.selectOrgId': {
      handler(nVal) {
        this.firstForm.companyId = nVal
      },
      immediate: true
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initSelect()
      const newId = vm.$route.query.id
      const oldId = vm.firstForm.id
      const type = vm.$route.query.type
      if (type === 'edit' && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.firstForm.id = newId
        vm.initForm()
        vm.initDataById(newId)
        vm.active = 1
      } else {
        if (type === 'add' && oldId) {
          // 说明是打开一个新建页面
          vm.initForm()
          vm.active = 1
        }
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
        // this.firstForm.totalAdjustDays = data.realDuration - data.contractDuration
        this.firstForm.computeFinishDate = formatDate(data.computeFinishDate)
        this.project = {
          ...data,
          orgName: data.organization.name,
          contractStartDate: formatDate(data.contractStartDate),
          contractFinishDate: formatDate(data.contractFinishDate),
          realStartDate: formatDate(data.realStartDate)
        }
      })
    },
    /**
     * @description: 清除form数据，清除检验提示
     */
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.project = {}
      this.$nextTick(() => {
        this.$refs.firstForm.resetFields()
      })
    },
    /**
     * @description: 初始化选项框数据
     */
    initSelect() {
      InitProjectDuration().then(res => {
        this.filter.orderTypeList = res.orderTypeList
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetProjectDurationAttitudeById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(res.data, key)) {
            form[key] = res.data[key]
          }
        }
        form.fileList = res.data.upFile
        form.billFlow = res.billFlowData
        this.handelProjectSelect(this.firstForm)
      })
    },
    getBillFlow() {
      // 获取流程数据
      const { state, billFlow } = this.firstForm
      const req = {
        ...this.firstForm,
        totalAdjustDays: this.totalAdjustDays,
        totalDuration: this.totalDuration,
        state: state || 0
      }
      if (billFlow) req.billFlowId = billFlow.id
      delete req.billFlow
      delete req.number
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
          const { progressType, transactDate, sendDate } = this.firstForm
          console.log(progressType)
          if (progressType === 1 && !sendDate) {
            return this.$message.error('进度选项为已发生时，上报日期为必填项')
          } else if (progressType === 2 && !transactDate) {
            return this.$message.error('进度选项为已上报时，办理日期为必填项')
          }
          this.getBillFlow()
        }
      })
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteProjectDuration({ id: this.firstForm.id })
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
      const req = {
        ...this.firstForm,
        totalAdjustDays: this.totalAdjustDays,
        totalDuration: this.totalDuration,
        state
      }
      delete req.number
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
      if (this.firstForm.progressType === 2 && req.state === 1) {
        return this.$message.error('进度选项为已上报时，才能提交审批')
      }
      if (req.id) {
        PutProjectDuration(req).then(res => {
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddProjectDuration(req).then(() => {
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

