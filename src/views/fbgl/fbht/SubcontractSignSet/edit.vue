<template>
  <div class="container ProjectSiteSignEdit">
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
          @subcontractIdSelect="selectSubcontract"
        />
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
import { GetBillFlow, GetSubcontractSignSetById, InitSubcontractSignSet, AddSubcontractSignSet, PutSubcontractSignSet, DeleteSubcontractSignSet } from '@/api/fbgl/subcontractSignSet.js'

export default {
  name: 'SubcontractSignSetEdit',
  components: {
    MyForm,
    FlowSelect
  },
  data() {
    return {
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      subcontract: {},
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        subcontractId: '', // 分包合同Id
        projectId: '', // 项目id
        orderPeople: '', // 指令人
        signType: '', // 签证类型（如果为外部指令，指令下达方式默认书面通知）
        subReferee: '', // 分包人代表
        orderMode: '', // 指令下达方式
        siteSignId: '', // 对外签证id
        orderDate: '', // 指令下达日期
        amount: '', // 预估金额
        summary: '', // 用途
        remark: '', // 备注
        workPart: '', // 施工部位
        content: '', // 工作内容
        fileList: [], // 附件
        state: 0, // 状态
        billFlow: null // 单据流程
      },
      firstRules: {
        subcontractId: [
          { required: true, message: '请选择合同', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        siteSignId: [
          { required: true, message: '请输入外部签证号', trigger: 'change' }
        ],
        orderPeople: [
          { required: true, message: '请输入指令人', trigger: 'change' }
        ],
        signType: [
          { required: true, message: '请选择签证类型', trigger: 'change' }
        ],
        subReferee: [
          { required: true, message: '请输入分包代表人', trigger: 'change' }
        ],
        orderMode: [
          { required: true, message: '请选择指令下达方式', trigger: 'change' }
        ],
        orderDate: [
          { required: true, message: '请选择指令下达日期', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请输入事由', trigger: 'change' }
        ]
      },
      filter: {
        signTypeList: [],
        orderModeList: []
      }
    }
  },
  computed: {

    disabled() {
      return false
    },
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '分包签证立项'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        subcontract,
        firstForm,
        filter: { signTypeList, orderModeList },
        disabled
      } = this
      return [
        { label: '编号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '合同号:', keyword: 'subcontractId', component: 'SubcontractSelect', props: { placeholder: inputPlaceholder }},
        { label: '项目:', value: subcontract.projectName, props: { disabled: true, placeholder: inputPlaceholder }},
        { label: '组织机构:', value: subcontract.orgName, props: { disabled: true, placeholder: inputPlaceholder }},
        { label: '合同名称:', value: subcontract.name, props: { disabled: true, placeholder: inputPlaceholder }},
        { label: '分包单位:', value: subcontract.subcontractor, props: { disabled: true, placeholder: inputPlaceholder }},
        { label: '分包人:', value: subcontract.corporation, props: { disabled: true, placeholder: inputPlaceholder }},
        { label: '指令人:', keyword: 'orderPeople', props: { disabled, placeholder: inputPlaceholder }},

        { label: '签证类型:', keyword: 'signType', component: 'Select', props: { disabled, propsLabel: 'name', placeholder: selectPlaceholder, options: signTypeList }},
        { label: '分包人代表:', keyword: 'subReferee', props: { disabled, placeholder: inputPlaceholder }},
        { label: '外部签证号:', if: firstForm.signType === 2, keyword: 'siteSignId', component: 'ProjectSiteSignSelect', props: { disabled, placeholder: selectPlaceholder }},
        { label: '指令下达方式:', if: firstForm.signType !== 2, keyword: 'orderMode', component: 'Select', props: { disabled, propsLabel: 'name', placeholder: selectPlaceholder, options: orderModeList }},
        { label: '指令下达日期:', keyword: 'orderDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '预估金额:', monopolize: true, keyword: 'amount', props: { disabled, placeholder: inputPlaceholder }},
        { label: '事由:', keyword: 'summary', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '施工部位:', keyword: 'workPart', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '工作内容:', keyword: 'content', props: { disabled, placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: !disabled, isDelete: !disabled, fileSize: 100, isPreview: true }}
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
        const form = vm.firstForm
        const { selectOrgId } = vm.$store.state.user
        form.companyId = selectOrgId
        if (type === 'add' && oldId) {
          vm.initForm()
          vm.active = 1
        }
      }
    })
  },
  methods: {
    selectSubcontract(subcontract) {
      this.subcontract = subcontract
      this.firstForm.orgId = subcontract.orgId
      this.firstForm.projectId = subcontract.projectId
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
      InitSubcontractSignSet().then(res => {
        this.filter.signTypeList = res.signTypeList
        this.filter.orderModeList = res.orderModeList
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetSubcontractSignSetById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        this.user = res.data.person
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
        PutSubcontractSignSet(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddSubcontractSignSet(req).then(() => {
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

