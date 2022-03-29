<template>
  <div class="container editPage">
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
        />
        <div class="actions">
          <el-button :size="size" @click="submitForm()">保存</el-button>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import MyForm from '@/components/MyForm'
import { validate } from '@/utils/validate'
import { getEnterpriseById, initEnterprise, addEnterprise, putEnterprise, deleteEnterprise } from '@/api/zsgl/enterprise.js'
export default {
  name: 'MatchEdit',
  components: {
    MyForm
  },
  data() {
    return {
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        companyName: '', // 公司名称
        legalPerson: '', // 法定代表人
        employeeNum: '', // 从业人数
        output: '', // 企业产值
        tax: '', // 税收
        linkMan: '', // 联系人
        linkTel: '', // 联系电话
        officialNet: '', // 官网
        email: '', // 邮箱
        area: '', // 建筑面积
        address: '', // 地址
        formerName: '', // 曾用名
        operationState: '', // 经营状态
        regCapital: '', // 注册资本
        paidCapital: '', // 实缴资本
        occupation: '', // 所属行业
        uniSocialCreditCode: '', // 统一社会信用代码
        taxNum: '', // 纳税人识别号
        businessLicense: '', // 工商注册号
        orgCode: '', // 组织机构代码
        setDate: '', // 成立日期
        startDate: '', // 营业期限起
        endDate: '', // 营业期限止
        enterpriseType: '', // 企业类型
        checkDate: '', // 核准日期
        inUse: 1, // 是否使用
        remark: '' // 备注
      },
      firstRules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人代表', trigger: 'change' }
        ],
        operationState: [
          { required: true, message: '请选择经营状态', trigger: 'change' }
        ],
        enterpriseType: [
          { required: true, message: '请选择企业类型', trigger: 'change' }
        ],
        inUse: [
          { required: true, message: '请选择是否使用', trigger: 'change' }
        ],
        linkMan: [
          { required: true, message: '请输入联系人', trigger: 'change' }
        ],
        linkTel: [
          { required: true, message: '请输入联系方式', trigger: 'change' }
        ],
        taxNum: [
          { required: true, message: '请输入纳税人识别号', trigger: 'change' }
        ],
        employeeNum: [
          { required: true, message: '请输入从业人数', trigger: 'change' },
          { validator: validate.number, message: '数字格式不正确', trigger: 'change' }
        ],
        output: [
          { required: true, message: '请输入企业产值', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ],
        tax: [
          { required: true, message: '请输入税收', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ],
        regCapital: [
          { required: true, message: '请输入注册资本', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ],
        paidCapital: [
          { required: true, message: '请输入实缴资本', trigger: 'change' },
          { validator: validate.money, message: '数字格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大值', trigger: 'change' }
        ]
      },
      filter: {
        operationStateList: [],
        enterpriseTypeList: [],
        inUseList: [{ name: '是', value: 1 }, { name: '否', value: 0 }]
      }
    }
  },
  computed: {
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '意向企业信息'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        filter: { operationStateList, enterpriseTypeList, inUseList }
      } = this

      return [
        { label: '公司名称:', keyword: 'companyName', props: { placeholder: inputPlaceholder }},
        { label: '曾用名:', keyword: 'formerName', props: { placeholder: inputPlaceholder }},
        { label: '法定代表人:', keyword: 'legalPerson', props: { placeholder: inputPlaceholder }},
        { label: '从业人数:', keyword: 'employeeNum', props: { placeholder: inputPlaceholder }},
        { label: '企业产值:', keyword: 'output', props: { placeholder: inputPlaceholder }},
        { label: '税收:', keyword: 'tax', props: { placeholder: inputPlaceholder }},
        { label: '联系人:', keyword: 'linkMan', props: { placeholder: inputPlaceholder }},
        { label: '联系电话:', keyword: 'linkTel', props: { placeholder: inputPlaceholder }},
        { label: '官网:', keyword: 'officialNet', props: { placeholder: inputPlaceholder }},
        { label: '邮箱:', keyword: 'email', props: { placeholder: inputPlaceholder }},
        { label: '建筑面积:', keyword: 'area', props: { placeholder: inputPlaceholder }},
        { label: '地址:', keyword: 'address', props: { placeholder: inputPlaceholder }},
        { label: '经营状态:', keyword: 'operationState', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: operationStateList }},
        { label: '所属行业:', keyword: 'occupation', props: { placeholder: inputPlaceholder }},
        { label: '注册资本:', keyword: 'regCapital', props: { placeholder: inputPlaceholder }},
        { label: '实缴资本:', keyword: 'paidCapital', props: { placeholder: inputPlaceholder }},
        { label: '统一社会信用代码:', keyword: 'uniSocialCreditCode', props: { placeholder: inputPlaceholder }},
        { label: '纳税人识别号:', keyword: 'taxNum', props: { placeholder: inputPlaceholder }},
        { label: '工商注册号:', keyword: 'businessLicense', props: { placeholder: inputPlaceholder }},
        { label: '组织机构代码:', keyword: 'orgCode', props: { placeholder: inputPlaceholder }},
        { label: '营业期限起:', keyword: 'startDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '营业期限止:', keyword: 'endDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '成立日期:', keyword: 'setDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '核准日期:', keyword: 'checkDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '企业类型:', keyword: 'enterpriseType', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: enterpriseTypeList }},
        { label: '是否使用:', keyword: 'inUse', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: inUseList }},
        { label: '备注:', monopolize: true, keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }}
      ]
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
          vm.initForm()
          vm.active = 1
        }
        const form = vm.firstForm
        const { info: { uid, userName, name }, selectOrgId } = vm.$store.state.user
        vm.user = {
          id: uid,
          number: userName,
          name: name
        }
        form.companyId = selectOrgId
        form.personId = uid
      }
    })
  },
  methods: {
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
      initEnterprise().then(res => {
        this.filter.operationStateList = res.operationStateList
        this.filter.enterpriseTypeList = res.enterpriseTypeList
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      getEnterpriseById({ id }).then(res => {
        console.log(res.data)
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            if (key === 'inUse') {
              form[key] = typeof res.data[key] === 'boolean' ? Number(res.data[key]) : form[key]
            } else {
              form[key] = res.data[key] || form[key]
            }
          }
        }
      })
    },
    /**
     * 修改填报进度
     */
    setActive(active) {
      this.active = active
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return deleteEnterprise({ id: this.firstForm.id })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    /**
     * 提交表单
     */
    submitForm() {
      const req = {
        ...this.firstForm
      }
      if (req.id) {
        putEnterprise(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        addEnterprise(req).then(() => {
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
.editPage{
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

