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
            <el-form-item
              v-if="activate"
              label="调出项目"
              prop="orgOutId"
            >
              <org-select2
                :key="orgOutKey"
                v-model="ruleForm.orgOutId"
                :data-mode="1"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="true"
                :select-data="ruleForm.orgOutId"
                select-style="width:100%;"
              />
              <!-- <org-select2
                :key="orgOutKey"
                v-model="ruleForm.orgOutId"
                :disabled="true"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :select-data="ruleForm.orgOutId"
                placeholder="选择工人后自动带出"
                select-style="width:100%;"
              /> -->
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="ruleForm.worker.number" :disabled="true" placeholder="请选择" size="mini" maxlength="50">
                <el-button slot="append" :disabled="disabled" icon="el-icon-search" @click="checkWorker()" />
              </el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="4" size="mini" maxlength="500" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="调出日期" prop="date">
              <el-date-picker
                v-model="ruleForm.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                style="width:100%"
                size="mini"
              />
            </el-form-item>
            <el-form-item
              v-if="activate"
              label="调入项目"
              prop="orgInId"
            >
              <org-select2
                v-model="ruleForm.orgInId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :select-data="ruleForm.orgInId"
                select-style="width:100%;"
              />
            </el-form-item>
            <el-form-item label="姓名">
              {{ ruleForm.worker.name }}
            </el-form-item>
            <el-form-item label="附件">
              <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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

    <select-worker-2 ref="workerRef" :multiple="false" :org-ids="orgIdList" :isexit="false" :ispause="false" :worker-list="workerList" @getPersons="getPersons" />
  </div>
</template>
<script>
import { getFormById, getBillFlow, saveData, deleteData } from '@/api/ggzx/workerTransfer'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SelectWorker2 from '@/components/Other/ggzx/selectWorker2.vue'
export default {
  name: 'WorkerTransferEdit',
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
        number: '',
        orgInId: null,
        orgOutId: null,
        workerId: null,
        worker: {
          id: null,
          number: '',
          name: ''
        },
        date: null,
        remark: '',
        fileList: []
      },
      workerList: [],
      orgIdList: [],
      disabled: false,
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
      orgOutKey: 0,
      rules: {
        orgInId: [{ required: true, message: '请选择', trigger: 'change' }],
        orgOutId: [{ required: true, message: '请选择', trigger: 'change' }],
        date: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
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
    // }
    'ruleForm.orgOutId': {
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
    },
    setData(response) {
      this.fileListKey++
      const { data } = response
      this.ruleForm = data
      this.ruleForm.fileList = data.upFile
      const workers = []
      workers.push(this.ruleForm.worker)
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

          const postdata = {
            id: newObj.id,
            orgInId: newObj.orgInId,
            orgOutId: newObj.orgOutId,
            workerId: newObj.worker.id,
            date: newObj.date,
            remark: newObj.remark,
            fileList: newObj.fileList,
            state: newObj.state,
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
    checkWorker() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$refs.workerRef.openDialog()
        }
      })
    },
    getPersons(personList) {
      if ((personList || []).length > 0) {
        // const data = []
        // personList.forEach(person => {
        //   data.push({
        //     worker: {
        //       id: person.id,
        //       year: person.year,
        //       number: person.number,
        //       name: person.name,
        //       organization: person.organization,
        //       idNumber: person.idNumber
        //     },
        //     exitReason: this.ruleForm.exitReason,
        //     exitDate: this.ruleForm.exitDate,
        //     remark: ''
        //   })
        // })
        // this.list = data

        this.ruleForm.worker = personList[0]
        this.ruleForm.orgOutId = personList[0].organization.id
        this.ruleForm.workerId = personList[0].id
        const workers = []
        workers.push(personList[0])
        this.workerList = workers
        this.orgOutKey++
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
