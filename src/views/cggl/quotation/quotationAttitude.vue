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
          <el-form-item align="right">
            <el-button v-if="ruleForm.state!==10000" type="success" :loading="loading" @click="addContractAttitude()">发起合同评审</el-button>
            <el-button v-if="ruleForm.state===0" type="default" :loading="loading" @click="quotationAgain()">再次报价</el-button>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="编号">
                {{ ruleForm.number }}
              </el-form-item>
              <el-form-item label="使用项目">
                {{ ruleForm.orgStr }}
              </el-form-item>
              <el-form-item label="价格执行期">
                <div v-if="ruleForm.executeStartDate">
                  {{ ruleForm.executeStartDate | dateFormat }} → {{ ruleForm.executeEndDate | dateFormat }}
                </div>
              </el-form-item>
              <el-form-item v-if="ruleForm.state!==10000" label="建议中标单位" prop="recommendSupplier">
                <el-select v-model="ruleForm.recommendSupplier" style="width:100%" @change="supplierChange">
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
              <el-form-item label="报价轮次">
                {{ ruleForm.times }}
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
              <el-form-item v-if="ruleForm.state!==10000" label=" ">
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
      <el-collapse v-model="activeNames">
        <el-collapse-item title="" name="0">
          <template slot="title">
            <i class="el-icon-s-comment" />报价对比信息
          </template>
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
            :cell-style="cellStyle"
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
                <el-table-column label="含税单价" align="center" width="150">
                  <template slot-scope="scope">
                    <p v-if="scope.row.categoryName!=='付款方式'&&scope.row.taxInclusivePrice!==''">
                      {{ scope.row.taxInclusivePrice.find(f=>f.id===item.supplierId).value }}
                    </p>
                    <p v-else-if="scope.row.categoryName==='付款方式'">
                      <ul v-for="(item_sup,index_sup) in scope.row.taxInclusivePrice.find(f=>f.id===item.supplierId).value" :key="index_sup">
                        付款方式：{{ item_sup.requirement }}，支付比例：{{ item_sup.scale }}，天数：{{ item_sup.days }}
                      </ul>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="税率" align="center" width="150">
                  <template slot-scope="scope">
                    <p v-if="scope.row.taxRate!==''">
                      {{ (scope.row.taxRate.find(f=>f.id===item.supplierId).value * 100).toFixed(2) }}%
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="含税金额" align="center" width="150">
                  <template slot-scope="scope">
                    <p v-if="scope.row.taxInclusiveAmount!==''">
                      {{ scope.row.taxInclusiveAmount.find(f=>f.id===item.supplierId).value }}
                    </p>
                  </template>
                </el-table-column>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.remark }}
              </template>
            </el-table-column>
          </el-table>
          <!-- <div v-show="active===0" style="text-align:center; margin-top:15px;">
            <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
          </div> -->
        </el-collapse-item>
        <el-collapse-item v-if="contractList.length>0" title="" name="1">
          <template slot="title">
            <i class="el-icon-s-comment" />合同评审信息
          </template>
          <!-- 合同评审 -->
          <el-table
            v-loading="loading"
            :data="contractList"
            border
            highlight-current-row
            size="mini"
          >
            <!-- <el-table-column type="index" width="55" align="center" /> -->
            <el-table-column label="合同编号" header-align="center" width="130">
              <template slot-scope="scope">
                {{ scope.row.number }}
              </template>
            </el-table-column>
            <el-table-column label="部门" align="center" min-width="10">
              <template slot-scope="scope">
                {{ scope.row.organization.name }}
              </template>
            </el-table-column>
            <el-table-column label="日期" header-align="center" width="130">
              <template slot-scope="scope">
                {{ scope.row.contractDate | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" min-width="10">
              <template slot-scope="scope">
                <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" label="待审批人" min-width="10" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ getPerson(scope.row.billFlow) }}
              </template>
            </el-table-column>
            <el-table-column label="制单人" align="center" min-width="10">
              <template slot-scope="scope">
                <el-tooltip placement="top" :enterable="false" effect="light">
                  <div slot="content">
                    制单人：{{ scope.row.createUserName }} 制单时间：{{ scope.row.createDate }}<br>
                    更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate }}
                  </div>
                  <span>{{ scope.row.createUserName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="80">
              <template slot-scope="scope">
                <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
                  <el-button v-if="scope.row.state===0" v-has="'CONTRACT_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
                </el-tooltip>
                <el-tooltip content="审查" effect="light" placement="left-start" :enterable="false">
                  <el-button v-if="scope.row.state>0" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item v-if="quotationList.length>0" title="" name="2">
          <template slot="title">
            <i class="el-icon-s-comment" />历史报价单
          </template>
          <el-table
            v-loading="loading"
            :data="quotationList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            size="mini"
          >
            <!-- <el-table-column type="index" width="55" align="center" /> -->
            <el-table-column label="编号" align="center" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.number }}
              </template>
            </el-table-column>
            <el-table-column label="使用项目" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.row.organization.name }}
              </template>
            </el-table-column>
            <el-table-column label="价格执行期" align="center" width="250">
              <template slot-scope="scope">
                <div v-if="scope.row.executeStartDate">
                  {{ scope.row.executeStartDate | dateFormat }} → {{ scope.row.executeEndDate | dateFormat }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="使用部位及用途" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.useSpace }}
              </template>
            </el-table-column>
            <el-table-column label="报价轮次" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.row.times }}
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" min-width="200">
              <template slot-scope="scope">
                {{ scope.row.remark }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" min-width="200">
              <template slot-scope="scope">
                <el-tooltip content="查看" effect="light" placement="left-start" :enterable="true">
                  <el-button size="mini" class="el-icon-edit-outline" plain circle @click="detail(scope.row)" />
                </el-tooltip>
              </template>
            </el-table-column> -->
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />
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
      >
        <template #saveBtn>
          <!--当前审批人拥有支付的操作-->
          <!-- <el-button v-if="showPayButton" size="mini" type="success">特殊操作，支付</el-button> -->
          <!--调用单据中controller操作-->
          <el-button size="mini" type="success" :loading="loading" @click="submitAttitude()">保存</el-button>
        </template>
        <template #otherBtn>
          <!-- <el-button size="mini" type="der">测试其他插槽</el-button> -->
        </template>
      </flow-attitude>
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
import { getQuotationAttitudeById, getBillFlow, quotationAttitude, checkSupplierAttitude, addAttitude } from '@/api/cggl/quotation'
import { getContractListByQuotationId } from '@/api/cggl/contract'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowAttitude from '@/components/Flow/flowAttitude'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import QuotationEdit from '@/views/cggl/quotation/quotationEdit'
export default {
  name: 'QuotationAttitude',
  components: {
    OrgSelect2,
    FlowAttitude,
    FlowSelect,
    FlowDisplay,
    QuotationEdit
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
      // 合同评审列表
      contractList: [],
      // 报价单列表——多次报价
      quotationList: [],
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
        recommendSupplier: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      isLoad: false,
      activeNames: ['0', '1', '2']
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
    this.initData()
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
      getContractListByQuotationId({ quotationId: this.$route.query.id }).then((response) => {
        this.contractList = response.data
      })
    },
    setData(response) {
      const { data } = response
      // 填充参数
      this.ruleForm = data.ruleForm
      this.ruleForm.orgStr = data.orgStr
      this.ruleForm.executeUserName = data.executeUserName
      this.suppliers = data.recommendSupplierList
      this.ruleForm.taskNumber = data.ruleForm.cgTask.number
      // 填充 明细列表
      this.list = data.tableData
      this.quotationList = data.quotationList
      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
      if (data.ruleForm.state > 0) {
        // 获取审批流程
        this.disabled = true
        // getBillFlowById({ billFlowId: data.ruleForm.billFlowId }).then((response2) => {
        //   const { billFlowData } = response2
        //   // 检查当前 状态 是否有特殊操作，有就跳转
        //   var filterOption = billFlowData.billFlowNode.filter(f => f.isCurrentState)
        //   if ((filterOption || []).length) {
        //     if (filterOption[0].option > 0) {
        //       // alert('当前节点有特殊操作')
        //       this.disabled = false
        //     } else {
        //       this.disabled = true
        //     }
        //   }
        //   this.billFlow = billFlowData
        //   this.attitudePara = { formId: billFlowData.formId, billFlowId: data.ruleForm.billFlowId, planId: data.ruleForm.id }
        //   this.active = 3 // 审批
        //   this.isLoad = true
        // })
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
      this.loading = true
      var newObj = JSON.parse(JSON.stringify(this.ruleForm))
      var postData = {
        id: newObj.id,
        recommendSupplier: newObj.recommendSupplier,
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
    },
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {
            id: newObj.id,
            recommendSupplier: newObj.recommendSupplier,
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
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.brand !== '' && (column.label === '含税单价' || column.label === '税率' || column.label === '含税金额')) {
        row.taxInclusivePrice.forEach(e => {
          e.value = (Math.round(e.value * 100) / 100).toFixed(2)
        })
        row.taxInclusiveAmount.forEach(e => {
          e.value = (Math.round(e.value * 100) / 100).toFixed(2)
        })
        return 'text-align: right;padding: 0px;line-height: 4px;'
      } else if (column.label === '辅数量' || column.label === '主数量') {
        return 'text-align: right;padding: 0px;line-height: 4px;'
      } else if (row.categoryName === '合计' && column.label === '含税金额') {
        row.taxInclusiveAmount.forEach(e => {
          e.value = (Math.round(e.value * 100) / 100).toFixed(2)
        })
        return 'text-align: right;padding: 0px;line-height: 4px;'
      } else {
        return 'text-align: center;padding: 0px;line-height: 4px;'
      }
    },
    quotationAgain() {
      // 再次报价
      this.closeThePage()
      this.$router.push({ name: 'QuotationEdit', query: { id: null, refreshRouterName: this.$route.name, tab: 'edit' }, params: { fid: this.ruleForm.fId }})
    },
    addContractAttitude() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          // 确认供应商是否已经发起合同评审
          checkSupplierAttitude({ quotationId: this.ruleForm.id, supplierId: this.ruleForm.recommendSupplier }).then(response => {
            if (response.success === true) {
              // 发起合同评审
              this.closeThePage()
              this.$router.push({ name: 'ContractEdit', query: { id: null, refreshRouterName: this.$route.name, tab: 'edit' }, params: { ruleForm: this.ruleForm, recommendSupplierList: this.suppliers }})
            } else {
              this.$message.error(response.message)
            }
          })
        }
      })
    },
    getFormState(row) {
      if (!row.billFlow) { return '流程空' }
      const formState = row.billFlow.form.formState
      this.formState = formState
      const state = row.state
      if (state === -1) return '作废'
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    handleEdit(row) {
      this.closeThePage()
      this.$router.push({ name: 'ContractEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    attitude(row) {
      this.closeThePage()
      this.$router.push({ name: 'ContractAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    submitAttitude() {
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

.task_div{
  padding-top: 30px;
}
</style>
