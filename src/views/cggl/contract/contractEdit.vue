<template>
  <div class="app-container">
    <div v-show="active===0">
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
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
            <el-form-item label="报价单">
              <el-link :underline="false" @click="openQuotation(ruleForm.quotation.id)">{{ ruleForm.quotation.number }}</el-link>
            </el-form-item>
            <el-form-item label="供应商名称">
              <el-link :underline="false" @click="openSupplier(ruleForm.supplier.id)">{{ ruleForm.supplier.name }}</el-link>
            </el-form-item>
            <el-form-item label="违约责任" prop="breachDuty">
              <el-input v-model="ruleForm.breachDuty" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
            <el-form-item label="其他说明事项" prop="explain">
              <el-input v-model="ruleForm.explain" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <!-- <el-form-item label="供应商">
              <el-input v-model="ruleForm.supplierName" disabled="true" size="mini" maxlength="50" />
            </el-form-item> -->
            <el-form-item
              v-if="activate"
              label="项目"
              prop="orgId"
            >
              <org-select2
                :key="orgKey"
                v-model="ruleForm.quotation.orgId"
                disabled
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :check-strictly="false"
                :select-data="ruleForm.quotation.orgId"
                select-style="width:100%;"
              />
            </el-form-item>
            <el-form-item label="日期" prop="contractDate">
              <el-date-picker
                v-model="ruleForm.contractDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="供货方式" prop="howSupply">
              <el-input v-model="ruleForm.howSupply" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
            <el-form-item label="附件">
              <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
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
        size="mini"
      >
        <el-table-column label="材料名称" align="center" min-width="100">
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
            <el-input-number v-model="scope.row.quantity" controls-position="right" size="mini" :step="0.0001" :min="1" :max="scope.row.maxQuantity" @change="handleChange" />
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.material.unit2 }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity2" controls-position="right" size="mini" :step="0.0001" :min="1" :max="scope.row.maxQuantity2" @change="handleChange" />
          </template>
        </el-table-column>
        <el-table-column label="含税单价" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxInclusivePrice" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="税率" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxRate" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="不含税单价" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxExclusivePrice" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="含税金额" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxInclusiveAmount" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="税额" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tax" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="不含税金额" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxExclusiveAmount" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" fixed="right" align="center" width="80">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="editDetail(scope)" />
            </el-button-group>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="add()">+添加付款方式</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="payModes"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column label="付款方式" align="center" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.requirement" placeholder="请输入" size="mini" maxlength="100" />
          </template>
        </el-table-column>
        <el-table-column label="天数" align="center" width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.days" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="支付比例" align="center" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.scale" placeholder="请输入" size="mini" maxlength="80" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button-group>
              <!-- <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" /> -->
              <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
      </div>
    </div>

    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" @dialogClose="dialogClose" />
      </el-dialog>
    </div>

    <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div>
  </div>
