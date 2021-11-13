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
            <el-form-item label="编号" prop="number">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>

            <el-form-item
              v-if="activate"
              label="项目"
              prop="orgId"
            >
              <org-select2
                v-model="ruleForm.orgId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :clearable="false"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :select-data="ruleForm.orgId"
                select-style="width:100%;"
              />
            </el-form-item>

            <el-form-item label="合同号" prop="contractIdAndsupplierId">
              <el-select v-model="contractIdAndsupplierId" size="mini" placeholder="选择合同" style="width:100%" @change="selectContract">
                <el-option v-for="(item1,index1) in contractList" :key="index1" :label="item1.contractNumber+'-'+item1.supplierName" :value="item1.contractId+'|'+item1.supplierId" />
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="供应商" prop="supplierId">
              <el-select v-model="ruleForm.supplierId" disabled style="width:100%">
                <el-option v-for="(item2,index2) in supplierList" :key="index2" :label="item2.name" :value="item2.id" />
              </el-select>
            </el-form-item> -->

            <el-form-item label="附件">
              <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
            </el-form-item>

          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="发票类型" prop="type">
              <el-select v-model="ruleForm.type" style="width:100%">
                <el-option v-for="(item,index) in invoiceTypes" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="发票名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="" size="mini" maxlength="50" />
            </el-form-item> -->

            <el-form-item label="发票号码" prop="invoiceNumber">
              <el-input v-model="ruleForm.invoiceNumber" placeholder="" size="mini" maxlength="50" />
            </el-form-item>
            <el-form-item label="开票日期" prop="invoicingDate">
              <el-date-picker
                v-model="ruleForm.invoicingDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="开票金额(含税)" prop="amount">
              <el-input-number v-model.number="ruleForm.amount" :precision="2" :controls="false" :min="0" :max="100000000" />元
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <p style=" text-align: right">
        已选金额：<el-input-number v-model="total" :disabled="true" size="mini" :precision="2" :controls="false" :min="0" :max="100000000" />元（以后台处理数据为准）
        <el-button v-if="ruleForm.orgId&&ruleForm.contractId" size="mini" type="primary" :loading="loading" @click="selectStorageDetail()">选择入库明细</el-button>
      </p>
      <el-table
        ref="multipleTable2"
        v-loading="loading"
        :data="list2"
        border
        size="mini"
        :span-method="objectSpanMethod2"
      >
        <!-- <el-table-column label="物品编号" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column> -->
        <el-table-column label="入库单号" align="center" width="140">
          <template slot-scope="scope">
            {{ scope.row.storageIn.number }}
          </template>
        </el-table-column>
        <el-table-column label="入库时间" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.storageIn.entryDate | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column label="入库明细id" align="center" width="140">
          <template slot-scope="scope">
            {{ scope.row.id }}
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
            <b>{{ scope.row.taxInclusiveAmount.toFixed(2) }}</b>
          </template>
        </el-table-column>

        <!-- <el-table-column label="是否开票" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.invoiceId === 0? '未开':'已开' }}
          </template>
        </el-table-column> -->

        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button size="mini" @click="removeStorage(scope)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 材料分类数据 -->

      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
      </div>

    </div>

    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        title="选择明细入库"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        width="90%"
        :append-to-body="false"
      >
        <el-row style="margin:10px;">
          <el-col :span="24" style="text-align:left;">
            已选金额：<el-input-number v-model="total" :disabled="true" size="mini" :precision="2" :controls="false" :min="0" :max="100000000" />元（以后台处理数据为准）
          </el-col>
        </el-row>

        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="list"
          row-key="id"
          element-loading-text="Loading"
          border
          size="mini"
          style="width:100%"
          :span-method="objectSpanMethod"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <!-- <el-table-column label="物品编号" align="center" width="80">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column> -->
          <el-table-column label="入库单号" align="center" width="140">
            <template slot-scope="scope">
              {{ scope.row.storageIn.number }}
            </template>
          </el-table-column>

          <el-table-column label="入库时间" align="center" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.storageIn.entryDate | dateFormat }}
            </template>
          </el-table-column>

          <el-table-column label="入库明细id" align="center" width="100">
            <template slot-scope="scope">
              {{ scope.row.id }}
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
              <b>{{ scope.row.taxInclusiveAmount.toFixed(2) }}</b>
            </template>
          </el-table-column>

          <!-- <el-table-column label="是否开票" align="center" width="100">
            <template slot-scope="scope">
              {{ scope.row.invoiceId === 0? '未开':'已开' }}
            </template>
          </el-table-column> -->

          <!-- <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="mini" @click="selectStorage(scope) ">选择</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div style="text-align:center;margin:10px 0;">
          <el-pagination
            background
            :hide-on-single-page="false"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            @current-change="getStorageInDetailList"
            @size-change="sizeChange"
          />
        </div>
        <p style="text-align:right">
          <el-button size="mini" type="success" @click="sureSelected">确定</el-button>
        </p>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { initiInvoiceEdit, addInvoice, deleteInvoice, getContractListByOrgId, putInvoice, getBillFlow, getInvoiceById, getStorageInDetailListByContractId } from '@/api/cggl/invoice'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowSelect from '@/components/Flow/flowSelect'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'CGInvoiceEdit',
  components: {
    OrgSelect2,
    FlowSelect,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        // name: '',
        type: null,
        invoiceNumber: '', // 发票号码
        invoicingDate: null, // 开票日期
        orgId: null,
        amount: null,
        state: 0,
        remark: '',
        supplierId: null,
        contractId: null,
        invoiceDetail: [],
        fileList: []
      },
      loading: false,
      activate: false,
      active: 0,

      list: [],
      list2: [],
      contractIdAndsupplierId: '',
      invoiceTypes: [], // 发票类型 字典数据
      contractList: [], // 合同列表
      supplierList: [], // 供应商列表
      multipleSelection: [], // 选中列表
      orgStr: '',
      billFlow: null,
      total: 0,
      dialogTableVisible: false,
      pageTotal: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      spanArr: [],
      rules: {
        orgId: [{ required: true, message: '请选择', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        amount: [{ required: true, type: 'number', message: '请输入', trigger: 'blur' }],
        invoiceNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractIdAndsupplierId: [{ required: false, message: '请选择', trigger: ['blur', 'change'] }],
        invoicingDate: [{ type: 'string', required: true, message: '请选择', trigger: ['blur', 'change'] }]
      }
    }
  },
  watch: {
    'ruleForm.orgId': {
      handler: function(value, oldvalue) {
        // console.log('变化：', value, oldvalue)
        if (!oldvalue) {
          this.$refs['ruleForm'].validateField('orgId', (valid) => {})
        }
        if (value && !oldvalue) {
          this.getContractList(value).then(data => {
            this.contractList = data
          })
        }
        if (value && oldvalue) {
          this.getContractList(value).then(data => {
            if (data.length === 0) {
              this.$message.info('该项目中没有合同信息')
            }
            this.contractList = data
            this.clearData()
          })
        }
      }, deep: true
    }
  },
  activated() {
    if (this.$route.params.id) {
      // this.ruleForm.orgId = null // 刷新 org 列表
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    initiInvoiceEdit().then(res => {
      const { invoiceTypes } = res
      this.invoiceTypes = invoiceTypes
    })
    if (!this.$route.params.id) {
      this.active = 0
      this.activate = true
    }
  },
  methods: {
    clearData() {
      this.list2 = []
      // 清空供应商 和 合同
      this.supplierList = []
      this.ruleForm.supplierId = null
      this.ruleForm.contractId = null
      this.contractIdAndsupplierId = ''
    },
    initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.ruleForm.id = this.$route.query.id
        this.loading = true
        this.activate = false
        getInvoiceById({ id: this.ruleForm.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data } = response
      if (data) {
        if (data.state > 0) {
          this.$message.info('单据已在审批阶段，无法制单')
          this.closeThePage()
          return
        }
      }
      // 填充 明细列表
      var invoiceDetails = data.invoiceDetail.map(m => m.storageInDetail)
      this.list2 = invoiceDetails
      this.getSpanArr(this.list2)
      this.sumStorage(this.list2)

      // 获取 设计下单 数据
      if (data) {
        // 设计下单制单 保存 状态
        if (data.state === 0) {
          this.ruleForm = data
          this.getContractList(data.orgId).then(res => {
            this.contractList = res
          })
          this.ruleForm.fileList = data.upFile
          this.contractIdAndsupplierId = data.contractId + '|' + data.supplierId
        } else {
          // state
          this.loading = false
          this.closeThePage()
        }
      }
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件

      // console.log('this.ruleForm:', this.ruleForm)
      // console.log('this.data:', data)
      // console.log('this.contractIdAndsupplierId:', this.contractIdAndsupplierId)
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },

    submitForm(state) {
      var newObj = JSON.parse(JSON.stringify(this.ruleForm))
      // 设计下单状态
      newObj.state = state

      var invoiceDetail = []
      this.list2.forEach(e => {
        // 从已经保存的数据中查找 入库明细,如果 find后有数据，就是已经存在的数据，否则是 新增的数据
        var findInvoiceDetail = newObj.invoiceDetail.find(f => f.storageInDetailId === e.id)
        let iid = 0
        if (findInvoiceDetail) {
          iid = findInvoiceDetail.idf
        }
        invoiceDetail.push(
          { id: iid,
            invoiceId: newObj.id,
            storageInDetailId: e.id
          }
        )
      })

      newObj.invoiceDetail = invoiceDetail

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
      newObj.billFlow = billFlow

      // console.log('提交的数据：', newObj)

      // 保存单据
      this.loading = true
      if (this.ruleForm.id) {
        putInvoice(newObj).then(response => {
          if (response.errorMsg) {
          // 验证错误
            this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
              { dangerouslyUseHTMLString: true })
            return
          }
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        }).catch(() => { this.loading = false })
      } else {
        addInvoice(newObj).then(response => {
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
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    cancel() { // 作废
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteInvoice({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },

    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          if ((this.list2 || []).length <= 0) {
            this.$alert('请选择入库明细单')
            return false
          }
          if (this.ruleForm.amount < this.total) {
            this.$alert('开票金额必须大于已选金额')
            return false
          }
          this.loading = true
          getBillFlow(newObj).then(response => {
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
    // 选择
    selectStorage(scope) {
      if (scope.row.invoiceId > 0) {
        this.$alert('已开过发票，请不要重复开')
        return false
      }
      const storageInDetail = this.list.find(f => f.id === scope.row.id)
      this.list.splice(scope.$index, 1)

      if (this.list2.some(s => s.id === scope.row.id)) {
        this.$alert('已存在，不能重复添加')
        return
      } else {
        this.list2.push(storageInDetail)
      }
      this.sumStorage(this.list2)
    },
    // 移除
    removeStorage(scope) {
      // const storageInDetail = this.list2.find(f => f.id === scope.row.id)
      this.list2.splice(scope.$index, 1)
      // this.list.push(storageInDetail)
      // 计算总金额
      this.sumStorage(this.list2)
    },
    selectContract(value) {
      var contractId = Number(value.split('|')[0])
      var supplierId = Number(value.split('|')[1])
      // this.supplierList = []
      // var contract = this.contractList.find(f => f.contractId === contractId && f.supplierId === supplierId)

      // this.supplierList.push({ id: contract.supplierId, name: contract.supplierName })
      this.ruleForm.contractId = contractId
      this.ruleForm.supplierId = supplierId
      // // 清空选中列表
      this.list2 = []
    },
    getStorageInDetailList() {
      const postData = {}
      postData.contractId = this.ruleForm.contractId
      postData.supplierId = this.ruleForm.supplierId
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      if (this.ruleForm.id > 0) {
        postData.invoiceId = this.ruleForm.id
      }
      this.loading = true
      return new Promise((resolve, reject) => {
        getStorageInDetailListByContractId(postData).then(res => {
          this.loading = false
          const { storageInDetailList, count } = res
          this.list = storageInDetailList
          this.getSpanArr(this.list) // 合并单元格
          this.pageTotal = count
          resolve()
        })
      })
    },
    sumStorage(arr) {
      // 计算金额
      this.total = 0
      arr.map(m => m.taxInclusiveAmount).forEach(e => {
        this.total += e
      })
    },
    selectStorageDetail() {
      if (!this.ruleForm.orgId) {
        this.$alert('请先选择项目')
        return
      }
      if (!this.ruleForm.contractId) {
        this.$alert('请先选择合同')
        return
      }
      // 清空弹出选择的值
      // this.ruleForm.contractId = null
      this.list = []
      this.dialogTableVisible = true
      // this.contractId = value
      this.getStorageInDetailList().then(r => {
        this.list2.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(this.list.find(f => f.id === row.id))
        })
      })

      // getContractListByOrgId({ orgId: this.ruleForm.orgId }).then(res => {
      //   const { data } = res
      //   this.contractList = data
      //   this.dialogTableVisible = true
      // })
    },
    sizeChange(val) {
      this.pageSize = val
      this.getStorageInDetailList().then(r => {
        this.list2.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(this.list.find(f => f.id === row.id))
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.sumStorage(this.multipleSelection)
    },
    sureSelected() {
      // 弹窗关闭前
      this.list2 = this.multipleSelection

      this.getSpanArr(this.list2)
      // this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.sumStorage(this.list2)
      this.dialogTableVisible = false
    },
    getSpanArr(data) {
      // data就是我们从后台拿到的数据
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].Number === data[i - 1].Number) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
        // console.log(this.spanArr)
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0 || columnIndex === 1) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        // console.log(`rowspan:${_row} colspan:${_col}`)
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
    objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0 || columnIndex === 1) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        // console.log(`rowspan:${_row} colspan:${_col}`)
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getContractList(orgId) {
      return new Promise((resolve, reject) => {
        getContractListByOrgId({ orgId: orgId }).then(res => {
          const { data } = res
          resolve(data)
        })
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
