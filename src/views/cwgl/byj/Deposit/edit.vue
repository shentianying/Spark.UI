<template>
  <div class="container DepositEdit">
    <template v-if="active === 1">
      <el-card class="info-card">
        {{ title }}
      </el-card>
      <el-card class="form-card">
        <MyForm
          ref="firstForm"
          :form-data="firstForm"
          :rules="firstRules"
          :form-node="formNodeData"
          :size="size"
          @personIdSelect="selectPerson"
          @bussinessInfoIdChange="getBussinessInfo"
        />
        <div class="actions">
          <el-button v-if="firstForm.state === 0" :size="size" type="primary" @click="nextStep('firstForm')">下一步</el-button>
        </div>
      </el-card>
    </template>
    <!--流程显示-->
    <template v-if="active===2">
      <flow-select v-if="firstForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="firstForm.billFlow" />
      <div class="botton-box">
        <template v-if="firstForm.state === 0">
          <el-button :size="size" type="primary" :loading="addbtnLoad" @click="submitForm(1)">提交</el-button>
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
import { InitDeposit, GetBillFlow, AddDeposit, PutDeposit, GetDepositById, DeleteDeposit } from '@/api/cwgl/Deposit'
export default {
  name: 'DepositEdit',
  components: {
    FlowSelect,
    MyForm
  },
  data() {
    return {
      addbtnLoad: false, // 提交按钮loading状态
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      user: {

      },
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        personId: '', // 人员id
        depositType: 1, // 类别
        planReturnDate: '', // 回收日期
        bussinessInfoId: '', // 业务工程信息编号
        bussinessMan: '', // 客商
        applicationAmount: '', // 申请金额
        summary: '', // 用途
        remark: '', // 备注
        fileList: [], // 附件
        state: 0, // 状态
        billFlow: null // 单据流程
      },
      firstRules: {
        orgId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        applicationAmount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        depositType: [
          { required: true, message: '请选择保证金类型', trigger: 'change' }
        ],
        personId: [
          { required: true, message: '请输入工号', trigger: 'change' }
        ],
        planReturnDate: [
          { required: true, message: '请输入日期', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请输入用途', trigger: 'change' }
        ]
      },
      filter: {
        depositTypeList: []
      },
      project: {},
      bussinessInfo: { // 业务工程信息
        number: ''
      }
    }
  },
  computed: {

    disabled() {
      return false
    },
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '保证金申请'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        firstForm,
        filter: { depositTypeList },
        user,
        bussinessInfo,
        disabled
      } = this
      return [
        { label: '编号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { placeholder: selectPlaceholder }},
        { label: '保证金类型:', keyword: 'depositType', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: depositTypeList }},
        { label: '金额:', keyword: 'applicationAmount', props: { placeholder: inputPlaceholder }},
        { label: '业务信息工程:', if: (firstForm.depositType === 1 || firstForm.depositType === 3), keyword: 'bussinessInfoId', component: 'BussinessInfoSelect', props: { placeholder: selectPlaceholder }},
        { label: '业务信息编号:', if: (firstForm.depositType === 1 || firstForm.depositType === 3), value: bussinessInfo.number, props: { disabled: true, placeholder: '自动带出' }},
        { label: '工号:', keyword: 'personId', component: 'PersonSelect', props: { propsLabel: 'number', multiple: false, placeholder: selectPlaceholder }},
        { label: '姓名:', value: user.name, props: { disabled: true, placeholder: '自动带出' }},
        { label: '回收日期:', keyword: 'planReturnDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '客商:', keyword: 'bussinessMan', props: { placeholder: inputPlaceholder }},
        { label: '用途:', keyword: 'summary', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: !disabled, isDelete: !disabled, fileSize: 100, isPreview: true }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.InitDepositSelce()
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
    selectPerson(user) {
      this.firstForm.personId = user.id
      this.user = user
    },
    getBussinessInfo(info) {
      this.bussinessInfo = info
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
    InitDepositSelce() {
      InitDeposit().then(res => {
        const { depositTypeList } = res
        this.filter.depositTypeList = depositTypeList
      })
    },
    /*
     *下一步
     */
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getBillFlow()
        }
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetDepositById({ id }).then(res => {
        res.data.bussinessInfo = res.data.bussinessInfo ? res.data.bussinessInfo : { number: '' }
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        this.user = res.data.person
        this.bussinessInfo = res.data.bussinessInfo
        form.billFlow = res.billFlowData
        form.fileList = res.data.upFile
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
      delete req.bussinessInfoName
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
        PutDeposit(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        this.addbtnLoad = true
        AddDeposit(req).then(() => {
          // 添加
          this.$message.success('提交成功')
          this.back()
          this.addbtnLoad = false
        }).catch(() => {
          this.addbtnLoad = false
        })
      }
    },
    /**
     * 作废
     */
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteDeposit({ id: this.firstForm.id })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
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
.DepositEdit{
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