</template>
<script>
import { getContractById, addContract, putContract, getBillFlow, deleteContract } from '@/api/cggl/contract'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import QuotationSuppliersCheck from '@/views/cggl/quotation/quotationSuppliersCheck'
export default {
  name: 'ContractEdit',
  components: {
    OrgSelect2,
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
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      list: [],
      payModes: [],
      billFlow: null,
      attitudePara: null,
      loadFlow: false,
      orgKey: 0,
      fileListKey: 0,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true },
      rules: {
        // orgId: [{ required: true, message: '请输入', trigger: 'change' }],
        // quotationNumber: [{ required: true, message: '请选择', trigger: 'blur' }],
        howSupply: [{ required: true, message: '请输入', trigger: 'blur' }],
        breachDuty: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractDate: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {
  },
  activated() {
    this.initData()
  },
  mounted() {
  },
  methods: {
    // 根据表单获取流程
    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.ruleForm.orgId = this.ruleForm.quotation.orgId
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {}
          postData.number = newObj.number
          postData.contractDate = newObj.contractDate
          postData.orgId = newObj.orgId
          postData.quotationId = newObj.quotation.id
          postData.supplierId = newObj.supplier.id
          postData.howSupply = newObj.howSupply
          postData.breachDuty = newObj.breachDuty
          postData.explain = newObj.explain
          postData.billFlowId = newObj.billFlowId
          if (this.id) {
            postData.id = this.id
          }
          getBillFlow(postData).then(response => {
            this.loading = false
            if (response.success) {
              this.billFlow = response.data.billFlow
              this.active = 1
            } else {
              this.$message(response.message)
            }
          }).catch(() => { this.loading = false })
        }
      })
    },
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.ruleForm.state = state
          this.loading = true
          this.ruleForm.orgId = this.ruleForm.quotation.orgId
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {}
          postData.contractDate = newObj.contractDate
          postData.orgId = newObj.orgId
          postData.quotationId = newObj.quotation.id
          postData.supplierId = newObj.supplier.id
          postData.howSupply = newObj.howSupply
          postData.breachDuty = newObj.breachDuty
          postData.explain = newObj.explain
          var pom = []
          this.list.forEach(e => {
            pom.push({
              planDetailId: e.planDetail.id,
              materialId: e.materialId,
              quantity: e.quantity,
              quantity2: e.quantity2,
              taxExclusivePrice: e.taxExclusivePrice,
              taxInclusivePrice: e.taxInclusivePrice,
              taxRate: e.taxRate,
              taxExclusiveAmount: e.taxExclusiveAmount,
              taxInclusiveAmount: e.taxInclusiveAmount,
              tax: e.tax,
              remark: e.remark
            })
          })
          var pom2 = []
          this.payModes.forEach(e => {
            pom2.push({
              requirement: e.requirement,
              scale: e.scale,
              days: e.days,
              remark: e.property
            })
          })
          postData.contractDate = newObj.contractDate
          postData.orgId = newObj.orgId
          postData.supplierId = newObj.supplier.id
          postData.quotationId = newObj.quotation.id
          postData.howSupply = newObj.howSupply
          postData.breachDuty = newObj.breachDuty
          postData.explain = newObj.explain
          postData.contractDetails = pom
          postData.contractPayModes = pom2
          postData.fileList = newObj.fileList
          postData.state = state
          // 获取流程组件中的数据
          if (state === 1) {
            // 如果是提交，验证流程人员的完整信息
            const checkBillFlow = this.$refs.flowSelect.checkBillFlow()
            if (!checkBillFlow) {
              this.$message('流程错误，流程中审批人员不能为空')
              return false
            }
          }

          const billFlow = this.$refs.flowSelect.getBillFlow()
          console.log('获取的billFlow:', billFlow)
          this.ruleForm.billFlow = billFlow
          postData.billFlow = billFlow

          if (this.id) {
            postData.id = this.id
            putContract(postData).then(response => {
              this.closeThePage()
            }).catch(() => { this.loading = false })
          } else {
            postData.id = 0
            addContract(postData).then(response => {
              this.closeThePage()
            }).catch(() => { this.loading = false })
          }
        }
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
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
      // 复制报价单信息
      if (this.$route.params.ruleForm) {
        this.loading = true
        var data = this.$route.params.ruleForm
        this.ruleForm.quotation = data
        var supplier = data.quotationSuppliers.find(f => f.supplierId === data.recommendSupplier)
        this.payModes = supplier.quotationSupplierPayModes
        this.list = supplier.quotationSupplierDetails
        if (this.$route.params.recommendSupplierList) {
          this.ruleForm.supplier = this.$route.params.recommendSupplierList.find(f => f.id === data.recommendSupplier)
        }
        this.list.forEach(e => {
          e.maxQuantity = e.quotationDetail.planDetail.applicationQuantity
          e.maxQuantity2 = e.quotationDetail.planDetail.applicationQuantity2
          e.planDetail = { id: e.quotationDetail.planDetailId }
        })
        this.setColumnShow()
        this.loading = false
      }
    },
    setData(response) {
      const { data } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.orgKey++ // 重新加载项目组件
      this.fileListKey++ // 重新加载文件组件
      // 填充 明细列表
      this.list = data.contractDetails
      this.list.forEach(e => {
        e.quotationDetail = { planDetail: { id: e.planDetail.id, applicationQuantity: e.quantity, applicationQuantity2: e.quantity2 }}
      })
      this.payModes = data.contractPayModes
      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
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
    checkQuotationSup() {
      this.dialogTitle = '选择供应商报价单'
      this.comName = 'QuotationSuppliersCheck'
      this.currentRow = null
      this.dialogWidth = '100%'
      this.fileList = []
      this.dialogTableVisible = true
    },
    dialogClose(data) {
      this.dialogTableVisible = false
    },
    cancel() { // 作废
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteContract({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    openQuotation(id) {
      this.$router.push({ name: 'QuotationAttitude', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    openSupplier(id) {
      this.$router.push({ name: 'SupplierDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    handleChange() {
      //
    },
    add() {
      var data = {
        requirement: '',
        days: '',
        scale: '',
        remark: ''
      }
      this.payModes.push(data)
    },
    del(d) {
      // 列表删除
      this.payModes.splice(d.$index, 1)
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-top:10px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
