<template>
  <div class="app-container">
    <div>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写单据" icon="el-icon-edit" />
        <el-step title="确认流程" icon="el-icon-refresh" />
      </el-steps>
    </div>
    <div v-show="active===0 || active===2">
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
          </el-col>

          <el-col :sm="12" :xs="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 材料分类数据 -->
      <div class="flex_div">
        <excel-export style="margin-right:10px;" book-type="xlsx" filename="商务成本材料导入模板" :sheet="sheet" :on-error="onError">
          <el-button :loading="loading" size="mini">下载模板</el-button>
        </excel-export>
        <excel-import style="margin-right:10px;" :on-success="onSuccess">
          <el-button :loading="loading" size="mini">导入材料</el-button>
        </excel-import>
        <el-button :loading="loading" size="mini" @click="add()">+添加材料</el-button>

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

        <el-table-column label="操作" fixed="right" align="center" width="80">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
              <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center; margin-top:15px;">
        <!-- <el-button size="mini" type="success" :loading="loading" @click="savePlan('ruleForm')">下一步</el-button> -->
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow('ruleForm')">下一步➜</el-button>
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
    <!--流程显示-->
    <div v-show="active===1 || active===2">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm',1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm('ruleForm',0)">保存</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>
    <!-- <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div> -->
  </div>
</template>
<script>
import { putBusinessCost, addBusinessCost, getBusinessCostById, checkBusinessCostDetail, getBillFlow, deleteBusinessCost } from '@/api/cggl/businessCost'
import BusinessCostDetailAdd from './businessCostDetailAdd'
import OrgSelect2 from '@/components/OrgSelect/index2'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import { ExcelExport, ExcelImport } from 'pikaz-excel-js'
import { validateData } from '@/utils/validate'
import { cleanText } from '@/utils/index'
export default {
  name: 'BusinessCostEdit',
  components: {
    BusinessCostDetailAdd,
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
      loading: false,
      showbuttons: false,
      activate: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'BusinessCostDetailAdd',
      currentRow: null,
      listIndex: 0,
      list: [],
      attitudePara: null,
      loadFlow: false,
      active: 0,
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
        // title: '材料导入模板',
        tHeader: ['材料名称', '数量', '单价', '总金额', '备注'],
        table: [],
        keys: ['CategoryName', 'Quantity', 'Price', 'Amount', 'Remark'],
        sheetName: '商务成本材料明细'
      }],
      rules: {
        orgId: [{ required: true, message: '请输入', trigger: 'change' }]
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
      this.showbuttons = true
      this.activate = true
    }
  },
  methods: {
    // 根据表单获取流程
    getDynamicFlow(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 拼接材料明细参数
          var arr1 = []
          this.list.forEach(e => {
            var item = {}
            item.id = e.id
            item.quantity = e.quantity
            item.price = e.price
            item.amount = e.amount
            item.remark = e.remark
            arr1.push(item)
          })
          newObj.businessCostDetails = arr1

          // console.log('添加计划的数据：', newObj)
          getBillFlow(newObj).then(response => {
            if (response.success) {
              this.billFlow = response.data.billFlow
              this.active = 1
            } else {
              this.$message(response.message)
            }
          })
        }
      })
    },
    submitForm(formName, state) {
      this.active = 2
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 计划状态
          newObj.state = state
          // 拼接材料明细参数
          var arr1 = []
          this.list.forEach(e => {
            var item = {}
            item.id = e.id
            item.materialCategoryId = e.materialCategoryId
            item.quantity = e.quantity
            item.price = e.price
            item.amount = e.amount
            item.remark = e.remark
            arr1.push(item)
          })
          newObj.businessCostDetails = arr1

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
            putBusinessCost(newObj).then(response => {
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
          } else {
            console.log(newObj)
            addBusinessCost(newObj).then(response => {
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
        await getBusinessCostById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data } = response
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
      this.list = data.businessCostDetails
      this.loading = false // loading 状态关闭
      this.attitudePara = { planId: data.id, billFlowId: data.billFlowId }
      this.showbuttons = true // 初始化完成，显示上面的按钮
      this.activate = true // 加载部门组件
      this.loadFlow = true // 加载审批组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.addMaterial(data, state)
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
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    edit(d) {
      this.currentRow = d.row
      this.listIndex = d.$index
      this.dialogTitle = '编辑材料'
      this.comName = 'BusinessCostDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.dialogTitle = '添加材料'
      this.comName = 'BusinessCostDetailAdd'
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
    onSuccess(d, file) {
      // 导入判断
      var data = d[0].data
      // console.log('数据为空的字段data中不会有该字段:', data)
      if (data.length) {
        const postData = []
        var errorMessage = ''
        for (var e of data) {
          if (!e.材料名称) {
            errorMessage += '第' + e.__rowNum__ + '行，材料名称不能为空；'
          }
          if (!e.材料名称) {
            errorMessage += '第' + e.__rowNum__ + '行，材料名称不能为空；'
          }
          if (!e.数量) {
            errorMessage += '第' + e.__rowNum__ + '行，数量不能为空；'
          }
          // 必须是数字
          if (e.数量) {
            if (!validateData.dbl(e.数量.trim()).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，数量必须是数字；'
            }
          }
          if (!e.单价) {
            errorMessage += '第' + e.__rowNum__ + '行，单价不能为空；'
          }
          if (e.单价) {
            if (!validateData.dbl(e.单价.trim()).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，单价必须是数字；'
            }
          }
          if (!e.总金额) {
            errorMessage += '第' + e.__rowNum__ + '行，总金额不能为空；'
          }
          if (e.总金额) {
            if (!validateData.dbl(e.总金额.trim()).isSuccess) {
              errorMessage += '第' + e.__rowNum__ + '行，总金额必须是数字；'
            }
          }
          var obj1 = {}
          var obj2 = {}
          var detailCols = ['CategoryName', 'Quantity', 'Price', 'Amount', 'Remark']
          this.sheet[0].keys.forEach((v, i) => {
            var value = e[this.sheet[0].tHeader[i]]
            // 清除空格 回车 换行符
            if (value) { value = cleanText(value) } else { value = '' }
            // console.log('v:' + v + ';value:' + value)
            if (detailCols.includes(v)) { obj1[v] = value } else { obj2[v] = value }
          })
          obj1['Material'] = obj2
          postData.push(obj1)
        }
        this.loading = true
        if (errorMessage.length > 0) {
          this.$alert(`${errorMessage.replace(/；/g, '；<br />')}`,
            { dangerouslyUseHTMLString: true })
          this.loading = false
          return
        }
        // console.log('postData:', postData)
        // 把数据推送到后端进行验证
        checkBusinessCostDetail(postData).then(response => {
          this.loading = false
          if (response.request === 100) {
            this.$alert(`${response.msg.replace(/；/g, '；<br />')}`,
              { dangerouslyUseHTMLString: true })
          } else {
            if (response.data) {
              const { data } = response
              // 拼接成数组对象
              for (var item1 of data) {
                var obj2 = {
                  materialCategoryId: item1.materialCategoryId,
                  materialCategory: item1.materialCategory,
                  quantity: item1.quantity,
                  price: item1.price,
                  amount: item1.amount,
                  remark: item1.remark
                }
                console.log(obj2)
                this.addMaterial(obj2, 'add')
              }
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
        this.active = 2
        this.loading = true
        deleteBusinessCost({ id: this.ruleForm.id }).then(response => {
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
