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
// import TreeSelect from '@/components/SearchBar/form/OrgSelect'
import FlowSelect from '@/components/Flow/flowSelect'
import MyForm from '@/components/MyForm'
// import { validate } from '@/utils/validate'
import { GetBillFlow, GetProjectCompleteManageById, InitProjectCompleteManage, AddProjectCompleteManage, PutProjectCompleteManage, DeleteProjectCompleteManage } from '@/api/xmgl/ProjectCompleteManage.js'
import { getProjectById } from '@/api/xmgl/project.js'

export default {
  name: 'ProjectCompleteManageEdit',
  components: {
    FlowSelect,
    MyForm
  },
  data() {
    return {
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      autoPlaceholder: '自动带出',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        projectId: null, // 项目id
        companyId: 2, // 中南装饰的
        id: 0, // 新增为0
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        orgStr: '', // 部门名称
        orderType: 1, // 指令类型
        completDate: '', // 竣工验收日期
        remark: '', // 备注
        fileList: [], // 附件
        state: 0, // 状态
        billFlow: [] // 单据流程
      },
      firstRules: {
        projectId: [
          { required: true, message: '请选择项目' }
        ],
        completDate: [
          { required: true, message: '请选择竣工验收日期' }
        ],
        orderType: [
          { required: true, message: '请选择指令类型' }
        ]
      },
      filter: {
        orderTypeList: [] // 指令类型list
      },
      project: {}
    }
  },
  computed: {
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '项目竣工'
    },
    /**
     * 计算质保完成日期
     * 质保完成日期=竣工验收日期+质保期
     */
    warrantyFinishDate() {
      const { project: { warrantyDays }, firstForm: { completDate }} = this
      return completDate ? this.$moment(completDate).add(warrantyDays || 0, 'days').format('YYYY-MM-DD') : ''
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      const {
        project: {
          orgName,
          area,
          contractDuration,
          contractStartDate,
          contractFinishDate,
          realStartDate,
          computeFinishDate,
          warrantyDays
        },
        inputPlaceholder,
        selectPlaceholder,
        autoPlaceholder,
        warrantyFinishDate,
        filter: {
          orderTypeList
        }
      } = this
      return [
        { label: '编码:', monopolize: true, keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '项目:', keyword: 'projectId', component: 'ProjectSelect', props: { placeholder: selectPlaceholder, projectState: [1] }},
        { label: '组织机构:', value: orgName, props: { disabled: true, placeholder: '请选择有项目的部门' }},
        { label: '竣工验收日期:', keyword: 'completDate', component: 'el-date-picker', props: { type: 'date', placeholder: selectPlaceholder, valueFormat: 'yyyy-MM-dd' }},
        { label: '指令类型:', keyword: 'orderType', component: 'Select', props: { propsLabel: 'name', options: orderTypeList, placeholder: selectPlaceholder }},
        { label: '建筑面积:', value: area, component: 'Input', props: { disabled: true, placeholder: autoPlaceholder, unit: '㎡' }},
        { label: '合同工期:', value: contractDuration, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '合同开工日期:', value: contractStartDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '合同竣工日期:', value: contractFinishDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '开工日期说明:', value: contractStartDate, monopolize: true, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '实际开工日期:', value: realStartDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '计算竣工日期:', value: computeFinishDate, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '质保完成日期:', value: warrantyFinishDate, monopolize: true, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '质保期:', value: warrantyDays, monopolize: true, props: { disabled: true, placeholder: autoPlaceholder }},
        { label: '备注:', keyword: 'remark', monopolize: true, props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initSelect()
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
    },
    /**
     * @description: 初始化选项框数据
     */
    initSelect() {
      InitProjectCompleteManage().then(({ orderTypeList }) => {
        this.filter.orderTypeList = orderTypeList
      })
    },
    /**
     * @description: 根据id获取数据
     */
    initDataById(id) {
      GetProjectCompleteManageById({ id }).then(({ data, billFlowData }) => {
        Object.keys(this.firstForm).forEach(key => {
          this.firstForm[key] = data[key] || this.firstForm[key]
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
        return DeleteProjectCompleteManage({ id: this.firstForm.id })
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
      delete req.orgStr
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
        PutProjectCompleteManage(req).then(res => {
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddProjectCompleteManage(req).then(() => {
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
