<template>
  <div class="app-container">
    <div>
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
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目：" prop="projectId">
              <el-input v-model="projectName" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectProject()" />
              </el-input>
              <select-project ref="projectRef" :multiple="false" :org-id="ruleForm.orgId" @getProject="getProject" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="票号：" prop="number">
              <el-input v-model="ruleForm.number" placeholder="请输入" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="开票日期：" prop="date">
              <el-date-picker
                v-model="ruleForm.date"
                type="date"
                placeholder="请选择"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="金额：" prop="amount">
              <el-input v-model="ruleForm.amount" size="mini" />
            </el-form-item>

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
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm')">保存</el-button>
        <el-button v-if="ruleForm.id>0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button size="mini" type="info" :loading="loading" @click="closeThePage">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { putProjectInvoice, addProjectInvoice, getProjectInvoiceById, deleteProjectInvoice } from '@/api/xmgl/projectInvoice'
import { getOrgWithProject } from '@/api/xtgl/organization'
import { validate } from '@/utils/validate'
import UpFile from '@/components/UpLoad/UpFile'
import SelectProject from '@/components/Other/xmgl/selectProject'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ProjectInvoiceEdit',
  components: {
    UpFile,
    SelectProject,
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
        date: null,
        amount: '',
        remark: '',
        state: 0,
        fileList: []
      },
      orgList: [],
      keyOrg: 0,
      projectInvoiceId: null,
      projectName: '',

      loading: false,
      rules: {
        orgId: [{ required: true, message: '请选择组织机构', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        number: [{ required: true, message: '请输入', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        amount: [
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
      this.initData()
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          let tempIds = []
          if (newObj.fileList.length > 0) {
            tempIds = newObj.fileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.fileList = tempIds

          this.loading = true

          if (this.projectInvoiceId) {
            putProjectInvoice(newObj).then(response => {
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
            addProjectInvoice(newObj).then(response => {
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
      this.projectInvoiceId = id
      this.type = type
      getOrgWithProject().then(res => {
        const { data } = res
        this.orgList = data
        this.keyOrg += 1
      }).catch(() => { })
      if (this.type === 'edit') {
        getProjectInvoiceById({ id: this.projectInvoiceId }).then(response => {
          const { data } = response
          this.ruleForm = data
          this.keyOrg += 1
          this.ruleForm.fileList = data.upFile
          this.projectName = data.project.name
        })
      } else {
        this.ruleForm.state = 0
        this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
      }
    },
    cancel() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteProjectInvoice({ id: this.ruleForm.id }).then(response => {
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
