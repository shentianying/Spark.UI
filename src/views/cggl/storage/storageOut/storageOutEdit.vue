<template>
  <div class="app-container">
    <div v-show="active===0">
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
            <el-form-item label="出库单号">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
            <el-form-item label="用途" prop="useSpace">
              <el-input v-model="ruleForm.useSpace" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
            <el-form-item label="经办人" prop="personId">
              <!-- <el-input v-model="ruleForm.personName" size="mini" maxlength="50" @click.native="selectPerson()" /> -->
              <el-select
                v-model="ruleForm.personId"
                size="mini"
                filterable
                remote
                reserve-keyword
                clearable
                :remote-method="(query)=>{getRemotePerson(query)}"
                placeholder="请选择"
                :loading="loading"
                style="width:120px;"
                @click.native="selectPerson()"
              >
                <el-option
                  v-for="(item,index) in personList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                  <span>{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="出库时间" prop="outDate">
              <el-date-picker
                v-model="ruleForm.outDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="出库类别" prop="type">
              <org-select2
                :key="keyOutType"
                v-model="ruleForm.type"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="false"
                :multiple="false"
                :filterable="true"
                :options="outTypeOptions"
                props-value="value"
                :select-data="ruleForm.type"
              />
            </el-form-item>
            <el-form-item
              v-if="activate"
              label="项目"
              prop="orgId"
            >
              <org-select2
                :key="orgKey"
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
            <el-form-item label="附件">
              <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="add()">选择材料</el-button>
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
        <el-table-column label="材料名称" fixed="left" align="center" min-width="100">
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
        <el-table-column label="主单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.material.materialCategory.unit }}
          </template>
        </el-table-column>
        <el-table-column label="库存主数量" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.storageInDetail.quantity }}
          </template>
        </el-table-column>
        <el-table-column label="出库主数量" align="center" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity" controls-position="right" size="mini" :step="0.0001" :min="0" :max="scope.row.storageInDetail.quantity" @change="handleChange" />
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="辅单位" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.material.unit2 }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="库存辅数量" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.storageInDetail.quantity2 }}
          </template>
        </el-table-column>
        <el-table-column v-if="columnShow.unit2" label="出库辅数量" align="center" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity2" controls-position="right" size="mini" :step="0.0001" :min="0" :max="scope.row.storageInDetail.quantity2" @change="handleChange" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入" size="mini" maxlength="200" />
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
      </div>
    </div>

    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
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

    <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div>
    <!--选择用户-->
    <div>
      <select-person ref="personRef" :multiple="false" @getPersons="getPersons" />
    </div>
  </div>
