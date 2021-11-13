<template>
  <div class="app-container">
    <div v-if="activate" style="padding:10px 0px;">
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
            <el-form-item label="部门">
              {{ orgStr }}
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

    <!-- 材料分类数据 -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column label="材料Id" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.planDetailId }}
        </template>
      </el-table-column>
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
          {{ scope.row.categoryUnit }}
        </template>
      </el-table-column>
      <el-table-column label="主数量" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.unit2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.quantity2 }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="进场日期" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.entryDate | dateFormat }}
        </template>
      </el-table-column> -->
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否主单位" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.isUnit }}
        </template>
      </el-table-column>
      <el-table-column label="设计单位" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.desUnit }}
        </template>
      </el-table-column>
      <el-table-column label="设计数量" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.desQuantity }}
        </template>
      </el-table-column> -->
    </el-table>

    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="attitudePara"
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

    <!-- <msg-info :person-array="personArr" :bill-id="39" :bill-flow-id="149" :page-id="41" /> -->

    <!-- <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :file-list="fileList" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div> -->
  </div>
</template>
<script>
// import { getPlanBillAttitudeById } from '@/api/cggl/plan'
import { getPlanDesignOrderById, addAttitude } from '@/api/cggl/designOrder'
// import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
// import UpFile from '@/components/UpLoad/UpFile'
// import TaskAdd from '@/views/cggl/task/taskAdd'
// import PlanDetailCancel from './cancel/planDetailCancel'
// import MsgInfo from '@/components/Other/msgInfo.vue'
export default {
  name: 'DesignOrderAttitude',
  components: {
    // OrgSelect2,
    FlowAttitude,
    FlowDisplay
    // UpFile,
    // TaskAdd,
    // PlanDetailCancel,
    // MsgInfo
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: 0,
        // planId: 0,
        state: 0,
        billFlowId: 0
      },
      // planDesignOrderDetail: [],
      loading: false,
      // isLoad: true,
      // loadFlowAttitude: false,
      activate: false,
      // dialogTableVisible: false,
      // dialogTitle: '保存',
      // dialogWidth: '70%',
      // comName: 'PlanDetailAdd',
      // fullscreen: false,

      list: [],
      planData: null,
      billFlow: null,
      attitudePara: null,
      // personArr: [{ id: 4, name: '银角大王' }, { id: 10, name: '薛飞' }],
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
      }
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.activate = true
    }
  },
  methods: {
    initData() {
      if (this.$route.query.id) {
        this.ruleForm.id = this.$route.query.id
        // this.loading = true
        getPlanDesignOrderById({ id: this.ruleForm.id })
          .then(response => this.setData(response))
          .catch(() => { this.loading = true })
      }
    },
    setData(response) {
      // 验证
      // if (!response.success) {
      //   this.$alert(response.message, {
      //     callback: action => {
      //       this.closeThePage()
      //     }
      //   })
      // }

      // data 设计下单数据
      const { data, orgStr, billFlowData } = response
      const { planDesignOrderDetail } = data
      // 检查当前 状态 是否有特殊操作，有就跳转
      // var filterOption = billFlowData.billFlowNode.filter(f => f.isCurrentState)
      // if ((filterOption || []).length) {
      //   if (filterOption[0].option > 0) {
      //     // alert('当前节点有特殊操作')
      //     if (filterOption[0].option === 1) {
      //       // 分配任务单
      //       this.special_operation = true
      //     }
      //   } else {
      //     this.special_operation = false
      //   }
      // }
      this.orgStr = orgStr

      this.ruleForm = {
        id: data.id,
        number: data.number,
        orgId: data.orgId,

        state: data.state,
        billFlowId: data.billFlowId,
        createUserName: data.createUserName,
        submitUserName: data.submitUserName,
        lastEditUserName: data.lastEditUserName,

        createDate: data.createDate,
        submitDate: data.submitDate,
        lastEditDate: data.lastEditDate
        // fileList: data.upFile.filter(f => f.tableId === planData.id)
        // organization: planData.organization
      }

      var pom = []
      planDesignOrderDetail.forEach(e => {
        const { material } = e
        const { materialCategory } = material

        pom.push({
          id: e.id,
          planDetailId: e.planDetailId,
          planDesignOrderId: e.planDesignOrderId,
          materialId: e.materialId,
          categoryId: material.categoryId,
          categoryName: materialCategory.name,
          categoryUnit: materialCategory.unit, // 主单位
          unit2: material.unit2,
          brand: material.brand,
          model: material.model,
          spec: material.spec,
          thickness: material.thickness,
          texture: material.texture,
          surfaceTreatment: material.surfaceTreatment,
          designNumber: material.designNumber,
          // applicationQuantity: e.applicationQuantity,
          // applicationQuantity2: e.applicationQuantity2,
          quantity: e.quantity,
          quantity2: e.quantity2,
          entryDate: e.entryDate,
          remark: e.remark
        })
      })
      console.log('审批pom:', pom)
      this.list = pom
      this.billFlow = billFlowData

      // **start**信息意见组件需要的数据
      // this.personArr = billFlowData.billFlowNode.map(m => { return { id: m.person.id, name: m.person.name } })
      // **end**信息意见组件需要的数据

      // 加载流程组件
      this.attitudePara = { formId: billFlowData.formId, billFlowId: billFlowData.id, planId: billFlowData.billId }
      // this.loadFlowAttitude = true

      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true
    },
    updateFlow() {
      // 修改计划单据state状态
      // this.loading = true
      // this.billFlow = null
      // putPlanState({ id: data.billId, state: data.state }).then(response => {
      //   this.loading = false
      //   // 重新加载 流程
      //   this.closeThePage()
      // })
      this.closeThePage()
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },

    // dialogClose() {
    //   this.loading = true
    //   this.activate = false // 销毁
    //   getPlanBillAttitudeById({ id: this.id }).then(response => this.setData(response))
    //   this.dialogTableVisible = false
    // },
    // showFileList(fileList) {
    //   this.dialogTitle = '附件列表'
    //   this.comName = 'UpFile'
    //   this.dialogWidth = '50%'
    //   this.fileList = fileList
    //   this.dialogTableVisible = true
    // },
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
    // getFormState(row) {
    //   if (!row.billFlow) { return '流程空' }
    //   const formState = row.billFlow.form.formState
    //   this.formState = formState
    //   const state = row.state
    //   if (state === -1) return '作废'
    //   const obj = formState.find(f => f.value === state)
    //   if (obj) { return obj.name } else { return '状态不详' }
    // },
    // getPerson(bf) {
    //   if (bf) {
    //     var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
    //     return arr.map(m => m.person.name).join('、')
    //   }
    // },
    attitude(row) {
      this.$router.push({ name: 'PlanDetailCancelAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
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

.task_div{
  padding-top: 30px;
}
</style>
}
