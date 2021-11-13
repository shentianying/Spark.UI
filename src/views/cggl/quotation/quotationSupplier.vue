<template>
  <div class="app-container">
    <!-- <el-form
      ref="supplierForm"
      :disabled="disabled"
      status-icon
      :model="supplierForm"
      :rules="supplierRule"
      label-width="120px"
      class=""
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="填报供应商：" prop="brand">
            <el-select v-model="supplierForm.supplierId" style="width:100%">
              <el-option v-for="(item,index) in priceListSuppliers" :key="index" :label="item.supplier.name" :value="item.supplier.id">
                <span>{{ item.supplier.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-show="active===0" style="text-align:center; margin-top:15px;">
      <el-button size="mini" :loading="loading" @click="setSupplierId()">下一步➜</el-button>
    </div> -->
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
          <el-form-item label="品牌：" prop="brand">
            <el-input v-model="ruleForm.brand" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="技术标准及称量实际数据：" prop="standardData">
            <el-input v-model="ruleForm.standardData" type="textarea" :rows="3" size="mini" maxlength="500" />
          </el-form-item>
          <el-form-item label="发票种类：" prop="receiptType">
            <org-select2
              :key="keyreceiptType"
              v-model="ruleForm.receiptType"
              :data-mode="0"
              size="mini"
              :collapse-tags="false"
              :show-all-levels="false"
              :multiple="false"
              :filterable="true"
              :options="receiptTypes"
              :select-data="ruleForm.receiptType"
            />
          </el-form-item>
          <el-form-item label="卸车费归属：" prop="otherPricePay">
            <org-select2
              :key="keyotherPricePay"
              v-model="ruleForm.otherPricePay"
              :data-mode="0"
              size="mini"
              :collapse-tags="false"
              :show-all-levels="false"
              :multiple="false"
              :filterable="true"
              :options="otherPricePays"
              :select-data="ruleForm.otherPricePay"
            />
          </el-form-item>
          <el-form-item label="总价包含：" prop="amountContain">
            <el-input v-model="ruleForm.amountContain" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
        </el-col>
        <!-- <el-col :sm="12" :xs="24">
          <el-form-item label="付款方式：" prop="payStatus">
            <el-input v-model="ruleForm.payStatus" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
        </el-col> -->
        <el-col :sm="12" :xs="24">
          <el-form-item label="供货信息：" prop="supplyData">
            <el-input v-model="ruleForm.supplyData" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="补充说明：" prop="explain">
            <el-input v-model="ruleForm.explain" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="联系人：" prop="contacts">
            <el-input v-model="ruleForm.contacts" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="联系电话：" prop="contactsPhone">
            <el-input v-model="ruleForm.contactsPhone" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form ref="materialModel" :rules="materialModel.rules" :model="materialModel">
      <el-table
        v-loading="loading"
        :data="materialModel.list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <!-- <el-table-column type="index" width="55" align="center" /> -->
        <el-table-column label="材料名称" fixed="left" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.category.name }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.brand" label="品牌/产地" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.brand }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.model" label="型号" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.model }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.spec" label="规格/尺寸" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.spec }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.thickness" label="厚度" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.thickness }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.texture" label="材质" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.texture }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.surfaceTreatment" label="表面处理/工艺、色号" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.surfaceTreatment }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.designNumber" label="设计编号" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.designNumber }}
          </template>
        </el-table-column>
        <el-table-column label="主单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.category.unit }}
          </template>
        </el-table-column>
        <el-table-column label="主数量" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.applicationQuantity }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.unit2 }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.applicationQuantity2 }}
          </template>
        </el-table-column>
        <el-table-column label="进场日期" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.entryDate | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="含税单价" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.taxInclusivePrice'" :rules="materialModel.rules.taxInclusivePrice">
              <el-input v-model="scope.row.taxInclusivePrice" placeholder="请输入" size="mini" maxlength="50" @change="handleChangeMoney(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="税率" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.taxRate'" :rules="materialModel.rules.taxRate">
              <el-input v-model="scope.row.taxRate" placeholder="请输入" size="mini" maxlength="50" @change="handleChangeMoney(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="不含税单价" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.taxExclusivePrice'" :rules="materialModel.rules.taxExclusivePrice">
              <el-input v-model="scope.row.taxExclusivePrice" placeholder="请输入" size="mini" maxlength="50" @change="handleChangeMoney(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="含税金额" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.taxInclusiveAmount'" :rules="materialModel.rules.taxInclusiveAmount">
              <el-input v-model="scope.row.taxInclusiveAmount" placeholder="请输入" size="mini" maxlength="50" @change="handleChangeMoney(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="税额" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.tax'" :rules="materialModel.rules.tax">
              <el-input v-model="scope.row.tax" placeholder="请输入" size="mini" maxlength="50" @change="handleChangeMoney(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="不含税金额" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.taxExclusiveAmount'" :rules="materialModel.rules.taxExclusiveAmount">
              <el-input v-model="scope.row.taxExclusiveAmount" placeholder="请输入" size="mini" maxlength="50" @change="handleChangeMoney(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.remark'" :rules="materialModel.rules.remark">
              <el-input v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="flex_div">
      <el-button :loading="loading" size="mini" @click="add()">+添加付款方式</el-button>
    </div>
    <el-form ref="paymodel" :rules="paymodel.rules" :model="paymodel">
      <el-table
        v-loading="loading"
        :data="paymodel.list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <!-- <el-table-column type="index" width="55" align="center" /> -->
        <el-table-column label="付款方式" fixed="left" align="center" min-width="100">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.requirement'" :rules="paymodel.rules.requirement">
              <el-input v-model="scope.row.requirement" placeholder="请输入" size="mini" maxlength="100" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="天数" align="center" width="80">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.days'" :rules="paymodel.rules.days">
              <el-input v-model="scope.row.days" placeholder="请输入" size="mini" maxlength="80" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="支付比例" align="center" width="100">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.scale'" :rules="paymodel.rules.scale">
              <el-input v-model="scope.row.scale" placeholder="请输入" size="mini" maxlength="80" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="'list.' + scope.$index + '.remark'" :rules="paymodel.rules.remark">
              <el-input v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="80">
          <template slot-scope="scope">
            <el-form-item>
              <el-button-group>
                <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
              </el-button-group>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :file-list="fileList" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
    <div style="text-align:center;margin-top:10px;">
      <el-button type="success" size="mini" :loading="loading" @click="submitForm(1)">保存</el-button>
      <!-- <el-button type="primary" size="mini" :loading="loading" @click="submitForm(2)">提交</el-button> -->
    </div>
  </div>
