<template>
  <div class="app-container">
    <div v-show="active===0 || active===1">
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
                :disabled="disabled"
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
            <el-form-item label="工人名单">
              <el-button :disabled="disabled" size="mini" type="default" :loading="loading" @click="checkWorker()">选择</el-button>
              {{ workerNameList }}
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
      <!-- <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="addWorker()">选择工人</el-button>
      </div> -->
      <div v-show="active===0" style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDetailList()">生成出勤记录➜</el-button>
      </div>
    </div>
    <div v-show="active===1">
      <!-- <table-item :key="tabeleItemKey" ref="tableItem" :loading="loading" :list="table.list" :col="table.col" :attend-options="attendOptions" /> -->
      <el-table
        v-loading="loading"
        size="mini"
        :data="table.list"
        header-cell-class-name="table-header"
        element-loading-text="Loading"
        fit
        highlight-current-row
        @row-dblclick="handleDetails"
      >
        <el-table-column align="center" label="姓名" fixed="left" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.worker.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工号" fixed="left" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.worker.number }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工种" fixed="left" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.worker.workType.name }}
          </template>
        </el-table-column>
        <template>
          <el-table-column v-for="(item, index) in table.col" :key="index" align="center" :label="item.label" min-width="160">
            <template>
              <el-table-column
                v-for="(item_child, index_child) in item.children"
                :key="index_child"
                align="center"
                :label="item_child.label"
                min-width="160"
              >
                <template slot-scope="scope">
                  <el-select
                    v-if="item_child.dateType==='select'"
                    v-model="scope.row.attend[item_child.value]"
                    size="mini"
                    style="width:100%"
                  >
                    <el-option
                      v-for="(option_item, option_index) in attendOptions"
                      :key="option_index"
                      :label="option_item.name"
                      :value="option_item.value"
                    />
                  </el-select>
                  <el-input
                    v-if="item_child.dateType==='input'"
                    v-model="scope.row[col.value]"
                    size="mini"
                  />
                </template>
              </el-table-column>
            </template>
          </el-table-column>
        </template>
        <el-table-column align="center" label="考勤员备注" min-width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" size="mini" maxlength="200" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="统计出勤" fixed="right" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.attendanceDays }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="统计工资" fixed="right" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.salaryAmount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="人脸打卡" fixed="right" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.faceClock }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="日均工资" fixed="right" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.salaryDaily }}
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
      </div>
    </div>
    <!--流程显示-->
    <div v-show="active===2">
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
import { getFormDefaultTableDate, getDefaultOptions, deleteData } from '@/api/ggzx/attendance'
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
        list: [],
        attendList: []
      },
      attendOptions: [{
        name: 'aaa',
        value: 1
      }],
      disabled: false,
      workerNameList: '',
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
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
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
    previous() {
      // 上一步
      this.active--
      this.disabled = false
      this.billFlow = null
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
    },
    checkWorker() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$refs.workerRef.openDialog()
        }
      })
    },
    getPersons(personList) {
      if ((personList || []).length > 0) {
        const workers = []
        this.workerNameList = ''
        personList.forEach(person => {
          workers.push(person)
          this.workerNameList += person.name + '(' + person.number + '),'
        })
        this.workerNameList = this.workerNameList.substring(0, this.workerNameList.lastIndexOf(','))
        this.workerList = workers
      }
    },
    getDetailList() {
      if (this.workerList.length === 0) {
        this.$message.error('工人名单为空，不可生成出勤记录')
      } else {
        const workerIds = []
        this.workerList.forEach(e => {
          workerIds.push(e.id)
        })
        const postData = {
          date: this.ruleForm.date,
          workerIds: workerIds
        }
        getFormDefaultTableDate(postData).then(response => {
          this.loading = true
          const { columns, attendList } = response
          this.table.col = columns
          this.table.attendList = attendList
          this.loading = false
        })
        this.active = 1
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
