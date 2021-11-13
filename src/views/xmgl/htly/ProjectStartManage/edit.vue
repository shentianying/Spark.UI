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
import FlowSelect from '@/components/Flow/flowSelect'
import { getProjectById } from '@/api/xmgl/project.js'
import MyForm from '@/components/MyForm'
import {
  GetBillFlow,
  GetProjectStartManageById,
  InitProjectStartManage,
  AddProjectStartManage,
  PutProjectStartManage,
  DeleteProjectStartManage
} from '@/api/xmgl/ProjectStartManage.js'
export default {
  name: 'ProjectStartManageEdit',
  components: {
    // Select,
    FlowSelect,
    // UpFile,
    // ProjectSelect,
    MyForm
  },
  data() {
    return {
      size: 'mini',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        companyId: '', // 公司id
        projectId: '', // 项目id
        id: 0, // 新增为0
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        orgName: '', // 部门名称
        startDate: '', // 开工日期
        startType: 1, // 开工类型
        orderUnit: '', // 指令单位
        orderPeople: '', // 指令人
        contractDuration: '', // 合同约定工期
        computeFinishDate: '', // 计算竣工日期
        fileList: [], // 附件
        state: 0, // 状态
        billFlow: [], // 单据流程
        remark: ''
      },
      firstRules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择实际开工日期', trigger: 'change' }
        ],
        startType: [
          { required: true, message: '请选择实际开工类型', trigger: 'change' }
        ],
        orderUnit: [
          { required: true, message: '请输入指令单位', trigger: 'change' }
        ]
      },

      filter: {
        orgList: [],
        startTypeList: []
      },
      project: {}
    }
  },
  computed: {

    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '项目开工'
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      const { startTypeList } = this.filter
      return [
        { label: '编码:', monopolize: true, keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '项目:', keyword: 'projectId', component: 'ProjectSelect', props: { projectState: [0] }},
        { label: '组织机构:', keyword: 'orgName', props: { disabled: true, placeholder: '请选择有项目的部门' }},
        { label: '实际开工日期:', keyword: 'startDate', component: 'el-date-picker', props: { placeholder: '请选择' }},
        { label: '开工类型:', keyword: 'startType', component: 'Select', props: { propsLabel: 'name', options: startTypeList, placeholder: '请选择' }},
        { label: '指令单位:', keyword: 'orderUnit', props: { placeholder: '请输入' }},
        { label: '指令人:', keyword: 'orderPeople', props: { placeholder: '请输入' }},
        { label: '合同约定工期:', keyword: 'contractDuration', props: { disabled: true, placeholder: '自动带出' }},
        { label: '计算竣工日期:', keyword: 'computeFinishDate', component: 'el-date-picker', props: { disabled: true, placeholder: '自动计算' }},
        { label: '备注:', keyword: 'remark', monopolize: true, props: { type: 'textarea' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true }}
      ]
    }
  },
  watch: {
    'firstForm': {
      handler(nVal) {
        const { contractDuration, startDate } = nVal
        const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
        const startTime = new Date(startDate).getTime()
        const durationTime = (Number(contractDuration) || 0) * 24 * 60 * 60 * 1000
        this.firstForm.computeFinishDate = d(new Date(startTime + durationTime) || '')
      },
      deep: true
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
        companyId: val ? val.companyId : ''
      })
      this.getProjectMessage()
    },
    /**
     * 根据id获取项目信息
     */
    getProjectMessage() {
      if (this.firstForm.projectId === undefined) {
        this.firstForm.orgName = ''
        this.firstForm.projectId = ''
        this.project.orgName = ''
      } else {
        const req = {
          id: this.firstForm.projectId
        }
        getProjectById(req).then(({ data }) => {
          Object.assign(this.firstForm, {
            contractDuration: data.contractDuration,
            orgName: data.organization.name
          })
        })
      }
    },
    /**
     * @description: 清除form数据，清除检验提示
     */
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.project = {}
      this.$nextTick(() => {
        // 调用表单组件的重置方法
        this.$refs.firstForm.resetFields()
      })
    },
    /**
     * @description: 初始化选项框数据
     */
    initSelect() {
      InitProjectStartManage().then(res => {
        this.filter.startTypeList = res.startTypeList
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetProjectStartManageById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(res.data, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        form.billFlow = res.billFlowData
        form.fileList = res.data.upFile
        this.handelProjectSelect(this.firstForm)
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
      this.$refs[formName].validate(() => this.getBillFlow())
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteProjectStartManage({ id: this.firstForm.id })
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
        PutProjectStartManage(req).then(res => {
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddProjectStartManage(req).then(() => {
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

