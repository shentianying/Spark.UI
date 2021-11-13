<template>
  <div class="container ZiJinZhiChuEdit">
    <el-card class="info-card">
      支出信息
    </el-card>
    <el-card class="form-card">
      <my-form
        ref="ruleForm"
        :form-data="zcForm"
        :rules="rules"
        :form-node="formNodeData"
        :size="size"
        @capitalTypeChange="capitalTypeChange"
      />
      <div v-show="isChengDui" class="detail-container">
        <p>承兑明细:</p>
        <el-table :size="size" header-cell-class-name="table-header" :data="cdmxData" style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            :index="utils.formatIndex"
          />
          <el-table-column prop="ticketNumber" label="票号" />
          <el-table-column prop="ticketDate" label="开票日期">
            <template slot-scope="scope">
              {{ scope.row.ticketDate | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="expiration" label="到期日期">
            <template slot-scope="scope">
              {{ scope.row.expiration | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额">
            <template slot-scope="scope">
              {{ utils.formatMoney(scope.row.amount,2,0) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </div>
      <div v-if="zcForm.state == 0" style="margin-left:100px;">
        <template v-if="zcForm.id">
          <el-button
            :size="size"
            type="primary"
            @click="submitForm('ruleForm')"
          >更新</el-button>
          <el-button
            :size="size"
            type="primary"
            @click="invalidGathering"
          >作废</el-button>
        </template>
        <el-button
          v-if="!zcForm.id"
          :size="size"
          type="primary"
          @click="submitForm('ruleForm')"
        >提交</el-button>
        <el-button
          :size="size"
          @click="cancelForm('ruleForm')"
        >取消</el-button>
      </div>
    </el-card>
    <acceptance-check-list v-model="dialogVisible" :type="zcForm.capitalType" :size="size" :origin="cdmxData" @onchange="cdCheck($event)" />
  </div>
</template>

<script>
import { GetExpendById, SaveExpend, InvalidExpend, GetExpendPaging } from '@/api/cwgl/zjgl/Expend.js'
import AcceptanceCheckList from '@/components/Other/AcceptanceCheckList' // 未支出承兑单弹窗
import MyForm from '@/components/MyForm'
import { validate } from '@/utils/validate'
export default {
  // 组件名称
  name: 'ZiJinZhiChuEdit',
  // 局部注册的组件
  components: {
    MyForm,
    AcceptanceCheckList
  },
  // 组件状态值
  data() {
    return {
      type: 'add', // 编辑:edit  新增:add
      size: 'mini', // 整体大小
      dialogVisible: false, // 控制对话框显示
      isCanUpdate: true, // 是否可编辑,备注银行除外
      zcForm: {
        id: 'new',
        expendDate: '', // 支出日期
        number: '', // 收款编号
        orgId: '', // 部门
        expendType: '', // 支出类型
        capitalType: '', // 资金类型
        date1: '', // 支出日期
        personId: '', // 经手人ID
        personName: '', // 经手人
        amount: '', // 金额
        summary: '', // 摘要
        remark: '', // 备注
        state: -1
      },
      zclxData: [], // 支出类型
      zjlxData: [], // 资金类型

      cdmxData: [], // 承兑明细列表
      // 验证规则
      rules: {
        orgId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        expendType: [{ required: true, message: '请选择支出类型', trigger: 'change' }],
        capitalType: [{ required: true, message: '请选择资金类型', trigger: 'change' }],
        expendDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
        personId: [{ required: true, message: '请选择经手人', trigger: 'change' }],
        amount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额' }
        ],
        summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }]
      }
    }
  },
  computed: {
    /**
     * 是否是承兑
     */
    isChengDui() {
      const { capitalType } = this.zcForm
      return capitalType === 2 || capitalType === 3
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      const { isCanUpdate, zclxData, isChengDui, zcForm } = this
      return [
        { label: '支出编号:', keyword: 'number', props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '部门:', keyword: 'orgId', component: 'OrgSelect', props: { dataMode: 1, collapseTags: true, showAllLevels: false, filterable: true, expandTrigger: 'hover', placeholder: '请选择部门', checkStrictly: true, disabled: !isCanUpdate }},
        { label: '支出类型:', keyword: 'expendType', component: 'Select', props: { disabled: !isCanUpdate, placeholder: '请选择', options: zclxData.map(v => { return { label: v.name, value: v.value } }) }},
        { label: '资金类型:', keyword: 'capitalType', component: 'CapitalSelect', props: { disabled: !isCanUpdate, multiple: false, showAllLevels: false }},
        { label: '支出日期:', keyword: 'expendDate', component: 'el-date-picker', props: { disabled: !isCanUpdate, type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '经手人:', keyword: 'personId', component: 'PersonSelect', props: { disabled: !isCanUpdate, multiple: false }},
        { label: '金额:', keyword: 'amount',
          render: h => (
            <el-input v-model={zcForm.amount} disabled={isChengDui || !isCanUpdate}>
              {
                isChengDui ? <el-button slot='append' style='background-color:white;' disabled={!isCanUpdate} {...{ on: { 'click': this.showCd }}}>选择承兑</el-button> : ''
              }
            </el-input>
          )
        },
        { label: '摘要:', keyword: 'summary' },
        { label: '备注:', keyword: 'remark', monopolize: true, props: { type: 'textarea' }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const newId = vm.$route.query.id
      const oldId = vm.zcForm.id
      if (newId && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.zcForm.id = newId
        vm.getZcForm()
      } else if (!newId && oldId) {
        // 说明是打开一个新建页面
        Object.assign(vm.zcForm, {
          state: 0,
          id: ''
        })
        vm.isCanUpdate = true
        vm.$refs['ruleForm']?.resetFields()
        vm.getOptions()
      }
    })
  },
  // 组件方法
  methods: {
    /**
     * @description: 获取支出数据
     */
    getZcForm() {
      GetExpendById(this.zcForm.id).then(
        res => {
          const {
            code,
            data,
            expendTypeOptions,
            capitalTypeOptions } = res
          if (code === 200) {
            data.expendDate = this.$moment(data.expendDate).format('YYYY-MM-DD')
            this.isCanUpdate = data.isCanUpdate
            for (const key in this.zcForm) {
              if (Object.hasOwnProperty.call(data, key)) {
                this.zcForm[key] = data[key]
              }
            }
            if (Array.isArray(data.acceptanceList)) {
              this.cdmxData = this.utils.easyDeepClone(data.acceptanceList)
            }
            this.zclxData = expendTypeOptions
            this.zjlxData = capitalTypeOptions
          }
        }

      )
    },
    /**
     * @description: 获取支出 资金 类型下拉
     */
    async getOptions() {
      const { expendTypOptions, capitalTypeOptions } = await GetExpendPaging({ currentPage: 1, pageSize: 1 })
      this.zclxData = expendTypOptions
      this.zjlxData = capitalTypeOptions
    },
    /**
     * @description: 提交更新
     */
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const data = {
            ...this.zcForm,
            acceptanceIDs: this.cdmxData.map(v => v.id)
          }
          if (!data.id) {
            delete data.id
          }
          delete data.acceptanceList
          const res = await SaveExpend(data)

          this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
          this.$message.success(res.message)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * @description: 作废
     */
    async invalidGathering() {
      InvalidExpend(this.zcForm.id).then((res) => {
        this.$message.success(res.message)
        this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
      }).catch(err => {
        console.log(err)
        // this.$message.error(err.errorMsg || '操作失败')
      })
    },
    cancelForm(formName) {
      // this.$router({name:""})
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    /**
     * 弹出承兑选择框
     */
    showCd() {
      this.dialogVisible = true
    },
    /**
     * 承兑票选择完成回调
     */
    cdCheck(newData) {
      const { sum } = this.utils
      this.cdmxData = newData
      // this.zcForm.acceptanceIDs = Array.from(new Set(newData.map(item => item.id)))
      this.zcForm.amount = sum(newData.map(v => v.amount)).toFixed(2)
    },
    /**
     * 选择资金形式后的回调,
     * 选择承兑时需要清空承兑明细列表和资金总额
     */
    capitalTypeChange(value) {
      this.cdmxData = []
      if (value === 2 || value === 3) {
        this.zcForm.amount = 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ZiJinZhiChuEdit{
  /deep/.table-header{
    background-color: #F7F7F7;
    font-weight: normal;
    color: #606266;;
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
.detail-container {
  margin-left: 16px;
  border-top: 1px dotted #ccc;
}
.el-select-dropdown {
  min-width: 150px !important;
}
 /deep/.props-container {
  width: 100%;
  display: flex;
  align-items: center;
}
}

</style>
