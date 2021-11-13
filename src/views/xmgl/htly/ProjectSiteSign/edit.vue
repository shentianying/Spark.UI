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
          <template v-else-if="disabled">
            <el-button :size="size" type="primary" @click="updateForm('firstForm')">保存</el-button>
            <el-button :size="size" @click="back()">取消</el-button>
          </template>
        </div>
      </el-card>
    </template>
    <!--流程显示-->
    <template v-if="active===2">
      <flow-select v-if="firstForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="firstForm.billFlow" />
      <div class="botton-box">
        <template v-if="firstForm.state === 0">
          <el-button :size="size" type="primary" @click="submitForm(1)">提交审批</el-button>
          <el-button :size="size" @click="submitForm(0)">保存</el-button>
        </template>
        <el-button :size="size" @click="setActive(1)">返回</el-button>
        <el-button v-if="firstForm.id && firstForm.state === 0" :size="size" @click="invalidForm()">作废</el-button>
        <el-button :size="size" @click="back()">取消</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import FlowSelect from '@/components/Flow/flowSelect'
import MyForm from '@/components/MyForm'
import { validate } from '@/utils/validate'
import { getProjectById } from '@/api/xmgl/project.js'
import { GetBillFlow, GetProjectSiteSignById, InitProjectSiteSign, AddProjectSiteSign, PutProjectSiteSign, DeleteProjectSiteSign, UpdateProjectSiteSign } from '@/api/xmgl/ProjectSiteSign.js'

export default {
  name: 'ProjectSiteSignEdit',
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
        orgName: '', // 组织机构名称
        name: '', // 签证名称
        reportAmount: '', // 上报值
        approveAmount: '', // 审定值
        costAmount: '', // 成本值
        firstRepresent: '', // 甲方代表
        occurDate: '', // 发生日期
        predictFinishDate: '', // 计划完成日期
        coordinateType: 0, // 是否协助类型
        firstPartyContent: '', // 甲方指令内容
        noTransactReason: '', // 未办理原因
        coordinateContent: '', // 协调配合内容
        remark: '', // 备注
        progressType: 1, // 进度id
        sendDate: '', // 上报日期
        transactDate: '', // 办理日期
        fileList: [], // 附件
        state: 0, // 状态
        billFlow: null // 单据流程
      },
      firstRules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入签证名称', trigger: 'change' }
        ],
        reportAmount: [
          { required: true, message: '请输入上报值', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        approveAmount: [
          { required: true, message: '请输入审定值', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        costAmount: [
          { required: true, message: '请输入成本值', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        firstRepresent: [
          { required: true, message: '请输入甲方代表', trigger: 'change' }
        ],
        occurDate: [
          { required: true, message: '请选择发生日期', trigger: 'change' }
        ],
        predictFinishDate: [
          { required: true, message: '请选择预计完成日期', trigger: 'change' }
        ],
        coordinateType: [
          { required: true, message: '请选择协助类型', trigger: 'change' }
        ],
        progressType: [
          { required: true, message: '请选择进度', trigger: 'change' }
        ],
        sendDate: [],
        transactDate: []
      },

      filter: {
        orgList: [],
        coordinateTypes: [],
        progressTypes: []
      },
      project: {}
    }
  },
  computed: {
    disabled() {
      return this.firstForm.state === 10000
    },
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '对外签证'
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      const {
        disabled,
        selectPlaceholder,
        inputPlaceholder,
        filter: {
          coordinateTypes,
          progressTypes
        }
      } = this
      return [
        { label: '编码:', monopolize: true, keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '项目:', keyword: 'projectId', component: 'ProjectSelect', props: { disabled, placeholder: selectPlaceholder }},
        { label: '组织机构:', keyword: 'orgName', props: { disabled: true, placeholder: '请选择有项目的部门' }},
        { label: '签证名称:', keyword: 'name', props: { disabled, placeholder: inputPlaceholder }},
        { label: '上报值:', keyword: 'reportAmount', props: { disabled, placeholder: inputPlaceholder }},
        { label: '审定值:', keyword: 'approveAmount', props: { disabled, placeholder: inputPlaceholder }},
        { label: '成本值:', keyword: 'costAmount', props: { disabled, placeholder: inputPlaceholder }},
        { label: '甲方代表:', keyword: 'firstRepresent', props: { disabled, placeholder: inputPlaceholder }},
        { label: '发生日期:', keyword: 'occurDate', component: 'el-date-picker', props: { type: 'date', placeholder: selectPlaceholder, valueFormat: 'yyyy-MM-dd' }},
        { label: '预计完成日期:', keyword: 'predictFinishDate', component: 'el-date-picker', props: { type: 'date', placeholder: selectPlaceholder, valueFormat: 'yyyy-MM-dd' }},
        { label: '是否协助:', keyword: 'coordinateType', component: 'Select', props: { propsLabel: 'name', options: coordinateTypes, placeholder: selectPlaceholder }},
        { label: '甲方指令内容:', keyword: 'firstPartyContent', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '未办理原因:', keyword: 'noTransactReason', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '协调配合内容:', keyword: 'coordinateContent', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '进度:', keyword: 'progressType', monopolize: true, component: 'Select', props: { disabled, propsLabel: 'name', options: progressTypes, placeholder: selectPlaceholder }},
        { label: '上报日期:', keyword: 'sendDate', component: 'el-date-picker', props: { type: 'date', placeholder: selectPlaceholder, valueFormat: 'yyyy-MM-dd' }},
        { label: '办理日期:', keyword: 'transactDate', component: 'el-date-picker', props: { type: 'date', placeholder: selectPlaceholder, valueFormat: 'yyyy-MM-dd' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true }}
      ]
    }
  },
  watch: {
    'firstForm.progressType': {
      handler(val) {
        const changeRules = {
          sendDate: [],
          transactDate: []
        }
        if (val === 1) {
          changeRules.sendDate = [
            { required: true, message: '进度选项为已发生时，上报日期为必填项', trigger: 'change' }
          ]
        } else if (val === 2) {
          changeRules.transactDate = [
            { required: true, message: '进度选项为已上报时，办理日期为必填项', trigger: 'change' }
          ]
        }
        Object.assign(this.firstRules, changeRules)
        this.$nextTick(() => {
          this.$refs.firstForm.clearValidate()
        })
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
        orgId: val ? val.orgId : '',
        orgName: val ? val.orgStr : '',
        companyId: val ? val.companyId : ''
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
      InitProjectSiteSign().then(res => {
        this.filter.coordinateTypes = res.coordinateTypeList
        this.filter.progressTypes = res.progressTypeList
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetProjectSiteSignById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(res.data, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        form.billFlow = res.billFlowData
        form.fileList = res.data.upFile
        this.$set(form, 'orgName', res.data.organization.name)
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
        return DeleteProjectSiteSign({ id: this.firstForm.id })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交;
     */
    submitForm(state) {
      const req = {
        ...this.firstForm,
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
      if (req.progressType !== 2 && req.state === 1) {
        return this.$message.error('进度选项为已上报时，才能提交审批')
      }
      if (req.id) {
        PutProjectSiteSign(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddProjectSiteSign(req).then(() => {
          // 添加
          this.$message.success('提交成功')
          this.back()
        })
      }
    },
    /**
     * 修改
    */
    updateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const req = {
            ...this.firstForm
          }
          delete req.number
          delete req.billFlow
          UpdateProjectSiteSign(req).then(res => {
          // 修改
            this.$message.success('修改成功')
            this.back()
          })
        }
      })
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

