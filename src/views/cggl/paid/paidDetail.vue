<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="采购付款编号">
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="合同编号">
            <el-link :underline="false" @click="openContract(ruleForm.contractId)">{{ ruleForm.contract.number }}</el-link>
          </el-form-item>
          <el-form-item label="入库金额">
            {{ utils.formatMoney(ruleForm.storageAmount,2,0) }}
          </el-form-item>
          <el-form-item label="应付金额">
            {{ utils.formatMoney(ruleForm.dues,2,0) }}
          </el-form-item>
          <el-form-item label="已付金额">
            {{ utils.formatMoney(ruleForm.paid,2,0) }}
          </el-form-item>
          <el-form-item label="支付金额">
            {{ utils.formatMoney(ruleForm.amount,2,0) }}
          </el-form-item>
          <el-form-item label="附件">
            <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
          </el-form-item>
          <el-form-item label="创建人">
            {{ ruleForm.createUserName }}
          </el-form-item>
          <el-form-item label="提交人">
            {{ ruleForm.submitUserName }}
          </el-form-item>
          <el-form-item label="最后修改人">
            {{ ruleForm.lastEditUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="项目">
            {{ orgStr }}
          </el-form-item>
          <el-form-item label="发票金额">
            {{ utils.formatMoney(ruleForm.invoice,2,0) }}
          </el-form-item>
          <el-form-item label="支付比例">
            {{ ruleForm.payScale * 100 }}%
          </el-form-item>
          <el-form-item label="申请金额" prop="applyAmount">
            {{ utils.formatMoney(ruleForm.applyAmount,2,0) }}
          </el-form-item>
          <el-form-item label="审批金额" prop="attitudeAmount">
            {{ utils.formatMoney(ruleForm.attitudeAmount,2,0) }}
          </el-form-item>
          <el-form-item label="总支付金额">
            {{ utils.formatMoney(ruleForm.sumAmount,2,0) }}
          </el-form-item>
          <el-form-item label="资金形式">
            {{ getPayModeName(ruleForm.capitalType) }}
          </el-form-item>
          <!-- <el-form-item label=" ">
            &nbsp;
          </el-form-item> -->
          <el-form-item label="创建日期">
            {{ ruleForm.createDate }}
          </el-form-item>
          <el-form-item label="提交日期">
            {{ ruleForm.submitDate }}
          </el-form-item>
          <el-form-item label="最后修改日期">
            {{ ruleForm.lastEditDate }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <el-table
      v-loading="loading"
      :data="payModes"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
      style="margin-top:20px"
    >
      <el-table-column label="付款方式" align="center" min-width="100">
        <template slot-scope="scope">
          {{ getPayModeName(scope.row.payMode) }}
        </template>
      </el-table-column>
      <el-table-column label="申请金额" header-align="center" align="right" min-width="80">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.applyAmount,2,3) }}
        </template>
      </el-table-column>
      <el-table-column label="审批金额" header-align="center" prop="attitudeAmount" align="right" min-width="150">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.attitudeAmount,2,3) }}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" header-align="center" align="right" min-width="80">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.paid) }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table> -->
  </div>
</template>
<script>
import UpFile from '@/components/UpLoad/UpFile'
import { getCGPaidDetailById } from '@/api/cggl/paid'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
export default {
  name: 'PaidDetail',
  components: {
    UpFile
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        fileList: [],
        quotation: {},
        supplier: {},
        contract: [],
        sumAmount: 0
      },
      loading: false,
      activate: true,
      orgStr: '',
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      list: [],
      payModes: [],
      payModeOptions: [],
      keyPayMode: 0,
      billFlow: null,
      isLoad: false,
      attitudePara: {},
      loadFlow: false,
      rules: {},
      isPaid: false,
      attitudeAmount: 0,
      acceptanceList: []
    }
  },
  watch: {
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        if (this.obj && this.obj.id) {
          this.id = this.obj.id
        } else {
          this.id = this.$route.query.id
        }
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getCGPaidDetailById({ id: this.id }).then(response => this.setData(response))
      }
      getDictionarysByTypes({ types: 'CapitalType' })
        .then((response) => {
          const { data } = response
          data.forEach(element => {
            element.pid = element.pId
            this.payModeOptions.push(element)
          })
          this.keyPayMode += 1
        })
    },
    setData(response) {
      const { data, orgStr, sumAmount } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.ruleForm.sumAmount = sumAmount
      this.attitudeAmount = data.attitudeAmount
      this.orgStr = orgStr
      this.isLoad = true
      // 填充 明细列表
      this.payModes = data.cgPaidDetails
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    },
    openContract(id) {
      this.$router.push({ name: 'ContractDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    getPayModeName(type) {
      if (type !== null) {
        var entryType = this.payModeOptions.find(f => f.value === type)
        if (entryType !== undefined) {
          return entryType.name
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
