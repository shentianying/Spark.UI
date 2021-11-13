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
            <el-form-item label="计划编号" prop="number">
              {{ ruleForm.number }}
              <!-- <el-input v-model="ruleForm.number" disabled readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" /> -->
            </el-form-item>

            <el-form-item
              label="项目"
              prop="orgId"
            >
              {{ orgStr }}
            </el-form-item>

            <el-form-item label="计划类型" prop="planType">
              {{ ruleForm.planTypeName }}
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
            <el-form-item label="附件">
              <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
            </el-form-item>
          </el-col>

          <el-col :sm="12" :xs="24">
            <el-form-item label="实际计划单号">
              {{ ruleForm.realNumber }}
            </el-form-item>
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
            <el-form-item label="材料类型" prop="materialType">
              {{ ruleForm.materialTypeName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="flex_div">
      <excel-export
        style="margin-right:10px;"
        book-type="xlsx"
        filename="计划材料明细"
        :sheet="sheet"
        :on-error="onError"
        :before-start="beforeStart"
      >
        <el-button :loading="loading" size="mini">导出计划材料明细</el-button>
      </excel-export>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="材料明细">
        <div v-show="special_operation" class="flex_div">
          <el-button :loading="loading" type="success" size="mini" @click="addTask()">分配任务单</el-button>
          <el-button :loading="loading" type="danger" size="mini" @click="returnMaterial()">退回材料</el-button>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="special_operation" type="selection" :selectable="selectInit" fixed="left" align="center" width="55" />
          <el-table-column type="index" width="55" align="center" />
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
          <el-table-column label="进场日期" align="center" width="100">
            <template slot-scope="scope">
              {{ scope.row.entryDate | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope">
              {{ stateList.find(f=>f.value === scope.row.state).name }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="附件" align="center" width="100">
            <template slot-scope="scope">
              <el-link v-if="scope.row.fileList.length" type="info" @click="showFileList(scope.row.fileList)">查看</el-link>
              <span v-else>-</span>
            </template>
          </el-table-column> -->
          <el-table-column label="备注" align="center" min-width="200">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="任务单明细">
        <!-- 任务单信息 -->
        <el-table
          v-loading="loading"
          :data="taskList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column type="index" width="55" align="center" />
          <el-table-column label="编号" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.number }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="项目" align="center" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.organization.name }}
            </template>
          </el-table-column> -->
          <el-table-column label="采购员" align="center" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.person.name }}
            </template>
          </el-table-column>
          <el-table-column label="下达时间" align="center" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.createDate | dateTimeFormat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="10">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state===0" type="primary" effect="plain">待确认</el-tag>
              <el-tag v-if="scope.row.state===-1" type="success" effect="plain">拒收</el-tag>
              <el-tag v-if="scope.row.state===10000" type="info" effect="plain">已确认</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="10">
            <template slot-scope="scope">
              <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
                <el-button size="mini" class="el-icon-view" plain circle @click="taskDetail(scope.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="退回单明细">
        <!-- 退回单明细 -->
        <el-table
          v-loading="loading"
          :data="cancelList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column type="index" width="55" align="center" />
          <el-table-column label="编号" align="center" min-width="30">
            <template slot-scope="scope">
              {{ scope.row.number }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="项目" align="center" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.organization.name }}
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="待审批人" min-width="50" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ getPerson(scope.row.billFlow) }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="10">
            <template slot-scope="scope">
              <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="10">
            <template slot-scope="scope">
              <el-tooltip content="审查" effect="light" placement="left-start" :enterable="false">
                <el-button v-if="scope.row.state>0" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
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

    <!-- <msg-info :person-array="personArr" :bill-id="39" :bill-flow-id="149" :page-id="41" /> -->

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
import { getPlanBillAttitudeById, addAttitudeForPlan } from '@/api/cggl/plan'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
import TaskAdd from '@/views/cggl/task/taskAdd'
import PlanDetailCancel from './cancel/planDetailCancel'
import { ExcelExport } from 'pikaz-excel-js'
// import MsgInfo from '@/components/Other/msgInfo.vue'
export default {
  name: 'PlanAttitude',
  components: {
    OrgSelect2,
    FlowAttitude,
    FlowDisplay,
    UpFile,
    TaskAdd,
    PlanDetailCancel,
    ExcelExport
    // ExcelImport
    // MsgInfo
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        planType: '',
        planTypeName: '',
        materialTypeName: '',
        realNumber: '',
        remark: '',
        state: 0,
        billFlowId: 0,
        organization: null,
        fileList: []
      },
      special_operation: false,
      loading: false,
      isLoad: false,
      orgStr: '',
      // personArr: [{ id: 4, name: '银角大王' }, { id: 10, name: '薛飞' }],
      activate: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      listIndex: 0,
      fullscreen: false,
      list: [],
      fileList: [], // 上传文件列表
      billFlow: null,
      attitudePara: {},
      multipleSelection: [],
      stateList: [],
      taskList: [],
      cancelList: [],
      formState: null,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true },
      sheet: [{
        // title: '材料计划导入模板',
        keys: [],
        tHeader: [],
        // keys: ['planDetailId', 'isUnit', 'unit', 'quantity', 'remark'],
        // tHeader: ['材料Id', '是否用主单位', '单位名称', '数量', '备注'],
        table: [], // 默认数据
        // colWidth: ['10', '15', '15', '10', '30'],
        // cellStyle: ['string', 'string', 'string', 'string', 'string'], // 单元格样式
        sheetName: '计划材料明细'
      }],
      rules: {
        // orgId: [{ required: true, message: '请输入', trigger: 'change' }],
        // planType: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
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
        await getPlanBillAttitudeById({ id: this.id }).then(response => this.setData(response))
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
      const { planData, billFlowData, planType, orgStr, materialType, detailStates } = response
      // 检查当前 状态 是否有特殊操作
      var filterOption = billFlowData.billFlowNode.filter(f => f.isCurrentState)
      if ((filterOption || []).length) {
        if (filterOption[0].option > 0) {
          // alert('当前节点有特殊操作')
          if (filterOption[0].option === 1) {
            // 分配任务单
            this.special_operation = true
          }
        } else {
          this.special_operation = false
        }
      }
      this.orgStr = orgStr
      this.stateList = detailStates
      this.taskList = planData.cgTasks // 任务单列表
      this.cancelList = planData.planDetailCancels // 退回单列表
      var pom = []
      planData.planDetail.forEach(e => {
        pom.push({
          id: e.id,
          categoryId: e.material.categoryId,
          category: { id: e.material.categoryId,
            name: e.material.materialCategory.name,
            unit: e.material.materialCategory.unit,
            isMain: e.material.materialCategory.isMain },
          unit: e.material.unit, // unit已经不存在了
          unit2: e.material.unit2,
          brand: e.material.brand,
          model: e.material.model,
          spec: e.material.spec,
          thickness: e.material.thickness,
          texture: e.material.texture,
          surfaceTreatment: e.material.surfaceTreatment,
          designNumber: e.material.designNumber,
          applicationQuantity: e.applicationQuantity,
          applicationQuantity2: e.applicationQuantity2,
          quantity: e.quantity,
          quantity2: e.quantity2,
          entryDate: e.entryDate,
          remark: e.remark,
          state: e.state,
          fileList: planData.upFile.filter(f => f.tableId === e.id)
        })
      })
      // 填充参数
      this.ruleForm = {
        id: planData.id,
        number: planData.number,
        orgId: planData.orgId,
        planTypeName: planType.name,
        materialTypeName: materialType.name,
        realNumber: planData.realNumber,
        remark: planData.remark,
        state: planData.state,
        billFlowId: planData.billFlowId,
        createUserName: planData.createUserName,
        submitUserName: planData.submitUserName,
        lastEditUserName: planData.lastEditUserName,

        createDate: planData.createDate,
        submitDate: planData.submitDate,
        lastEditDate: planData.lastEditDate,
        fileList: planData.upFile.filter(f => f.tableId === planData.id)
        // organization: planData.organization
      }
      // 填充 明细列表
      this.list = pom
      this.billFlow = billFlowData

      // **start**信息意见组件需要的数据
      // this.personArr = billFlowData.billFlowNode.map(m => { return { id: m.person.id, name: m.person.name } })
      // **end**信息意见组件需要的数据

      this.attitudePara = { formId: billFlowData.formId, billFlowId: planData.billFlowId, planId: planData.id }
      if (this.special_operation) {
        this.isLoad = false // 分配任务单不加载审批组件
      } else {
        this.isLoad = true // 加载审批组件
      }

      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
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

    dialogClose() {
      this.loading = true
      this.activate = false // 销毁
      getPlanBillAttitudeById({ id: this.id }).then(response => this.setData(response))
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    addTask() {
      if (this.multipleSelection.length > 0) {
        this.dialogTitle = '分配任务单'
        this.comName = 'TaskAdd'
        this.dialogWidth = '100%'
        this.fileList = []
        var data = {
          planId: this.id,
          planNumber: this.ruleForm.number,
          orgId: this.ruleForm.orgId,
          data: this.multipleSelection
        }
        this.currentRow = data
        this.fullscreen = true
        this.dialogTableVisible = true
      } else {
        this.$message.error('必须选择材料！')
      }

      // if (this.multipleSelection.length > 0) {
      //   this.$router.push({ name: 'TaskAdd', query: { refreshRouterName: this.$route.name, planId: this.id, planNumber: this.ruleForm.number }, params: { data: this.multipleSelection,
      //     orgId: this.ruleForm.orgId,
      //     orgStr: this.orgStr,
      //     planNumber: this.ruleForm.number,
      //     planTypeName: this.ruleForm.planTypeName,
      //     materialTypeName: this.ruleForm.materialTypeName }})
      // } else {
      //   this.$alert('必须选择材料！')
      // }
    },
    returnMaterial() {
      if (this.multipleSelection.length > 0) {
        this.dialogTitle = '材料退回'
        this.comName = 'PlanDetailCancel'
        this.dialogWidth = '100%'
        this.fileList = []
        var data = {
          planId: this.id,
          planNumber: this.ruleForm.number,
          orgId: this.ruleForm.orgId,
          orgStr: this.orgStr,
          planDetail: this.multipleSelection
        }
        this.currentRow = data
        this.fullscreen = true
        this.dialogTableVisible = true
      } else {
        this.$message.error('必须选择材料！')
      }
    },
    taskDetail(row) {
      this.$router.push({ name: 'TaskDetail', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'detail' }, params: { id: row.id }})
    },
    selectInit(row, index) {
      if (row.state === 0) {
        return true
      } else {
        return false
      }
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
    attitude(row) {
      this.$router.push({ name: 'PlanDetailCancelAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    onError(err) {
      this.$message.info('导出失败：' + err)
    },
    beforeStart(bookType, filename, sheet) {
      // 清空 sheet
      this.sheet[0].keys = []
      this.sheet[0].tHeader = []
      this.sheet[0].table = []

      var k = this.sheet[0].keys
      var t = this.sheet[0].tHeader
      var sheetTableData = []

      this.list.forEach((e, i) => {
        var obj = {}
        obj['planDetailId'] = e.id
        if (i === 0) {
          k.push('planDetailId')
          t.push('计划材料明细编号')
        }
        obj['categoryName'] = e.category.name
        if (i === 0) {
          k.push('categoryName')
          t.push('材料名称')
        }
        // if (this.columnShow.brand) {
        obj['brand'] = e.brand
        if (i === 0) {
          k.push('brand')
          t.push('品牌/产地')
        }
        // }
        // if (this.columnShow.model) {
        obj['model'] = e.model
        if (i === 0) {
          k.push('model')
          t.push('型号')
        }
        // }
        // if (this.columnShow.spec) {
        obj['spec'] = e.spec
        if (i === 0) {
          k.push('spec')
          t.push('规格/尺寸')
        }
        // }
        // if (this.columnShow.thickness) {
        obj['thickness'] = e.thickness
        if (i === 0) {
          k.push('thickness')
          t.push('厚度')
        }
        // }
        // if (this.columnShow.texture) {
        obj['texture'] = e.texture
        if (i === 0) {
          k.push('texture')
          t.push('材质')
        }
        // }
        // if (this.columnShow.surfaceTreatment) {
        obj['surfaceTreatment'] = e.surfaceTreatment
        if (i === 0) {
          k.push('surfaceTreatment')
          t.push('表面处理/工艺、色号')
        }
        // }
        // if (this.columnShow.designNumber) {
        obj['designNumber'] = e.designNumber
        if (i === 0) {
          k.push('designNumber')
          t.push('设计编号')
        }
        // }
        obj['unit'] = e.category.unit
        if (i === 0) {
          k.push('unit')
          t.push('主单位')
        }
        obj['applicationQuantity'] = e.applicationQuantity
        if (i === 0) {
          k.push('applicationQuantity')
          t.push('主数量')
        }
        obj['unit2'] = e.unit2
        if (i === 0) {
          k.push('unit2')
          t.push('辅单位')
        }
        obj['applicationQuantity2'] = e.applicationQuantity2
        if (i === 0) {
          k.push('applicationQuantity2')
          t.push('辅数量')
        }
        obj['entryDate'] = e.entryDate
        if (i === 0) {
          k.push('entryDate')
          t.push('进场日期')
        }
        obj['remark'] = e.remark
        if (i === 0) {
          k.push('remark')
          t.push('备注')
        }
        // if (i === 0) {
        //   obj['isUnit'] = ''
        //   k.push('isUnit')
        //   t.push('是否主单位')
        //   obj['desUnit'] = ''
        //   k.push('desUnit')
        //   t.push('设计单位')
        //   obj['desQuantity'] = ''
        //   k.push('desQuantity')
        //   t.push('设计数量')
        // }
        sheetTableData.push(obj)
      })
      console.log('sheet列表: ', sheetTableData)
      this.sheet[0].table = sheetTableData
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
        addAttitudeForPlan(postData).then(res => {
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
