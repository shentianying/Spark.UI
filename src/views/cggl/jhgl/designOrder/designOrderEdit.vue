<template>
  <div class="app-container">
    <div v-show="active===0">

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
                  :multiple="false"
                  :filterable="true"
                  :check-strictly="false"
                  :select-data="ruleForm.orgId"
                  select-style="width:100%;"
                />
              </el-form-item>

              <el-col :sm="12" :xs="24">
                <!-- <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item> -->
                <!-- <el-form-item label="附件">
                  <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
                </el-form-item> -->
              </el-col>
            </el-col></el-row>
        </el-form>
      </div>
      <div class="flex_div">
        <excel-export style="margin-right:10px;" book-type="xlsx" filename="设计下单模板" :sheet="sheet" :on-error="onError">
          <el-button :loading="loading" size="mini">下载模板</el-button>
        </excel-export>
        <excel-import style="margin-right:10px;" :on-success="onSuccess">
          <el-button :loading="loading" size="mini">导入</el-button>
        </excel-import>
        <el-button :loading="loading" size="mini" @click="list = []">清空</el-button>
      </div>
      <!-- 材料分类数据 -->
      <el-table
        v-if="isLoad"
        ref="multipleTable"
        v-loading="loading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column label="计划材料明细编号" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.planDetailId }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="材料分类编号" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.categoryId }}
          </template>
        </el-table-column> -->
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

        <el-table-column label="主数量" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>

        <el-table-column label="辅数量" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.quantity2 }}
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" width="200">
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
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { getPlanBillAttitudeById } from '@/api/cggl/plan'
import { getBillFlow, deleteDesignOrder, addPlanDesignOrder, getPlanDesignOrderById, putPlanDesignOrder, checkImportExcel, checkPlanDesignOrderDetail } from '@/api/cggl/designOrder'

