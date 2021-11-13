<template>
  <div class="app-container SubcontractorEdit">
    <el-card class="info-card">
      分包单位
    </el-card>
    <el-card class="form-card">
      <template>
        <MyForm
          ref="firstForm"
          :form-data="firstForm"
          :rules="firstRules"
          :form-node="formNodeData"
          :label-width="labelWidth"
          :size="size"
          @licenseChange="setLicense"
          @safetyPeriodChange="setSafetyPeriod"
          @licenseFileListChange="fileListRest('licenseFileList')"
          @accountFileListChange="fileListRest('accountFileList')"
          @corporationFileListChange="fileListRest('corporationFileList')"
          @infoFileListChange="fileListRest('infoFileList')"
          @deliveryStatementFileListChange="fileListRest('deliveryStatementFileList')"
        />
        <div class="actions">
          <template>
            <el-button v-if="firstForm.id" :size="size" type="primary" @click="submitForm('firstForm')">更新</el-button>
            <el-button v-else :size="size" type="primary" @click="submitForm('firstForm')">保存</el-button>
            <el-button :size="size" type="promary" @click="back()">取消</el-button>
            <el-button :size="size" @click="submitRate('reviewStar',firstForm.id)">提交评审</el-button>
          </template>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import MyForm from '@/components/MyForm'
