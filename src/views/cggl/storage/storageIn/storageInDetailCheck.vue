<template>
  <div class="app-container">
    <el-row v-if="obj===null" style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.number" placeholder="入库单号" size="mini" clearable maxlength="20" style="width:150px;" />
        <!-- <org-select2
          v-model="search.orgIds"
          :data-mode="1"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="false"
          filterable
          expand-trigger="hover"
          placeholder="选择项目"
          :check-strictly="true"
          select-style="min-width:110px;"
        /> -->
        <!-- <el-select
          v-if="(formState||[]).length"
          v-model="search.states"
          collapse-tags
          multiple
          clearable
          style="width:150px;"
          size="mini"
          placeholder="状态"
        >
          <el-option v-for="(item,index) in formState" :key="index" :label="item.name" :value="item.value" />
        </el-select> -->
        <el-select
          v-model="search.supplierIds"
          collapse-tags
          multiple
          clearable
          style="width:150px;"
          size="mini"
          placeholder="供应商"
        >
          <el-option v-for="(item,index) in suppliers" :key="index" :label="item.name" :value="item.id">
            <span>{{ item.name }}</span>
          </el-option>
        </el-select>
        <el-input v-model="search.categoryName" placeholder="材料名称" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-button :loading="loading" type="primary" size="mini" @click="fetchData">搜索</el-button>
      </el-col>
    </el-row>
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
      <el-table-column type="selection" fixed="left" align="center" width="55" />
      <!-- <el-table-column type="index" width="55" align="center" /> -->
      <el-table-column label="项目" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.storageIn.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="材料名称" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.name }}
        </template>
      </el-table-column>
      <el-table-column label="入库单号" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.storageIn.number }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.storageIn.supplier.name }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.brand" label="品牌/产地" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.material.brand }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.model" label="型号" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.material.model }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.spec" label="规格/尺寸" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.material.spec }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.thickness" label="厚度" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.material.thickness }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.texture" label="材质" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.material.texture }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.surfaceTreatment" label="表面处理/工艺、色号" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.material.surfaceTreatment }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.designNumber" label="设计编号" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.material.designNumber }}
        </template>
      </el-table-column>
      <el-table-column label="主单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.unit }}
        </template>
      </el-table-column>
      <el-table-column label="库存主数量" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.unit2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="库存辅数量" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.quantity2 }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin:10px 0;">
      <el-pagination
        background
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="fetchData"
        @size-change="sizeChange"
      />
    </div>
    <div style="text-align:center; margin-top:15px;">
      <el-button size="mini" type="success" :loading="loading" @click="check()">确定</el-button>
    </div>
  </div>
</template>
<script>
import { getStorageInDetailPaging } from '@/api/cggl/storageIn'
import { getSupplierInfo } from '@/api/cggl/supplier'
// import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'StorageInDetailCheck',
  components: {
    // OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
      },
      search: {
        number: '',
        orgIds: [],
        states: [],
        supplierIds: [],
        categoryName: ''
      },
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      loading: false,
      list: [],
      fileList: [],
      multipleSelection: [],
      suppliers: [],
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true
      },
      rules: {
        // number: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  activated() {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.number = this.search.number
      postData.orgIds = this.search.orgIds
      if (this.obj && this.obj.orgId) {
        postData.orgIds.push(this.obj.orgId)
      }
      postData.states = this.search.states
      postData.states.push(10000) // 已入库的材料
      postData.supplierIds = this.search.supplierIds
      postData.categoryName = this.search.categoryName
      getStorageInDetailPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        var rows = this.obj.datalist
        this.$refs.multipleTable.clearSelection()
        if (rows) {
          this.$nextTick(function() {
            this.list.forEach(e => {
              var row = rows.find(f => f.storageInDetail.id === e.id)
              if (row) {
                this.$refs.multipleTable.toggleRowSelection(e, true)
              } else {
                this.$refs.multipleTable.toggleRowSelection(e, false)
              }
            })
          })
        }
        this.setColumnShow()
        this.total = count
        this.loading = false
      })
      getSupplierInfo().then(response => {
        this.supplier = response.data
      })
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
        if (row.material.unit2) { modelunit2 = true }
        if (row.material.brand) { modelbrand = true }
        if (row.material.model) { modelmodel = true }
        if (row.material.spec) { modelspec = true }
        if (row.material.thickness) { modelthickness = true }
        if (row.material.texture) { modeltexture = true }
        if (row.material.surfaceTreatment) { modelsurfaceTreatment = true }
        if (row.material.designNumber) { modeldesignNumber = true }
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
    check() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择材料')
      } else {
        var data = {
          list: this.multipleSelection
        }
        this.$emit('dialogClose', data, 'check')
      }
    },
    // handleCurrentChange(val) {
    //   this.loading = true
    //   this.ruleForm = val
    //   getContractDetailsById({ contractId: val.id }).then(response => {
    //     const { data } = response
    //     this.list = data
    //     this.setColumnShow()
    //     this.loading = false
    //   })
    // },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