import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowSelect from '@/components/Flow/flowSelect'
// import FlowDisplay from '@/components/Flow/flowDisplay'
// import FlowAttitude from '@/components/Flow/flowAttitude'
// import UpFile from '@/components/UpLoad/UpFile'
import { ExcelExport, ExcelImport } from 'pikaz-excel-js'
import { cleanText } from '@/utils/index'
export default {
  name: 'DesignOrderEdit',
  components: {
    OrgSelect2,
    FlowSelect,
    // UpFile,
    ExcelExport,
    ExcelImport
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: 0,
        state: 0,
        billFlowId: 0,
        planDesignOrderDetail: []
      },
      loading: false,
      isLoad: true,
      activate: false,
      active: 0,

      list: [],
      orgStr: '',
      billFlow: null,

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
        tHeader: ['计划材料明细编号', '材料名称', '品牌/产地', '型号', '规格/尺寸', '厚度', '材质', '表面处理/工艺、色号', '设计编号', '主数量', '辅数量', '备注'],
        keys: ['planDetailId', 'categoryName', 'brand', 'model', 'spec', 'thickness', 'texture', 'surfaceTreatment', 'designNumber', 'quantity', 'quantity2', 'remark'],
        table: [], // 默认数据
        // colWidth: ['10', '15', '15', '10', '30'],
        // cellStyle: ['string', 'string', 'string', 'string', 'string'], // 单元格样式
        sheetName: '设计下单'
      }],
      rules: {
        orgId: [{ required: true, message: '请输入', trigger: 'change' }]
        // planType: [{ required: true, message: '请输入', trigger: 'blur' }]
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
      // this.ruleForm.orgId = null // 刷新 org 列表
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.active = 0
      this.activate = true
    }
  },
  methods: {
    initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.ruleForm.id = this.$route.query.id
        this.loading = true
        this.activate = false
        getPlanDesignOrderById({ id: this.ruleForm.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data } = response
      // data == null ,新增。 data != null && state =0 ,就是编辑 else 就是流程审核
      // 如果设计下单存在 并且 状态是审批状态的话，就关闭页面，阻止编辑
      if (data) {
        if (data.state > 0) {
          this.$message.info('单据已在审批阶段，无法制单')
          this.closeThePage()
          return
        }
      }
      var pom = []
      data.planDesignOrderDetail.forEach(e => {
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
      // 填充 明细列表
      this.list = pom

      this.setColumnShow()

      // 获取 设计下单 数据
      if (data) {
        // 设计下单制单 保存 状态
        if (data.state === 0) {
          // this.ruleForm.id = data.id
          this.ruleForm.billFlowId = data.billFlowId
          this.ruleForm.number = data.number
          this.ruleForm.orgId = data.orgId
        } else {
          // state > 0 设计下单 审核流程 状态，跳转到 审核页面
          this.loading = false
          this.$router.replace(
            { name: 'DesignOrderAttitude',
              query: { id: this.ruleForm.planId, refreshRouterName: this.refreshRouterName },
              params: { id: this.ruleForm.planId }
            })
        }
      }
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
    onError(err) {
      this.$message.info('导出失败：' + err)
    },
    // 导入
    onSuccess(d, file) {
      if (!this.ruleForm.orgId) {
        this.$message('请选择项目')
        return
      }

      var data = d[0].data
      if (data.length) {
        var errorMessage = ''
        var arr1 = []
        for (var e of data) {
          if (errorMessage.length > 0) {
            this.$alert(`${errorMessage.replace(/；/g, '；<br />')}`,
              { dangerouslyUseHTMLString: true })
            return
          }

          var obj1 = {}
          this.sheet[0].keys.forEach((v, i) => {
            var value = e[this.sheet[0].tHeader[i]]
            value = cleanText(value)
            // console.log('v:', v, '- value:', value)
            if (v === 'applicationQuantity') { v = 'quantity' }
            if (v === 'applicationQuantity2') { v = 'quantity2' }
            obj1[v] = value
          })

          obj1['id'] = 0
          obj1['planDesignOrderId'] = 0
          arr1.push(obj1)
        }
        // console.log('取得导入数据：', arr1)
        this.list = arr1
        var newObj = JSON.parse(JSON.stringify(this.ruleForm))
        newObj.planDesignOrderDetail = this.getPlanDesignOrderDetail()
        // 判断导入的数据是否合法
        checkImportExcel(newObj).then(res => {
          if (res.result === 400) {
            this.list = []
            this.$alert(`${res.msg.replace(/；/g, '；<br />')}`, { dangerouslyUseHTMLString: true })
            return false
          } else {
            this.list = arr1
            this.ruleForm.planDesignOrderDetail = this.getPlanDesignOrderDetail()
            this.setColumnShow()
          }
        })
      } else {
        this.$message.info('模板中数据不能为空')
      }
    },
    submitForm(state) {
      var newObj = JSON.parse(JSON.stringify(this.ruleForm))
      // 设计下单状态
      newObj.state = state
      // console.log('提交前：this.list:', this.list)
      newObj.planDesignOrderDetail = this.getPlanDesignOrderDetail()

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

      // console.log('设计下单提交的数据：', newObj)
      // 保存单据
      // this.loading = true
      if (this.ruleForm.id) {
        putPlanDesignOrder(newObj).then(response => {
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
        addPlanDesignOrder(newObj).then(response => {
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
        deleteDesignOrder({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if ((this.list || []).length === 0) {
            this.$alert('请导入设计下单明细')
            return
          }
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // delete newObj.planDesignOrderDetail
          // newObj.planDesignOrderDetail = this.getPlanDesignOrderDetail()
          // 拼接材料明细参数
          this.loading = true
          // 验证信息
          checkPlanDesignOrderDetail(this.getPlanDesignOrderDetail()).then(response => {
            if (response.result === 400) {
              this.$alert(`${response.msg.replace(/；/g, '；<br />')}`,
                { dangerouslyUseHTMLString: true })
            } else {
              // console.log('getBillFlow11:', newObj)
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
            this.loading = false
          }).catch(() => { this.loading = false })
        }
      })
    },
    getPlanDesignOrderDetail() {
      return this.list.map(m => {
        return {
          id: m.id,
          planDetailId: m.planDetailId,
          planDesignOrderId: m.planDesignOrderId,
          quantity: m.quantity,
          quantity2: m.quantity2,
          materialId: m.materialId,
          remark: m.remark,
          material: {
            categoryId: m.categoryId,
            categoryName: m.categoryName,
            unit2: '块',
            brand: m.brand,
            model: m.model,
            spec: m.spec,
            thickness: m.thickness,
            texture: m.texture,
            surfaceTreatment: m.surfaceTreatment,
            designNumber: m.designNumber
          }
        }
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
