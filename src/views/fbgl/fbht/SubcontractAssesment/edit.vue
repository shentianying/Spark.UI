<template>
  <div class="container ProjectSiteSignEdit">
    <template v-if="active === 1">
      <el-card class="info-card">
        {{ title }}
      </el-card>
      <el-card class="form-card">
        <MyForm
          ref="firstForm"
          label-width="140px"
          :form-data="firstForm"
          :rules="firstRules"
          :form-node="formNodeData"
          :size="size"
          @sourceSubcontractIdSelect="sourceSubcontractIdSelect"
          @subcontractorIdSelect="subcontractorIdSelect"
          @projectIdSelect="projectIdSelect"
          @subcontractPeopleId="subcontractPeopleIdSelect"
        />
        <h4>附件列表</h4>
        <h5>施工合同及其清单</h5>
        <up-file v-model="firstForm.listFileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="firstForm.listFileList" />
        <el-divider />
        <h5>授权委托书</h5>
        <up-file v-model="firstForm.authorizationFileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="firstForm.authorizationFileList" />
        <el-divider />
        <h5>其他</h5>
        <up-file v-model="firstForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="firstForm.fileList" />
        <div class="actions">
          <el-button v-if="firstForm.state === 0" :size="size" type="primary" @click="nextStep('firstForm')">下一步</el-button>
          <!-- <el-button :size="size" type="promary" @click="invalidForm()">作废</el-button>
          <el-button :size="size" type="promary" @click="back()">取消</el-button> -->
        </div>
      </el-card>
    </template>
    <!--流程显示-->
    <template v-if="active===2">
      <flow-select v-if="firstForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="firstForm.billFlow" />
      <div class="botton-box">
        <template v-if="firstForm.state === 0">
          <el-button :size="size" type="primary" @click="submitForm(1)">提交</el-button>
          <el-button :size="size" @click="submitForm(0)">保存</el-button>
        </template>
        <el-button :size="size" @click="setActive(1)">上一步</el-button>
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
// import { hasPower } from '@/utils'
import { GetBillFlow, GetSubcontractAssesmentById, InitSubcontractAssesment, AddSubcontractAssesment, PutSubcontractAssesment, DeleteSubcontractSignSet } from '@/api/fbgl/subcontractAssesment.js'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'SubcontractAssesmentEdit',
  components: {
    MyForm,
    FlowSelect,
    UpFile
  },
  data() {
    const date = (rule, value, callback) => {
      const { contractStartDate, contractFinishDate } = this.firstForm
      if (contractStartDate && contractFinishDate) {
        if (new Date(contractStartDate).getTime() > new Date(contractFinishDate).getTime()) {
          return callback(new Error('开工日期要早于竣工日期'))
        }
      }
      return callback()
    }
    return {
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        number: '', // 合同号
        orgId: '', // 部门id
        name: '', // 合同名称
        subcontractType: 1, // 合同类型
        sourceSubcontractId: '', // 初始合同Id（补充合同时必填）
        isSeal: 1, // 是否用章
        projectId: '', // 项目ID
        subcontractorId: '', // 分包单位id
        subcontractPeopleId: '', // 分包人id
        secondParty: '', // 乙方代表
        contractStartDate: '', // 合同开工日期
        contractFinishDate: '', // 合同竣工日期
        contractDuration: '', // 合同工期
        contractAmount: '', // 合同额
        inDeAmount: '', // 增减额
        taxRate: '', // 开票税率
        repairYear: '', // 保修年限
        progressPaymentScale: '', // 进度款付款比例
        settleReportScale: '', // 结算上报比例
        acceptenceScale: '', // 竣工验收比例
        settlePaymentScale: '', // 结算付款比例
        subPart: '', // 分包部位
        paymentTerms: '', // 付款条件
        remark: '', // 备注
        fileList: [], // 附件
        listFileList: [], // 施工合同及清单扫描件
        authorizationFileList: [], // 授权委托书
        state: 0, // 状态
        billFlow: null // 单据流程
      },
      firstRules: {
        orgId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入合同名称', trigger: 'change' }
        ],
        subcontractType: [
          { required: true, message: '请选择合同类别', trigger: 'change' }
        ],
        isSeal: [
          { required: true, message: '请选择是否用章', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        subcontractorId: [
          { required: true, message: '请选择分包单位', trigger: 'change' }
        ],
        subcontractPeopleId: [
          { required: true, message: '请选择代理人', trigger: 'change' }
        ],
        secondParty: [
          { required: true, message: '请输入乙方代表', trigger: 'change' }
        ],
        contractStartDate: [
          { required: true, message: '请选择合同开工日期', trigger: 'change' },
          { validator: date, trigger: 'change' }
        ],
        contractFinishDate: [
          { required: true, message: '请选择合同竣工日期', trigger: 'change' },
          { validator: date, trigger: 'change' }
        ],
        contractAmount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        taxRate: [
          { required: true, message: '请输入开票税率', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ],
        repairYear: [
          { required: true, message: '请输入保修年限', trigger: 'change' },
          { validator: validate.number, message: '数字格式不正确', trigger: 'change' }
        ],
        progressPaymentScale: [
          { required: true, message: '请输入进度款付款比例', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ],
        settleReportScale: [
          { required: true, message: '请输入结算上报比例', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ],
        acceptenceScale: [
          { required: true, message: '请输入竣工验收比例', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ],
        settlePaymentScale: [
          { required: true, message: '请输入结算付款比例', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ]
      },
      filter: {
        subcontractTypeList: [],
        isSealList: [{ name: '是', value: 1 }, { name: '否', value: 0 }]
      },
      subcontractor: {},
      project: {}
    }
  },
  computed: {

    disabled() {
      return this.firstForm.subcontractType === 2
    },
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '分包合同'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        subcontractor,
        filter: { subcontractTypeList, isSealList },
        firstForm,
        disabled,
        project
      } = this
      // console.log(firstForm.isSeal)
      return [
        { label: '合同号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '合同名称:', keyword: 'name', props: { placeholder: inputPlaceholder }},
        { label: '合同类别:', keyword: 'subcontractType', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: subcontractTypeList }},
        { label: '是否用章:', keyword: 'isSeal', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: isSealList }},
        { label: '主合同号:', monopolize: true, if: firstForm.subcontractType === 2, component: 'SubcontractSelect', keyword: 'sourceSubcontractId', props: { placeholder: inputPlaceholder }},
        { label: '项目:', keyword: 'projectId', component: 'ProjectSelect', props: { disabled, placeholder: selectPlaceholder }},
        { label: '组织机构:', value: project.orgId, component: 'OrgSelect', props: { disabled: true, placeholder: '请选择项目' }},
        { label: '分包单位:', keyword: 'subcontractorId', component: 'SubcontractorSelect', props: { propsLabel: 'name', disabled, placeholder: inputPlaceholder }},
        { label: '法定代表人:', value: subcontractor.corporation, props: { disabled: true, placeholder: '请选择分包单位' }},
        { label: '代理人:', keyword: 'subcontractPeopleId', component: 'SubcontractPeopleSelect', props: { disabled, placeholder: inputPlaceholder }},
        { label: '乙方代表:', keyword: 'secondParty', props: { disabled, placeholder: inputPlaceholder }},
        { label: '合同开工日期:', keyword: 'contractStartDate', component: 'el-date-picker', props: { disabled, type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '合同竣工日期:', keyword: 'contractFinishDate', component: 'el-date-picker', props: { disabled, type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '合同工期:', keyword: 'contractDuration', props: { disabled: true, placeholder: '自动计算' }},
        { label: '合同额:', keyword: 'contractAmount', props: { placeholder: inputPlaceholder }},
        { label: '开票税率:', keyword: 'taxRate', props: { placeholder: inputPlaceholder }},
        { label: '保修年限:', keyword: 'repairYear', props: { placeholder: inputPlaceholder }},
        { label: '进度款付款比例:', keyword: 'progressPaymentScale', props: { placeholder: inputPlaceholder }},
        { label: '结算上报比例:', keyword: 'settleReportScale', props: { placeholder: inputPlaceholder }},
        { label: '竣工验收比例:', keyword: 'acceptenceScale', props: { placeholder: inputPlaceholder }},
        { label: '结算付款比例:', keyword: 'settlePaymentScale', props: { placeholder: inputPlaceholder }},
        { label: '分包部位:', keyword: 'subPart', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '付款条款:', keyword: 'paymentTerms', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', monopolize: true, keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }}
        // { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: !disabled, isDelete: !disabled, fileSize: 100, isPreview: true }}
      ]
    }
  },
  watch: {
    'firstForm.contractStartDate'() {
      this.calcContractDuration()
    },
    'firstForm.contractFinishDate'() {
      this.calcContractDuration()
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
        const form = vm.firstForm
        const { info: { uid, userName, name }, selectOrgId } = vm.$store.state.user
        vm.user = {
          id: uid,
          number: userName,
          name: name
        }
        form.companyId = selectOrgId
        form.personId = uid
        if (type === 'add' && oldId) {
          vm.initForm()
          vm.active = 1
        }
      }
    })
  },
  methods: {
    sourceSubcontractIdSelect(subcontract) {
      // console.log(subcontract)
      const { contractStartDate, contractFinishDate, projectId, subcontractPeopleId, subcontractorId, corporation, orgName, secondParty } = subcontract
      this.firstForm = {
        ...this.firstForm,
        contractStartDate,
        contractFinishDate,
        projectId,
        subcontractPeopleId,
        subcontractorId,
        secondParty
      }
      this.subcontractor = { id: subcontractorId, corporation }
      this.project.orgStr = orgName
      // project,subcontractor
    },
    calcContractDuration() {
      const { contractStartDate, contractFinishDate } = this.firstForm
      const day = 1000 * 60 * 60 * 24
      const res = Math.ceil((new Date(new Date(contractFinishDate) - 1 + day) - new Date(contractStartDate)) / day)
      this.firstForm.contractDuration = isNaN(res) ? '' : res
    },
    subcontractPeopleIdSelect(subcontractPeople) {
      console.log(subcontractPeople)
    },
    projectIdSelect(project) {
      this.project = project
      this.firstForm.orgId = project.orgId
    },
    subcontractorIdSelect(subcontractor) {
      console.log(subcontractor)
      this.subcontractor = subcontractor
    },
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.$nextTick(() => {
        this.$refs.firstForm.clearValidate()
      })
    },
    /**
     * @description: 初始化选项框数据
     */
    initSelect() {
      InitSubcontractAssesment().then(res => {
        this.filter.subcontractTypeList = res.subcontractTypeList
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetSubcontractAssesmentById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            if (key === 'isSeal') {
              // console.log(11111111)
              form[key] = typeof res.data[key] === 'boolean' ? Number(res.data[key]) : form[key]
            } else {
              form[key] = res.data[key] || form[key]
            }
          }
        }
        this.subcontractor = res.data.subcontractor
        this.project = res.data.project
        form.billFlow = res.billFlowData
        // form.fileList = res.data.upFile
        form.fileList = res.data.upFile
        form.listFileList = res.data.listUpFile
        form.authorizationFileList = res.data.authorizationUpFile
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
          this.getBillFlow()
        }
      })
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteSubcontractSignSet({ id: this.firstForm.id })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交; 10000: 修改
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
      if (req.id) {
        PutSubcontractAssesment(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddSubcontractAssesment(req).then(() => {
          // 添加
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
// /deep/.el-form {
//   .el-form-item{
//     width:45%
//   }
//   .input-width {
//     width: 272px;
//   }
//   .el-form-item__label{
//     font-weight: normal;
//     color: #101010;
//     }

//   }
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

