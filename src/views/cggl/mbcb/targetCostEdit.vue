<template>
  <div class="app-container">
    <div>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写单据" icon="el-icon-edit" />
        <el-step title="填写或导入材料" icon="el-icon-upload2" />
        <el-step title="确认流程" icon="el-icon-refresh" />
      </el-steps>
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
          <el-form-item label="编号" prop="number">
            <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
          </el-form-item>

          <!-- <el-form-item v-if="active === 0" label="项目" prop="orgId">
            <org-select2
              :key="keyOrg"
              v-model="ruleForm.orgId"
              :data-mode="0"
              size="mini"
              :collapse-tags="false"
              :show-all-levels="true"
              :multiple="false"
              :check-strictly="false"
              :select-data="ruleForm.orgId"
              select-style="width:100%;"
            />
          </el-form-item> -->
          <el-form-item label="项目" prop="orgId">
            <org-select2
              :key="keyOrg"
              v-model="ruleForm.orgId"
              :disabled="disabled"
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
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-show="active !== 0">
      <!-- 材料分类数据 -->
      <div class="flex_div">
        <excel-export style="margin-right:10px;" book-type="xlsx" filename="材料导入模板" :sheet="sheet" :on-error="onError">
          <el-button :loading="loading" icon="el-icon-download" size="mini">下载模板</el-button>
        </excel-export>
        <excel-import style="margin-right:10px;" :on-success="onSuccess" :on-error="onErrorImport">
          <el-button :loading="loading" icon="el-icon-upload2" size="mini">导入材料</el-button>
        </excel-import>
        <el-button :loading="loading" icon="el-icon-circle-plus-outline" size="mini" @click="add()">添加材料</el-button>

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
            {{ scope.row.unit }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.unit2 }}
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.targetCostQuantity }}
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.targetCostPrice }}
          </template>
        </el-table-column>
        <el-table-column label="总金额" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.targetCostAmount }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
              <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
            </el-button-group>
          </template>
        </el-table-column>
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
    <!--流程显示-->
    <flow-select v-show="active > 1" v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
    <div style="text-align:center;margin-top:10px;">
      <el-button v-show="active !== 0" v-if="ruleForm.state === 0" size="mini" type="info" :loading="loading" @click="previous()"><i class="el-icon-back el-icon--left" />上一步</el-button>
      <el-button v-show="active === 0" size="mini" type="success" :loading="loading" @click="getDynamicFlow('')">下一步<i class="el-icon-right el-icon--right" /></el-button>
      <el-button v-show="active === 1" size="mini" type="success" :loading="loading" @click="getDynamicFlow('ruleForm')">下一步<i class="el-icon-right el-icon--right" /></el-button>
      <el-button v-show="active > 1" v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
      <el-button v-show="active > 1" v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm',1)">提交</el-button>
      <el-button v-show="active > 1" v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm('ruleForm',0)">保存</el-button>
    </div>
    <!-- <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div> -->
  </div>
