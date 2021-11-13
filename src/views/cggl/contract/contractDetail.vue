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
          {{ scope.row.storageQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="入库数量" align="center" width="200">
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
    <el-collapse v-model="activeNames">
      <el-collapse-item title="" name="1">
        <template slot="title">
          <i class="el-icon-s-comment" />付款方式
        </template>
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
          <el-table-column label="付款方式" align="center" min-width="150">
            <template slot-scope="scope">
              {{ scope.row.requirement }}
            </template>
          </el-table-column>
          <el-table-column label="天数" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.days }}
            </template>
          </el-table-column>
          <el-table-column label="支付比例" align="center" min-width="80">
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
      </el-collapse-item>
      <el-collapse-item title="" name="2">
        <template slot="title">
          <i class="el-icon-s-comment" />入库明细
        </template>
        <el-table
          v-loading="loading"
          :data="storageIns"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
          style="margin-top:20px"
        >
          <el-table-column label="入库单号" align="center" min-width="150">
            <template slot-scope="scope">
              <el-link :underline="false" size="mini" style="font-size: 12px;" @click="openStorageIn(scope.row)">{{ scope.row.number }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="入库时间" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.entryDate | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="入库金额" header-align="center" align="right" min-width="80">
            <template slot-scope="scope">
              ￥{{ scope.row.amount.toFixed(4) }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="" name="3">
        <template slot="title">
          <i class="el-icon-s-comment" />发票明细
        </template>
        <el-table
          v-loading="loading"
          :data="invoices"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
          style="margin-top:20px"
        >
          <el-table-column label="编号" align="center" min-width="150">
            <template slot-scope="scope">
              <el-link :underline="false" size="mini" style="font-size: 12px;" @click="openInvoice(scope.row)">{{ scope.row.number }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发票类型" align="center" min-width="80">
            <template slot-scope="scope">
              {{ getReceiptType(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="发票名称" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="发票号码" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.invoiceNumber }}
            </template>
          </el-table-column>
          <el-table-column label="开票日期" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.invoicingDate | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="开票金额" header-align="center" align="right" min-width="80">
            <template slot-scope="scope">
              ￥{{ scope.row.amount.toFixed(4) }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="" name="4">
        <template slot="title">
          <i class="el-icon-s-comment" />付款明细
        </template>
        <el-table
          v-loading="loading"
          :data="cgPaids"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
          style="margin-top:20px"
        >
          <el-table-column label="采购付款编号" align="center" min-width="150">
            <template slot-scope="scope">
              <el-link :underline="false" size="mini" style="font-size: 12px;" @click="openPaidDetail(scope.row)">{{ scope.row.number }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="申请金额" header-align="center" align="right" min-width="80">
            <template slot-scope="scope">
              ￥{{ scope.row.applyAmount.toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column label="审批金额" header-align="center" align="right" min-width="80">
            <template slot-scope="scope">
              ￥{{ scope.row.attitudeAmount.toFixed(4) }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getContractDetailById } from '@/api/cggl/contract'
import UpFile from '@/components/UpLoad/UpFile'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import PaidAttitude from '@/views/cggl/paid/paidAttitude.vue'
export default {
  name: 'ContractDetail',
  components: {
    UpFile,
    PaidAttitude
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
      storageIns: [],
      invoices: [],
      cgPaids: [],
      receiptTypesOptions: [],
      keyReceiptTypes: 0,
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
      rules: {},
      activeNames: ['1', '2', '3', '4']
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
      getDictionarysByTypes({ types: 'receiptTypes' })
        .then((response) => {
          const { data } = response
          data.forEach(element => {
            element.pid = element.pId
            this.receiptTypesOptions.push(element)
          })
          this.keyReceiptTypes += 1
        })
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getContractDetailById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data, orgStr } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.orgStr = orgStr
      this.isLoad = true
      // 填充 明细列表
      this.list = data.contractDetails
      this.payModes = data.contractPayModes
      this.setColumnShow()
      this.storageIns = data.storageIns
      this.invoices = data.invoices
      this.cgPaids = data.cgPaids
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
    getReceiptType(type) {
      if (type !== null) {
        var receiptType = this.receiptTypesOptions.find(f => f.value === type)
        if (receiptType !== undefined) {
          return receiptType.name
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    openInvoice(row) {
      this.$router.push({ name: 'CGInvoiceAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    openStorageIn(row) {
      this.$router.push({ name: 'StorageInAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id, type: row.type }})
    },
    dialogClose(data, state) {
    },
    openPaidDetail(row) {
      var data = {
        id: row.id
      }
      this.currentRow = data
      this.dialogTitle = row.number + '付款详情'
      this.comName = 'PaidAttitude'
      this.dialogWidth = '100%'
      this.dialogTableVisible = true
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
