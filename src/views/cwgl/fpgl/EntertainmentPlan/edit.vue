<template>
  <div class="container EntertainmentPlanEdit">
    <!-- 招待费计划制单页 -->
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
          @bussinessInfoIdChange="getBussinessInfo"
        />
        <div class="dashLine" />
        <div class="tableBox">
          <TableEx
            ref="TableEx"
            :size="size"
            :columns="entertainmentPlantable.columns"
            :table-loading="entertainmentPlantable.tbLoading"
            :list="entertainmentPlantable.list"
            :show-count="false"
            :show-pagination="false"
          >
            <template v-slot:actions="{row}">
              <el-button :size="size" type="text" @click="handleDel(row,'del')">删除</el-button>
            </template>
          </TableEx>
        </div>
        <div class="addTableBtn">
          <el-button type="text" @click="addTable">添加</el-button>
        </div>
        <div class="dashLine" />

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
import SocialResourceSelect from '@/components/SearchBar/form/SocialResourceSelect'
import FlowSelect from '@/components/Flow/flowSelect'
import MyForm from '@/components/MyForm'
import { validate } from '@/utils/validate'
import TableEx from '@/components/TableEx'
import { GetBillFlow, PutEntertainmentPlan, AddEntertainmentPlan, GetDepositById, DeleteEntertainmentPlan } from '@/api/cwgl/EntertainmentPlan'

