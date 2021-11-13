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
            <el-form-item label="计划编号" prop="number">
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
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :select-data="ruleForm.orgId"
                select-style="width:100%;"
              />
            </el-form-item>

            <el-form-item label="计划类型" prop="planType">
              <el-select v-model="ruleForm.planType" style="width:100%">
                <el-option v-for="(item,index) in planTypeList" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="材料类型" prop="materialType">
              <el-select v-model="ruleForm.materialType" style="width:100%">
                <el-option v-for="(item,index) in materialTypeList" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :xs="24">
            <el-form-item label="实际计划单号" prop="realNumber">
              <el-input v-model="ruleForm.realNumber" size="mini" maxlength="50" />
            </el-form-item>
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
      <div class="flex_div">
        <excel-export style="margin-right:10px;" book-type="xlsx" filename="计划单材料计划导入模板" :sheet="sheet" :on-error="onError">
          <el-button v-show="ruleForm.materialType === 2" :loading="loading" size="mini">下载模板</el-button>
        </excel-export>
        <excel-import style="margin-right:10px;" :on-success="onSuccess">
          <el-button v-show="ruleForm.materialType === 2" :loading="loading" size="mini">导入材料</el-button>
        </excel-import>
        <el-button v-show="ruleForm.materialType === 2" :loading="loading" size="mini" @click="add()">+添加材料</el-button>
        <el-button v-show="ruleForm.materialType === 1" :loading="loading" size="mini" @click="checkMaterials()">选择主材</el-button>
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
        <el-table-column label="是否主材" align="center" min-width="80">
          <template slot-scope="scope">
            {{ getMainMaterial(scope.row.category.isMain) }}
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
            <!-- {{ scope.row.applicationQuantity }} -->
            <el-input v-model="scope.row.applicationQuantity" size="mini" />
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.unit2 }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="100">
          <template slot-scope="scope">
            <!-- {{ scope.row.applicationQuantity2 }} -->
            <el-input v-model="scope.row.applicationQuantity2" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="进场日期" align="center" width="150">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.entryDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
              style="width:100%"
              size="mini"
            />
            <!-- {{ scope.row.entryDate | dateFormat }} -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="附件" align="center" width="100">
          <template slot-scope="scope">
            <el-link v-if="(scope.row.fileList || []).length" type="info" @click="showFileList(scope.row.fileList)">查看</el-link>
          </template>
        </el-table-column> -->
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" align="center" width="80">
          <template slot-scope="scope">
            <el-button-group>
              <el-button v-if="!scope.row.category.isMain" type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
              <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
            </el-button-group>
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
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>

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

    <!-- <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div> -->
  </div>
</template>

<script>
import { putPlan, addPlan, getPlanById, checkPlanDetail, deletePlan, getBillFlow, checkPlanData } from '@/api/cggl/plan'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import PlanDetailAdd from './planDetailAdd'
import TargetCostDetailAll from './targetCostDetailAll'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowSelect from '@/components/Flow/flowSelect'
// import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import { ExcelExport, ExcelImport } from 'pikaz-excel-js'
import UpFile from '@/components/UpLoad/UpFile'
import { validateData } from '@/utils/validate'
import { formatExcelDate, cleanText } from '@/utils/index'

