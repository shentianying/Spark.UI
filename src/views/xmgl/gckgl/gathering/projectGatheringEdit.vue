<template>
  <div class="app-container ShouKuanEdit">
    <el-card class="info-card">
      工程款信息
    </el-card>
    <el-card class="form-card">
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
            <el-form-item label="项目：" prop="projectId">
              <el-input v-model="projectName" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectProject()" />
              </el-input>
              <select-project ref="projectRef" :multiple="false" :org-id="ruleForm.orgId" @getProject="getProject" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="经手人：" prop="personId">
              <PersonSelect v-model="ruleForm.personId" size="mini" :multiple="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="收款类型：" prop="gatheringType">
              <el-select v-model="ruleForm.gatheringType" placeholder="请选择" size="mini" style="width:100%">
                <el-option
                  v-for="item in gatheringTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="资金类型：" prop="capitalType">
              <CapitalSelect v-model="ruleForm.capitalType" size="mini" :multiple="false" :show-all-levels="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="收款日期：" prop="gatheringDate">
              <el-date-picker
                v-model="ruleForm.gatheringDate"
                type="date"
                placeholder="请选择"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="金额：" prop="gatheringAmount">
              <el-input v-model="ruleForm.gatheringAmount" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div style="text-align:center; margin-top:15px;">
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm',1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm('ruleForm',0)">保存</el-button>
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="info" :loading="loading" @click="closeThePage()">取消</el-button>
      </div>

    </el-card>

  </div>

</template>

<script>
import { putProjectGathering, addProjectGathering, getProjectGatheringById, deleteProjectGathering, initProjectGathering } from '@/api/xmgl/projectGathering'
import { validate } from '@/utils/validate'
import SelectProject from '@/components/Other/xmgl/selectProject'
import CapitalSelect from '@/components/SearchBar/form/CapitalSelect'
import PersonSelect from '@/components/SearchBar/form/PersonSelect'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ProjectGatheringEdit',
  components: {
    SelectProject,
    CapitalSelect,
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
        gatheringType: '',
        capitalType: '',
        gatheringDate: new Date(),
        personId: this.$store.state.user.uid,
        gatheringAmount: '',
        remark: '',
        state: 0
      },
      orgList: [],
      keyOrg: 0,
      gatheringTypeList: [],
      capitalTypeList: [],
      projectGatheringId: null,
      projectName: '',

      loading: false,
      rules: {
        orgId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        gatheringType: [{ required: true, message: '请选择收款类型', trigger: 'change' }],
        capitalType: [{ required: true, message: '请选择资金类型', trigger: 'change' }],
        gatheringDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
        personId: [{ required: true, message: '请选择经手人', trigger: 'change' }],
        gatheringAmount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' }
        ]
      }
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
      this.active = 0
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    submitForm(formName, state) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.state = state

          this.loading = true

          if (this.projectGatheringId) {
            putProjectGathering(newObj).then(response => {
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
            })
          } else {
            addProjectGathering(newObj).then(response => {
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
      this.projectGatheringId = id
      this.type = type
      if (this.type === 'edit') {
        getProjectGatheringById({ id: this.projectGatheringId }).then(response => {
          const { data, gatheringTypeList, orgList } = response
          this.gatheringTypeList = gatheringTypeList
          this.orgList = orgList
          this.ruleForm = data
          this.keyOrg += 1
          this.projectName = data.project.name
        })
      } else {
        this.ruleForm.state = 0
        this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
        this.getOptions()
      }
    },
    // 获取资金类型、收款类型选项
    async getOptions() {
      const { gatheringTypeList, capitalTypeList, orgList } = await initProjectGathering()
      this.gatheringTypeList = gatheringTypeList
      this.capitalTypeList = capitalTypeList
      this.orgList = orgList
      this.keyOrg += 1
    },
    cancel() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteProjectGathering({ id: this.ruleForm.id }).then(response => {
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

<style lang="scss" scoped>
.ShouKuanEdit{
  .info-card {
  margin: 16px 24px 0 24px;
  height: 48px;
  line-height: 12px;
  font-size: 16px;
  font-weight: 600;
  }
.form-card {
  margin: 0 24px;
  }
}
</style>
