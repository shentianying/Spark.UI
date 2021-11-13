<template>
  <div class="app-container">
    <div class="flex_div">
      <el-button v-if="isFinish===false" :loading="loading" type="danger" size="mini" @click="cancel()">作废</el-button>
      <el-button v-if="isFinish===false" :loading="loading" type="success" size="mini" @click="entry()">入库</el-button>
      <!-- <el-button v-if="ruleForm.state<1" :loading="loading" type="success" size="mini" @click="submitForm(1)">提交</el-button>
      <el-button v-if="ruleForm.state<1" :loading="loading" type="success" size="mini" @click="submitForm(0)">保存</el-button> -->
    </div>
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
          <el-form-item label="送货单号">
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="供应商">
            <el-link :underline="false" @click="openSupplier(ruleForm.supplier.id)">{{ ruleForm.supplier.name }}</el-link>
            <!-- {{ ruleForm.supplier.name }} -->
          </el-form-item>
          <el-form-item label="备注">
            {{ ruleForm.remark }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item v-if="activate" label="项目">
            {{ ruleForm.orgStr }}
          </el-form-item>
          <el-form-item label="送货日期">
            {{ ruleForm.deliveryDate | dateFormat }}
          </el-form-item>
          <el-form-item label="附件">
            <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <div class="flex_div">
      <el-button :loading="loading" size="mini" @click="add()">选择材料</el-button>
    </div> -->
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
      <el-table-column label="订单主数量" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.orderDetail.quantity }}
        </template>
      </el-table-column>
      <el-table-column label="历史送货主数量" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.alreadyQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="本次送货主数量" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.unit2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="订单辅数量" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.orderDetail.quantity2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="历史送货辅数量" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.alreaQuantity2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="本次送货辅数量" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.quantity2 }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>
<script>
import { getDeliveryById, deleteDelivery } from '@/api/cggl/delivery'
import { getSupplierInfo } from '@/api/cggl/supplier'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import OrderDetailCheck from '@/views/cggl/order/orderDetailCheck'
export default {
  name: 'DeliveryDetail',
  components: {
    OrgSelect2,
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    OrderDetailCheck
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        supplierId: null,
        fileList: [],
        order: {},
        supplier: {},
        state: 0
      },
      loading: false,
      activate: true,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'OrderDetailCheck',
      currentRow: null,
      list: [],
      suppliers: [],
      orgKey: 0,
      fileListKey: 0,
      isFinish: false,
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
        // supplierId: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
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
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getDeliveryById({ id: this.id }).then(response => this.setData(response))
      }
      getSupplierInfo().then(response => {
        this.suppliers = response.data
      })
    },
    setData(response) {
      this.loading = true
      const { data, isFinish } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.orgKey++ // 重新加载项目组件
      this.fileListKey++ // 重新加载文件组件
      // 填充 明细列表
      this.list = data.details
      this.setColumnShow()
      this.isFinish = isFinish
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
    cancel() { // 作废
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteDelivery({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    entry() {
      // 入库
      this.$router.push({ name: 'StorageInEdit', query: { deliveryId: this.ruleForm.id, refreshRouterName: this.$route.name }, params: { deliveryId: this.ruleForm.id }})
    },
    openSupplier(id) {
      this.$router.push({ name: 'SupplierDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-top:10px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
