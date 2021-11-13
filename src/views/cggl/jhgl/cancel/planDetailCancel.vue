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
            <el-form-item label="项目" prop="orgId">
              {{ ruleForm.orgStr }}
            </el-form-item>
            <el-form-item label="计划单号" prop="planNumber">
              {{ ruleForm.planNumber }}
            </el-form-item>
          </el-col>

          <el-col :sm="12" :xs="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
            <el-form-item label="附件">
              <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 材料分类数据 -->
      <el-table
        v-loading="loading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column type="index" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" width="55">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>-->
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
        <el-table-column label="主数量" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.applicationQuantity }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.unit2 }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.applicationQuantity2 }}
          </template>
        </el-table-column>
        <el-table-column label="计划单材料备注" align="center" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.remark }}
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
        <!-- <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button> -->
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <!-- <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button> -->
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>
    <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div>
  </div>
</template>

<script>
import { cancelPlanDetailsSubmit, getMaterialCancelBillFlow } from '@/api/cggl/plan'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'PlanDetailCancel',
  components: {
    FlowSelect,
    FlowAttitude,
    UpFile
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        orgStr: '',
        planNumber: '',
        remark: '',
        state: 0,
        billFlowId: 0,
        fileList: []
      },
      loading: false,
      active: 0,
      listIndex: 0,
      list: [],
      billFlow: null,
      attitudePara: null,
      loadFlow: false,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true },
      rules: {
      }
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
    if (this.obj) {
      this.setData(this.obj)
    }
  },
  mounted() {
    if (this.obj) {
      this.setData(this.obj)
    }
  },
  methods: {
    // 根据表单获取流程
    getDynamicFlow() {
      var newObj = JSON.parse(JSON.stringify(this.ruleForm))
      // 拼接材料明细参数
      var arr1 = []
      this.list.forEach(e => {
        var m = {}
        m.categoryId = e.categoryId
        m.categoryName = e.category.name
        m.unit2 = e.unit2
        m.brand = e.brand
        m.model = e.model
        m.spec = e.spec
        m.thickness = e.thickness
        m.texture = e.texture
        m.surfaceTreatment = e.surfaceTreatment
        m.designNumber = e.designNumber
        var item = {}
        item.material = m
        item.id = e.id
        item.isMain = e.category.isMain
        item.applicationQuantity = e.applicationQuantity
        item.applicationQuantity2 = e.applicationQuantity2 || 0
        item.quantity = e.quantity
        item.quantity2 = e.quantity2
        item.entryDate = e.entryDate
        item.remark = e.remark
        item.targetCostMaterialId = e.targetCostMaterialId
        arr1.push(item)
      })
      if (arr1.length === 0) {
        this.$message('明细不能为空！')
        return
      }

      newObj.planDetails = arr1
      this.loading = true
      getMaterialCancelBillFlow(newObj).then(response => {
        this.loading = false
        if (response.success) {
          this.billFlow = response.data.billFlow
          this.active = 1
        } else {
          this.$message(response.message)
        }
      }).catch(() => { this.loading = false })
      this.loading = false
    },
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 计划状态
          newObj.state = state
          // 拼接材料明细参数
          var arr1 = []
          this.list.forEach(e => {
            var m = {}
            m.categoryId = e.categoryId
            m.categoryName = e.category.name
            // m.unit = e.category.unit
            m.unit2 = e.unit2
            m.brand = e.brand
            m.model = e.model
            m.spec = e.spec
            m.thickness = e.thickness
            m.texture = e.texture
            m.surfaceTreatment = e.surfaceTreatment
            m.designNumber = e.designNumber
            var item = {}
            item.material = m
            // item.fileList = []
            // if (e.fileList.length) {
            //   item.fileList = e.fileList.map(m => { return { id: m.id, addFlag: m.addFlag } })
            // }
            item.id = e.id
            item.applicationQuantity = e.applicationQuantity
            item.applicationQuantity2 = e.applicationQuantity2 || 0
            item.quantity = e.quantity
            item.quantity2 = e.quantity2
            item.entryDate = e.entryDate
            item.remark = e.remark
            item.targetCostMaterialId = e.targetCostMaterialId
            item.state = 0
            arr1.push(item)
          })
          newObj.planDetails = arr1

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
          newObj.billFlow = billFlow

          // 保存单据
          this.loading = true
          cancelPlanDetailsSubmit(newObj).then(response => {
            if (response.errorMsg) {
              // 验证错误
              this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                { dangerouslyUseHTMLString: true })
              return
            }
            this.$message(response.message)
            this.loading = false
            this.$emit('dialogClose')
          }).catch(() => { this.loading = false })
        }
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    setData(response) {
      this.ruleForm = {
        planId: response.planId,
        planNumber: response.planNumber,
        orgId: response.orgId,
        orgStr: response.orgStr,
        state: 0,
        fileList: []
      }
      // 填充 明细列表
      this.list = response.planDetail
      // this.billFlow = data.billFlow
      this.setColumnShow()
      this.loading = false // loading 状态关闭

      // 如果 存在单据和 流程Id 就加载审批组件
    //   if (data.id && data.billFlowId) {
    //     this.attitudePara = { planId: data.id, billFlowId: data.billFlowId }
    //     this.loadFlow = true // 加载审批组件
    //   }
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
    }
    // cancel() { // 作废
    //   this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
    //     type: 'warning'
    //   }).then(() => {
    //     this.loading = true
    //     deletePlan({ id: this.ruleForm.id }).then(response => {
    //       this.$message(response.message)
    //       this.loading = false
    //       this.closeThePage()
    //     })
    //   }).catch(() => {})
    // }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