</template>
<script>
import { addStorageOut, putStorageOut, getBillFlow, getStorageOutById, deleteStorageOut, getDefaultInfo } from '@/api/cggl/storageOut'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary' // 出库类别
// import { getSupplierInfo } from '@/api/cggl/supplier'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import StorageInDetailCheck from '@/views/cggl/storage/storageIn/storageInDetailCheck'
import { getPersonList } from '@/api/rsgl/person'
import SelectPerson from '@/components/Other/selectPerson'
export default {
  name: 'StorageOutEdit',
  components: {
    OrgSelect2,
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    StorageInDetailCheck,
    SelectPerson
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        fileList: [],
        quotation: {},
        supplier: {},
        type: null,
        personId: 0
      },
      loading: false,
      activate: true,
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'ContractDetailCheck',
      currentRow: null,
      list: [],
      suppliers: [],
      outTypeOptions: [],
      keyOutType: 0,
      billFlow: null,
      attitudePara: null,
      loadFlow: false,
      orgKey: 0,
      fileListKey: 0,
      columnShow: { unit2: true,
        brand: true,
        model: true,
        spec: true,
        thickness: true,
        texture: true,
        surfaceTreatment: true,
        designNumber: true },
      rules: {
        orgId: [{ required: true, message: '请选择', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'blur' }],
        outDate: [{ required: true, message: '请选择', trigger: 'blur' }],
        useSpace: [{ required: true, message: '请输入', trigger: 'blur' }],
        personId: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      personList: []
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
    }
  },
  watch: {
    'ruleForm.orgId': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue && oldvalue !== null) {
          this.list = []
        }
      }, deep: true
    }
  },
  activated() {
    this.initData()
  },
  mounted() {
  },
  methods: {
    // 根据表单获取流程
    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {}
          postData.number = newObj.number
          postData.orgId = newObj.orgId
          postData.outDate = newObj.outDate
          postData.type = newObj.type
          postData.useSpace = newObj.useSpace
          postData.remark = newObj.remark
          postData.fileList = newObj.fileList
          postData.billFlowId = newObj.billFlowId
          if (this.id) {
            postData.id = this.id
          }
          var isFailed = false
          this.list.forEach(e => {
            if (e.quantity === 0) {
              isFailed = true
            }
          })
          if (isFailed === true) {
            // this.$notify.error({
            //   title: '错误',
            //   message: '出库数量不可为空！'
            // })
            this.$message.error('出库数量不可为空！')
            this.loading = false
          } else {
            getBillFlow(postData).then(response => {
              this.loading = false
              if (response.success) {
                this.billFlow = response.data.billFlow
                this.active = 1
              } else {
                this.$message(response.message)
              }
            }).catch(() => { this.loading = false })
          }
        }
      })
    },
    submitForm(state) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.ruleForm.state = state
          this.loading = true
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var postData = {}
          var pom = []
          this.list.forEach(e => {
            pom.push({
              id: e.id,
              storageInDetailId: e.storageInDetail.id,
              planDetailId: e.planDetailId,
              materialId: e.material.id,
              quantity: e.quantity,
              quantity2: e.quantity2,
              remark: e.remark
            })
          })
          postData.orgId = newObj.orgId
          postData.outDate = newObj.outDate
          postData.type = newObj.type
          postData.useSpace = newObj.useSpace
          postData.remark = newObj.remark
          postData.personId = newObj.personId
          postData.fileList = newObj.fileList
          postData.state = state
          postData.storageOutDetails = pom
          // 获取流程组件中的数据
          if (state === 1) {
            // 如果是提交，验证流程人员的完整信息
            const checkBillFlow = this.$refs.flowSelect.checkBillFlow()
            if (!checkBillFlow) {
              this.$message('流程错误，流程中审批人员不能为空')
              return false
            }
          }

          const billFlow = this.$refs.flowSelect.getBillFlow()
          console.log('获取的billFlow:', billFlow)
          this.ruleForm.billFlow = billFlow
          postData.billFlow = billFlow

          if (this.id) {
            postData.id = this.id
            putStorageOut(postData).then(response => {
              this.closeThePage()
            })
          } else {
            postData.id = 0
            addStorageOut(postData).then(response => {
              this.closeThePage()
            })
          }
        }
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    async initData() {
      getDictionarysByTypes({ types: 'outType' })
        .then((response) => {
          const { data } = response
          data.forEach(element => {
            element.pid = element.pId
            this.outTypeOptions.push(element)
          })
          this.keyOutType += 1
        })
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getStorageOutById({ id: this.id }).then(response => this.setData(response))
      } else {
        getDefaultInfo().then(response => {
          this.personList = response.data
          this.ruleForm.personId = response.data[0].id
          this.ruleForm.person = response.uid
        })
      }
    },
    setData(response) {
      const { data } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      this.orgKey++ // 重新加载项目组件
      this.fileListKey++ // 重新加载文件组件
      this.keyOutType++ // 重新加载出库类别组件
      // 填充 明细列表
      var pom = []
      data.storageOutDetails.forEach(e => {
        pom.push({
          id: e.id,
          material: e.material,
          storageInDetail: e.storageInDetail,
          planDetailId: e.planDetailId,
          quantity: e.quantity,
          quantity2: e.quantity2,
          remark: ''
        })
      })
      this.list = pom
      this.personList = data.personList
      this.ruleForm.personId = data.personList[0].id
      this.setColumnShow()
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
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
    add() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var data = {
            orgId: this.ruleForm.orgId,
            datalist: this.list
          }
          this.dialogTitle = '选择材料'
          this.comName = 'StorageInDetailCheck'
          this.currentRow = data
          this.dialogWidth = '100%'
          this.fileList = []
          this.dialogTableVisible = true
        }
      })
    },
    dialogClose(data, state) {
      this.addMaterial(data, state)
      this.dialogTableVisible = false
    },
    cancel() { // 作废
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteStorageOut({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    addMaterial(data, state) {
      if (state === 'check') {
        this.loading = true
        var pom = []
        data.list.forEach(e => {
          pom.push({
            material: e.material,
            storageInDetail: e,
            planDetailId: e.planDetailId,
            quantity: 0,
            quantity2: 0,
            remark: ''
          })
        })
        this.list = pom
        this.setColumnShow()
        this.loading = false
      } else {
        this.initData()
      }
    },
    handleChange() {
      //
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
    getPersons(personList) {
      if ((personList || []).length > 0) {
        this.personList = personList.map(m => { return { id: m.id, name: m.name } })
        this.$nextTick(() => {
          this.ruleForm.personId = personList[0].id
          this.ruleForm.personName = personList[0].name
        })
      }
    },
    selectPerson() {
      // this.tempItem2 = item2
      this.$refs.personRef.openDialog()
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-top:10px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