</template>
<script>
import { getQuotationSupplierInfo, fillQuotationSupplier } from '@/api/cggl/quotation'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import OrgSelect2 from '@/components/OrgSelect/index2'
import { validate } from '@/utils/validate'
export default {
  name: 'QuotationSupplier',
  components: {
    OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      supplierForm: {
        supplierId: null
      },
      priceListSuppliers: [],
      ruleForm: {},
      loading: false,
      showbuttons: false,
      // 附件页面
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      currentRow: null,
      // 材料明细
      list: [],
      // 付款方式明细
      paymodel: {
        rules: {
          requirement: [{ required: true, message: '请输入', trigger: 'blur' }],
          days: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
          scale: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }]
        },
        list: []
      },
      materialModel: {
        rules: {
          taxExclusivePrice: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
          taxRate: [{ validator: validate.logic, logic: value => value > 0 && value < 1, required: true, trigger: 'blur' }],
          taxInclusivePrice: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
          taxExclusiveAmount: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
          tax: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
          taxInclusiveAmount: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }]
        },
        list: []
      },
      fileList: [],
      // 供应商
      suppliers: [],
      // 发票种类
      receiptTypes: [],
      keyreceiptType: 0,
      // 卸车费归属
      otherPricePays: [],
      keyotherPricePay: 0,
      rules: {
        brand: [{ required: true, message: '请输入', trigger: 'blur' }],
        standardData: [{ required: true, message: '请输入', trigger: 'blur' }],
        receiptType: [{ required: true, message: '请选择', trigger: 'blur' }],
        otherPricePay: [{ required: true, message: '请选择', trigger: 'blur' }],
        amountContain: [{ required: true, message: '请输入', trigger: 'blur' }],
        supplyData: [{ required: true, message: '请输入', trigger: 'blur' }],
        explain: [{ required: true, message: '请输入', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入', trigger: 'blur' }],
        contactsPhone: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      supplierRule: {},
      active: 0,
      disabled: false,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true
      }
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
    }
  },
  watch: {},
  activated() {
    // this.initData()
  },
  mounted() {
    this.initData()
  },
  methods: {
    saveForm() {
    },
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$refs['paymodel'].validate(val => {
            if (val) {
              this.$refs['materialModel'].validate(val2 => {
                if (val2) {
                  var postData = {}
                  var newObj = JSON.parse(JSON.stringify(this.ruleForm))
                  // 拼接材料明细参数
                  var arr1 = []
                  this.materialModel.list.forEach(e => {
                    var item = {}
                    item = e
                    item.quotationSupplierId = this.obj.id
                    item.state = 0
                    arr1.push(item)
                  })
                  // 拼接付款方式参数
                  var arr2 = []
                  this.paymodel.list.forEach(e => {
                    var item2 = {}
                    item2 = e
                    item2.quotationId = newObj.quotationId
                    item2.quotationSupplierId = this.obj.id
                    arr2.push(item2)
                  })

                  postData.id = newObj.id
                  postData.brand = newObj.brand
                  postData.standardData = newObj.standardData
                  postData.receiptType = newObj.receiptType
                  postData.payStatus = newObj.payStatus
                  postData.otherPricePay = newObj.otherPricePay
                  postData.amountContain = newObj.amountContain
                  postData.supplyData = newObj.supplyData
                  postData.explain = newObj.explain
                  postData.contacts = newObj.contacts
                  postData.contactsPhone = newObj.contactsPhone
                  postData.remark = newObj.remark
                  postData.state = state
                  postData.quotationId = newObj.quotationId
                  postData.supplierId = newObj.supplierId
                  postData.fillMode = newObj.fillMode
                  postData.createUserId = newObj.createUserId
                  postData.createUserName = newObj.createUserName
                  postData.quotationSupplierDetails = arr1 // 材料
                  postData.quotationSupplierPayModes = arr2 // 付款方式

                  this.loading = true
                  fillQuotationSupplier(postData).then(response => {
                    this.$message(response.message)
                    this.loading = false
                    this.$emit('dialogClose', response, '')
                    // this.closeThePage()
                  }).catch(() => { this.loading = false })
                }
              })
            }
          })
        }
      })
    },
    async initData() {
      getDictionarysByTypes({ types: 'receiptTypes,otherPricePays' }).then((response) => {
        const { data } = response
        data.forEach(element => {
          element.pid = element.pId
          if (element.type === 'receiptTypes') {
            this.receiptTypes.push(element)
          }
          if (element.type === 'otherPricePays') {
            this.otherPricePays.push(element)
          }
        })
        this.keyreceiptType += 1
        this.keyotherPricePay += 1
      })
      if (this.obj) {
        getQuotationSupplierInfo({ id: this.obj.id }).then((response) => {
          this.ruleForm = response.data
          // this.list = response.detailList
          this.setData(response)
          this.activsetData = 1
          this.keyreceiptType += 1
          this.keyotherPricePay += 1
        })
        this.disabled = true
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.dialogTableVisible = false
    },
    showFileList(fileList) {
      this.dialogTitle = '附件列表'
      this.comName = 'UpFile'
      this.dialogWidth = '50%'
      this.fileList = fileList
      this.dialogTableVisible = true
    },
    previous() {
      this.active = 0
      this.disabled = false
    },
    setData(response) {
      const { data } = response
      var pom = []
      data.quotationSupplierDetails.forEach(e => {
        pom.push({
          id: e.id,
          categoryId: e.material.categoryId,
          category: { id: e.material.categoryId, name: e.material.materialCategory.name, unit: e.material.materialCategory.unit },
          unit2: e.material.unit2,
          brand: e.material.brand,
          model: e.material.model,
          spec: e.material.spec,
          thickness: e.material.thickness,
          texture: e.material.texture,
          surfaceTreatment: e.material.surfaceTreatment,
          designNumber: e.material.designNumber,
          applicationQuantity: e.quotationDetail.planDetail.applicationQuantity,
          applicationQuantity2: e.quotationDetail.planDetail.applicationQuantity2,
          quantity: e.quotationDetail.planDetail.quantity,
          quantity2: e.quotationDetail.planDetail.quantity2,
          entryDate: e.quotationDetail.planDetail.entryDate,
          remark: e.remark,
          materialId: e.materialId,
          quotationDetailId: e.quotationDetailId,
          taxExclusivePrice: e.taxExclusivePrice,
          taxRate: e.taxRate,
          taxInclusivePrice: e.taxInclusivePrice,
          taxExclusiveAmount: e.taxExclusiveAmount,
          tax: e.tax,
          taxInclusiveAmount: e.taxInclusiveAmount
          // fileList: detailList.upFile.filter(f => f.tableId === e.id)
        })
      })
      // 填充 明细列表
      this.materialModel.list = pom
      var pom2 = []
      data.quotationSupplierPayModes.forEach(e => {
        pom2.push({
          id: e.id,
          requirement: e.requirement,
          days: e.days,
          scale: e.scale,
          remark: e.remark
        })
      })
      if (pom2.length === 0) {
        pom2.push({
          id: 0,
          requirement: '',
          days: '',
          scale: '',
          remark: ''
        })
      }
      this.paymodel.list = pom2
      this.setColumnShow()
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
      for (var row of this.materialModel.list) {
        if (row.unit2) { modelunit2 = true }
        if (row.brand) { modelbrand = true }
        if (row.model) { modelmodel = true }
        if (row.spec) { modelspec = true }
        if (row.thickness) { modelthickness = true }
        if (row.texture) { modeltexture = true }
        if (row.surfaceTreatment) { modelsurfaceTreatment = true }
        if (row.designNumber) { modeldesignNumber = true }
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
    add() {
      var data = {
        requirement: '',
        days: '',
        scale: '',
        remark: ''
      }
      this.paymodel.list.push(data)
    },
    del(d) {
      // 列表删除
      this.paymodel.list.splice(d.$index, 1)
    },
    handleChangeMoney(row) {
      if (row.taxInclusivePrice && row.taxRate) {
        row.taxInclusiveAmount = Number(row.taxInclusivePrice) * Number(row.applicationQuantity)
        row.taxExclusiveAmount = (Number(row.taxInclusiveAmount) / (1 + Number(row.taxRate))).toFixed(2)
        row.tax = (Number(row.taxInclusiveAmount) - Number(row.taxExclusiveAmount)).toFixed(2)
        row.taxExclusivePrice = (Number(row.taxInclusivePrice) / (1 + Number(row.taxRate))).toFixed(10)
      }
      this.$set(row)
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px;padding-top: 20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
.flowCard {
    margin-top: 10px;
}
</style>
