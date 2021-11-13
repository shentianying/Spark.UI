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
      <el-form-item align="right">
        <el-button v-if="canSubmit===false" type="success" :loading="loading" @click="submitForm('ruleForm',0)">保存</el-button>
        <el-button v-else-if="canSubmit===true" type="success" :loading="loading" @click="attitude()">提交</el-button>
        <!-- <el-button type="primary" :loading="loading" @click="submitForm('ruleForm',-1)">提交</el-button> -->
        <!-- <el-button type="danger" :loading="loading" @click="closeThePage"><i class="el-icon-close" /></el-button> -->
      </el-form-item>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="编号" prop="number">
            <el-input v-model="ruleForm.number" :disabled="true" placeholder="自动生成" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="项目" prop="orgId">
            <org-select2
              :key="orgKey"
              v-model="ruleForm.orgId"
              :data-mode="0"
              :disabled="true"
              size="mini"
              :collapse-tags="false"
              :show-all-levels="true"
              :multiple="false"
              :filterable="true"
              :check-strictly="false"
              :select-data="ruleForm.orgId"
              select-style="width:100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="使用部位及用途" prop="useSpace">
            <el-input v-model="ruleForm.useSpace" :disabled="disabled" placeholder="请输入" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="采购执行人" prop="executeUserId">
            <el-select
              v-model="ruleForm.executeUserId"
              :filter-method="getRemotePerson"
              :disabled="disabled"
              size="mini"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请选择"
              :loading="loading"
              style="width:100%;"
            >
              <el-option
                v-for="(item,index) in personList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ getOrgName(item.organizationId) }}-{{ item.name }}</span>
                <!-- getOrgList.find(f=>f.id===item.organizationId).name -->
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="价格执行期" prop="executeStartDate">
            <el-col :span="11">
              <el-date-picker v-model="ruleForm.executeStartDate" :disabled="disabled" type="date" placeholder="请选择" style="width: 100%;" />
            </el-col>
            <el-col class="line" :span="2">→</el-col>
            <el-col :span="11">
              <el-date-picker v-model="ruleForm.executeEndDate" :disabled="disabled" type="date" placeholder="请选择" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="任务单" prop="taskNumber">
            <el-input v-model="ruleForm.taskNumber" :disabled="true" placeholder="请选择" size="mini" maxlength="50">
              <el-button slot="append" :disabled="disabled" icon="el-icon-search" @click="checkTask()" />
            </el-input>
            <!-- <el-link :underline="false" @click="openTask(ruleForm.taskId)">{{ ruleForm.taskNumber }}</el-link>
            <el-button size="mini" type="success" :loading="loading" @click="checkTask()">选择</el-button> -->
          </el-form-item>
          <el-form-item label="报价截止日期" prop="deadline">
            <el-date-picker v-model="ruleForm.deadline" :disabled="disabled" type="date" placeholder="请选择" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark" :disabled="disabled" type="textarea" :rows="4" size="mini" maxlength="500" />
          </el-form-item>
          <el-form-item label="报价轮次" prop="times">
            <el-input v-model="ruleForm.times" :disabled="true" type="number" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <!-- <el-col :sm="12" :xs="24">
          <el-form-item label="附件">
            <up-file v-if="ruleForm.fileList" key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>

    <div v-if="ruleForm.times > 1" class="flex_div">
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
        <el-table-column label="操作" align="center" min-width="200">
          <template slot-scope="scope">
            <el-tooltip content="查看" effect="light" placement="left-start" :enterable="true">
              <el-button size="mini" class="el-icon-edit-outline" plain circle @click="detail(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <!-- <el-table-column type="index" width="55" align="center" /> -->
      <el-table-column label="材料名称" align="center" min-width="100">
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
      <!-- <el-table-column label="进场日期" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.entryDate | dateFormat }}
        </template>
      </el-table-column> -->
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          <!-- {{ scope.row.remark }} -->
          <el-input v-model="scope.row.remark" :disabled="disabled" placeholder="请输入" size="mini" maxlength="200" />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="id">
      <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="addSupplier()">增加参标单位</el-button>
        <el-button :loading="loading" type="success" size="mini" @click="send()">发送</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="suppliers"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column align="center" label="编号" :show-overflow-tooltip="true" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.supplier.number }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" :show-overflow-tooltip="true" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.supplier.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="主营" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.supplier.mainBusiness }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="地址" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.supplier.address }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="公司电话" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.supplier.companyPhone }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.supplier.contacts }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人电话" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.supplier.contactsPhone }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="星级" min-width="10">
          <template slot-scope="scope">
            {{ getSupplierRate(scope.row.supplier.rate) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="填报方式" min-width="10">
          <template slot-scope="scope">
            <org-select2
              v-if="scope.row.state===0"
              :key="keyFillMode"
              v-model="scope.row.fillMode"
              size="mini"
              :collapse-tags="false"
              props-value="value"
              :show-all-levels="false"
              :multiple="false"
              :filterable="true"
              :options="fillModeOptions"
            />
            <org-select2
              v-else
              :key="keyFillMode"
              v-model="scope.row.fillMode"
              :disabled="true"
              size="mini"
              :collapse-tags="false"
              props-value="value"
              :show-all-levels="false"
              :multiple="false"
              :filterable="true"
              :options="fillModeOptions"
            />
            <!-- {{ scope.row.fillMode }} -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="10">
          <template slot-scope="scope">
            {{ getquotationSupState(scope.row.state) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button-group>
              <el-button v-if="scope.row.fillMode===2 && scope.row.state>0" type="success" plain size="small" icon="el-icon-edit" style="padding:6px;" title="填报" @click="fill(scope)" />
              <el-button v-if="scope.row.state<2" type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope.row)" />
            </el-button-group>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" fixed="right" align="center" width="80">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
              <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
            </el-button-group>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
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
  </div>
</template>
<script>
import { generateQuotation, getQuotationById, sendQuotationSupplier, addQuotationSupplier, deleteQuotationSupplier, getQuotationByFId } from '@/api/cggl/quotation'
import OrgSelect2 from '@/components/OrgSelect/index2'
import { getPersonList } from '@/api/rsgl/person'
import CheckTask from '@/views/cggl/task/taskCheck'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import QuotationSuppliersAdd from './quotationSuppliersAdd'
import QuotationSupplier from './quotationSupplier'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'QuotationEdit',
  components: {
    OrgSelect2,
    CheckTask,
    QuotationSuppliersAdd,
    QuotationSupplier,
    UpFile
  },
  data() {
    return {
      id: null,
      fid: null,
      ruleForm: {
        orgId: null,
        supplier_id: [],
        state: 0,
        taskId: null,
        times: 1,
        fileList: []
      },
      disabled: false,
      loading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      currentRow: null,
      fileList: [],
      listIndex: 0,
      list: [],
      planTypeList: null,
      billFlow: false,
      orgKey: 0,
      fileListKey: 0,
      canSubmit: false,
      columnShow: {
        unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true
      },
      personList: [],
      // 供应商-参标单位
      suppliers: [],
      // 填报方式
      keyFillMode: 0,
      fillModeOptions: [],
      // 供应商星级
      supplierRateOptions: [],
      // 参标单位状态
      quotationSupStateOptions: [],
      // 多轮报价单
      quotationList: [],
      rules: {
        // orgId: [{ required: true, message: '请选择', trigger: 'change' }],
        supplierId: [{ required: true, message: '请选择', trigger: 'change' }],
        importType: [{ required: true, message: '请选择', trigger: 'blur' }],
        supplier_id: [{ required: true, message: '请选择', trigger: 'blur' }],
        taskNumber: [{ required: true, message: '请选择', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择', trigger: 'blur' }]
        // executeStartDate: [{ required: true, message: '请选择', trigger: 'blur' }],
        // executeEndDate: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
    }
  },
  watch: {
    // 'ruleForm.orgId': {
    //   handler: function(value, oldvalue) {
    //     if (!oldvalue) {
    //       this.$refs['ruleForm'].validateField('orgId', (valid) => {})
    //     }
    //   }, deep: true
    // }
  },
  activated() {
    // this.initData()
  },
  mounted() {
    this.initData()
  },
  methods: {
    saveForm() {
    },
    submitForm(formName, state) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var postData = {}
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 拼接材料明细参数
          var arr1 = []
          this.list.forEach(e => {
            var item = {}
            item.materialId = e.materialId
            item.planDetailId = e.planDetailId
            item.state = 0
            item.remark = e.remark
            arr1.push(item)
          })
          postData.fId = newObj.fId
          postData.orgId = newObj.orgId
          postData.taskId = newObj.taskId
          postData.useSpace = newObj.useSpace
          postData.executeUserId = newObj.executeUserId
          postData.executeStartDate = newObj.executeStartDate
          postData.executeEndDate = newObj.executeEndDate
          postData.deadline = newObj.deadline
          postData.times = newObj.times
          // postData.planId = newObj.planId
          postData.state = state
          postData.remark = newObj.remark
          postData.quotationDetails = arr1
          // postData.quotationSuppliers = this.suppliers

          this.loading = true
          if (this.id) {
            postData.id = this.id
          }
          // 判断供应商列表的填报方式都已填写
          // var isWrite = true
          // if (this.suppliers.length > 0) {
          //   this.suppliers.forEach(e => {
          //     if (!e.fillMode) {
          //       this.$alert('请选择参标单位的填报方式！')
          //       this.loading = false
          //       isWrite = false
          //     }
          //   })
          // }
          // if (isWrite) {
          // }
          generateQuotation(postData).then(response => {
            this.$message(response.message)
            this.loading = false
            // this.setData(response)
            // this.closeThePage()
            this.id = response.data
            getQuotationById({ id: this.id }).then(response => { this.setData(response) })
          }).catch(() => { this.loading = false })
        }
      })
    },
    async initData() {
      // 用户
      getPersonList().then(response => {
        this.personList = response.data
      })
      // 数据初始化
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      // 再次报价
      if (this.$route.params.fid) {
        this.fid = this.$route.params.fid
      }
      var fillmodes = []
      var supplierrates = []
      var quotationsupstates = []
      getDictionarysByTypes({ types: 'priceListImportType,supplierRate,quotationSupState' })
        .then((response) => {
          const { data } = response
          data.forEach(element => {
            element.pid = element.pId
            if (element.type === 'priceListImportType') {
              fillmodes.push(element)
            }
            if (element.type === 'supplierRate') {
              supplierrates.push(element)
            }
            if (element.type === 'quotationSupState') {
              quotationsupstates.push(element)
            }
          })
        })
      this.fillModeOptions = fillmodes
      this.supplierRateOptions = supplierrates
      this.quotationSupStateOptions = quotationsupstates
      if (this.id) {
        getQuotationById({ id: this.id }).then(response => { this.setData(response) })
      }
      if (this.fid) {
        getQuotationByFId({ fid: this.fid }).then(response => { this.setAgainData(response) })
      }
    },
    setAgainData(response) {
      this.loading = true
      const { data, quotationList, maxTimes } = response
      var pom = []
      data.quotationDetails.forEach(e => {
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
          applicationQuantity: e.planDetail.applicationQuantity,
          applicationQuantity2: e.planDetail.applicationQuantity2,
          quantity: e.planDetail.quantity,
          quantity2: e.planDetail.quantity2,
          entryDate: e.planDetail.entryDate,
          remark: e.remark,
          materialId: e.materialId,
          planDetailId: e.planDetailId
        })
      })
      this.ruleForm = data
      this.ruleForm.taskNumber = data.cgTask.number
      this.ruleForm.times = maxTimes
      this.ruleForm.id = 0
      this.quotationList = quotationList
      this.list = pom
      this.orgKey++ // 项目组件重新加载
      this.keyFillMode++ // 付款方式组件重新加载
      this.loading = false // loading 状态关闭
      this.setColumnShow()
    },
    setData(response) {
      this.loading = true
      const { data } = response
      if (data.state > 0) {
        this.closeThePage()
      }
      var pom = []
      data.quotationDetails.forEach(e => {
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
          applicationQuantity: e.planDetail.applicationQuantity,
          applicationQuantity2: e.planDetail.applicationQuantity2,
          quantity: e.planDetail.quantity,
          quantity2: e.planDetail.quantity2,
          entryDate: e.planDetail.entryDate,
          remark: e.remark,
          materialId: e.materialId,
          planDetailId: e.planDetailId
        })
      })
      // 填充参数
      this.ruleForm = data
      this.quotationList = data.quotationList
      this.orgKey++ // 项目重新赋值
      this.suppliers = data.supplier
      // 是否可以提交
      var isCan = false
      data.supplier.forEach(e => {
        if (e.state >= 2) {
          isCan = true
        }
      })
      this.canSubmit = isCan
      this.keyFillMode += 1
      this.suppliers.forEach(e => {
        // if (e.state === 0) {
        //   this.canSend = true
        // } else {
        //   this.disabled = true
        // }
        if (e.state !== 0) {
          this.disabled = true
        }
      })
      // 填充 明细列表
      this.list = pom
      this.loading = false // loading 状态关闭
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
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.addMaterial(data, state)
      this.setColumnShow()
      this.dialogTableVisible = false
    },
    checkTask() {
      this.dialogTitle = '选择任务单'
      this.comName = 'CheckTask'
      this.dialogWidth = '100%'
      if (this.ruleForm.times > 1) {
        this.currentRow = this.ruleForm
      }
      this.fileList = []
      this.dialogTableVisible = true
    },
    getRemotePerson(query) {
      if (query.length > 0) {
        query = query.trim()
        setTimeout(() => {
          getPersonList({ name: query }).then(response => {
            this.personList = response.data
          })
        }, 200)
      } else {
        getPersonList().then(response => {
          this.personList = response.data
        })
      }
    },
    addMaterial(data, state) {
      if (state === 'add') {
        var times = this.ruleForm.times
        this.ruleForm = {
          orgId: data.form.orgId,
          taskNumber: data.form.number,
          taskId: data.form.id,
          executeUserId: data.form.buyerId,
          planId: data.form.planId,
          state: 0,
          times: times
        }
        this.orgKey++
        var pom = []
        data.list.forEach(e => {
          pom.push({
            categoryId: e.categoryId,
            category: e.category,
            unit2: e.unit2,
            brand: e.brand,
            model: e.model,
            spec: e.spec,
            thickness: e.thickness,
            texture: e.texture,
            surfaceTreatment: e.surfaceTreatment,
            designNumber: e.designNumber,
            applicationQuantity: e.applicationQuantity,
            applicationQuantity2: e.applicationQuantity2,
            quantity: e.quantity,
            quantity2: e.quantity2,
            entryDate: e.entryDate,
            remark: e.remark,
            materialId: e.materialId,
            planDetailId: e.id
          })
        })
        this.list = pom
      } else if (state === 'addSuppliers') {
        // 新增参标单位
        data.list.forEach(e => {
          var arr = {}
          // arr.id = 0
          arr.quotationId = this.id
          arr.supplierId = e.supplierId
          arr.state = 0
          arr.contacts = e.contacts
          arr.contactsPhone = e.contactsPhone
          // arr.fillMode = null
          arr.supplier = e
          this.suppliers.push(arr)
        })
        addQuotationSupplier(this.suppliers).then(response => {
          this.suppliers = response.data
          // this.initData()
          // this.$alert('添加成功！')
        })
      } else {
        this.initData()
      }
    },
    getSupplierRate(rate) {
      var supplierRate = this.supplierRateOptions.find(f => f.value === rate)
      return supplierRate.name
    },
    addSupplier() {
      this.dialogTitle = '选择参标单位'
      this.comName = 'QuotationSuppliersAdd'
      this.currentRow = this.suppliers
      this.dialogWidth = '100%'
      this.fileList = []
      this.dialogTableVisible = true
    },
    del(d) {
      // 删除数据库这一条数据
      deleteQuotationSupplier(d).then(response => {
        this.suppliers = response.data
        // this.initData()
      })
    },
    getquotationSupState(state) {
      var quotationSupplier = this.quotationSupStateOptions.find(f => f.value === state)
      return quotationSupplier.name
    },
    send() {
      this.loading = true
      sendQuotationSupplier(this.suppliers).then(response => {
        this.suppliers = response.data
        this.loading = false
        this.initData()
        this.$message.error(response.message)
      })
    },
    fill(row) {
      this.dialogTitle = row.row.supplier.name + '-填报'
      this.comName = 'QuotationSupplier'
      this.currentRow = row.row
      this.dialogWidth = '100%'
      this.fileList = []
      this.dialogTableVisible = true
    },
    attitude() {
      this.closeThePage()
      this.$router.push({ name: 'QuotationAttitude', query: { id: this.id, refreshRouterName: this.$route.name }, params: { id: this.id }})
    },
    detail(row) {
      this.$router.push({ name: 'QuotationAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    getOrgName(id) {
      var orgList = this.getOrgList.find(f => f.id === id)
      if (orgList) {
        return orgList.name
      } else {
        return ''
      }
    }
    // openTask(taskId) {
    //   this.$router.push({ name: 'TaskDetail', query: { id: taskId, refreshRouterName: this.$route.name, tab: 'detail' }, params: { id: taskId, isCheck: false }})
    // },
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px;margin-top: 10px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
