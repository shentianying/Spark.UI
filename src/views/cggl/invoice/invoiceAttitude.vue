<template>
  <div class="app-container">
    <div v-if="activate" style="padding:10px 0px;">
      <!-- <h2>计划单</h2> -->
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
            <el-form-item label="编号" prop="number">
              {{ ruleForm.number }}
            </el-form-item>
            <el-form-item label="部门">
              {{ orgStr }}
            </el-form-item>

            <el-form-item label="发票类型">
              {{ invoiceTypes.find(f=>f.value === ruleForm.type).name }}
            </el-form-item>
            <el-form-item label="供应商">
              {{ ruleForm.supplier.name }}
            </el-form-item>
            <el-form-item label="发票号码">
              {{ ruleForm.invoiceNumber }}
            </el-form-item>
            <el-form-item label="开票日期">
              {{ ruleForm.invoicingDate }}
            </el-form-item>
            <el-form-item label="开票金额">
              {{ ruleForm.amount }}元
            </el-form-item>
            <el-form-item label="备注">
              {{ ruleForm.remark }}
            </el-form-item>
          </el-col>

          <el-col :sm="12" :xs="24">
            <el-form-item label="创建人">
              {{ ruleForm.createUserName }}
            </el-form-item>
            <el-form-item label="创建日期">
              {{ ruleForm.createDate }}
            </el-form-item>
            <el-form-item label="提交人">
              {{ ruleForm.submitUserName }}
            </el-form-item>
            <el-form-item label="提交日期">
              {{ ruleForm.submitDate }}
            </el-form-item>
            <el-form-item label="最后修改人">
              {{ ruleForm.lastEditUserName }}
            </el-form-item>
            <el-form-item label="最后修改日期">
              {{ ruleForm.lastEditDate }}
            </el-form-item>
            <el-form-item label="附件">
              <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 材料分类数据 -->
    已选金额：<el-input-number v-model="total" :disabled="true" size="mini" :precision="2" :controls="false" :min="0" :max="100000000" />元（以后台处理数据为准）
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="list"
      size="mini"
    >
      <el-table-column label="入库单号" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.storageIn.number }}
        </template>
      </el-table-column>
      <el-table-column label="材料名称" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.name }}
        </template>
      </el-table-column>

      <el-table-column label="品牌/产地" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.brand }}
        </template>
      </el-table-column>

      <el-table-column label="型号" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.model }}
        </template>
      </el-table-column>
      <el-table-column label="规格尺寸" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.spec }}
        </template>
      </el-table-column>

      <el-table-column label="厚度" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.thickness }}
        </template>
      </el-table-column>

      <el-table-column label="材质" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.texture }}
        </template>
      </el-table-column>
      <el-table-column label="表面处理/工艺、色号" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.material.surfaceTreatment }}
        </template>
      </el-table-column>

      <el-table-column label="主单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.unit }}
        </template>
      </el-table-column>

      <el-table-column label="主数量" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>

      <el-table-column label="辅单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.unit2 }}
        </template>
      </el-table-column>
      <el-table-column label="辅数量" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.quantity2 }}
        </template>
      </el-table-column>

      <el-table-column label="含税金额" header-align="center" align="right" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.taxInclusiveAmount.toFixed(2) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="含税金额" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.taxInclusiveAmount }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="是否开票" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.invoiceId === 0? '未开':'已开' }}
        </template>
      </el-table-column> -->

    </el-table>

    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      :show="true"
      :para="attitudePara"
      @update="updateFlow"
    >
      <template #saveBtn>
        <!--当前审批人拥有支付的操作-->
        <!-- <el-button v-if="showPayButton" size="mini" type="success">特殊操作，支付</el-button> -->
        <!--调用单据中controller操作-->
        <el-button size="mini" type="success" :loading="loading" @click="submitForm()">保存</el-button>
      </template>
      <template #otherBtn>
        <!-- <el-button size="mini" type="der">测试其他插槽</el-button> -->
      </template>
    </flow-attitude>
  </div>
</template>
<script>
import { getInvoiceById, addAttitude } from '@/api/cggl/invoice'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'CGInvoiceAttitude',
  components: {
    FlowAttitude,
    FlowDisplay,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        name: '',
        type: null,
        invoiceNumber: '', // 发票号码
        invoicingDate: null, // 开票日期
        amount: null,
        remark: '',
        fileList: []
      },
      loading: false,
      activate: false,
      list: [],
      invoiceTypes: [], // 发票类型
      total: 0,
      billFlow: null,
      attitudePara: null,
      rules: {
        // orgId: [{ required: true, message: '请输入', trigger: 'change' }],
        // planType: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.activate = true
    }
  },
  methods: {
    initData() {
      if (this.$route.query.id) {
        this.ruleForm.id = this.$route.query.id
        this.loading = true
        getInvoiceById({ id: this.ruleForm.id })
          .then(response => this.setData(response))
          .catch(() => { this.loading = false })
      }
    },
    setData(response) {
      // data 设计下单数据
      const { data, orgStr, billFlowData, invoiceTypes } = response
      this.orgStr = orgStr
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile

      this.invoiceTypes = invoiceTypes
      this.list = data.invoiceDetail.map(m => m.storageInDetail)

      this.billFlow = billFlowData

      // 加载流程组件
      this.attitudePara = { formId: billFlowData.formId, billFlowId: billFlowData.id, planId: billFlowData.billId }

      this.sumStorage()
      this.loading = false // loading 状态关闭
      this.activate = true

      // **********支付状态的话，要屏蔽子组件中的一些文本框***********
      // if (this.showPayButton) {
      //   console.log('set toContent')
      // this.toContent = false
      // }
    },
    updateFlow(state) {
      this.closeThePage()
    },
    submitForm() {
      // 保存审批步骤
      // 1.调用组件中的验证
      // 2.获取表单参数数据
      // 3.请求 审批

      const result = this.$refs.flowAttitude.checkValidate()
      if (result) {
        var postData = this.$refs.flowAttitude.getPostData()
        this.loading = true
        addAttitude(postData).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            // 如果只填写意见不转下一步 需要子组件更新流程审批信息
            // if (this.type !== 2) {
            //   this.list = attitudeList
            // }
            this.closeThePage() // 跳转
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        }).catch(() => { this.loading = false })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    sumStorage() {
      // 计算金额
      this.total = 0
      this.list.map(m => m.taxInclusiveAmount).forEach(e => {
        this.total += e
      })
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}

.task_div{
  padding-top: 30px;
}
</style>
}