export default {
  name: 'EntertainmentPlanEdit',
  components: {
    MyForm,
    TableEx,
    FlowSelect
  },
  data() {
    return {
      addbtnLoad: false, // 提交按钮loading状态
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        personId: '', // 人员id
        date: '', // 日期
        bussinessInfoId: '', // 业务工程信息编号
        isBussinessFee: 0, // 是否是项目营销费用
        applicationAmount: '', // 申请金额
        entertainmentPlanDetails: [], // 招待费计划详细数据列表
        summary: '', // 用途
        remark: '', // 备注
        // fileList: [], // 附件
        state: 0, // 状态
        billFlow: null // 单据流程
      },
      firstRules: {
        orgId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        personId: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请输入事由', trigger: 'change' }
        ],
        isBussinessFee: [
          { required: true, message: '请选择是否为项目营销费用', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        applicationAmount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ]
      },
      filter: {
        isBussinessFeeList: [
          { label: '否', value: 0 },
          { label: '是', value: 1 }
        ]
      },
      bussinessInfo: { // 选择的工程信息相关
        number: ''
      },

      entertainmentPlantable: {
        columns: [
          { label: '序号',
            minWidth: '80', // 最小宽度
            format: (val, format, row, column, scoped) => `0${scoped.$index + 1}`
          },
          {
            render: (h) => {
              return (
                <el-table-column minWidth='180' align='center' label='姓名' scopedSlots={{ default: ({ row }) => {
                  if (this.firstForm.state === 0) {
                    return (<SocialResourceSelect
                      value={row.socialResourceId}
                      vModel={row.socialResourceId}
                      onSelect={
                        (val) => {
                          row.unit = val[0].company
                          row.position = val[0].position
                          row.name = val[0].name
                        }
                      }
                      onChange={
                        (val) => {
                          if (val === '') {
                            row.unit = ''
                            row.position = ''
                            row.name = ''
                          }
                        }
                      } size='mini'
                      placeholder='输入关键字搜索'/>
                    )
                  } else {
                    return row.name
                  }
                } }} />
              )
            }
          },
          {
            label: '单位',
            prop: 'unit',
            minWidth: '180'
          },
          {
            label: '职务',
            prop: 'position',
            minWidth: '180'
          },
          {
            render: (h) => {
              return (
                <el-table-column minWidth='120' align='center' label='金额' scopedSlots={{ default: ({ row }) => {
                  if (this.firstForm.state === 0) {
                    return (<el-input
                      vModel={row.applicationAmount}
                      size='mini'
                      onInput={ ($event) => {
                        row.applicationAmount = $event.replace(/[^\d.]/g, '')
                      } }
                      onBlur={this.calculateAmount}
                      placeholder='输入金额'/>
                    )
                  } else {
                    return row.applicationAmount
                  }
                } }} />
              )
            }
          },
          {
            // label: '备注',
            // prop: 'remark',
            // minWidth: '180'
            render: (h) => {
              return (
                <el-table-column minWidth='120' align='center' label='备注' scopedSlots={{ default: ({ row }) => {
                  if (this.firstForm.state === 0) {
                    return (<el-input
                      vModel={row.remark}
                      size='mini'
                      placeholder='输入备注'/>
                    )
                  } else {
                    return row.remark
                  }
                } }} />
              )
            }
          }
        ],
        list: [
          {
            id: 1,
            entertainmentPlanId: '', // 详情id
            socialResourceId: '', // 社会资源id
            name: '', // 姓名
            position: '', // 职务
            unit: '', // 单位
            applicationAmount: '', // 申请金额
            amount: '', // 批准金额
            remark: '' // 备注
          }
        ],
        tbLoading: false
      }
    }
  },
  computed: {

    disabled() {
      return false
    },
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '招待费计划'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        firstForm,
        filter: { isBussinessFeeList },
        bussinessInfo
      } = this
      return [
        { label: '编号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { placeholder: selectPlaceholder }},
        { label: '姓名:', keyword: 'personId', component: 'PersonSelect', props: { propsLabel: 'name', multiple: false, placeholder: selectPlaceholder }},
        { label: '日期:', keyword: 'date', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '项目营销费用:', keyword: 'isBussinessFee', component: 'Select', props: { placeholder: selectPlaceholder, options: isBussinessFeeList }},
        { label: '金额:', keyword: 'applicationAmount', props: { disabled: true, placeholder: inputPlaceholder }},
        { label: '业务信息工程:', if: (firstForm.isBussinessFee === 1), keyword: 'bussinessInfoId', component: 'BussinessInfoSelect', props: { placeholder: selectPlaceholder }},
        { label: '业务信息编号:', if: (firstForm.isBussinessFee === 1), value: bussinessInfo.number, props: { disabled: true, placeholder: '自动带出' }},
        { label: '事由:', keyword: 'summary', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
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
    getBussinessInfo(row) {
      this.bussinessInfo = row
    },
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.$nextTick(() => {
        this.$refs.firstForm.clearValidate()
        this.$data.entertainmentPlantable.list = [{
          id: 1,
          entertainmentPlanId: '', // 详情id
          socialResourceId: '', // 社会资源id
          name: '', // 姓名
          position: '', // 职务
          unit: '', // 单位
          applicationAmount: '', // 申请金额
          amount: '', // 批准金额
          remark: '' // 备注
        }]
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetDepositById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        form.isBussinessFee = Number(form.isBussinessFee)
        this.user = res.data.person
        this.bussinessInfo = res.data.bussinessInfo || { number: '' }
        this.entertainmentPlantable.list = res.data.entertainmentPlanDetails
        form.billFlow = res.billFlowData
        form.fileList = res.data.upFile
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
    getBillFlow() {
      // 组装招待费计划信息
      let flage = true
      this.entertainmentPlantable.list.forEach(e => {
        if (e.applicationAmount === '' || e.socialResourceId === '') { flage = false }
        delete e.id
        delete e.entertainmentPlanId
      })
      if (!flage) {
        this.$message('请将申请信息填写完整!')
        return false
      }
      this.firstForm.entertainmentPlanDetails = [...this.entertainmentPlantable.list]
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
      if (active === 1) {
        this.entertainmentPlantable.list.forEach((e, i) => {
          e.id = i
        })
      }
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
      if (req.isBussinessFee === 0) req.bussinessInfoId = null
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
        PutEntertainmentPlan(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        this.addbtnLoad = true
        AddEntertainmentPlan(req).then(() => {
          // 添加
          this.$message.success('提交成功')
          this.back()
        }).catch(() => {
          this.addbtnLoad = false
        }).finally(() => {
          this.addbtnLoad = false
        })
      }
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteEntertainmentPlan({ id: this.firstForm.id })
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
    },
    /**
     * 添加招待费计划列表
     */
    addTable() {
      // 最后一条数据不能删掉 所以新增的一条数据的id 只能取list的最后一条数据的id+1; 直接取list.length会有问题
      const length = this.entertainmentPlantable.list.length - 1
      const id = this.entertainmentPlantable.list[length].id + 1
      this.entertainmentPlantable.list.push({
        id: id,
        socialResourceId: '', // 社会资源id
        name: '', // 姓名
        position: '', // 职务
        unit: '', // 单位
        applicationAmount: '', // 申请金额
        amount: '', // 批准金额
        remark: '' // 备注
      })
    },
    /**
     * 删除招待费计划信息
     */
    handleDel(row) {
      // 删除选中的招待费计划信息
      if (this.entertainmentPlantable.list.length > 1) {
        this.entertainmentPlantable.list = this.entertainmentPlantable.list.filter(e => {
          if (e.id === row.id && e.applicationAmount !== '') {
            this.firstForm.applicationAmount = Number(this.firstForm.applicationAmount) - Number(e.applicationAmount)
          }
          return e.id !== row.id
        })
      }
    },
    /**
     * 当金额输入框失去焦点后计算申请金额
     */
    calculateAmount() {
      let allAmout = 0
      this.entertainmentPlantable.list.forEach(el => {
        allAmout += +el.applicationAmount
      })
      this.firstForm.applicationAmount = allAmout
    }
  }
}
</script>

<style lang="scss" scoped>
.EntertainmentPlanEdit{
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
  .addTableBtn {
    width: 100%;
    border: 1px dashed #cecece;
    margin: 20px 0;
    text-align: center;
    border-radius: 4px;
    .el-button {
      width: 100%;
      color: #000;
     }
  }
  .actions{
    margin-left: 100px;
    margin-top: 20px;
  }
  /deep/.table-header {
    background-color: #f7f7f7;
    color:#333;
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
  .dashLine {
    height: 1px;
    border-top: 1px dashed #cecece;
    // margin-bottom: 20px;
  }
  .tableBox {
    margin-top: 20px;
  }
}
</style>
