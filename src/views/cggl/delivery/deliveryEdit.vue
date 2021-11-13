<template>
  <div class="app-container">
    <div class="flex_div">
      <el-button v-if="ruleForm.id>0" :loading="loading" type="danger" size="mini" @click="cancel()">作废</el-button>
      <el-button v-if="ruleForm.state<1" :loading="loading" type="success" size="mini" @click="submitForm(1)">提交</el-button>
      <el-button v-if="ruleForm.state<1" :loading="loading" type="success" size="mini" @click="submitForm(0)">保存</el-button>
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
            <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="供应商" prop="supplierId">
            <el-select v-model="ruleForm.supplierId" style="width:100%">
              <el-option v-for="(item,index) in suppliers" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item
            v-if="activate"
            label="项目"
            prop="orgId"
          >
            <org-select2
              :key="orgKey"
              v-model="ruleForm.orgId"
              disabled
              :data-mode="0"
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
          <el-form-item label="送货日期" prop="deliveryDate">
            <el-date-picker
              v-model="ruleForm.deliveryDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
              style="width:100%"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="附件">
            <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex_div">
      <el-button :loading="loading" size="mini" @click="add()">选择材料</el-button>
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
      <el-table-column label="已送货主数量" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.alreadyQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="本次送货主数量" align="center" width="200">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.quantity" controls-position="right" size="mini" :step="0.0001" :min="1" :max="scope.row.maxQuantity" @change="handleChange" />
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
      <el-table-column v-if="columnShow.unit2" label="已送货辅数量" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.alreaQuantity2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="本次送货辅数量" align="center" width="200">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.quantity2" controls-position="right" size="mini" :step="0.0001" :min="1" :max="scope.row.maxQuantity2" @change="handleChange" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="80">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
          </el-button-group>
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
import { getDeliveryById, addDelivery, putDelivery, deleteDelivery, getDeliveryDetailsByOrder } from '@/api/cggl/delivery'
import { getSupplierInfo } from '@/api/cggl/supplier'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import OrderDetailCheck from '@/views/cggl/order/orderDetailCheck'
export default {
  name: 'DeliveryEdit',
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
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true },
      rules: {
        deliveryDate: [{ required: true, message: '请选择', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'ruleForm.supplierId': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue) {
          this.list = []
        }
      }, deep: true
    }
  },
  activated() {
    this.initData()
  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.ruleForm.state = state
          this.loading = true
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {}
          var pom = []
          this.list.forEach(e => {
            pom.push({
              orderDetailId: e.orderDetail.id,
              materialId: e.material.id,
              quantity: e.quantity,
              quantity2: e.quantity2,
              remark: e.remark,
              surplusQuantity: e.maxQuantity - e.quantity,
              surplusQuantity2: e.maxQuantity2 - e.quantity2
            })
          })
          postData.supplierId = newObj.supplierId
          postData.orgId = newObj.orgId
          postData.orderId = newObj.orderId
          postData.deliveryDate = newObj.deliveryDate
          postData.remark = newObj.remark
          postData.fileList = newObj.fileList
          postData.state = state
          postData.deliveryDetails = pom

          if (this.id) {
            postData.id = this.id
            putDelivery(postData).then(response => {
              this.closeThePage()
            })
          } else {
            postData.id = 0
            addDelivery(postData).then(response => {
              this.closeThePage()
            })
          }
        }
      })
    },
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
      const { data } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.ruleForm.supplierId = data.supplierId
      this.orgKey++ // 重新加载项目组件
      this.fileListKey++ // 重新加载文件组件
      // 填充 明细列表
      this.list = data.details
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
    add() {
      if (this.ruleForm.supplierId === null) {
        this.$message.error('请选择供应商')
      } else {
        this.dialogTitle = '选择材料'
        this.comName = 'OrderDetailCheck'
        this.currentRow = this.ruleForm
        this.dialogWidth = '100%'
        this.fileList = []
        this.dialogTableVisible = true
      }
    },
    dialogClose(data, state) {
      this.addMaterial(data, state)
      this.dialogTableVisible = false
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
    addMaterial(data, state) {
      if (state === 'check') {
        this.ruleForm.orgId = data.form.orgId
        this.ruleForm.orderId = data.form.id
        getDeliveryDetailsByOrder(data.list).then(response => {
          this.list = response.data
          this.setColumnShow()
        })
        this.orgKey++
      } else {
        this.initData()
      }
    },
    handleChange() {
      //
    },
    del(d) {
      // 页面删除
      this.list.splice(d.$index, 1)
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-top:10px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
