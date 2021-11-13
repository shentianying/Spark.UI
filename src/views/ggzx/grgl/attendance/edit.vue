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
            <el-form-item label="编号">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
            <el-form-item label="考勤月份" prop="date">
              <el-date-picker
                v-model="ruleForm.date"
                type="month"
                placeholder="选择月份"
              />
            </el-form-item>
            <el-form-item label="总出勤天数">
              {{ ruleForm.attendanceDay }}
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="4" size="mini" maxlength="500" />
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
            <el-form-item label=" ">
              &nbsp;
            </el-form-item>
            <el-form-item label="总货币化工资">
              {{ ruleForm.salary }}
            </el-form-item>
            <el-form-item label="附件">
              <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="addWorker()">选择工人</el-button>
      </div>
      <table-item :key="tabeleItemKey" ref="tableItem" :list="table.list" :col="table.col" :attend-options="attendOptions" />
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
import { getFormTableDate, getDefaultOptions, deleteData } from '@/api/ggzx/attendance'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SelectWorker2 from '@/components/Other/ggzx/selectWorker2'
import TableItem from '@/components/Other/TableRec/tableItem.vue'
export default {
  name: 'WorkerAttendanceEdit',
  components: {
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    OrgSelect2,
    SelectWorker2,
    TableItem
  },
  data() {
    return {
      id: null,
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        date: null,
        attendanceDay: 0,
        salary: 0,
        remark: '',
        fileList: []
      },
      table: {
        col: [],
        list: []
      },
      attendOptions: [{
        name: 'aaa',
        value: 1
      }],
      tabeleItemKey: 0,
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
        date: [
          { required: true, message: '请选择考勤月份', trigger: 'change' }
        ]
        // exitReason: [{ required: true, message: '请输入', trigger: 'blur' }],
        // year: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 'ruleForm.exitDate': {
    //   handler: function(value, oldvalue) {
    //     if (value !== oldvalue && oldvalue !== null) {
    //       this.list.forEach(e => {
    //         e.exitDate = value
    //       })
    //     }
    //   }, deep: true
    // },
    'ruleForm.date': {
      handler: function(value, oldvalue) {
        if (value !== null) {
          var attendId = 0
          if (this.id) {
            attendId = this.id
          }
          getFormTableDate({ date: value, attendId: attendId }).then(response => this.setData(response))
          this.tabeleItemKey++
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
      }
      getDefaultOptions().then(op => {
        const { yearOptions } = op
        this.yearList = yearOptions
      })
    },
    setData(response) {
      const { columns, list } = response
      this.table.col = columns
      this.table.list = list
      console.log(this.table)
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
    // // 根据表单获取流程
    // getDynamicFlow() {
    //   this.$refs['ruleForm'].validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       const postData = { ...this.ruleForm }
    //       console.log(postData)
    //       getBillFlow(postData).then(response => {
    //         this.loading = false
    //         if (response.success) {
    //           this.billFlow = response.data.billFlow
    //           this.active = 1
    //         } else {
    //           this.$message(response.message)
    //         }
    //       }).catch(() => { this.loading = false })
    //     }
    //   })
    // },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    // submitForm(state) {
    //   // 提交审批流程
    //   this.$refs['ruleForm'].validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.ruleForm.state = state
    //       const billFlow = this.$refs.flowSelect.getBillFlow()
    //       console.log('获取的billFlow:', billFlow)
    //       this.ruleForm.billFlow = billFlow
    //       var newObj = JSON.parse(JSON.stringify(this.ruleForm))
    //       const details = []
    //       this.list.forEach(e => {
    //         details.push({
    //           workerId: e.worker.id,
    //           exitReason: e.exitReason,
    //           exitDate: e.exitDate,
    //           remark: e.remark
    //         })
    //       })

    //       const postdata = {
    //         id: newObj.id,
    //         orgId: newObj.orgId,
    //         year: newObj.year,
    //         exitReason: newObj.exitReason,
    //         exitDate: newObj.exitDate,
    //         remark: newObj.remark,
    //         fileList: newObj.fileList,
    //         state: newObj.state,
    //         workerExitDetails: details,
    //         billFlow: billFlow
    //       }
    //       saveData(postdata).then(response => {
    //         this.closeThePage()
    //       })
    //     }
    //   })
    // },
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
