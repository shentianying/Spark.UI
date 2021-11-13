<template>
  <div class="app-container">
    <div>
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
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="55" align="center" />
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
        <el-table-column v-if="columnShow.brand" label="品牌/产地" align="center" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.brand }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.model" label="型号" align="center" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.model }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.spec" label="规格/尺寸" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.spec }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.thickness" label="厚度" align="center" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.thickness }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.texture" label="材质" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.texture }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.surfaceTreatment" label="表面处理/工艺、色号" align="center" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.surfaceTreatment }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.designNumber" label="设计编号" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.designNumber }}
          </template>
        </el-table-column>
        <el-table-column label="主单位" align="center" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.category.unit }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.unit2 }}
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.targetCostQuantity }}
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.targetCostPrice }}
          </template>
        </el-table-column>
        <el-table-column label="总金额" align="center" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.targetCostAmount }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align:center;margin-top:10px;">
      <el-button size="mini" type="success" :loading="loading" @click="check()">确认</el-button>
    </div>
  </div>
</template>
<script>
import { getTargetCostDetailAllByOrgId } from '@/api/cggl/targetCost'
export default {
  name: 'TargetCostDetailAll',
  components: {},
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      listIndex: 0,
      list: [],
      loadFlow: false,
      multipleSelection: [],
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true }
    }
  },
  watch: {},
  activated() {},
  mounted() {
    this.initData()
  },
  methods: {
    check() {
      this.$emit('dialogClose', this.multipleSelection, 'addList')
    },
    async initData() {
      if (this.obj && this.obj.orgId) {
        this.loading = true
        await getTargetCostDetailAllByOrgId({ orgId: this.obj.orgId }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data } = response
      var pom = []
      data.forEach(e => {
        if (e.material.materialCategory.isMain === true) {
          pom.push({
            id: e.id,
            targetCostMaterialId: e.materialId,
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
            targetCostQuantity: e.targetCostQuantity,
            targetCostPrice: e.targetCostPrice,
            targetCostAmount: e.targetCostAmount,
            applicationQuantity: null,
            applicationQuantity2: null,
            quantity: null,
            quantity2: null,
            entryDate: null,
            remark: null,
            fileList: []
          })
        }
      })
      // 填充 明细列表
      this.list = pom
      var rows = this.obj.datalist
      this.$refs.multipleTable.clearSelection()
      if (rows) {
        this.$nextTick(function() {
          // rows.forEach(f => {
          //   this.list.forEach(e => {
          //     if (f.materialId === e.materialId) {
          //       this.$refs.multipleTable.toggleRowSelection(e, true)
          //     } else {
          //       alert(1)
          //       this.$refs.multipleTable.toggleRowSelection(e, false)
          //     }
          //   })
          // })
          this.list.forEach(e => {
            var row = rows.find(f => f.targetCostMaterialId === e.targetCostMaterialId)
            if (row) {
              this.$refs.multipleTable.toggleRowSelection(e, true)
            } else {
              this.$refs.multipleTable.toggleRowSelection(e, false)
            }
          })
        })
      }
      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.loadFlow = true // 加载审批组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection
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