// import UpFile from '@/components/UpLoad/UpFile'
import { validate } from '@/utils/validate'
import { InitSubcontractor, AddSubcontractor, GetSubcontractorById, PutSubcontractor } from '@/api/fbgl/subcontractor'
export default {
  name: 'SubcontractorEdit',
  components: {
    MyForm
  },
  data() {
    return {
      subcontractorAssesmentId: '', // 分包星级评审id
      state: 0,
      labelWidth: '160px',
      size: 'mini',
      selectPlaceholder: '输入选择',
      inputPlaceholder: '请输入',
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        name: '', // 分包单位,
        subContractorType: '', // 分包类型
        address: '', // 注册地址
        postAddress: '', // 邮寄地址
        capital: '', // 注册资本
        mainBusiness: '', // 经营范围
        corporation: '', // 法定代表人
        entrustedAgent: '', // 委托代理人
        phone: '', // 手机
        tel: '', // 固话
        fax: '', // 传真
        email: '', // 邮箱
        regDate: '', // 成立日期
        taxpayerType: '', // 纳税人性质
        workerNum: '', // 工人数量
        isForbidden: 0, // 是否禁用
        bussinessType: [], // 可承接业务类型
        projectType: [], // 可承接工程类型
        businessCity: [], // 可施工区域
        postCertificate: '', // 上岗证书
        remark: '', // 备注
        licenseFileList: [], // 营业执照
        license: [],
        licenseStart: '', // 营业期限
        licenseEnd: '', // 营业期限
        accountFileList: [], // 开户许可证
        corporationFileList: [], // 法定代表人身份证明
        infoFileList: [], // 分包考察资料
        deliveryStatementFileList: [], // 送达声明
        taxpayerCerFileList: [], // 纳税人信息证明
        qualificationFileList: [], // 施工资质证书
        qualificationNum: '', // 编号
        regScopeStart: '', // 登记范围
        regScopeEnd: '', // 登记范围
        safetyFileList: [], // 安全生产许可证
        safetyCerNum: '', // 编号
        safetyPeriod: [],
        safetyPeriodStart: '', // 有效期
        safetyPeriodEnd: '', // 有效期
        financeReportFileList: [], // 财务审计报告
        fileList: [], // 其他附件
        rate: -1 // 星级默认不合格
      },
      firstRules: {
        orgId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入单位名称', trigger: 'change' }
        ],
        subContractorType: [
          { required: true, message: '请选择分包类型', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入注册地址', trigger: 'change' }
        ],
        postAddress: [
          { required: true, message: '请输入邮寄地址', trigger: 'change' }
        ],
        capital: [
          { required: true, message: '请输入注册资本', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        mainBusiness: [
          { required: true, message: '请输入经营范围', trigger: 'change' }
        ],
        corporation: [
          { required: true, message: '请输入法定代表人', trigger: 'change' }
        ],
        entrustedAgent: [
          { required: true, message: '请输入委托代理人', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: validate.mobile, message: '手机号格式不正确', trigger: 'change' }
        ],
        // tel: [
        //   { validator: validate.phone, message: '固话格式不正确', trigger: 'change' }
        // ],
        // email: [
        //   { validator: validate.email, message: 'Email格式不正确', trigger: 'change' }
        // ],
        regDate: [
          { required: true, message: '请选择成立日期', trigger: 'change' }
        ],
        taxpayerType: [
          { required: true, message: '选择纳税人性质', trigger: 'change' }
        ],
        workerNum: [
          { required: true, message: '请输入工人数量', trigger: 'change' },
          { validator: validate.int, message: '必须为整数', trigger: 'change' }
        ],
        isForbidden: [
          { required: true, message: '请选择是否禁用', trigger: 'change' }
        ],
        bussinessType: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        projectType: [
          { required: true, message: '请选择工程类型', trigger: 'change' }
        ],
        businessCity: [
          { required: true, message: '请选择可施工区域', trigger: 'change' }
        ],
        licenseFileList: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ],
        license: [
          { required: true, message: '请上选择营业期限', trigger: 'change' }
        ],
        accountFileList: [
          { required: true, message: '请上传开户许可证', trigger: 'change' }
        ],
        corporationFileList: [
          { required: true, message: '请上传法定代表人身份证明', trigger: 'change' }
        ],
        infoFileList: [
          { required: true, message: '请上传分包考察资料', trigger: 'change' }
        ],
        deliveryStatementFileList: [
          { required: true, message: '请上传送达声明', trigger: 'change' }
        ]
      },
      filter: {
        isForbiddenalist: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        subcontractorTypeList: [], // 分包类型列表
        taxpayerTypeList: [], // 纳税人性质列表
        bussinessTypeList: [], // 可承接业务类型
        projectTypeList: [], // 可承接工程类型
        bussinessCityList: [], // 可施工区域
        rateList: '' // 星级列表数据
      }
    }
  },
  computed: {
    formNodeData() {
      const {
        size,
        selectPlaceholder,
        inputPlaceholder,
        firstForm,
        filter: {
          subcontractorTypeList,
          taxpayerTypeList,
          bussinessTypeList,
          projectTypeList,
          bussinessCityList,
          isForbiddenalist
        }
      } = this
      return [
        { label: '编号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { placeholder: selectPlaceholder }},
        { label: '单位名称:', keyword: 'name', props: { placeholder: inputPlaceholder }},
        { label: '分包类型:', keyword: 'subContractorType', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: subcontractorTypeList }},
        { label: '注册地址:', keyword: 'address', props: { placeholder: inputPlaceholder }},
        { label: '邮寄地址:', keyword: 'postAddress', props: { placeholder: inputPlaceholder }},
        { label: '注册资本:', keyword: 'capital', component: 'Input', props: { placeholder: inputPlaceholder, unit: '万元' }},
        { label: '经营范围:', keyword: 'mainBusiness', props: { placeholder: inputPlaceholder }},
        { label: '法定代表人:', keyword: 'corporation', props: { placeholder: inputPlaceholder }},
        { label: '委托代理人:', keyword: 'entrustedAgent', props: { placeholder: inputPlaceholder }},
        { label: '手机:', keyword: 'phone', props: { placeholder: inputPlaceholder }},
        { label: '固话:', keyword: 'tel', props: { placeholder: inputPlaceholder }},
        { label: '传真:', keyword: 'fax', props: { placeholder: inputPlaceholder }},
        { label: '邮箱:', keyword: 'email', props: { placeholder: inputPlaceholder }},
        { label: '成立日期:', keyword: 'regDate', component: 'el-date-picker', props: { type: 'date', placeholder: selectPlaceholder, valueFormat: 'yyyy-MM-dd' }},
        { label: '纳税人性质:', keyword: 'taxpayerType', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: taxpayerTypeList }},
        { label: '工人数量:', keyword: 'workerNum', props: { placeholder: inputPlaceholder }},
        { label: '是否禁用:', keyword: 'isForbidden', component: 'Select', props: { placeholder: selectPlaceholder, options: isForbiddenalist }},
        { label: '可承接业务类型:', keyword: 'bussinessType', component: 'Select', props: { propsLabel: 'name', multiple: true, placeholder: selectPlaceholder, options: bussinessTypeList }},
        { label: '可承接工程类型:', keyword: 'projectType', component: 'Select', props: { propsLabel: 'name', multiple: true, placeholder: selectPlaceholder, options: projectTypeList }},
        { label: '可施工区域:', monopolize: true, keyword: 'businessCity', component: 'TreeSelect', props: { propsValue: 'id', propsLabel: 'name', multiple: true, placeholder: selectPlaceholder, options: bussinessCityList }},
        { label: '上岗证书:', keyword: 'postCertificate', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        /* component: 'UpFile', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true } */
        /* render: h => (
          <UpFile
            isUpfile={true}
            isDelete={true}
            fileSize={100}
            isPreview={true}
            fileList={firstForm.licenseFileList}
          ></UpFile>
        )  */
        { label: '营业执照:', monopolize: true, keyword: 'licenseFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '营业期限:', monopolize: true, keyword: 'license', component: 'DateRange', width: '100%', props: { type: 'monthrange', placeholder: selectPlaceholder, valueFormat: 'yyyy-MM' }},
        { label: '开户许可证:', monopolize: true, keyword: 'accountFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '法定代表人身份证明:', monopolize: true, keyword: 'corporationFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '分包考察资料:', monopolize: true, keyword: 'infoFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '送达声明:', monopolize: true, keyword: 'deliveryStatementFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '纳税人证明信息:', monopolize: true, keyword: 'taxpayerCerFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '施工资质证书:', monopolize: true, keyword: 'qualificationFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '编号:', keyword: 'qualificationNum', props: { placeholder: inputPlaceholder }},
        { label: '登记范围:', props: { placeholder: inputPlaceholder }, width: '100%', render: h => (<div class='input-range'>
          <el-input v-model={firstForm.regScopeStart} clearable class='input' size={size} placeholder={inputPlaceholder} />
          <i class='el-icon-right' />
          <el-input v-model={firstForm.regScopeEnd} clearable class='input' size={size} placeholder={inputPlaceholder} /></div>) },
        { label: '安全生产许可证:', monopolize: true, keyword: 'safetyFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '编号:', keyword: 'safetyCerNum', props: { placeholder: inputPlaceholder }},
        { label: '有效期:', keyword: 'safetyPeriod', component: 'DateRange', width: '100%', props: { placeholder: selectPlaceholder, transformType: 'property-serial' }},
        { label: '财务审计报告:', monopolize: true, keyword: 'financeReportFileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }},
        { label: '其他:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initSelect()
      const newId = vm.$route.query.id
      const oldId = vm.firstForm.id
      const type = vm.$route.query.type
      vm.subcontractorAssesmentId = vm.$route.query.subcontractorAssesmentId || ''
      // vm.filter.rateList = JSON.parse(vm.$route.query.rateList)
      vm.filter.rateList = vm.$route.query.rateList
      if (type === 'edit' && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.firstForm.id = newId
        vm.initForm()
        vm.initDataById(newId)
      } else {
        const form = vm.firstForm
        form.companyId = vm.$store.state.user.selectOrgId
        // 由于缓存的原因，防止上一次是编辑留下的数据，所以需要判断一下oldId
        if (type === 'add' && oldId) {
          vm.initForm()
        }
      }
    })
  },
  methods: {
    // 设置营业期限
    setLicense(val) {
      this.firstForm.licenseStart = val[0]
      this.firstForm.licenseEnd = val[1]
    },
    // 上传文件之后清空校验信息
    fileListRest(type) {
      this.$refs.firstForm.clearValidate(type)
    },
    // 设置有效期
    setSafetyPeriod(val) {
      this.firstForm.safetyPeriodStart = val[0]
      this.firstForm.safetyPeriodEnd = val[1]
    },
    initSelect() {
      InitSubcontractor().then(res => {
        const { subcontractorTypeList, taxpayerTypeList, bussinessTypeList, projectTypeList, bussinessCityList } = res
        this.filter.subcontractorTypeList = subcontractorTypeList
        this.filter.taxpayerTypeList = taxpayerTypeList
        this.filter.bussinessTypeList = bussinessTypeList
        this.filter.projectTypeList = projectTypeList
        this.filter.bussinessCityList = bussinessCityList
      })
    },
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.$nextTick(() => {
        this.$refs.firstForm.clearValidate()
      })
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交; 10000: 修改
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { bussinessType, businessCity, projectType } = this.firstForm
          const form = {
            bussinessType, businessCity, projectType
          }
          if (!this.firstForm.licenseStart || !this.firstForm.licenseEnd) {
            this.$message.error('请选择营业期限')
            return
          }
          form.bussinessType = form.bussinessType.join(',')
          form.businessCity = Array.isArray(form.businessCity) ? form.businessCity.join(',') : form.businessCity
          form.projectType = form.projectType.join(',')
          const req = {
            ...this.firstForm,
            ...form
          }
          delete req.number
          delete req.license
          delete req.safetyPeriod
          if (req.id) {
            PutSubcontractor(req).then(res => {
              // 更新
              this.$message.success('保存成功')
              this.back()
            })
          } else {
            AddSubcontractor(req).then(() => {
              // 添加
              this.$message.success('提交成功')
              this.back()
            })
          }
        }
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetSubcontractorById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        form.isForbidden = Number(form.isForbidden)
        this.parseServeDate(form, res.data)
      })
    },
    /* 处理多选数据 和 文件列表数据 */
    parseServeDate(form, data) {
      form.projectType = form.projectType.split(',')
      form.bussinessType = form.bussinessType.split(',')
      form.businessCity = form.businessCity.split(',')
      form.bussinessType = form.bussinessType.map(Number)
      form.projectType = form.projectType.map(Number)
      form.businessCity = form.businessCity.map(Number)
      form.fileList = data.upFile
      form.licenseFileList = data.licenseUpFile
      // 营业期限
      form.license = [form.licenseStart, form.licenseEnd]
      // 安全有效期
      form.safetyPeriod = [form.safetyPeriodStart, form.safetyPeriodEnd]
      form.accountFileList = data.accountUpFile
      form.corporationFileList = data.corporationUpFile
      form.infoFileList = data.infoUpFile
      form.deliveryStatementFileList = data.deliveryStatementUpFile
      form.taxpayerCerFileList = data.taxpayerCerUpFile
      form.qualificationFileList = data.qualificationUpFile
      form.safetyFileList = data.safetyUpFile
      form.financeReportFileList = data.financeReportUpFile
    },
    /* 提交评审 */
    submitRate(type, id) {
      if (this.firstForm.id) {
        this.$router.push({ name: 'SubcontractorDetails', query: { type, id, subcontractorAssesmentId: this.subcontractorAssesmentId, rateList: this.filter.rateList, refreshRouterName: this.$route.name }})
      } else {
        this.$message.error('请先保存数据!')
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

<style lang="scss" scoped>
.SubcontractorEdit {
  .actions{
    margin-left: 100px;
  }
  .el-form {
    /deep/ .input-range{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .input{
        width:45%;
      }
    }

  }

}

</style>
