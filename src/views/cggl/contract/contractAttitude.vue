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
          <el-form-item label="合同编号">
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="报价单">
            <el-link :underline="false" @click="openQuotation(ruleForm.quotation.id)">{{ ruleForm.quotation.number }}</el-link>
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-link :underline="false" @click="openSupplier(ruleForm.supplier.id)">{{ ruleForm.supplier.name }}</el-link>
          </el-form-item>
          <el-form-item label="违约责任">
            {{ ruleForm.breachDuty }}
          </el-form-item>
          <el-form-item label="其他说明事项">
            {{ ruleForm.explain }}
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
          <el-form-item label="日期">
            {{ ruleForm.contractDate | dateFormat }}
          </el-form-item>
          <el-form-item label="供货方式">
            {{ ruleForm.howSupply }}
          </el-form-item>
          <el-form-item label="附件">
            <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
          </el-form-item>
          <el-form-item label=" ">
            &nbsp;
          </el-form-item>
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

    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :cell-style="cellStyle"
      size="mini"
    >
      <el-table-column label="材料名称" fixed="left" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.name }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.brand" label="品牌/产地" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.material.brand }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.model" label="型号" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.material.model }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.spec" label="规格/尺寸" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.material.spec }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.thickness" label="厚度" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.material.thickness }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.texture" label="材质" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.material.texture }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.surfaceTreatment" label="表面处理/工艺、色号" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.material.surfaceTreatment }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.designNumber" label="设计编号" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.material.designNumber }}
        </template>
      </el-table-column>
      <el-table-column label="主单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.unit }}
        </template>
      </el-table-column>
      <el-table-column label="主数量" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.unit2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.quantity2 }}
        </template>
      </el-table-column>
      <el-table-column label="含税单价" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.taxInclusivePrice }}
        </template>
      </el-table-column>
      <el-table-column label="税率" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.taxRate }}
        </template>
      </el-table-column>
      <el-table-column label="不含税单价" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.taxExclusivePrice }}
        </template>
      </el-table-column>
      <el-table-column label="含税金额" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.taxInclusiveAmount }}
        </template>
      </el-table-column>
      <el-table-column label="税额" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.tax }}
        </template>
      </el-table-column>
      <el-table-column label="不含税金额" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.taxExclusiveAmount }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
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
          {{ scope.row.requirement }}
        </template>
      </el-table-column>
      <el-table-column label="天数" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.days }}
        </template>
      </el-table-column>
      <el-table-column label="支付比例" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.scale * 100 }}%
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>

    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
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

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :file-list="fileList" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getContractById, addAttitude } from '@/api/cggl/contract'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import QuotationSuppliersCheck from '@/views/cggl/quotation/quotationSuppliersCheck'
export default {
  name: 'ContractAttitude',
  components: {
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    QuotationSuppliersCheck
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        fileList: [],
        quotation: {},
        supplier: {}
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
      billFlow: null,
      isLoad: false,
      attitudePara: {},
      loadFlow: false,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true },
      rules: {}
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
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getContractById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data, orgStr, billFlowData } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.orgStr = orgStr
      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true
      // 填充 明细列表
      this.list = data.contractDetails
      this.payModes = data.contractPayModes
      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    },
    setColumnShow() { // 设置列的显示。列中，都没有值，就隐藏
      var modelunit2 = false
      var modelbrand = false
      var modelmodel = false
      var modelspec = false
      var modelthickness = false
      var modeltexture = false
      var modelsurfaceTreatment = false
      var modeldesignNumber = false
      for (var row of this.list) {
        if (row.material.unit2) { modelunit2 = true }
        if (row.material.brand) { modelbrand = true }
        if (row.material.model) { modelmodel = true }
        if (row.material.spec) { modelspec = true }
        if (row.material.thickness) { modelthickness = true }
        if (row.material.texture) { modeltexture = true }
        if (row.material.surfaceTreatment) { modelsurfaceTreatment = true }
        if (row.material.designNumber) { modeldesignNumber = true }
      }
      this.columnShow['unit2'] = modelunit2
      this.columnShow['brand'] = modelbrand
      this.columnShow['model'] = modelmodel
      this.columnShow['spec'] = modelspec
      this.columnShow['thickness'] = modelthickness
      this.columnShow['texture'] = modeltexture
      this.columnShow['surfaceTreatment'] = modelsurfaceTreatment
      this.columnShow['designNumber'] = modeldesignNumber
    },
    openQuotation(id) {
      this.$router.push({ name: 'QuotationAttitude', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    openSupplier(id) {
      this.$router.push({ name: 'SupplierDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label === '含税单价' || column.label === '税率' || column.label === '不含税单价' ||
        column.label === '含税金额' || column.label === '税额' || column.label === '不含税金额') {
        row.taxInclusivePrice = (Math.round(row.taxInclusivePrice * 100) / 100).toFixed(2)
        row.taxRate = (Math.round(row.taxRate * 100) / 100).toFixed(2)
        row.taxExclusivePrice = (Math.round(row.taxExclusivePrice * 100) / 100).toFixed(2)
        row.taxInclusiveAmount = (Math.round(row.taxInclusiveAmount * 100) / 100).toFixed(2)
        row.tax = (Math.round(row.tax * 100) / 100).toFixed(2)
        row.taxExclusiveAmount = (Math.round(row.taxExclusiveAmount * 100) / 100).toFixed(2)
        return 'text-align: right;padding: 0px;line-height: 4px;'
      } else {
        return 'text-align: center;padding: 0px;line-height: 4px;'
      }
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
            this.$message.success('保存成功')
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
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
