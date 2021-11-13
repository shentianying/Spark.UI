<template>
  <div class="app-container">
    <el-row v-if="obj===null" style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.number" placeholder="合同编号" size="mini" clearable maxlength="20" style="width:150px;" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="0"
          size="mini"
          :collapse-tags="false"
          :show-all-levels="false"
          :multiple="true"
          expand-trigger="hover"
          placeholder="选择项目"
          :check-strictly="false"
          select-style="min-width:100px;"
        />
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
        <el-checkbox v-model="search.isDesignOrder">设计下单</el-checkbox>
        <el-button :loading="listLoading" type="primary" size="mini" @click="fetchData">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="singleTable"
      v-loading="listLoading"
      :data="contractList"
      highlight-current-row
      element-loading-text="Loading"
      border
      fit
      size="mini"
      :header-cell-style="{'text-align': 'center'}"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="合同编号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.contractDate }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.supplier.name }}
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
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="材料名称" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.name }}
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
      <!-- <el-table-column label="是否设计下单" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.material.designNumber }}
        </template>
      </el-table-column> -->
      <el-table-column label="主单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.materialCategory.unit }}
        </template>
      </el-table-column>
      <el-table-column label="主数量" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.material.unit2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="80">
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
    <div style="text-align:center; margin-top:15px;">
      <el-button size="mini" type="success" :loading="listLoading" @click="check()">确定</el-button>
    </div>
  </div>
</template>
<script>
import { getContractPaging, getContractDetailsById } from '@/api/cggl/contract'
import { getSupplierInfo } from '@/api/cggl/supplier'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ContractDetailCheck',
  components: {
    OrgSelect2
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
      contractList: [],
      search: {
        number: '',
        orgIds: [],
        states: [],
        supplierIds: [],
        categoryName: '',
        isDesignOrder: false
      },
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      loading: false,
      list: [],
      fileList: [],
      listLoading: false,
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
    'search.isDesignOrder': {
      handler: function(value, oldvalue) {
        if (!oldvalue) {
          // 值变更
          getContractDetailsById({ contractId: this.ruleForm.id, isDesignOrder: this.search.isDesignOrder }).then(response => {
            const { data } = response
            this.list = data
            this.setColumnShow()
            // this.loading = false
          })
          // this.$refs.singleTable.setCurrentRow()
        }
      }, deep: true
    }
  },
  activated() {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.number = this.search.number
      postData.orgIds = this.search.orgIds
      postData.states = this.search.states
      postData.states.push(10000) // 已确认的合同
      postData.supplierIds = this.search.supplierIds
      postData.categoryName = this.search.categoryName
      getContractPaging(postData).then(response => {
        const { data, count } = response
        this.contractList = data
        this.total = count
        this.listLoading = false
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
          form: this.ruleForm,
          list: this.multipleSelection
        }
        this.$emit('dialogClose', data, 'check')
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.ruleForm = val
      if (val) {
        getContractDetailsById({ contractId: val.id, isDesignOrder: this.search.isDesignOrder }).then(response => {
          const { data } = response
          this.list = data
          this.setColumnShow()
          // this.loading = false
        })
      }
      this.loading = false
    },
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