</template>
<script>
import { putTargetCost, addTargetCost, getTargetCostById, checkTargetCostDetail, getBillFlow, deleteTargetCost, checkDetailDistinct } from '@/api/cggl/targetCost'
// import { getBusinessCostDetailsByOrgId } from '@/api/cggl/businessCost'
import TargetCostDetailAdd from './targetCostDetailAdd'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import { ExcelExport, ExcelImport } from 'pikaz-excel-js'
import { validateData } from '@/utils/validate'
import { cleanText } from '@/utils/index'
export default {
  name: 'TargetCostEdit',
  components: {
    TargetCostDetailAdd,
    OrgSelect2,
    ExcelExport,
    ExcelImport,
    FlowSelect,
    FlowDisplay,
    FlowAttitude
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        remark: '',
        state: 0,
        billFlowId: 0
      },
      disabled: false,
      loading: false,
      // showbuttons: false,
      activate: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'TargetCostDetailAdd',
      currentRow: null,
      // swcbDetails: null,
      listIndex: 0,
      list: [],
      attitudePara: null,
      loadFlow: false,
      active: 0,
      billFlow: null,
      fileList: null,
      keyOrg: 0,
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
        tHeader: ['材料名称', '品牌/产地', '型号', '规格/尺寸', '厚度', '材质', '表面处理/工艺、色号', '设计编号', '主单位', '辅单位', '数量', '单价', '金额', '备注'],
        table: [],
        keys: ['CategoryName', 'Brand', 'Model', 'Spec', 'Thickness', 'Texture', 'SurfaceTreatment', 'DesignNumber', 'Unit', 'Unit2', 'TargetCostQuantity', 'TargetCostPrice', 'TargetCostAmount', 'Remark'],
        sheetName: '材料明细'
      }],
      rules: {
        // number: [{ required: true, message: '请输入', trigger: 'blur' }],
        orgId: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  watch: {
    'ruleForm.orgId': {
      handler: function(value, oldvalue) {
        if (!oldvalue && !this.$route.params.id) {
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
      this.initData()
      this.showbuttons = true
      this.activate = true
    }
  },
  methods: {
    // 根据表单获取流程
    getDynamicFlow(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].validate(valid => {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 拼接材料明细参数
          var arr1 = []
          this.list.forEach(e => {
            var m = {}
            m.categoryId = e.categoryId
            m.categoryName = e.category.name
            m.unit = e.unit
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
            item.targetCostQuantity = e.targetCostQuantity
            item.targetCostPrice = e.targetCostPrice
            item.targetCostAmount = e.targetCostAmount
            item.remark = e.remark
            arr1.push(item)
          })
          newObj.targetCostDetails = arr1

          // console.log('添加计划的数据：', newObj)
          getBillFlow(newObj).then(response => {
            if (response.success) {
              this.billFlow = response.data.billFlow
              this.active++
            } else {
              this.$message(response.message)
            }
          })
        })
      } else {
        // this.$refs['ruleForm'].validate(valid => {
        //   if (valid) {
        //     this.active++
        //   }
        // })
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.active++
            this.disabled = true
          }
        })
        // getBusinessCostDetailsByOrgId({ orgId: this.ruleForm.orgId }).then(response => {
        //   // this.swcbDetails = response.data
        // }).catch(() => {
        //   this.loading = false
        //   this.active--
        // })
      }
    },
    submitForm(formName, state) {
      this.active = 3
      this.$refs[formName].validate(valid => {
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
            m.unit = e.unit
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
            item.targetCostQuantity = e.targetCostQuantity
            item.targetCostPrice = e.targetCostPrice
            item.targetCostAmount = e.targetCostAmount
            item.remark = e.remark
            arr1.push(item)
          })
          newObj.targetCostDetails = arr1

          if (this.billFlow) {
            // 获取流程组件中的数据
            const billFlow = this.$refs.flowSelect.getBillFlow()
            if (!billFlow) {
              return false
            }
            newObj.billFlow = billFlow
          } else {
            this.$message('流程数据不能为空')
            return
          }
          this.loading = true

          if (this.id) {
            if (state === 1) {
              checkDetailDistinct(newObj).then(response => {
                if (response.request === 100) {
                  this.$confirm(`${response.msg}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    // 点击确定的操作(调用接口)
                    putTargetCost(newObj).then(response => {
                      if (response.errorMsg) {
                      // 验证错误
                        this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                          { dangerouslyUseHTMLString: true })
                        return
                      }
                      this.$message(response.message)
                      this.loading = false
                      this.closeThePage()
                      // this.setData(response)
                    }).catch(() => {
                      this.loading = false
                      this.active = 0
                    })
                  }).catch(() => {
                    // 几点取消的提示
                    this.loading = false
                    this.active = 1
                  })
                } else {
                  putTargetCost(newObj).then(response => {
                    if (response.errorMsg) {
                    // 验证错误
                      this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                        { dangerouslyUseHTMLString: true })
                      return
                    }
                    this.$message(response.message)
                    this.loading = false
                    this.closeThePage()
                    // this.setData(response)
                  }).catch(() => { this.loading = false })
                }
              }).catch(() => { this.loading = false })
            } else {
              putTargetCost(newObj).then(response => {
                if (response.errorMsg) {
                // 验证错误
                  this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                    { dangerouslyUseHTMLString: true })
                  return
                }
                this.$message(response.message)
                this.loading = false
                this.closeThePage()
                // this.setData(response)
              }).catch(() => { this.loading = false })
            }
          } else {
            addTargetCost(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
              // this.setData(response)
            }).catch(() => { this.loading = false })
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
        await getTargetCostById({ id: this.id }).then(response => this.setData(response))
        this.keyOrg++
        // this.disabled = true
      }
    },
    setData(response) {
      const { data } = response
      // if (!success) {
      // // 验证错误
      //   this.$alert(`${response.message.replace(/；/g, '；<br />')}`,
      //     { dangerouslyUseHTMLString: true })
      //   return
      // }
      var pom = []
      data.targetCostDetails.forEach(e => {
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
          targetCostQuantity: e.targetCostQuantity,
          targetCostPrice: e.targetCostPrice,
          targetCostAmount: e.targetCostAmount,
          remark: e.remark
        })
      })
      // 填充参数
      this.ruleForm = {
        id: data.id,
        number: data.number,
        orgId: data.orgId,
        remark: data.remark,
        billFlowId: data.billFlowId,
        state: data.state
      }
      // 填充 明细列表
      this.list = pom
      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.attitudePara = { planId: data.id, billFlowId: data.billFlowId }
      // this.showbuttons = true // 初始化完成，显示上面的按钮
      this.activate = true // 加载部门组件
      this.loadFlow = true // 加载审批组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.addMaterial(data, state)
      this.setColumnShow()
      this.dialogTableVisible = false
    },
    addMaterial(data, state) {
      if (data) {
        if (state === 'add') {
          this.list.push(data)
        } else if (state === 'update') {
          this.list.splice(this.listIndex, 1, data)
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
    previous() {
      // 上一步
      this.active--
      this.billFlow = null
    },
    edit(d) {
      this.currentRow = d.row
      this.listIndex = d.$index
      this.dialogTitle = '编辑材料'
      this.comName = 'TargetCostDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.dialogTitle = '添加材料'
      this.comName = 'TargetCostDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    del(d) {
      // 页面删除
      this.list.splice(d.$index, 1)
    },
    onError(err) {
      this.$message.info('导出失败：' + err)
    },
    onErrorImport(err) {
      this.$message.info('导入失败：' + err)
    },
    onSuccess(d, file) {
      // 导入判断
      var data = d[0].data
      if (data.length) {
        const postData = []
        var errorMessage = ''
        for (var e of data) {
          if (!e.材料名称) {
            errorMessage += '第' + e.__rowNum__ + '行，材料名称不能为空；'
          }
          if (!e.主单位) {
            errorMessage += '第' + e.__rowNum__ + '行，主单位不能为空；'
          }
          // 必须是数字
          if (e.数量) {
            if (!validateData.dbl(e.数量.trim()).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，数量必须是数字；'
            }
          }
          if (e.单价) {
            if (!validateData.dbl(e.单价.trim()).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，单价必须是数字；'
            }
          }
          if (e.金额) {
            if (!validateData.dbl(e.金额.trim()).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，金额必须是数字；'
            }
          }

          var obj1 = {}
          var obj2 = {}
          var detailCols = ['TargetCostQuantity', 'TargetCostPrice', 'TargetCostAmount', 'Remark']
          this.sheet[0].keys.forEach((v, i) => {
            var value = e[this.sheet[0].tHeader[i]]
            // 清除空格 回车 换行符
            if (value) { value = cleanText(value) } else { value = '' }
            // console.log('v:' + v + ';value:' + value)
            if (detailCols.includes(v)) { obj1[v] = value } else { obj2[v] = value }
          })
          obj1['Material'] = obj2
          obj1.orgId = this.ruleForm.orgId
          postData.push(obj1)
        }
        this.loading = true
        if (errorMessage.length > 0) {
          this.$alert(`${errorMessage.replace(/；/g, '；<br />')}`,
            { dangerouslyUseHTMLString: true })
          this.loading = false
          return
        }
        console.log('postData:', postData)
        // 把数据推送到后端进行验证
        checkTargetCostDetail(postData).then(response => {
          this.loading = false
          // console.log('responseData:', response.data)
          if (response.request === 100) {
            this.$alert(`${response.msg.replace(/；/g, '；<br />')}`,
              { dangerouslyUseHTMLString: true })
          } else {
            if (response.data) {
              const { data } = response
              // 拼接成数组对象
              for (var item1 of data) {
                var obj2 = {
                  categoryId: item1.material.categoryId,
                  category: { id: item1.material.categoryId, name: item1.material.categoryName },
                  unit: item1.material.materialCategory.unit,
                  unit2: item1.material.unit2,
                  brand: item1.material.brand,
                  model: item1.material.model,
                  spec: item1.material.spec,
                  thickness: item1.material.thickness,
                  texture: item1.material.texture,
                  surfaceTreatment: item1.material.surfaceTreatment,
                  designNumber: item1.material.designNumber,
                  targetCostQuantity: item1.targetCostQuantity,
                  targetCostPrice: item1.targetCostPrice,
                  targetCostAmount: item1.targetCostAmount,
                  remark: item1.remark
                }
                this.addMaterial(obj2, 'add')
              }
              this.setColumnShow()
            }
          }
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$message.info('模板中数据不能为空')
      }
    },
    // beforeStart(bookType, filename, sheet) {
    //   const data = sheet
    //   const importData = []
    //   this.swcbDetails.forEach(e => {
    //     var m = {}
    //     m.CategoryName = e.materialCategory.name
    //     m.BusinessCostDetailId = e.id
    //     m.Remark = ''
    //     importData.push(m)
    //   })
    //   data[0].table = importData
    // },
    cancel() { // 作废
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.active = 2
        this.loading = true
        deleteTargetCost({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
