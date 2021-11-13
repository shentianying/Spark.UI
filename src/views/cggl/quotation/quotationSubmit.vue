<template>
  <div v-if="activate" class="app-container">
    <div v-show="active===0 || active===3">
      <div style="padding:10px 0px;">
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
              <el-form-item label="编号">
                {{ ruleForm.number }}
              </el-form-item>
              <el-form-item label="使用项目">
                {{ ruleForm.orgStr }}
              </el-form-item>
              <el-form-item label="价格执行期">
                {{ ruleForm.executeStartDate | dateFormat }} → {{ ruleForm.executeEndDate | dateFormat }}
              </el-form-item>
              <el-form-item label="建议中标单位" prop="recommendSupplierIds">
                <el-select v-model="ruleForm.recommendSupplierIds" :disabled="disabled" multiple style="width:100%" @change="supplierChange">
                  <el-option v-for="(item,index) in suppliers" :key="index" :label="item.name" :value="item.id">
                    <span>{{ item.name }}</span>
                  </el-option>
                </el-select>
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
              <el-form-item label="使用部位及用途">
                {{ ruleForm.useSpace }}
              </el-form-item>
              <el-form-item label="采购执行人">
                {{ ruleForm.executeUserName }}
              </el-form-item>
              <el-form-item label="所属任务单号">
                <el-link :underline="false" @click="openTask(ruleForm.taskId)">{{ ruleForm.taskNumber }}</el-link>
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
      </div>
      <!-- 合计 -->
      <!-- :summary-method="getSummaries" -->
      <el-table
        v-loading="loading"
        :data="list"
        :span-method="arraySpanMethod"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :row-style="{height:'15px'}"
        :cell-style="{padding:'0px'}"
        style="font-size: 10px"
        size="mini"
      >
        <el-table-column label="材料名称" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.categoryName }}
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
            {{ scope.row.unit }}
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
        <el-table-column v-for="(item,index) in ruleForm.quotationSuppliers" :key="index" :label="item.supplier.name" align="center" width="100">
          <template>
            <el-table-column label="含税单价" align="center" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.categoryName!=='付款方式'&&scope.row.taxInclusivePrice!==''">
                  {{ scope.row.taxInclusivePrice.find(f=>f.id===item.supplierId).value }}
                </p>
                <p v-else-if="scope.row.categoryName==='付款方式'">
                  <ul v-for="(item_sup,index_sup) in scope.row.taxInclusivePrice.find(f=>f.id===item.supplierId).value" :key="index_sup">
                    付款方式：{{ item.requirement }}，支付比例：{{ item.scale }}，天数：{{ item.days }}
                  </ul>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="税率" align="center" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.taxRate!==''">
                  {{ scope.row.taxRate.find(f=>f.id===item.supplierId).value }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="含税金额" align="center" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.taxInclusiveAmount!==''">
                  {{ scope.row.taxInclusiveAmount.find(f=>f.id===item.supplierId).value }}
                </p>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
      </el-table>
      <div v-show="active===0" style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
      </div>
    </div>
    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>

    <div v-show="active===3">
      <!--流程信息-->
      <flow-display v-if="billFlow" ref="flowSelectDisplay" :is-edit="true" :bill-flow="billFlow" />

      <flow-attitude
        v-if="isLoad"
        ref="flowAttitude"
        :show="true"
        :para="attitudePara"
        @update="updateFlow"
      />
    </div>

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
import { getQuotationAttitudeById, getBillFlow, quotationAttitude, getBillFlowById } from '@/api/cggl/quotation'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowAttitude from '@/components/Flow/flowAttitude'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
export default {
  name: 'QuotationSubmit',
  components: {
    OrgSelect2,
    FlowAttitude,
    FlowSelect,
    FlowDisplay
  },
  data() {
    return {
      ruleForm: {
        orgId: null
      },
      loading: false,
      activate: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      currentRow: [],
      list: [],
      list2: [],
      disabled: false,
      // 发票种类
      receiptTypes: [],
      // 卸车费归属
      otherPricePays: [],
      fileList: [],
      // 供应商
      suppliers: [],
      planTypeList: null,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true
      },
      tableHeader: [],
      // 流程
      loadFlow: false,
      billFlow: null,
      attitudePara: null,
      active: 0,
      rules: {
        // orgId: [{ required: true, message: '请选择', trigger: 'change' }],
        // recommendSupplierIds: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      isLoad: false
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
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
      getQuotationAttitudeById({ id: this.$route.query.id }).then((response) => {
        this.setData(response)
      })
      this.setColumnShow()
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
    },
    setData(response) {
      const { data } = response
      // 填充参数
      this.ruleForm = data.ruleForm
      this.ruleForm.orgStr = data.orgStr
      this.ruleForm.supplierCheckNames = data.supplierCheckNames
      this.ruleForm.executeUserName = data.executeUserName
      this.ruleForm.recommendSupplierIds = data.recommendSupplierIds
      this.suppliers = data.recommendSupplier
      this.ruleForm.taskNumber = data.ruleForm.cgTask.number
      // 填充 明细列表
      this.list = data.tableData
      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
      if (data.ruleForm.state > 0) {
        // 获取审批流程
        this.disabled = true
        getBillFlowById({ billFlowId: data.ruleForm.billFlowId }).then((response2) => {
          const { billFlowData } = response2
          // 检查当前 状态 是否有特殊操作，有就跳转
          var filterOption = billFlowData.billFlowNode.filter(f => f.isCurrentState)
          if ((filterOption || []).length) {
            if (filterOption[0].option > 0) {
              // alert('当前节点有特殊操作')
              this.disabled = false
            } else {
              this.disabled = true
            }
          }
          this.billFlow = billFlowData
          this.attitudePara = { formId: billFlowData.formId, billFlowId: data.ruleForm.billFlowId, planId: data.ruleForm.id }
          this.active = 3 // 审批
          this.isLoad = true
        })
      }
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
    getPrice(detail, materialId) {
      const pri = detail.find(f => f.materialId === materialId)
      return pri.price
    },
    getAmount(detail, materialId) {
      const pri = detail.find(f => f.materialId === materialId)
      return pri.amount
    },
    getSupplierSum(detail) {
      var result = {
        taxInclusiveAmountSum: 0,
        taxExclusiveAmountSum: 0
      }
      detail.forEach(e => {
        result.taxInclusiveAmountSum += e.taxInclusiveAmount
        result.taxInclusiveAmountSum += e.taxInclusiveAmount
      })
      return result
    },
    // getSummaries(param) {
    //   const { columns } = param
    //   const sums = []
    //   columns.forEach((index) => {
    //     if (index === 0) {
    //       sums[index] = '合计'
    //       return
    //     }
    //     var i = 4
    //     this.ruleForm.suppliers.forEach(e => {
    //       i = i + 2
    //       var sumAmount = 0
    //       e.priceSupplierDetails.forEach(p => {
    //         sumAmount += p.amount
    //       })
    //       if (index === i) {
    //         sums[index] = sumAmount
    //       }
    //     })
    //   })
    //   return sums
    // },
    getreceiptType(id) {
      const type = this.receiptTypes.find(f => f.id === id)
      if (type) {
        return type.name
      } else {
        return ''
      }
    },
    getotherPricePay(id) {
      const type = this.otherPricePays.find(f => f.id === id)
      if (type) {
        return type.name
      } else {
        return ''
      }
    },
    // 根据表单获取流程
    getDynamicFlow() {
      if (this.ruleForm.recommendSupplierIds.length > 0) {
        this.loading = true
        var newObj = JSON.parse(JSON.stringify(this.ruleForm))
        var postData = {
          id: newObj.id,
          recommendSupplier: newObj.recommendSupplierIds.join(','),
          orgId: newObj.orgId,
          billFlowId: newObj.billFlowId
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
      } else {
        this.$message.error('请选择建议中标单位')
      }
    },
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {
            id: newObj.id,
            recommendSupplier: newObj.recommendSupplierIds.join(','),
            state: state
          }
          const billFlow = this.$refs.flowSelect.getBillFlow()
          console.log('获取的billFlow:', billFlow)
          postData.billFlow = billFlow

          quotationAttitude(postData).then(response => {
            if (response.errorMsg) {
              // 验证错误
              this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                { dangerouslyUseHTMLString: true })
            } else {
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }
          }).catch(() => { this.loading = false })
        }
      })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      // 修改计划单据state状态
      // this.loading = true
      // this.billFlow = null
      this.closeThePage()
      // putQuotationState({ id: data.billId, state: data.state }).then()
    },
    openTask(taskId) {
      this.$router.push({ name: 'TaskDetail', query: { id: taskId, refreshRouterName: this.$route.name, tab: 'detail' }, params: { id: taskId, isCheck: false }})
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.tax === '') {
        if (columnIndex === 0) {
          return [1, 4]
        } else if (columnIndex === 1) {
          return [0, 0]
        } else if (columnIndex === 2) {
          return [0, 0]
        } else if (columnIndex === 3) {
          return [0, 0]
        }
        if (column.label === '含税单价' && row.taxInclusiveAmount === '') {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else if (column.label === '税率' && row.taxInclusiveAmount === '') {
          return {
            rowspan: 1,
            colspan: 0
          }
        // } else if (column.label === '不含税单价' && row.taxInclusiveAmount === '') {
        //   return {
        //     rowspan: 1,
        //     colspan: 0
        //   }
        } else if (column.label === '含税金额' && row.taxInclusiveAmount === '') {
          return {
            rowspan: 1,
            colspan: 0
          }
        } else if (column.label === '税额' && row.taxInclusiveAmount === '') {
          return {
            rowspan: 1,
            colspan: 0
          }
        // } else if (column.label === '不含税金额' && row.taxInclusiveAmount === '') {
        //   return {
        //     rowspan: 1,
        //     colspan: 0
        //   }
        }
      }
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    supplierChange() {
      this.$forceUpdate()
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
