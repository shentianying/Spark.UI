<template>
  <div class="app-container">
    <div class="flex_div">
      <el-button v-if="isCheck===false" :loading="loading" type="success" size="mini" @click="check()">确认</el-button>
      <!-- <el-button :loading="loading" type="success" size="mini" @click="addPriceList()">生成报价单</el-button> -->
      <!-- <el-button :loading="loading" type="danger" size="mini" @click="closeThePage()">X</el-button> -->
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
          <el-form-item label="编号">
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="项目">
            {{ ruleForm.orgStr }}
          </el-form-item>
          <el-form-item label="采购员">
            {{ ruleForm.person }}
            <!-- {{ ruleForm.person.name }} -->
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="附件">
            <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.fileList" />
          </el-form-item>
          <el-form-item label="备注">
            {{ ruleForm.remark }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :file-list="fileList" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getCGTaskById, checkCGTaskById } from '@/api/cggl/task'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'TaskDetail',
  components: {
    UpFile
  },
  data() {
    return {
      ruleForm: {
        number: '',
        planId: null,
        planNumber: '',
        orgId: null,
        orgStr: '',
        materialTypeName: '',
        buyerId: null,
        fileList: [],
        remark: ''
      },
      isCheck: false,
      loading: false,
      showbuttons: false,
      loadFlow: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      currentRow: null,
      listIndex: 0,
      list: [],
      attitudePara: null,
      fileList: [],
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
        // number: [{ required: true, message: '请输入', trigger: 'blur' }],
        // buyerId: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
    }
  },
  watch: {
    // 'ruleForm.orgId': {
    //   handler: function(value, oldvalue) {
    //     if (!oldvalue) {
    //       this.$refs['ruleForm'].validateField('orgId', (valid) => {})
    //     }
    //   }, deep: true
    // }
  },
  activated() {
  },
  mounted() {
    this.initData()
    if (this.$route.params.isCheck === true) {
      this.isCheck = true
    }
  },
  methods: {
    async initData() {
      if (this.$route.params.id) {
        this.loading = true
        getCGTaskById({ id: this.$route.params.id }).then(response => {
          const { data, orgStr } = response
          this.ruleForm = {
            number: data.number,
            person: data.person.name,
            orgId: data.orgId,
            orgStr: orgStr,
            fileList: data.upFile.filter(f => f.tableId === data.id),
            remark: data.remark
          }
          var pom = []
          data.planDetails.forEach(e => {
            pom.push({
              id: e.id,
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
        })
        this.loading = false
        this.setColumnShow()
      }
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
    // showFileList(fileList) {
    //   this.dialogTitle = '附件列表'
    //   this.comName = 'UpFile'
    //   this.dialogWidth = '50%'
    //   this.fileList = fileList
    //   this.dialogTableVisible = true
    // },
    dialogClose() {
      this.initData()
      this.dialogTableVisible = false
    },
    check() {
      this.loading = true
      checkCGTaskById({ id: this.$route.params.id }).then(response => {
        if (response.result === 400) {
          this.$alert(`${response.msg.replace(/；/g, '；<br />')}`,
            { dangerouslyUseHTMLString: true })
        } else {
          this.$message(response.message)
        }
        this.loading = false
        this.closeThePage()
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
