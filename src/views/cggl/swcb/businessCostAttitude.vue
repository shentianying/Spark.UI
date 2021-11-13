<template>
  <div v-if="activate" class="app-container">
    <div style="padding:10px 0px;">
      <!-- <h2>计划单</h2> -->
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
              {{ ruleForm.number }}
              <!-- <el-input v-model="ruleForm.number" disabled readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" /> -->
            </el-form-item>

            <el-form-item label="项目" prop="orgId">
              {{ orgStr }}
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
            <el-form-item label="备注">
              {{ ruleForm.remark }}
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
            <!-- <el-form-item label=" ">
              &nbsp;
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="flex_div">
      <excel-export style="margin-right:10px;" book-type="xlsx" filename="商务成本材料导出" :before-start="beforeStart" :sheet="sheet" :on-error="onError">
        <el-button :loading="loading" size="mini">导出材料</el-button>
      </excel-export>
    </div>
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
      <el-table-column label="材料名称" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.materialCategory.name }}
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.materialCategory.unit }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>

    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

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
        <el-button size="mini" type="success" :loading="loading" @click="submitForm()">保存</el-button>
      </template>
      <template #otherBtn>
        <!-- <el-button size="mini" type="der">测试其他插槽</el-button> -->
      </template>
    </flow-attitude>

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
import { getBusinessCostBillAttitudeById, addAttitude } from '@/api/cggl/businessCost'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
import { ExcelExport } from 'pikaz-excel-js'
export default {
  name: 'BusinessCostAttitude',
  components: {
    OrgSelect2,
    FlowAttitude,
    FlowDisplay,
    UpFile,
    ExcelExport
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        remark: '',
        state: 0,
        billFlowId: 0,
        organization: null
      },
      loading: false,
      isLoad: false,
      orgStr: '',
      // showbuttons: false,
      activate: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'BusinessDetailAdd',
      currentRow: null,
      listIndex: 0,
      list: [],
      fileList: [], // 上传文件列表
      billFlow: null,
      attitudePara: {},
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
        // planType: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      sheet: [{
        // title: '材料导入模板',
        tHeader: ['材料名称', '单位', '数量', '单价', '总金额', '备注',
          '辅单位', '品牌/产地', '型号', '规格/尺寸', '厚度', '材质',
          '表面处理/工艺、色号', '设计编号'],
        table: [],
        keys: ['CategoryName', 'Unit', 'Quantity', 'Price', 'Amount', 'Remark',
          'Unit2', 'Brand', 'Model', 'Spec', 'Thickness', 'Texture', 'SurfaceTreatment',
          'DesignNumber'],
        sheetName: '商务成本材料明细'
      }],
      cols: []
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.ruleForm.orgId = null // 刷新 org 列表
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.activate = true
    }
    // getDictionaryList({ type: 'cgglPlanType' }).then(response => {
    //   const { data } = response
    //   this.planTypeList = data
    // })
  },
  methods: {
    async initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁
        await getBusinessCostBillAttitudeById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      // 验证
      if (!response.success) {
        this.$alert(response.message, {
          callback: action => {
            this.closeThePage()
          }
        })
      }
      const { businessCostData, billFlowData, orgStr } = response
      // 检查当前 状态 是否有特殊操作，有就跳转
      var filterOption = billFlowData.billFlowNode.filter(f => f.isCurrentState)
      if (filterOption) {
        // if (filterOption[0].option > 0) {
        //   alert('当前节点有特殊操作')
        // }
      }
      this.orgStr = orgStr
      // 填充参数
      this.ruleForm = {
        id: businessCostData.id,
        number: businessCostData.number,
        orgId: businessCostData.orgId,
        remark: businessCostData.remark,
        state: businessCostData.state,
        billFlowId: businessCostData.billFlowId,
        createUserName: businessCostData.createUserName,
        submitUserName: businessCostData.submitUserName,
        lastEditUserName: businessCostData.lastEditUserName,

        createDate: businessCostData.createDate,
        submitDate: businessCostData.submitDate,
        lastEditDate: businessCostData.lastEditDate
        // organization: planData.organization
      }
      // 填充 明细列表
      this.list = businessCostData.businessCostDetails
      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: businessCostData.billFlowId, planId: businessCostData.id }
      this.isLoad = true // 加载审批组件

      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
    },
    updateFlow(data) {
      // 修改计划单据state状态
      // this.loading = true
      // this.billFlow = null
      // putBusinessCostState({ billId: data.billId, state: data.state }).then(response => {
      //   this.loading = false
      //   // 重新加载 流程
      //   // this.billFlow = data
      //   this.closeThePage()
      // })
      this.closeThePage()
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.addMaterial(data, state)
      this.setColumnShow()
      this.dialogTableVisible = false
    },
    showFileList(fileList) {
      // console.log('fileList:', fileList)
      this.dialogTitle = '附件列表'
      this.comName = 'UpFile'
      this.dialogWidth = '50%'
      this.fileList = fileList
      this.dialogTableVisible = true
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
    beforeStart(bookType, filename, sheet) {
      const data = sheet
      const exportData = []
      this.list.forEach(e => {
        console.log(e)
        var m = {}
        m.CategoryName = e.name
        m.Unit = e.unit
        m.Quantity = e.quantity
        m.Price = e.price
        m.Amount = e.amount
        m.Remark = e.remark
        m.Unit2 = e.propertyList.find(f => f.materialField === 'unit2').nameArray
        m.Brand = e.propertyList.find(f => f.materialField === 'brand').nameArray
        m.Model = e.propertyList.find(f => f.materialField === 'model').nameArray
        m.Spec = e.propertyList.find(f => f.materialField === 'spec').nameArray
        m.Thickness = e.propertyList.find(f => f.materialField === 'thickness').nameArray
        m.Texture = e.propertyList.find(f => f.materialField === 'texture').nameArray
        m.SurfaceTreatment = e.propertyList.find(f => f.materialField === 'surfaceTreatment').nameArray
        m.DesignNumber = e.propertyList.find(f => f.materialField === 'designNumber').nameArray
        exportData.push(m)
      })
      data[0].table = exportData
    },
    onError(err) {
      this.$message.info('导出失败：' + err)
    },
    submitForm() {
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
</style>
