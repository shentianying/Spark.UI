<template>
  <div class="container">
    <template v-if="active === 1">
      <el-card class="info-card">
        {{ title }}
      </el-card>
      <el-card class="form-card">
        <my-form
          ref="ruleForm"
          :form-data="zjdbForm"
          :rules="rules"
          :form-node="formNodeData"
          :size="size"
        />
        <div style="margin-left:100px;">
          <el-button
            :size="size"
            type="primary"
            @click="nextStep('ruleForm')"
          >下一步</el-button>
        </div>
      </el-card>
    </template>
    <!--流程显示-->
    <template v-else-if="active===2">
      <flow-select v-if="zjdbForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="zjdbForm.billFlow" />
      <div class="botton-box">
        <el-button v-if="zjdbForm.id && zjdbForm.state === 0" :size="size" type="primary" @click="invalidForm()">作废</el-button>
        <el-button v-if="zjdbForm.state === 0" :size="size" type="primary" @click="submitForm(1)">提交</el-button>
        <el-button v-if="zjdbForm.state === 0" :size="size" type="promary" @click="submitForm(0)">保存</el-button>
        <el-button :size="size" type="promary" @click="setActive(1)">上一步</el-button>
        <el-button :size="size" type="promary" @click="back()">取消</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { GetFundAllocationById, GetBillFlow, AddFundAllocation, PutFundAllocation, DeleteFundAllocation } from '@/api/cwgl/zjgl/FundAllocation.js'
import FlowSelect from '@/components/Flow/flowSelect'
import { validate } from '@/utils/validate'
import MyForm from '@/components/MyForm'

export default {
  name: 'ZiJinDiaoBoEdit',
  components: {
    FlowSelect,
    MyForm
  },
  data() {
    return {
      size: 'mini',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      dialogParam: {
        // dialog的配置参数集合
        title: '选择承兑', // 标题
        show: false, // 是否显示
        type: 1 // 显示类型，1：承兑信息
      },
      zjdbForm: {
        id: 0,
        billFlow: null, // 流程数据
        orgId: '', // 调出部门
        orgIdIn: '', // 调入部门
        number: '', // 收款编号
        capitalType: '', // 资金形式id
        remark: '', // 备注
        amount: '', // 金额
        state: 0 // 状态 0:制单;1:审批;1000:支付;10000:完成;-1:作废
      },
      zjxsData: [], // 资金形式下拉
      cdmxData: [], // 承兑明细列表
      zjcdDate: [], // 未承兑列表
      cdParams: {
        currentPage: 1,
        pageSize: this.utils.getPersonalSettings().pageSize,
        ticketNumber: '',
        orgids: []
      },
      // 验证规则
      rules: {
        orgId: [
          { required: true, message: '请选择调入部门', trigger: 'change' }
        ],
        orgIdIn: [
          { required: true, message: '请选择调出部门', trigger: 'change' }
        ],
        capitalType: [
          { required: true, message: '请选择资金形式', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: validate.money, message: '金额格式不正确', trigger: 'blur' },
          { validator: validate.max_amount, message: '超过所能存储的最大金额' }
        ]
      }
    }
  },
  computed: {
    /**
     * 计算是否是承兑
     */
    isChengdui() {
      const { capitalType } = this.zjdbForm
      return capitalType === 2 || capitalType === 3
    },
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '资金调拨信息'
    },
    /**
     * 处理form表单的数据
     */
    formNodeData() {
      return [
        { label: '编码:', keyword: 'number', monopolize: true, props: { disabled: true, placeholder: '系统自动生成' }},
        { label: '调出部门:', keyword: 'orgId', component: 'OrgSelect', props: { dataMode: 1, collapseTags: true, showAllLevels: false, filterable: true, expandTrigger: 'hover', placeholder: '请选择调出部门', checkStrictly: true }},
        { label: '调入部门:', keyword: 'orgIdIn', component: 'OrgSelect', props: { dataMode: 1, collapseTags: true, showAllLevels: false, filterable: true, expandTrigger: 'hover', placeholder: '请选择调入部门', checkStrictly: true }},
        { label: '资金形式:', keyword: 'capitalType', component: 'CapitalSelect', props: { multiple: false, showAllLevels: false }},
        { label: '金额:', keyword: 'amount' },
        { label: '备注:', keyword: 'remark', monopolize: true, props: { type: 'textarea' }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const newId = vm.$route.query.id
      const oldId = vm.zjdbForm.id
      if (newId && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.zjdbForm.id = newId
        vm.getZjdbForm()
        vm.active = 1
      } else if (!newId && oldId) {
        // 说明是打开一个新建页面
        Object.assign(vm.$data, vm.$options.data())
        vm.$nextTick(() => {
          vm.$refs['ruleForm']?.resetFields()
        })
      }
    })
  },
  methods: {
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
          // 获取流程数据
          const { state, billFlow } = this.zjdbForm
          const req = {
            ...this.zjdbForm,
            state: state || 0
          }
          if (billFlow) req.billFlowId = billFlow.id
          delete req.billFlow
          delete req.number
          GetBillFlow(req).then(({ data, success, message }) => {
            if (success) {
              this.zjdbForm.billFlow = data.billFlow
              this.setActive(2)
            } else {
              this.$message.error(message)
            }
          })
        }
      })
    },
    /**
     * 当选择承兑以后金额变成0
     */
    capitalTypeChange() {
      if (this.isChengdui) this.zjdbForm.amount = 0
    },
    /**
     * 获取资金调拨数据
     */
    getZjdbForm() {
      GetFundAllocationById(this.zjdbForm.id).then(
        res => {
          if (res.code === 200) {
            for (const key in this.zjdbForm) {
              this.zjdbForm[key] = res.data[key]
            }
            this.zjdbForm.billFlow = res.billFlowData
            console.log(this.zjdbForm, 110)
          }
        }
      )
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return DeleteFundAllocation(this.zjdbForm.id)
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交
     */
    submitForm(state) {
      const req = {
        ...this.zjdbForm,
        state
      }
      delete req.number
      if (this.zjdbForm.billFlow) {
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
        PutFundAllocation(req).then(res => {
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        AddFundAllocation(req).then(() => {
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
</style>
