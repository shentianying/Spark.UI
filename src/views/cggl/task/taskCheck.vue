<template>
  <div class="app-container">
    <!-- <div class="flex_div">
      <el-button :loading="listLoading" type="success" size="mini" @click="checkTask()">确定</el-button>
      <el-button :loading="loading" type="danger" size="mini" @click="closeThePage()">X</el-button>
    </div> -->
    <el-row v-if="obj===null" style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="1"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="true"
          filterable
          expand-trigger="hover"
          placeholder="选择部门"
          :check-strictly="true"
          select-style="min-width:110px;"
        />
        <el-button :loading="listLoading" type="primary" size="mini" @click="initData">搜索</el-button>
      </el-col>
      <!-- <el-col :span="8" style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">我发起的</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button>
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="3">列表</el-radio-button>
        </el-radio-group>
      </el-col> -->
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="taskList"
      highlight-current-row
      element-loading-text="Loading"
      border
      fit
      size="mini"
      :header-cell-style="{'text-align': 'center'}"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="编号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="采购员" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.person.name }}
        </template>
      </el-table-column>
      <el-table-column label="确认时间" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.checkDate | dateTimeFormat }}
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
          {{ scope.row.category.unit }}
        </template>
      </el-table-column>
      <el-table-column label="主数量" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.applicationQuantity }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.unit2 }}
        </template>
      </el-table-column>
      <el-table-column v-if="columnShow.unit2" label="辅数量" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.applicationQuantity2 }}
        </template>
      </el-table-column>
      <el-table-column label="进场日期" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.entryDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center; margin-top:15px;">
      <el-button size="mini" type="success" :loading="listLoading" @click="checkTask()">确定</el-button>
    </div>
  </div>
</template>
<script>
import { getCGTaskPaging, getCGTaskById } from '@/api/cggl/task'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'TaskCheck',
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
      taskList: [],
      search: {
        number: '',
        orgIds: [],
        states: []
      },
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
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
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.number = this.search.number
      postData.orgIds = this.search.orgIds
      postData.states = this.search.states
      postData.states.push(10000) // 已确认的任务单
      postData.isBuyer = true
      if (this.obj && this.obj.times > 1) {
        postData.number = this.obj.taskNumber
      }
      getCGTaskPaging(postData).then(response => {
        const { data, count } = response
        this.taskList = data
        this.total = count
        this.listLoading = false
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
    checkTask() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择材料')
      } else {
        var data = {
          form: this.ruleForm,
          list: this.multipleSelection
        }
        this.$emit('dialogClose', data, 'add')
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.ruleForm = val
      getCGTaskById({ id: val.id }).then(response => {
        const { data } = response
        var pom = []
        data.planDetails.forEach(e => {
          pom.push({
            id: e.id,
            materialId: e.materialId,
            categoryId: e.material.categoryId,
            category: { id: e.material.categoryId,
              name: e.material.materialCategory.name,
              unit: e.material.materialCategory.unit,
              isMain: e.material.materialCategory.isMain },
            unit: e.material.unit,
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
            state: e.state
          })
        })
        this.list = pom
        this.loading = false
      })
    },
    sizeChange(val) {
      this.pageSize = val
      this.initData()
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
