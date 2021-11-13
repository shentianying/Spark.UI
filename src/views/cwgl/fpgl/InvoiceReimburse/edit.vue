<template>
  <div class="container InvoiceReimburseEdit">
    <!-- 发票报销编辑页 -->
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
          @orgIdChange="getAccount"
          @bussinessInfoIdChange="getBussinessInfo"
          @invoiceCategoryChange="filterSelect"
          @personIdSelect="selectPerson"
          @reimburseTypeChange="setIsBussinessFee"
        />
        <div class="dashLine" />
        <div class="tableBox">
          <TableEx
            ref="TableEx"
            :size="size"
            :columns="invoiceReimburseTable.columns"
            :table-loading="invoiceReimburseTable.tbLoading"
            :list="invoiceReimburseTable.list"
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
import Select from '@/components/SearchBar/form/Select'
import FlowSelect from '@/components/Flow/flowSelect'

import MyForm from '@/components/MyForm'
import TableEx from '@/components/TableEx'
import { hasPower, formatMoney } from '@/utils'

import { validate } from '@/utils/validate'

import { getAccountSetByOrgId } from '@/api/xtgl/accountSet'
import { InitInvoiceReimburse, GetBillFlow, AddInvoiceReimburse, PutInvoiceReimburse, DeleteInvoiceReimburse, GetInvoiceReimburseById } from '@/api/cwgl/InvoiceReimburse'
export default {
  name: 'InvoiceReimburseEdit',
  components: {
    FlowSelect,
    MyForm,
    TableEx
  },
  data() {
    return {
      reimburseTypeDisable: false, //  报销类型选择工人发票时, 项目营销费用选中 否 并且禁止修改
      addbtnLoad: false, // 提交按钮loading状态
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      tableSelect: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        number: '', // 新增时,编号后端生成
        orgId: '', // 部门id
        accountId: '', // 账套id
        personId: '', // 人员id
        reimburseType: 1, // 报销类型
        invoiceType: 1, // 发票类型 默认电子发票
        invoiceDate: '', // 发票日期
        invoiceCategory: 318, // 发票类别 默认招待费 : id318
        costPlanId: '', // 费用计划id
        entertainmentPlanId: '', // 招待费计划id
        isNonCash: 0, // 是否现报销

        personNumber: '', // 工号
        personName: '', // 姓名
        bussinessInfoId: '', // 业务工程信息编号
        isBussinessFee: 1, // 是否是项目营销费用
        applicationAmount: '', // 申请金额
        // entertainmentPlanDetails: [], // 招待费计划详细数据列表
        summary: '', // 用途
        remark: '', // 备注
        fileList: [], // 附件
        invoiceFileList: [], // 发票附件
        invoiceReimburseDetails: [], // 发票明细
        state: 0, // 状态
        billFlow: null // 单据流程
      },
      firstRules: {
        reimburseType: [
          { required: true, message: '请选择报销类型', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        accountId: [
          { required: true, message: '请选择账套信息', trigger: 'change' }
        ],
        invoiceType: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        invoiceDate: [
          { required: true, message: '请选择发票日期', trigger: 'change' }
        ],
        invoiceCategory: [
          { required: true, message: '请选择发票类别', trigger: 'change' }
        ],
        personId: [
          { required: true, message: '请选择工号', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请填写事由', trigger: 'change' }
        ],
        applicationAmount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额', trigger: 'change' }
        ],
        bussinessInfoId: [
          { required: true, message: '请选择业务工程信息', trigger: 'change' }
        ]
      },
      filter: {
        isBussinessFeeList: [
          { label: '否', value: 0 },
          { label: '是', value: 1 }
        ],
        isNonCashList: [
          { label: '否', value: 0 },
          { label: '是', value: 1 }
        ],
        allInvoiceCategoryList: [],
        invoiceCategoryList: [], // 发票类别列表
        invoiceTypeList: [], // 发票类型列表
        reimburseTypeList: [], // 发票报销类型
        accountList: [],
        taxList: [], // 税率的列表
        secondList: [] // 表格二级选项
      },
      // 发票表格
      invoiceReimburseTable: {
        columns: [
          {
            label: '序号', // 表头
            minWidth: '50', // 最小宽度
            format: (val, format, row, column, scoped) => `0${scoped.$index + 1}`
          },
          {
            render: (h) => {
              return (
                <el-table-column
                  class='TableExColumn'
                  label='发票类别'
                  min-width='100'
                  show-overflow-tooltip={true}
                  scopedSlots={ {
                    default: (scoped) => {
                      const { filter: { secondList }, size, tableSelect } = this
                      if (this.firstForm.state === 0) {
                        return (<el-cascader
                          props={{
                            props: { value: 'id', label: 'name', emitPath: false },
                            size: size,
                            clearable: true,
                            showAllLevels: false,
                            collapseTags: true,
                            options: secondList || [],
                            placeholder: tableSelect
                          }}
                          vModel={scoped.row.invoiceCategory}
                          onChange={(val) => {
                            if (secondList[0].children) {
                              const newList = secondList[0].children.filter(e => e.id === val)
                              if (newList.length === 0) {
                                scoped.row.invoiceCategoryName = ''
                              } else {
                                scoped.row.invoiceCategoryName = newList[0]?.name
                              }
                            } else {
                              scoped.row.invoiceCategoryName = secondList[0]?.name
                            }
                          }}
                        />)
                      } else {
                        return scoped.row.invoiceCategoryName
                      }
                    }
                  }}
                />
              )
            }
          },
          {
            // label: '发票代码', // 表头
            // minWidth: '100', // 最小宽度
            // prop: 'invoiceCode'
            render: (h) => {
              return (
                <el-table-column
                  class='TableExColumn'
                  label='发票代码'
                  min-width='100'
                  show-overflow-tooltip={true}
                  scopedSlots={{
                    default: ({ row }) => {
                      const { size } = this
                      if (this.firstForm.state === 0) {
                        return (
                          <el-input
                            vModel={row.invoiceCode}
                            size={size}
                            onInput={ ($event) => {
                              row.invoiceCode = $event.replace(/[^\d.]/g, '')
                            } }
                            placeholder='发票代号'/>
                        )
                      } else {
                        return row.invoiceCode
                      }
                    }
                  }}
                />

              )
            }
          },
          {
            // label: '票号', // 表头
            // minWidth: '50', // 最小宽度
            // prop: 'invoiceNum'
            render: (h) => {
              return (
                <el-table-column
                  class='TableExColumn'
                  label='票号'
                  min-width='100'
                  show-overflow-tooltip={true}
                  scopedSlots={{
                    default: ({ row }) => {
                      const { size } = this
                      if (this.firstForm.state === 0) {
                        return (
                          <el-input
                            vModel={row.invoiceNum}
                            size={size}
                            onInput={ ($event) => {
                              row.invoiceNum = $event.replace(/[^\d.]/g, '')
                            } }
                            placeholder='票号'/>
                        )
                      } else {
                        return row.invoiceNum
                      }
                    }
                  }}
                />

              )
            }
          },
          {
            // label: '金额(含税)', // 表头
            // minWidth: '120', // 最小宽度
            // prop: 'applicationAmount'
            render: (h) => {
              return (
                <el-table-column
                  class='TableExColumn'
                  label='申请金额(含税)'
                  min-width='100'
                  show-overflow-tooltip={true}
                  scopedSlots={{
                    default: ({ row }) => {
                      const { size } = this
                      if (this.firstForm.state === 0) {
                        return (
                          <el-input
                            vModel={row.applicationAmount}
                            size={size}
                            onInput={ ($event) => {
                              row.applicationAmount = $event.replace(/[^\d.]/g, '')
                            } }
                            onBlur={() => this.calculateAmount(row)}
                            placeholder='金额'/>
                        )
                      } else {
                        return formatMoney(row.applicationAmount, 2, 0)
                      }
                    }
                  }}
                />

              )
            }
          },
          {
            // label: '税率', // 表头
            // minWidth: '50', // 最小宽度
            // prop: 'tax'
            render: (h) => {
              return (
                <el-table-column
                  class='TableExColumn'
                  label='税率'
                  min-width='100'
                  show-overflow-tooltip={true}
                  scopedSlots={{
                    default: ({ row }) => {
                      const { size, filter: { taxList }} = this
                      if (this.firstForm.state === 0) {
                        return (
                          <Select
                            value={row.tax}
                            vModel={row.tax}
                            options={taxList}
                            onChange={
                              (val) => {
                                if (row.applicationAmount) {
                                  row.taxAmount = +row.applicationAmount * val
                                  row.excludeTaxAmount = row.applicationAmount - row.taxAmount
                                } else {
                                  row.tax = ''
                                  this.$message('请先输入金额')
                                  return
                                }
                              }
                            } size={size}
                          />
                        )
                      } else {
                        return row.tax
                      }
                    }
                  }}
                />

              )
            }
          },
          {
            align: 'right',
            label: '税额', // 表头
            minWidth: '80', // 最小宽度
            format: 'money',
            prop: 'taxAmount'
          },
          {
            align: 'right',
            label: '金额(不含税)', // 表头
            minWidth: '120', // 最小宽度
            format: 'money',
            prop: 'excludeTaxAmount'
          },
          {
            // label: '备注', // 表头
            // minWidth: '50', // 最小宽度
            // prop: 'remark'
            render: (h) => {
              return (
                <el-table-column
                  class='TableExColumn'
                  label='备注'
                  min-width='100'
                  show-overflow-tooltip={true}
                  scopedSlots={{
                    default: ({ row }) => {
                      const { size } = this
                      if (this.firstForm.state === 0) {
                        return (
                          <el-input
                            vModel={row.remark}
                            size={size}
                            placeholder='备注'/>
                        )
                      } else {
                        return row.remark
                      }
                    }
                  }}
                />

              )
            }
          }
        ],
        list: [
          {
            id: 0,
            invoiceReimburseId: 0,
            invoiceCategory: 0,
            invoiceCategoryName: '', // 发票类别名称
            invoiceCode: '',
            invoiceNum: '', // 票号
            applicationAmount: '',
            tax: '',
            taxAmount: '',
            excludeTaxAmount: '',
            remark: ''
          }
        ]
      },
      bussinessInfo: { // 选择的工程信息相关
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
      return active === 2 ? '审批流程' : '发票报销'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        reimburseTypeDisable,
        firstForm,
        filter: {
          isBussinessFeeList,
          reimburseTypeList,
          accountList,
          invoiceTypeList,
          invoiceCategoryList,
          isNonCashList
        },
        disabled,
        bussinessInfo
      } = this
      return [
        { label: '报销类型:', keyword: 'reimburseType', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: reimburseTypeList }},
        { label: '编号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { placeholder: selectPlaceholder }},
        { label: '账套:', keyword: 'accountId', component: 'Select', props: { propsValue: 'id', propsLabel: 'name', placeholder: selectPlaceholder, options: accountList }},
        { label: '发票类型:', keyword: 'invoiceType', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: invoiceTypeList }},
        { label: '发票日期:', keyword: 'invoiceDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '发票类别:', keyword: 'invoiceCategory', component: 'Select', props: { propsLabel: 'name', propsValue: 'id', placeholder: selectPlaceholder, options: invoiceCategoryList }},
        { label: '招待费计划号:', if: (firstForm.invoiceCategory === 318), keyword: 'entertainmentPlanId', component: 'EntertainmentPlanSelect', props: { propsLabel: 'number', placeholder: selectPlaceholder }},
        { label: '费用计划号:', if: (firstForm.invoiceCategory !== 318), keyword: 'costPlanId', component: 'CostPlanSelect', props: { propsLabel: 'number', placeholder: selectPlaceholder }},
        { label: '非现报销:', monopolize: true, if: hasPower('INVOICEREIMBURSEEDIT'), keyword: 'isNonCash', component: 'Select', props: { placeholder: selectPlaceholder, options: isNonCashList }},
        { label: '工号:', keyword: 'personId', component: 'PersonSelect', props: { propsLabel: 'number', multiple: false, placeholder: selectPlaceholder }},
        { label: '姓名:', keyword: 'personName', props: { disabled: true, placeholder: '自动带出' }},
        { label: '项目营销费用:', keyword: 'isBussinessFee', component: 'Select', props: { disabled: reimburseTypeDisable, placeholder: selectPlaceholder, options: isBussinessFeeList }},
        { label: '金额:', keyword: 'applicationAmount', props: { disabled: true, placeholder: '自动计算' }},
        { label: '业务信息工程:', if: (firstForm.isBussinessFee === 1), keyword: 'bussinessInfoId', component: 'BussinessInfoSelect', props: { placeholder: selectPlaceholder }},
        { label: '业务信息编号:', if: (firstForm.isBussinessFee === 1), value: bussinessInfo.number, props: { disabled: true, placeholder: '自动带出' }},
        { label: '事由:', keyword: 'summary', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '发票附件:', keyword: 'invoiceFileList', component: 'UpFile', props: { isUpfile: !disabled, isDelete: !disabled, fileSize: 100, isPreview: true }},
        { label: '其他附件:', keyword: 'fileList', component: 'UpFile', props: { isUpfile: !disabled, isDelete: !disabled, fileSize: 100, isPreview: true }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const newId = vm.$route.query.id
      const oldId = vm.firstForm.id
      const type = vm.$route.query.type
      vm.InitInvoiceReimburseSelect()
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
        form.personName = name
        form.personNumber = userName
        form.personId = uid
        if (type === 'add' && oldId) {
          vm.initForm()
          vm.active = 1
        }
      }
    })
  },
  methods: {
    // 根据部门id获取账套信息
    getAccount(id) {
      getAccountSetByOrgId({ orgId: id }).then(res => {
        this.filter.accountList = res.data
        if (this.filter.accountList.length === 1) {
          this.firstForm.accountId ? '' : this.firstForm.accountId = this.filter.accountList[0].id
        }
      })
    },
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.$nextTick(() => {
        this.$refs.firstForm.clearValidate()
        this.$data.invoiceReimburseTable.list = [{
          id: 0,
          invoiceReimburseId: 0,
          invoiceCategory: 0,
          invoiceCategoryName: '', // 发票类别名称
          invoiceCode: '',
          invoiceNum: '', // 票号
          applicationAmount: '',
          tax: '',
          taxAmount: '',
          excludeTaxAmount: '',
          remark: ''
        }]
      })
    },
    // 获取人员工号信息
    selectPerson(user) {
      this.firstForm.personNumber = user.number
      this.firstForm.personName = user.name
    },
    // 获取业务信息编号
    getBussinessInfo(row) {
      this.bussinessInfo = row
    },
    // 报销类型选择工人发票时, 项目营销费用固定选中否 并且禁止修改
    setIsBussinessFee(val) {
      if (val === 2) {
        this.reimburseTypeDisable = true
        this.firstForm.isBussinessFee = 0
      } else {
        this.reimburseTypeDisable = false
        this.firstForm.isBussinessFee = 1
      }
    },
    /*
      初始化选择框数据
    */
    InitInvoiceReimburseSelect() {
      InitInvoiceReimburse().then(res => {
        this.filter.reimburseTypeList = res.reimburseTypeList // 报销类型
        this.filter.invoiceTypeList = res.invoiceTypeList // 发票类型
        this.filter.invoiceCategoryList = res.invoiceCategoryList.filter((e) => e.pId === 0) // 发票类别
        const tmp = res.invoiceCategoryList.map(item => {
          return { ...item, pid: item.pId }
        })
        this.filter.allInvoiceCategoryList = this.utils.getTree(0, tmp)
        res.taxList.forEach(e => {
          e.label = e.name
        })
        this.filter.taxList = res.taxList
        // 默认的业务招待费筛选二级选项
        this.filterSelect(this.firstForm.invoiceCategory)
      })
    },
    // 通过发票类别筛选表格的发票类别选项
    filterSelect(val) {
      if (val === 318) {
        this.firstForm.isBussinessFee = 1
      } else {
        this.firstForm.isBussinessFee = 0
      }
      this.filter.secondList = this.filter.allInvoiceCategoryList.filter(e => e.id === val)
      let labelName = ''
      if (!this.filter.secondList[0].children) {
        labelName = this.filter.secondList[0].name
      }
      this.tableSelect = this.filter.secondList[0].name
      this.$nextTick(() => {
        this.invoiceReimburseTable.list = this.invoiceReimburseTable.list.map(item => {
          return { ...item, invoiceCategory: val, invoiceCategoryName: labelName }
        })
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetInvoiceReimburseById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        form.isBussinessFee = Number(form.isBussinessFee)
        form.isNonCash = Number(form.isNonCash)
        this.bussinessInfo = res.data.bussinessInfo ? res.data.bussinessInfo : { number: '' }
        this.invoiceReimburseTable.list = res.data.invoiceReimburseDetails
        this.filter.secondList = this.filter.allInvoiceCategoryList.filter(e => e.id === res.data.invoiceCategory)
        form.billFlow = res.billFlowData
        form.fileList = res.data.upFile
        form.invoiceFileList = res.data.invoiceUpFile
        this.getAccount(form.orgId)
      })
    },
    /*
     *下一步
     */
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 组装招待费计划信息
          // 设置flag 只要有一项没填 就设置为false
          let flage = true
          let messageType = 1
          this.invoiceReimburseTable.list.forEach(e => {
            if (e.invoiceCategoryName === '' || e.applicationAmount === '' || e.invoiceNum === '' || e.invoiceCode === '' || e.tax === '') {
              flage = false
              messageType = 1
            }
            delete e.id
          })
          // 判断是票号和发票代码是否都重复
          if (!this.formatCope(this.invoiceReimburseTable.list, 'invoiceCode') && !this.formatCope(this.invoiceReimburseTable.list, 'invoiceNum')) {
            flage = false
            messageType = 2
          }
          if (!flage) {
            messageType === 1 ? this.$message('请将申请信息填写完整!') : this.$message('发票代码和票号不能都重复!')
            return false
          }
          this.getBillFlow()
        }
      })
    },
    getBillFlow() {
      // 组装招待费计划信息
      this.firstForm.invoiceReimburseDetails = [...this.invoiceReimburseTable.list]
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
        this.invoiceReimburseTable.list.forEach((e, i) => {
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
        PutInvoiceReimburse(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        this.addbtnLoad = true
        AddInvoiceReimburse(req).then(() => {
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
        return DeleteInvoiceReimburse({ id: this.firstForm.id })
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
    // 添加table数据
    addTable() {
      // 最后一条数据不能删掉 所以新增的一条数据的id 只能取list的最后一条数据的id+1; 直接取list.length会有问题
      const length = this.invoiceReimburseTable.list.length - 1
      const id = this.invoiceReimburseTable.list[length].id + 1
      this.invoiceReimburseTable.list.push({
        id: id,
        invoiceReimburseId: 0,
        invoiceCategory: 0,
        invoiceCategoryName: '', // 发票类别名称
        invoiceCode: '',
        invoiceNum: '', // 票号
        applicationAmount: '',
        tax: '',
        taxAmount: '',
        excludeTaxAmount: '',
        remark: ''
      })
    },
    // 删除table数据
    handleDel(row) {
      if (this.invoiceReimburseTable.list.length > 1) {
        this.invoiceReimburseTable.list = this.invoiceReimburseTable.list.filter(e => {
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
    calculateAmount(row) {
      let allAmout = null
      this.invoiceReimburseTable.list.forEach(el => {
        allAmout += +el.applicationAmount
      })
      allAmout === 0 ? this.firstForm.applicationAmount = '' : this.firstForm.applicationAmount = allAmout
      if (this.firstForm.applicationAmount !== '' && row.tax !== '') {
        row.taxAmount = +row.applicationAmount * row.tax
        row.excludeTaxAmount = +row.applicationAmount - row.taxAmount
      } else {
        row.tax = ''
        row.taxAmount = ''
        row.excludeTaxAmount = ''
      }
    },
    /* 判断数组中的某一项是否重复 */
    formatCope(list, keyword) {
      const keywordList = list.map(e => e[keyword])
      const newLst = [...new Set(keywordList)]
      if (keywordList.length === newLst.length) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
