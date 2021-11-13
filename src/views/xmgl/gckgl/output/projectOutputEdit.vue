<template>
  <div class="app-container">
    <div>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写单据" icon="el-icon-edit" />
        <el-step title="确认流程" icon="el-icon-refresh" />
      </el-steps>
    </div>
    <div v-show="active===0 || active===2">
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="160px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号：" prop="number">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="系统自动生成" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目：" prop="projectId">
              <el-input v-model="projectName" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectProject()" />
              </el-input>
              <select-project ref="projectRef" :multiple="false" :org-id="ruleForm.orgId" @getProject="getProject" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="组织机构：" prop="orgId">
              <org-select2
                v-if="orgList"
                :key="keyOrg"
                v-model="ruleForm.orgId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="true"
                :options="orgList"
                select-style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="年度：" prop="outputYear">
              <el-date-picker
                v-model="ruleForm.outputYear"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="月份：" prop="outputMonth">
              <el-select v-model="ruleForm.outputMonth" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="(item,index) in monthList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目经理：" prop="projectManagerId">
              <PersonSelect v-model="ruleForm.projectManagerId" size="mini" :multiple="false" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="对内产值：" prop="internalOutput">
              <el-input v-model="ruleForm.internalOutput" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="对外产值：" prop="externalOutput">
              <el-input v-model="ruleForm.externalOutput" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="应收款：" prop="receivable">
              <el-input v-model="ruleForm.receivable" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="定额甲供：" prop="quotaFirstSupply">
              <el-input v-model="ruleForm.quotaFirstSupply" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="实际甲供：" prop="realFirstSupply">
              <el-input v-model="ruleForm.realFirstSupply" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="当前比例：" prop="currentRate">
              <el-input v-model="ruleForm.currentRate" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="累计比例：" prop="totalRate">
              <el-input v-model="ruleForm.totalRate" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

            <el-form-item label="附件：">
              <up-file
                v-model="ruleForm.fileList"
                :size="50"
                :is-upfile="true"
                :is-preview="true"
                :is-download="true"
                :is-delete="true"
                :is-rename="true"
                :file-list="ruleForm.fileList"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow('ruleForm')">下一步➜</el-button>
      </div>
    </div>

    <!--流程显示-->
    <div v-show="active===1 || active===2">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm',1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm('ruleForm',0)">保存</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>
    <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div>
  </div>
</template>

<script>
import { putProjectOutput, addProjectOutput, getProjectOutputById, getBillFlow, deleteProjectOutput } from '@/api/xmgl/projectOutput'
import { getOrgWithProject } from '@/api/xtgl/organization'
import { validate } from '@/utils/validate'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import SelectProject from '@/components/Other/xmgl/selectProject'
import PersonSelect from '@/components/SearchBar/form/PersonSelect'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ProjectOutputEdit',
  components: {
    FlowSelect,
    UpFile,
    SelectProject,
    PersonSelect,
    OrgSelect2
  },
  data() {
    return {
      type: '', // edit：编辑 add:新增
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        companyId: this.$store.state.user.selectOrgId,
        projectId: null,
        outputYear: null,
        outputMonth: null,
        projectManagerId: null,
        projectManagerName: '',
        internalOutput: '',
        externalOutput: '',
        receivable: '',
        quotaFirstSupply: null,
        realFirstSupply: null,
        currentRate: null,
        totalRate: null,
        remark: '',
        state: 0,
        billFlowId: 0,
        fileList: []
      },
      monthList: [{
        value: 1,
        label: '1月'
      }, {
        value: 2,
        label: '2月'
      }, {
        value: 3,
        label: '3月'
      }, {
        value: 4,
        label: '4月'
      }, {
        value: 5,
        label: '5月'
      }, {
        value: 6,
        label: '6月'
      }, {
        value: 7,
        label: '7月'
      }, {
        value: 8,
        label: '8月'
      }, {
        value: 9,
        label: '9月'
      }, {
        value: 10,
        label: '10月'
      }, {
        value: 11,
        label: '11月'
      }, {
        value: 12,
        label: '12月'
      }, {
        value: 0,
        label: '年度调节'
      }],
      orgList: [],
      keyOrg: 0,
      projectOutputId: null,
      projectName: '',
      managerName: '',

      attitudePara: null,
      loadFlow: false,
      billFlow: null,

      active: 0,
      loading: false,
      rules: {
        orgId: [{ required: true, message: '请选择组织机构', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        projectManagerId: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
        outputYear: [{ required: true, message: '请选择年份', trigger: 'change' }],
        outputMonth: [{ required: true, message: '请选择月份', trigger: 'change' }],
        internalOutput: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' }
        ],
        externalOutput: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' }
        ],
        receivable: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' }
        ],
        quotaFirstSupply: [{ validator: validate.money, message: '金额格式不正确', trigger: 'blur' }],
        realFirstSupply: [{ validator: validate.money, message: '金额格式不正确', trigger: 'blur' }],
        currentRate: [{ validator: validate.logic, logic: value => value >= 0 && value <= 100, trigger: 'blur' }],
        totalRate: [{ validator: validate.logic, logic: value => value >= 0 && value <= 100, trigger: 'blur' }]
      }
    }
  },
  watch: {
    'ruleForm.outputYear'(val) {
      this.ruleForm.outputYear = '' + val
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.initData()
    }
  },
  methods: {
    submitForm(formName, state) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // newObj.outputYear = Number(this.ruleForm.outputYear)
          let tempIds = []
          if (newObj.fileList.length > 0) {
            tempIds = newObj.fileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.fileList = tempIds
          newObj.state = state

          if (this.billFlow) {
            // 获取流程组件中的数据
            const billFlow = this.$refs.flowSelect.getBillFlow()
            if (!billFlow) {
              return false
            }
            newObj.billFlow = billFlow
          } else {
            this.$message('流程数据不能为空')
            return
          }
          this.loading = true

          if (this.projectOutputId) {
            putProjectOutput(newObj).then(response => {
              if (response.errorMsg) {
              // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => {
              this.loading = false
              this.active = 0
            })
          } else {
            addProjectOutput(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => {
              this.loading = false
              this.active = 0
            })
          }
        }
      })
    },
    initData() {
      const { type, id } = this.$route.query
      if (!type) {
        return
      }
      this.projectOutputId = id
      this.type = type
      if (this.type === 'edit') {
        getProjectOutputById({ id: this.projectOutputId }).then(response => {
          const { data, orgList } = response
          this.orgList = orgList
          this.ruleForm = data
          this.keyOrg += 1
          this.ruleForm.fileList = data.upFile
          console.log(data)
          this.projectName = data.project.name
        })
      } else {
        getOrgWithProject().then(res => {
          const { data } = res
          this.orgList = data
          this.keyOrg += 1
        }).catch(() => { })
        this.ruleForm.state = 0
        this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
      }
    },
    getDynamicFlow(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))

          getBillFlow(newObj).then(response => {
            if (response.success) {
              this.billFlow = response.data.billFlow
              this.active = 1
            } else {
              this.$message(response.message)
            }
          })
        }
      })
    },
    previous() {
      // 上一步
      this.active--
      this.billFlow = null
    },
    cancel() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.active = 2
        this.loading = true
        deleteProjectOutput({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    selectProject() {
      this.$refs.projectRef.openDialog()
    },
    getProject(data) {
      if (data.length > 0) {
        this.ruleForm.projectId = data[0].id
        this.projectName = data[0].name
        this.ruleForm.orgId = data[0].orgId
        this.keyOrg += 1
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
