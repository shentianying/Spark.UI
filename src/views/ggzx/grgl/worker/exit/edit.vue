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
            <el-form-item label="年度" prop="year">
              <!-- <el-input v-model="ruleForm.year" placeholder="请输入" size="mini" maxlength="50" /> -->
              <el-select v-model="ruleForm.year" size="mini" placeholder="请选择" style="width:100%">
                <el-option v-for="(item,index) in yearList" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
            <el-form-item label="退场原因" prop="exitReason">
              <el-input v-model="ruleForm.exitReason" type="textarea" :rows="4" size="mini" maxlength="500" />
            </el-form-item>
            <el-form-item label="退场日期" prop="exitDate">
              <el-date-picker
                v-model="ruleForm.exitDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item
              v-if="activate"
              label="所属部门"
              prop="orgId"
            >
              <org-select2
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
            <el-form-item label="备注">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="4" size="mini" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="addWorker()">选择工人</el-button>
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
        <el-table-column label="年度" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.worker.year }}
          </template>
        </el-table-column>
        <el-table-column label="工号" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.worker.number }}
          </template>
        </el-table-column>
        <el-table-column label="工人姓名" align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.worker.name }}
          </template>
        </el-table-column>
        <el-table-column label="所属部门" align="center" width="140">
          <template slot-scope="scope">
            {{ scope.row.worker.organization.name }}
          </template>
        </el-table-column>
        <el-table-column label="证件号码" align="center" width="140">
          <template slot-scope="scope">
            {{ scope.row.worker.idNumber }}
          </template>
        </el-table-column>
        <el-table-column label="退场原因" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.exitReason" placeholder="请输入" size="mini" maxlength="200" />
          </template>
        </el-table-column>
        <el-table-column label="退场日期" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.exitDate | dateFormat }}
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
        <component :is="comName" :obj="currentRow" :is-preview="true" :file-list="fileList" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div>

    <select-worker-2 ref="workerRef" :multiple="true" :org-ids="orgIdList" :isexit="false" :worker-list="workerList" @getPersons="getPersons" />
  </div>
</template>
<script>
import { getFormById, getBillFlow, saveData, deleteData } from '@/api/ggzx/workerExit'
import { getDefaultOptions } from '@/api/ggzx/worker'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SelectWorker2 from '@/components/Other/ggzx/selectWorker2'
export default {
  name: 'WorkerExitEdit',
  components: {
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    OrgSelect2,
    SelectWorker2
  },
  data() {
    return {
      id: null,
      ruleForm: {
        id: 0,
        year: null,
        number: '',
        orgId: null,
        exitReason: '',
        exitDate: null,
        remark: '',
        fileList: []
      },
      list: [],
      orgIdList: [],
      workerList: [],
      yearList: [],
      loading: false,
      activate: true,
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      billFlow: null,
      isLoad: false,
      attitudePara: {},
      fileListKey: 0,
      rules: {
        orgId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        exitDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        exitReason: [{ required: true, message: '请输入', trigger: 'blur' }],
        year: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'ruleForm.exitDate': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue && oldvalue !== null) {
          this.list.forEach(e => {
            e.exitDate = value
          })
        }
      }, deep: true
    },
    'ruleForm.orgId': {
      handler: function(value, oldvalue) {
        if (value !== null) {
          const ids = []
          ids.push(value)
          this.orgIdList = ids
        }
      }, deep: true
    }
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getFormById({ id: this.id }).then(response => this.setData(response))
      }
      getDefaultOptions().then(op => {
        const { yearOptions } = op
        this.yearList = yearOptions
      })
    },
    setData(response) {
      this.fileListKey++
      const { data } = response
      this.ruleForm = data
      console.log(data.upFile)
      this.ruleForm.fileList = data.upFile
      this.list = data.workerExitDetails
      const workers = []
      this.list.forEach(e => {
        workers.push(e.worker)
      })
      this.workerList = workers
      // this.billFlow = billFlowData
      // this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true
      this.loading = false // loading 状态关闭
      this.activate = true // 加载部门组件
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    },
    // 根据表单获取流程
    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const postData = { ...this.ruleForm }
          console.log(postData)
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
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    submitForm(state) {
      // 提交审批流程
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.ruleForm.state = state
          const billFlow = this.$refs.flowSelect.getBillFlow()
          console.log('获取的billFlow:', billFlow)
          this.ruleForm.billFlow = billFlow
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          const details = []
          this.list.forEach(e => {
            details.push({
              workerId: e.worker.id,
              exitReason: e.exitReason,
              exitDate: e.exitDate,
              remark: e.remark
            })
          })

          const postdata = {
            id: newObj.id,
            orgId: newObj.orgId,
            year: newObj.year,
            exitReason: newObj.exitReason,
            exitDate: newObj.exitDate,
            remark: newObj.remark,
            fileList: newObj.fileList,
            state: newObj.state,
            workerExitDetails: details,
            billFlow: billFlow
          }
          saveData(postdata).then(response => {
            this.closeThePage()
          })
        }
      })
    },
    /**
     * 选择工人
     */
    addWorker() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$refs.workerRef.openDialog()
        }
      })
    },
    getPersons(personList) {
      if ((personList || []).length > 0) {
        const data = []
        const workers = []
        personList.forEach(person => {
          data.push({
            worker: {
              id: person.id,
              year: person.year,
              number: person.number,
              name: person.name,
              organization: person.organization,
              idNumber: person.idNumber
            },
            exitReason: this.ruleForm.exitReason,
            exitDate: this.ruleForm.exitDate,
            remark: ''
          })
          workers.push(person)
        })
        this.list = data
        this.workerList = workers
      }
    },
    cancel() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteData({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
