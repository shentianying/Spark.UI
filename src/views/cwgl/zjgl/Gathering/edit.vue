<template>
  <div class="container ShouKuanEdit">
    <el-card class="info-card">
      收款信息
    </el-card>
    <el-card class="form-card">
      <my-form
        ref="ruleForm"
        :form-data="skForm"
        :rules="rules"
        :form-node="formNodeData"
        :size="size"
      />
      <div
        v-show="isChendui"
        class="detail-container"
      >
        <p>承兑明细:</p>
        <el-table
          :data="skForm.acceptanceList"
          style="width: 100%"
          :size="size"
          class="cd-table"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            :index="utils.formatIndex"
            :size="size"
          />
          <el-table-column label="票号" width="120">
            <template slot-scope="scope">
              <el-form-item label-width="0" :prop="`acceptanceList.${scope.$index}.ticketNumber`" :show-message="false" class="no-show-message" :rules="rules.text">
                <el-input
                  v-model="scope.row.ticketNumber"
                  placeholder="请输入"
                  :disabled="!isCanUpdate"
                  :size="size"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="开票日期" width="150">
            <template slot-scope="scope">
              <el-form-item label-width="0" :prop="`acceptanceList.${scope.$index}.ticketDate`" :show-message="false" class="no-show-message" :rules="rules.gatheringDate">
                <el-date-picker
                  v-model="scope.row.ticketDate"
                  :disabled="!isCanUpdate"
                  :size="size"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width: 100%;"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到期日期" width="150">
            <template slot-scope="scope">
              <el-form-item label-width="0" :prop="`acceptanceList.${scope.$index}.expiration`" :show-message="false" class="no-show-message" :rules="rules.date">
                <el-date-picker
                  v-model="scope.row.expiration"
                  :disabled="!isCanUpdate"
                  :size="size"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width: 100%;"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="金额">
            <template slot-scope="scope">
              <el-form-item label-width="0" :prop="`acceptanceList.${scope.$index}.amount`" :show-message="false" class="no-show-message" :rules="rules.money">
                <el-input
                  :value="scope.row.amount"
                  placeholder="请输入"
                  :disabled="!isCanUpdate"
                  :size="size"
                  @input="scope.row.amount = $event.replace(/[^\d.]/g, '')"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="出票人">
            <template slot-scope="scope">
              <el-form-item label-width="0" :prop="`acceptanceList.${scope.$index}.drawer`" :show-message="false" class="no-show-message" :rules="rules.text">
                <el-input
                  v-model="scope.row.drawer"
                  placeholder="请输入"
                  :disabled="!isCanUpdate"
                  :size="size"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="付款人">

            <template slot-scope="scope">
              <el-form-item label-width="0" :prop="`acceptanceList.${scope.$index}.payer`" :show-message="false" class="no-show-message" :rules="rules.text">
                <el-input
                  v-model="scope.row.payer"
                  placeholder="请输入"
                  :disabled="!isCanUpdate"
                  :size="size"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="收款人">
            <template slot-scope="scope">
              <el-form-item label-width="0" :prop="`acceptanceList.${scope.$index}.payee`" :show-message="false" class="no-show-message" :rules="rules.text">
                <el-input
                  v-model="scope.row.payee"
                  placeholder="请输入"
                  :disabled="!isCanUpdate"
                  :size="size"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="付款行">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.bank"
                placeholder="请输入"
                :disabled="!isCanUpdate"
                :size="size"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入"
                :disabled="!isCanUpdate"
                :size="size"
              />
            </template>
          </el-table-column>
          <el-table-column v-if="isCanUpdate" label="操作">
            <template slot-scope="scope">
              <el-button type="text" :size="size" @click.native.prevent=" deleteRow(scope.$index, skForm.acceptanceList)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="isCanUpdate" class="btnlist">
          <div @click="addRow()">+增加</div>
          <excel-import :on-success="onSuccess">
            导入
            <el-button v-show="false" :size="size" />
          </excel-import>
          <excel-export
            style="margin-right:10px;"
            book-type="xlsx"
            filename="承兑明细模板"
            :sheet="sheet"
          >
            下载模板
            <el-button v-show="false" :size="size" />
          </excel-export>
        </div>
      </div>
      <div class="actions">
        <template v-if="skForm.id">
          <el-button
            :size="size"
            type="primary"
            @click="submitForm('ruleForm')"
          >更新</el-button>
          <el-button
            v-if="isCanUpdate"
            :size="size"
            type="primary"
            @click="invalidGathering"
          >作废</el-button>
        </template>
        <el-button
          v-if="!skForm.id"
          :size="size"
          type="primary"
          @click="submitForm('ruleForm')"
        >提交</el-button>
        <el-button :size="size" @click="goBack()">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  GetPaymentById,
  GetGatheringPaging,
  SaveGathering,
  InvalidGathering
} from '@/api/cwgl/zjgl/Gathering.js'

