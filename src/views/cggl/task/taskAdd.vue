<template>
  <div>
    <div class="flex_div">
      <el-button :loading="loading" type="success" size="mini" @click="addTask()">确认分配</el-button>
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
          <el-form-item label="编号" prop="number">
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="采购员" prop="buyerId">
            <el-select
              v-model="ruleForm.buyerId"
              size="mini"
              filterable
              remote
              reserve-keyword
              clearable
              :remote-method="(query)=>{getRemotePerson(query)}"
              placeholder="请选择"
              :loading="loading"
              style="width:120px;"
            >
              <el-option
                v-for="(item,index) in personList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ getOrgList.find(f=>f.id===item.organizationId).name }}-{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="附件">
            <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
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
  </div>
</template>
<script>
import { addCGTask, getCGTaskNumber } from '@/api/cggl/task'
import { getPersonList } from '@/api/rsgl/person'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'TaskAdd',
  components: {
    UpFile
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
        number: '',
        planId: null,
        planNumber: '',
        orgId: null,
        orgStr: '',
        planTypeName: '',
        materialTypeName: '',
        buyerId: null,
        fileList: [],
        remark: ''
      },
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
      personList: [],
      rules: {
        // number: [{ required: true, message: '请输入', trigger: 'blur' }],
        buyerId: [{ required: true, message: '请输入', trigger: 'change' }]
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
  },
  methods: {
    async initData() {
      if (this.obj) {
        this.ruleForm = {
          id: 0,
          number: '',
          planId: this.obj.planId,
          orgId: this.obj.orgId,
          buyerId: null,
          fileList: [],
          state: 0,
          remark: ''
        }
        getCGTaskNumber({ planNumber: this.obj.planNumber }).then(response => {
          response.data = response.data + 1
          this.ruleForm.number = this.obj.planNumber + '-' + response.data
        })
        this.loading = true
        this.list = this.obj.data
        this.loading = false
        this.setColumnShow()
      }
      getPersonList().then(response => {
        this.personList = response.data
      })
    },
    // closeThePage() {
    //   this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    // },
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
    showFileList(fileList) {
      this.dialogTitle = '附件列表'
      this.comName = 'UpFile'
      this.dialogWidth = '50%'
      this.fileList = fileList
      this.dialogTableVisible = true
    },
    getRemotePerson(query) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          getPersonList().then(response => {
            this.personList = response.data
            this.loading = false
          })
        }, 200)
      } else {
        this.personList = []
      }
    },
    addTask() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.state = 0
          // 拼接材料明细参数
          var arr1 = []
          this.list.forEach(e => {
            var m = {}
            m.categoryId = e.categoryId
            m.categoryName = e.category.name
            // m.unit = e.category.unit
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
            // item.fileList = []
            // if (e.fileList.length) {
            //   item.fileList = e.fileList.map(m => { return { id: m.id, addFlag: m.addFlag } })
            // }
            item.id = e.id
            item.applicationQuantity = e.applicationQuantity
            item.applicationQuantity2 = e.applicationQuantity2 || 0
            item.quantity = e.quantity
            item.quantity2 = e.quantity2
            item.entryDate = e.entryDate
            item.remark = e.remark
            item.targetCostMaterialId = e.targetCostMaterialId
            item.state = 0
            arr1.push(item)
          })
          newObj.planDetails = arr1
          console.log('分配的数据：', newObj)
          this.loading = true
          addCGTask(newObj).then(response => {
            this.$message(response.message)
            this.loading = false
            // this.closeThePage()
            this.$emit('dialogClose')
          }).catch(() => { this.loading = false })
          // this.loading = false
          // this.$emit('dialogClose')
        }
      })
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
