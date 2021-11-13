<template>
  <div class="app-container WriteOffEdit">
    <el-card class="info-card">
      备用金冲销
    </el-card>
    <el-card class="form-card">
      <template>
        <MyForm
          ref="firstForm"
          :form-data="firstForm"
          :rules="firstRules"
          :form-node="formNodeData"
          :size="size"
          @personIdSelect="selectPerson"
        />
        <div class="actions">
          <el-button
            :size="size"
            type="primary"
            @click="submitForm(1, 'firstForm')"
          >提交</el-button>
          <el-button
            :size="size"
            @click="submitForm(0, 'firstForm')"
          >保存</el-button>
          <template v-if="firstForm.id == 0">
            <el-button
              :size="size"
              @click="back()"
            >取消</el-button>
          </template>

          <template v-if="firstForm.id !== 0">
            <el-button :size="size" type="promary" @click="invalidForm()">作废</el-button>
          </template>
        </div>
      </template>
    </el-card>

  </div>
</template>

<script>
import MyForm from '@/components/MyForm'
import { validate } from '@/utils/validate'
import { InitImprestWriteOff, GetImprestWriteOffById, AddImprestWriteOff, PutImprestWriteOff, DeleteImprestWriteOff } from '@/api/cwgl/Impresst'
export default {
  name: 'ImprestWriteOffEdit',
  components: {
    MyForm
  },
  data() {
    return {
      state: 0,
      size: 'mini',
      selectPlaceholder: '输入选择',
      inputPlaceholder: '请输入',
      firstForm: {
        id: 0, // 新增id为0
        companyId: '', // 公司id
        number: '', // 新增编号自动生成
        personId: '', // 冲销人工号
        orgId: '', // 部门id
        imprestType: 2, // 冲销方式: 1：网银冲销；2：发票冲销
        personName: '',
        amount: '', // 冲销金额
        remark: '', // 备注
        type: 1 // 备用金冲销 固定值为1
      },
      firstRules: {
        orgId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        personId: [
          { required: true, message: '请输入冲销人工号', trigger: 'change' }
        ],
        personName: [
          { required: true, trigger: 'change', message: '请选择冲销人' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        imprestType: [
          { required: true, message: '请选择冲销方式', trigger: 'change' }
        ]
      },
      filter: {
        imprestTypeList: [] // 冲销方式列表数据
      },
      project: {}
    }
  },
  computed: {
    disabled() {
      return this.firstForm.state === 10000
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        firstForm,
        filter
      } = this
      return [
        { label: '编号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { placeholder: selectPlaceholder }},
        { label: '冲销人工号:', keyword: 'personId', component: 'PersonSelect', props: { propsLabel: 'number', multiple: false, placeholder: selectPlaceholder }},
        { label: '姓名:', keyword: 'personName', props: { disabled: true, placeholder: '自动带出' }},
        { label: '冲销金额:', keyword: 'amount', props: { placeholder: inputPlaceholder }},
        { label: '冲销方式:', keyword: 'imprestType', render: h => (
          <el-radio-group vModel={firstForm.imprestType}>
            {
              filter.imprestTypeList.map((e) => <el-radio key={e.id} label={e.value}>{e.name}</el-radio>)
            }
          </el-radio-group>)
        },
        { label: '备注:', monopolize: true, keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.InitImprestWriteOffType()
      const newId = vm.$route.query.id
      const oldId = vm.firstForm.id
      const type = vm.$route.query.type
      const form = vm.firstForm
      const { selectOrgId } = vm.$store.state.user
      form.companyId = selectOrgId
      if (newId && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.firstForm.id = newId
        vm.initDataById(newId)
        vm.state = 1
      } else {
        if (type === 'add' && oldId) {
          Object.assign(vm.$data.firstForm, vm.$options.data().firstForm)
          vm.$nextTick(() => {
            vm.$refs.firstForm.resetFields()
          })
        }
      }
    })
  },
  methods: {
    /**
     * 处理项目选择器选择事件
     */
    selectPerson(val) {
      Object.assign(this.firstForm, {
        personName: val ? val.name : ''
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetImprestWriteOffById({ id }).then(res => {
        this.user = res.data.person
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        if (form.amount < 0) {
          form.amount = Math.abs(form.amount)
        }
      })
    },
    /**
     * @description: 初始化冲销方式单选
     */
    InitImprestWriteOffType() {
      InitImprestWriteOff().then(res => {
        this.filter.imprestTypeList = res.typeList
      })
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交; 10000: 修改
     */
    submitForm(state, formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const req = {
            ...this.firstForm,
            state
          }
          delete req.personName
          if (req.id) {
            PutImprestWriteOff(req).then(res => {
            // 更新
              this.$message.success('保存成功')
              this.back()
            })
          } else {
            AddImprestWriteOff(req).then(() => {
            // 添加
              this.$message.success('提交成功')
              this.back()
            })
          }
        }
      })
    },
    /**
     * 作废
     */
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteImprestWriteOff({ id: this.firstForm.id })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    back() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style scoped lang="scss">
.WriteOffEdit {
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
