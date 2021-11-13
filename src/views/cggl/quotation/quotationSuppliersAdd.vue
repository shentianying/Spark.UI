<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <!-- <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" /> -->
        <el-input v-model="name" placeholder="名称" size="mini" clearable maxlength="20" style="width:150px;" />
        <!-- <org-select2
          v-model="search.orgIds"
          :data-mode="1"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="false"
          filterable
          expand-trigger="hover"
          placeholder="选择部门"
          :check-strictly="true"
          select-style="min-width:110px;"
        /> -->
        <el-button :loading="listLoading" type="primary" size="mini" @click="initData">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="selectInit" fixed="left" align="center" width="55" />
      <el-table-column align="center" label="编号" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主营" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.mainBusiness }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司电话" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.companyPhone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.contacts }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.contactsPhone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="星级" min-width="10">
        <template slot-scope="scope">
          {{ getSupplierRate(scope.row.rate) }}
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
        @current-change="initData"
        @size-change="sizeChange"
      />
    </div>
    <div style="text-align:center; margin-top:15px;">
      <el-button size="mini" type="success" :loading="listLoading" @click="checkSuppliers()">确定</el-button>
    </div>
  </div>
</template>
<script>
// import OrgSelect2 from '@/components/OrgSelect/index2'
import { getSupplierPaging } from '@/api/cggl/supplier'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
export default {
  name: 'QuotationSuppliersAdd',
  components: {
    // OrgSelect2
  },
  props: {
    obj: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
      },
      // 星级
      supplierRateOptions: [],
      keySupplierRate: 0,
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      name: '',
      loading: false,
      list: [],
      fileList: [],
      listLoading: false,
      multipleSelection: [],
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
        number: [{ required: true, message: '请输入', trigger: 'change' }]
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
    this.initData()
  },
  methods: {
    async initData() {
      this.listLoading = true
      getSupplierPaging({ currentPage: this.currentPage, pageSize: this.pageSize, name: this.name }).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      })
      getDictionarysByTypes({ types: 'supplierRate' })
        .then((response) => {
          const { data } = response
          data.forEach(element => {
            element.pid = element.pId
            if (element.type === 'supplierRate') {
              this.supplierRateOptions.push(element)
            }
          })
          // this.keyImportType += 1
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
    checkSuppliers() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('必须选择供应商')
      } else {
        var data = {
          list: this.multipleSelection
        }
        this.$emit('dialogClose', data, 'addSuppliers')
      }
    },
    sizeChange(val) {
      this.pageSize = val
      this.initData()
    },
    getSupplierRate(rate) {
      var supplierRate = this.supplierRateOptions.find(f => f.value === rate)
      return supplierRate.name
    },
    selectInit(row, index) {
      if (this.obj && this.obj.length > 0) {
        var supplier = this.obj.find(f => f.supplier.number === row.number)
        if (supplier) {
          return false // 不可选
        } else {
          return true
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