import { ExcelExport, ExcelImport } from 'pikaz-excel-js'
import { validateData, validate } from '@/utils/validate'
import { formatExcelDate, cleanText } from '@/utils/index'
import MyForm from '@/components/MyForm'

export default {
  name: 'ShouKuanEdit',
  // 局部注册的组件
  components: {
    ExcelImport,
    ExcelExport,
    MyForm
  },
  // 组件状态值
  data() {
    const date = (() => { // 防抖
      let timer = null
      return (rule, value, callback) => {
        const index = rule.field.split('.')[1]
        const key = rule.field.split('.')[2]
        const row = this.skForm.acceptanceList[index]
        if (new Date(row.ticketDate) > new Date(row.expiration)) {
          if (key === 'expiration') {
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
            timer = setTimeout(() => {
              this.$message.error('开票日期不能晚于到期日期')
              timer = null
            }, 200)
          }
          return callback(new Error('开票日期不能晚于到期日期'))
        }
        callback()
      }
    })()
    const money = (() => {
      let timer = null
      return (rule, value, callback) => {
        const cb = (e) => {
          if (e instanceof Error) {
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
            console.log(e.message)
            timer = setTimeout(() => {
              this.$message.error(e.message)
              timer = null
            }, 200)
            callback(e)
          } else {
            callback()
          }
        }
        validate.max_amount(rule, value, cb)
      }
    })()
    return {
      size: 'mini', // 整体大小
      type: '', // edit：编辑 add:新增
      isCanUpdate: true, // 是否可编辑,备注银行除外
      skForm: {
        id: 'add',
        gatheringDate: '',
        acceptanceList: [],
        number: '', // 收款编号
        orgId: '', // 部门
        gatheringType: '', // 收款类型
        capitalType: '', // 资金类型
        date1: '', // 收款日期
        personId: '', // 经手人ID
        personName: '', // 经手人
        amount: '', // 金额
        bank: '', // 银行
        remark: '', // 备注
        state: -1
      },
      defaultParams: {
        expandTrigger: 'hover',
        label: 'name',
        value: 'value',
        children: 'childs'
      },
      sheet: [
        {
          // title: '材料计划导入模板',
          tHeader: [
            '票号',
            '开票日期',
            '到期日期',
            '金额',
            '出票人',
            '付款人',
            '收款人',
            '付款行',
            '备注'
          ],
          table: [],
          keys: [
            'ticketNumber',
            'ticketDate',
            'expiration',
            'amount',
            'drawer',
            'payer',
            'payee',
            'bank',
            'remark'
          ],
          sheetName: '材料明细'
        }
      ],
      sklxData: [],
      zjlxData: [],
      // 验证规则
      rules: {
        text: [{ required: true, message: '请输入', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }, { validator: date, trigger: 'change' }],
        money: [{ required: true, message: '请输入金额', trigger: 'change' }, { validator: money, trigger: 'change' }],
        orgId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        gatheringType: [
          { required: true, message: '请选择收款类型', trigger: 'change' }
        ],
        capitalType: [
          { required: true, message: '请选择资金类型', trigger: 'change' }
        ],
        gatheringDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        personId: [
          { required: true, message: '请选择经手人', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额' }
        ]
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const newId = vm.$route.query.id
      const oldId = vm.skForm.id
      if (newId && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.skForm.id = newId
        vm.getskForm()
        vm.active = 1
      } else if (!newId && oldId) {
        // 说明是打开一个新建页面
        Object.assign(vm.skForm, {
          state: 0,
          acceptanceList: [],
          id: ''
        })
        vm.isCanUpdate = true
        vm.$refs['ruleForm']?.resetFields()
        vm.getOptions()
      }
    })
  },
  computed: {
    isChendui() {
      const { capitalType } = this.skForm
      return capitalType === 2 || capitalType === 3
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      const { isCanUpdate, sklxData } = this
      return [
        { label: '编码:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { dataMode: 1, collapseTags: true, showAllLevels: false, filterable: true, expandTrigger: 'hover', placeholder: '请选择部门', checkStrictly: true, disabled: !isCanUpdate }},
        { label: '收款类型:', keyword: 'gatheringType', component: 'Select', props: { disabled: !isCanUpdate, placeholder: '请选择', options: sklxData.map(v => { return { label: v.name, value: v.value } }) }},
        { label: '资金类型:', keyword: 'capitalType', component: 'CapitalSelect', props: { disabled: !isCanUpdate, multiple: false, showAllLevels: false }},
        { label: '收款日期:', keyword: 'gatheringDate', component: 'el-date-picker', props: { disabled: !isCanUpdate, type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '经手人:', keyword: 'personId', component: 'PersonSelect', props: { disabled: !isCanUpdate, multiple: false }},
        { label: '金额:', keyword: 'amount' },
        { label: '收款银行:', keyword: 'bank' },
        { label: '备注:', keyword: 'remark', monopolize: true, props: { type: 'textarea' }}
      ]
    }
  },
  watch: {
    'skForm.acceptanceList': {
      handler(val) {
        if (this.isChendui) {
          let amount = 0
          if (Array.isArray(val)) {
            val.forEach(item => {
              amount += Number(item.amount)
            })
          }
          this.skForm.amount = amount
        }
      },
      deep: true,
      immediate: true
    }
  },
  // 组件方法
  methods: {
    async invalidGathering() {
      // 作废之前弹窗确定一下
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      })
        .then(() => {
          return InvalidGathering(this.skForm.id)
        })
        .then(res => {
          this.$message.success(res.message)
          this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
        })
        .catch(err => {
          console.log(err)
          // this.$message.error(err.errorMsg || '操作失败')
        })
    },
    onSuccess(d, file) {
      var data = d[0].data
      // const postData = []
      console.log('数据为空的字段data中不会有该字段:', data)
      // if (data.length) return // 为空返回

      var errorMessage = ''
      const isEmpyt = data.every(e => {
        // 非空判断
        if (!e.付款人) {
          errorMessage += '第' + e.__rowNum__ + '行，付款人不能为空；'
        }
        if (!e.付款行) {
          errorMessage += '第' + e.__rowNum__ + '行，付款行不能为空；'
        }
        if (!e.出票人) {
          errorMessage += '第' + e.__rowNum__ + '行，出票人不能为空；'
        }
        if (!e.收款人) {
          errorMessage += '第' + e.__rowNum__ + '行，收款人不能为空；'
        }
        if (!e.金额) {
          errorMessage += '第' + e.__rowNum__ + '行，金额不能为空；'
        } else if (!validateData.money(e.金额.trim()).isSuccess) {
          errorMessage += '第' + e.__rowNum__ + '行，金额格式不正确；'
        }

        if (!e.开票日期) {
          errorMessage += '第' + e.__rowNum__ + '行，开票日期不能为空；'
        } else {
          /* const convertDate = formatExcelDate(e.开票日期.trim())
          if (!validateData.date(convertDate).isSuccess) {
            errorMessage += '第' + e.__rowNum__ + '行，开票日期格式错误；'
          } */
        }

        if (!e.到期日期) {
          errorMessage += '第' + e.__rowNum__ + '行，到期日期不能为空；'
        } else {
          /* const convertDate = formatExcelDate(e.到期日期.trim())
          if (!validateData.date(convertDate).isSuccess) {
            errorMessage += '第' + e.__rowNum__ + '行，到期日期格式错误；'
          } */
        }

        if (
          e.开票日期 &&
          e.到期日期 &&
          new Date(e.开票日期.trim()) > new Date(e.到期日期.trim())
        ) {
          errorMessage +=
            '第' + e.__rowNum__ + '行，开票日期不得晚于到期日期；'
        }
        return errorMessage.length > 0
      })
      // 表格检验
      this.loading = true
      if (isEmpyt) {
        this.$alert(`${errorMessage.replace(/；/g, '；<br />')}`, {
          dangerouslyUseHTMLString: true
        })
        this.loading = false
        return
      }

      const dateList = ['ticketDate', 'expiration'] // 时间
      for (var row of data) {
        const sheet = this.sheet[0]

        const tmpRow = {}
        sheet.keys.forEach((key, index) => {
          // 每一行
          const thName = sheet.tHeader[index] // 表头名

          tmpRow[key] = row[thName] || cleanText(index)

          if (dateList.includes(key)) {
            // 格式化时间
            console.log(tmpRow[key])
            data[key] = formatExcelDate(tmpRow[key])
          }
        })

        this.skForm.acceptanceList.push(tmpRow)
      }
    },
    // 获取资金类型、收款类型选项
    async getOptions() {
      const {
        capitalTypeOptions,
        gatheringTypeOptions
      } = await GetGatheringPaging({ currentPage: 1, pageSize: 1 })
      this.sklxData = gatheringTypeOptions
      this.zjlxData = capitalTypeOptions
    },
    // 获取收款信息数据
    getskForm() {
      GetPaymentById(this.skForm.id)
        .then(res => {
          const { code, data, gatheringTypeOptions, capitalTypeOptions } = res
          if (code === 200) {
            this.isCanUpdate = data.isCanUpdate
            for (const key in this.skForm) {
              if (Object.hasOwnProperty.call(data, key)) {
                this.skForm[key] = data[key]
              }
            }
            this.sklxData = gatheringTypeOptions
            this.zjlxData = capitalTypeOptions
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleEdit(row) {
      const backups = JSON.stringify(row)
      Object.assign(row, {
        isEdit: true,
        backups
      })
    },
    handleSubmitEdit(row) {
      delete row.isAdd
      this.$set(row, 'isEdit', false)
    },
    /**
     * @description: 列表行内编辑取消修改
     * @param {*} row
     * @param {Number} index
     * @return {*}
     */
    handleCancelEdit(row, index) {
      const backData = JSON.parse(row.backups)
      const list = this.skForm.acceptanceList
      if (row.isAdd) {
        // 此次编辑为新增,取消应删除此行
        list.splice(index, 1)
      } else {
        Object.assign(row, backData)
      }
    },
    // 提交表单
    submitForm(formName) {
      console.log(111)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const AcceptanceList = this.skForm.acceptanceList
          const capitalType = String(this.skForm.capitalType)
          const data = { ...this.skForm, AcceptanceList: [] }
          if (capitalType === '2' || capitalType === '3') {
            data.AcceptanceList = AcceptanceList
          }
          if (data.acceptanceList) {
            delete data.acceptanceList
          }
          if (!data.id) {
            delete data.id
          }
          const res = await SaveGathering(data)

          this.goBack()
          this.$message.success(res.message)
        }
      })
    },
    addRow() {
      // 这里要把字段写全,要不然,取消的时候反向覆盖没有对应字段,不好处理
      const row = {
        // isEdit: false,
        // isAdd: true,
        ticketNumber: '',
        ticketDate: '',
        expiration: '',
        amount: '',
        drawer: '',
        payer: '',
        payee: '',
        bank: '',
        remark: ''
      }
      // this.$set(row, 'backups', JSON.stringify(row))
      // row.isEdit = true
      this.skForm.acceptanceList.push(row)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    /**
     * 取消并返回上一页
     */
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.ShouKuanEdit {
  /deep/.el-form-item__label {
       font-weight: normal;
       color: #101010;
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
  .form{
    width: 100%;
     display: flex;
     justify-content: flex-start;
     flex-wrap: wrap;
     .no-show-message{
       margin: 0;
     }
    .input {
    width: 272px;
  }
  .form-item {
      width: 48%;
    }
  }

  // /deep/.el-form {
  //   width: 100%;
  //   display: flex;
  //   justify-content: flex-start;
  //   flex-wrap: wrap;
  //   .el-form-item {
  //     width: 50%;
  //   }
  //   .el-form-item__label {
  //     font-weight: normal;
  //     color: #101010;
  //   }
  //   /* .el-textarea {
  //   width: 272px;
  // } */
  //   /* .el-input__inner {
  //   width: 272px !important;
  // }

  //  */
  // }
  .detail-container {
    width: 100%;
    margin-left: 16px;
    border-top: 1px dotted #ccc;
    .cell {
      .el-button {
        width: auto;
        height: 0;
      }
    }
    /deep/ .cd-table {
      .el-table__header {
        border-right: none;
        height: 48px;
        th {
          font-size: 14px;
          font-weight: 400;
          background-color: #f7f7f7;
        }
      }
    }
    /deep/ .el-table td,
    .el-table th {
      padding: 0;
      height: 48px;
    }
    .btnlist {
      display: flex;
      justify-content: space-between;
      div {
        $height: 32px;
        flex: 1;
        height: $height;
        line-height: $height;
        text-align: center;
        margin: 16px 16px 0 16px;
        border: 1px dotted #ccc;
      }
    }
  }
  .actions {
    margin: 16px 0 0 100px;
  }
}
</style>
