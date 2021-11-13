<template>
  <div class="app-container SubcontractPeopleEdit">
    <el-card class="info-card">
      分包人
    </el-card>
    <el-card class="form-card">
      <MyForm
        ref="firstForm"
        :form-data="firstForm"
        :rules="firstRules"
        :form-node="formNodeData"
        :label-width="labelWidth"
        :size="size"
        @emailChange="resetData(firstForm.email, 'email')"
        @idNumberChange="resetData(firstForm.idNumber, 'idNumber')"
        @phoneChange="resetData(firstForm.phone, 'phone')"
        @telChange="resetData(firstForm.tel, 'tel')"
        @faxChange="resetData(firstForm.fax, 'fax')"
      />
      <div class="actions">
        <template>
          <el-button :size="size" type="primary" @click="submitForm('firstForm')">保存</el-button>
          <el-button :size="size" type="promary" @click="back()">取消</el-button>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import MyForm from '@/components/MyForm'

import { InitSubcontractPeople, AddSubcontractPeople, PutSubcontractPeople, GetSubcontractPeopleById } from '@/api/fbgl/subcontractPeople'
export default {
  name: 'SubcontractPeopleEdit',
  components: {
    MyForm
  },
  data() {
    return {
      state: 0,
      labelWidth: '160px',
      size: 'mini',
      selectPlaceholder: '输入选择',
      inputPlaceholder: '请输入',
      firstForm: {
        id: 0,
        name: '', // 分包人
        idNumber: '', // 身份证号
        orgId: '', // 部门
        address: '', // 地址
        tel: '', // 电话
        phone: '', // 手机
        fax: '', // 传真
        email: '', // Email
        type: '', // 类型
        isForbidden: 0,
        remark: '', // 备注
        fileList: [] // 附件
      },
      firstRules: {
        orgId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      filter: {
        isForbiddenalist: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        typeList: [] // 分包人类型
      }
    }
  },
  computed: {
    formNodeData() {
      const {
        selectPlaceholder,
        inputPlaceholder,
        filter: {
          isForbiddenalist,
          typeList
        }
      } = this
      return [
        { label: '分包人姓名:', keyword: 'name', props: { placeholder: inputPlaceholder, maxlength: 4 }},
        { label: '身份证号:', keyword: 'idNumber', props: { placeholder: inputPlaceholder, maxlength: 18 }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { placeholder: selectPlaceholder }},
        { label: '地址:', keyword: 'address', props: { placeholder: inputPlaceholder, maxlength: 100 }},
        { label: '电话:', keyword: 'tel', props: { placeholder: inputPlaceholder, maxlength: 11 }},
        { label: '手机:', keyword: 'phone', props: { placeholder: inputPlaceholder, maxlength: 11 }},
        { label: '传真:', keyword: 'fax', props: { placeholder: inputPlaceholder }},
        { label: 'Email:', keyword: 'email', props: { placeholder: inputPlaceholder }},
        { label: '类型:', keyword: 'type', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: typeList }},
        { label: '是否禁止:', keyword: 'isForbidden', component: 'Select', props: { placeholder: selectPlaceholder, options: isForbiddenalist }},
        { label: '备注:', monopolize: true, keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }}
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
    /* 重新设置输入框的内容 */
    resetData(value, str) {
      const emailReg = /.+@globex\.com/g
      const idReg = /\d{15}|d{18}/g
      const phoneReg = /\d{11}/g
      const telReg = /^([0-9]{3,4}-)?[0-9]{7,8}$|\d{11}/g
      const faxReg = /[\+? *[1-9]+]?[0-9]+/g
      switch (str) {
        case 'email':
          if (value !== '' && !emailReg.test(value)) {
            this.firstForm[str] = ''
            this.$message.error('请输入正确的邮箱')
          }
          break
        case 'idNumber':
          if (value !== '' && !idReg.test(value)) {
            this.firstForm[str] = ''
            this.$message.error('请输入正确的身份证号')
          }
          break
        case 'phone':
          if (value !== '' && !phoneReg.test(value)) {
            this.firstForm[str] = ''
            this.$message.error('请输入正确的手机号')
          }
          break
        case 'tel':
          if (value !== '' && !telReg.test(value)) {
            this.firstForm[str] = ''
            this.$message.error('请输入正确的电话')
          }
          break
        case 'fax':
          if (value !== '' && !faxReg.test(value)) {
            this.firstForm[str] = ''
            this.$message.error('请输入正确的传真号')
          }
          break
      }
    },
    /* 初始化选择框数据 */
    initSelect() {
      InitSubcontractPeople().then(res => {
        const { typeList } = res
        this.filter.typeList = typeList
      })
    },
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.$nextTick(() => {
        this.$refs.firstForm.clearValidate()
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetSubcontractPeopleById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        form.isForbidden = Number(form.isForbidden)
        form.fileList = res.data.upFile
      })
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交; 10000: 修改
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const req = {
            ...this.firstForm
          }
          if (req.id) {
            PutSubcontractPeople(req).then(res => {
              // 更新
              this.$message.success('保存成功')
              this.back()
            })
          } else {
            AddSubcontractPeople(req).then(() => {
              // 添加
              this.$message.success('保存成功')
              this.back()
            })
          }
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

<style lang="scss" scoped>
.SubcontractPeopleEdit {
  .actions{
    margin-left: 100px;
  }
}
</style>
