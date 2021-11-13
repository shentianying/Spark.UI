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
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="备注">
              {{ ruleForm.remark }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="flex_div">
      <excel-export style="margin-right:10px;" book-type="xlsx" filename="商务成本材料导出" :before-start="beforeStart" :sheet="sheet" :on-error="onError">
        <el-button :loading="loading" size="mini">导出材料</el-button>
      </excel-export>
    </div>
    <el-table
      v-loading="loading"
      :data="businessCostDetails"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="材料名称" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.unit }}
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
      <!-- <el-table-column label="可选项" align="center" width="60">
        <el-table-column v-for="(col,index) in cols" :key="index" :prop="col.prop" :label="col.label">
          <template slot-scope="scope">
            <div v-for="(item,index2) in scope.row.propertyList" :key="index2">
              <div v-if="item.materialField === col.prop">
                <el-tag v-for="(item1,index3) in item.nameList" :key="index3" type="primary">{{ item1 }} </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column> -->
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getBusinessCostDetailById } from '@/api/cggl/businessCost'
import { ExcelExport } from 'pikaz-excel-js'
export default {
  name: 'BusinessCostDetail',
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
      businessCostDetails: [],
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
  mounted() {
    if (this.$route.params.id) {
      this.initData()
    }
  },
  methods: {
    initData() {
      getBusinessCostDetailById({ id: this.$route.params.id }).then(response => this.setData(response))
    },
    setData(response) {
      this.loading = true
      const { data } = response
      this.ruleForm = data
      this.businessCostDetails = data.details
      //   data.mpList.forEach(element => {
      //     this.cols.push({ prop: element.materialField, label: element.name })
      //   })
      this.loading = false
    },
    beforeStart(bookType, filename, sheet) {
      const data = sheet
      const exportData = []
      this.businessCostDetails.forEach(e => {
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
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
