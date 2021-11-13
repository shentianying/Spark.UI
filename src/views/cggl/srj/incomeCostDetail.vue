<template>
  <div class="app-container">
    <div style="padding:10px 0px;">
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        label-width="120px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号">
              {{ ruleForm.number }}
            </el-form-item>
            <el-form-item label="项目">
              {{ ruleForm.orgName }}
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
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="flex_div">
      <excel-export style="margin-right:10px;" book-type="xlsx" filename="收入价材料导出" :before-start="beforeStart" :sheet="sheet" :on-error="onError">
        <el-button :loading="loading" size="mini">导出材料</el-button>
      </excel-export>
    </div>
    <el-table
      v-loading="loading"
      :data="incomeCostDetails"
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
  </div>
</template>
<script>
import { getIncomeCostDetailById } from '@/api/cggl/incomeCost'
import { ExcelExport } from 'pikaz-excel-js'
export default {
  name: 'IncomeCostDetail',
  components: {
    ExcelExport
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        remark: '',
        organization: null
      },
      incomeCostDetails: [],
      loading: false,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true },
      sheet: [{
        tHeader: ['材料名称', '单位', '数量', '单价', '总金额', '备注'],
        table: [],
        keys: ['CategoryName', 'Unit', 'Quantity', 'Price', 'Amount', 'Remark'],
        sheetName: '收入价材料明细'
      }],
      cols: []
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.initData()
    }
  },
  methods: {
    initData() {
      getIncomeCostDetailById({ id: this.$route.params.id }).then(response => this.setData(response))
    },
    setData(response) {
      this.loading = true
      const { data } = response
      this.ruleForm = data
      this.incomeCostDetails = data.details
      //   data.mpList.forEach(element => {
      //     this.cols.push({ prop: element.materialField, label: element.name })
      //   })
      this.loading = false
    },
    beforeStart(bookType, filename, sheet) {
      const data = sheet
      const exportData = []
      this.incomeCostDetails.forEach(e => {
        var m = {}
        m.CategoryName = e.materialCategory.name
        m.Unit = e.materialCategory.unit
        m.Quantity = e.quantity
        m.Price = e.price
        m.Amount = e.amount
        m.Remark = e.remark
        exportData.push(m)
      })
      data[0].table = exportData
    },
    onError(err) {
      this.$message.info('导出失败：' + err)
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