export default {
  name: 'PlanEdit',
  components: {
    PlanDetailAdd,
    TargetCostDetailAll,
    OrgSelect2,
    ExcelExport,
    ExcelImport,
    FlowSelect,
    // FlowDisplay,
    FlowAttitude,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        planType: '',
        materialType: '',
        realNumber: '',
        remark: '',
        state: 0,
        billFlowId: 0,
        organization: null,
        fileList: []
      },
      loading: false,
      // showbuttons: false,
      activate: false,
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      listIndex: 0,
      list: [],
      // fileList: [], // 上传文件列表
      planTypeList: [],
      materialTypeList: [],
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
      sheet: [{
        // title: '材料计划导入模板',
        tHeader: ['材料名称', '品牌/产地', '型号', '规格/尺寸', '厚度', '材质', '表面处理/工艺、色号', '设计编号', '主数量', '辅单位', '辅数量', '进场日期', '备注'],
        table: [],
        keys: ['CategoryName', 'Brand', 'Model', 'Spec', 'Thickness', 'Texture', 'SurfaceTreatment', 'DesignNumber', 'ApplicationQuantity', 'Unit2', 'ApplicationQuantity2', 'EntryDate', 'Remark'],
        sheetName: '材料明细'
      }],
      rules: {
        orgId: [{ required: true, message: '请输入', trigger: 'change' }],
        planType: [{ required: true, message: '请输入', trigger: 'blur' }],
        materialType: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  watch: {
    'ruleForm.orgId': {
      handler: function(value, oldvalue) {
        if (!oldvalue) {
          this.$refs['ruleForm'].validateField('orgId', (valid) => {})
        }
      }, deep: true
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
      this.active = 0
      this.activate = true
      this.ruleForm.orgId = null // 刷新 org 列表
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
    getDictionarysByTypes({ types: 'cgglPlanType,materialType' }).then(response => {
      const { data } = response
      data.forEach(element => {
        element.pid = element.pId
        if (element.type === 'cgglPlanType') {
          this.planTypeList.push(element)
        }
        if (element.type === 'materialType') {
          this.materialTypeList.push(element)
        }
      })
    })
  },
  methods: {
    // 根据表单获取流程
    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 拼接材料明细参数
          var arr1 = []
          this.list.forEach(e => {
            var m = {}
            m.categoryId = e.categoryId
            m.categoryName = e.category.name
            // m.unit = e.unit
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
            item.isMain = e.category.isMain
            item.applicationQuantity = e.applicationQuantity
            item.applicationQuantity2 = e.applicationQuantity2
            item.quantity = e.quantity
            item.quantity2 = e.quantity2
            item.entryDate = e.entryDate
            item.remark = e.remark
            item.materialId = e.targetCostMaterialId
            arr1.push(item)
          })
          if (arr1.length === 0) {
            this.$message('计划明细不能为空！')
            return
          }
          newObj.planDetail = arr1
          this.loading = true
          // 验证信息
          checkPlanData(newObj).then(response => {
            if (response.result === 400) {
              this.$alert(`${response.msg.replace(/；/g, '；<br />')}`,
                { dangerouslyUseHTMLString: true })
            } else {
              getBillFlow(response.data).then(response => {
                this.loading = false
                if (response.success) {
                  this.billFlow = response.data.billFlow
                  this.active = 1
                } else {
                  this.$message(response.message)
                }
              }).catch(() => { this.loading = false })
            }
            this.loading = false
            console.log(response)
          }).catch(() => { this.loading = false })
        }
      })
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
            item.applicationQuantity2 = e.applicationQuantity2
            item.quantity = e.quantity
            item.quantity2 = e.quantity2
            item.entryDate = e.entryDate
            item.remark = e.remark
            item.materialId = e.targetCostMaterialId
            item.state = 0
            arr1.push(item)
          })
          newObj.planDetail = arr1

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
          // console.log('AddPlan===> newObj :', newObj)
          // 保存单据
          this.loading = true
          if (this.id) {
            putPlan(newObj).then(response => {
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
            addPlan(newObj).then(response => {
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
        }
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    async initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getPlanById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data } = response
      var pom = []
      data.planDetail.forEach(e => {
        pom.push({
          id: e.id,
          categoryId: e.material.categoryId,
          category: { id: e.material.categoryId,
            name: e.material.materialCategory.name,
            unit: e.material.materialCategory.unit,
            isMain: e.material.materialCategory.isMain },
          // unit: e.material.unit,
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
          targetCostMaterialId: e.materialId
          // fileList: data.upFile.filter(f => f.tableId === e.id)
        })
      })
      // 填充参数
      // if (!data.fileList) {
      //   data.fileList = []
      // }
      this.ruleForm = {
        id: data.id,
        number: data.number,
        orgId: data.orgId,
        planType: data.planType,
        materialType: data.materialType,
        realNumber: data.realNumber,
        remark: data.remark,
        state: data.state,
        billFlowId: data.billFlowId,
        fileList: data.upFile.filter(f => f.tableId === data.id),
        organization: data.organization
      }
      // 填充 明细列表
      this.list = pom
      // this.billFlow = data.billFlow
      this.setColumnShow()
      this.loading = false // loading 状态关闭

      // 如果 存在单据和 流程Id 就加载审批组件
      if (data.id && data.billFlowId) {
        this.attitudePara = { planId: data.id, billFlowId: data.billFlowId }
        this.loadFlow = true // 加载审批组件
      }
      this.activate = true // 加载部门组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.addMaterial(data, state)
      this.setColumnShow()
      this.dialogTableVisible = false
    },
    // showFileList(fileList) {
    //   this.dialogTitle = '附件列表'
    //   this.comName = 'UpFile'
    //   this.dialogWidth = '50%'
    //   this.fileList = fileList
    //   this.dialogTableVisible = true
    // },
    addMaterial(data, state) {
      if (data) {
        if (state === 'add') {
          this.list.push(data)
        } else if (state === 'update') {
          this.list.splice(this.listIndex, 1, data)
        } else if (state === 'addList') {
          // data.forEach(e => {
          //   this.list.push(e)
          // })
          this.list = data
        }
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
    edit(d) {
      this.currentRow = d.row
      // console.log('edit=>d.row:', d.row)
      this.listIndex = d.$index
      this.dialogTitle = '编辑材料'
      this.comName = 'PlanDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.dialogTitle = '添加材料'
      this.comName = 'PlanDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    checkMaterials() {
      var data = {
        orgId: this.ruleForm.orgId,
        datalist: this.list
      }
      this.currentRow = data
      this.dialogTitle = '选择主材'
      this.comName = 'TargetCostDetailAll'
      this.dialogWidth = '100%'
      this.dialogTableVisible = true
    },
    del(d) {
      // 页面删除
      this.list.splice(d.$index, 1)
    },
    onError(err) {
      this.$message.info('导出失败：' + err)
    },
    onSuccess(d, file) {
      var data = d[0].data
      // console.log('数据为空的字段data中不会有该字段:', data)
      if (data.length) {
        const postData = []
        var errorMessage = ''
        for (var e of data) {
          if (!e.材料名称) {
            errorMessage += '第' + e.__rowNum__ + '行，材料名称不能为空；'
          }
          if (!e.主数量) {
            errorMessage += '第' + e.__rowNum__ + '行，主数量不能为空；'
          } else {
            if (!validateData.dbl(e.主数量.trim()).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，主数量必须是数字；'
            }
          }
          // 辅单位不为空，辅数量不能为空
          if (e.辅单位) {
            if (!e.辅数量) {
              errorMessage += '第' + e.__rowNum__ + '行，辅单位不为空，辅数量不能为空；'
            } else {
              if (!validateData.dbl(e.辅数量.trim()).isSuccess) {
                errorMessage += '第' + e.__rowNum__ + '行，辅数量必须是数字；'
              }
            }
          }
          if (!e.进场日期) {
            errorMessage += '第' + e.__rowNum__ + '行，进场日期不能为空；'
          } else {
            const convertDate = formatExcelDate(e.进场日期.trim())
            // console.log('数字格式化后的日期：', convertDate)
            if (!validateData.date(convertDate).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，进场日期格式错误；'
            }
          }
          this.loading = true
          if (errorMessage.length > 0) {
            this.$alert(`${errorMessage.replace(/；/g, '；<br />')}`,
              { dangerouslyUseHTMLString: true })
            this.loading = false
            return
          }

          var obj1 = {}
          var obj2 = {}
          var detailCols = ['ApplicationQuantity', 'ApplicationQuantity2', 'EntryDate', 'Remark']
          this.sheet[0].keys.forEach((v, i) => {
            var value = e[this.sheet[0].tHeader[i]]
            // 清除空格 回车 换行符
            if (value) { value = cleanText(value) } else { value = '' }
            // console.log('v:' + v + ';value:' + value)
            if (v === 'EntryDate') { value = formatExcelDate(e.进场日期) }
            if (detailCols.includes(v)) { obj1[v] = value } else { obj2[v] = value }
          })
          obj1['Material'] = obj2
          postData.push(obj1)
        }

        // console.log('postData:', postData)
        // 把数据推送到后端进行验证
        checkPlanDetail(postData).then(response => {
          this.loading = false
          if (response.code === 200) {
            // console.log('responseData:', response.data)
            if (response.data) {
              const { data } = response
              // 拼接成数组对象
              for (var item1 of data) {
                var obj2 = {
                  categoryId: item1.material.categoryId,
                  category: { id: item1.material.categoryId, name: item1.material.categoryName },
                  // unit: item1.material.unit,
                  unit2: item1.material.unit2,
                  brand: item1.material.brand,
                  model: item1.material.model,
                  spec: item1.material.spec,
                  thickness: item1.material.thickness,
                  texture: item1.material.texture,
                  surfaceTreatment: item1.material.surfaceTreatment,
                  designNumber: item1.material.designNumber,
                  applicationQuantity: item1.applicationQuantity,
                  applicationQuantity2: item1.applicationQuantity2,
                  quantity: item1.applicationQuantity,
                  quantity2: item1.applicationQuantity2,
                  entryDate: item1.entryDate,
                  remark: item1.remark
                  // fileList: []
                }
                this.addMaterial(obj2, 'add')
              }
              this.setColumnShow()
            } else {
              this.$alert(`${response.msg.replace(/；/g, '；<br />')}`,
                { dangerouslyUseHTMLString: true })
            }
          }
        }).catch(() => { this.loading = false })
      } else {
        this.$message.info('模板中数据不能为空')
      }
    },
    cancel() { // 作废
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deletePlan({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    getMainMaterial(isMain) {
      if (isMain === true) {
        return '是'
      } else {
        return '否'
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
