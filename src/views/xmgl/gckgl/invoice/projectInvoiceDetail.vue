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
            <el-form-item label="项目：">
              {{ orgName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目：">
              <span v-if="ruleForm.project">{{ ruleForm.project.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="票号：">
              {{ ruleForm.number }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="开票日期：">
              {{ ruleForm.date | dateFormat }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="金额：">
              {{ utils.formatMoney(ruleForm.amount, 2, 0) }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="备注：">
              {{ ruleForm.remark }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="附件：">
              <up-file
                v-model="ruleForm.fileList"
                :size="50"
                :is-preview="true"
                :is-download="true"
                :file-list="ruleForm.fileList"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="发票开具申请附件：">
              <up-file
                v-model="applyFileList"
                :size="50"
                :is-preview="true"
                :is-download="true"
                :file-list="applyFileList"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="财务开票附件：">
              <up-file
                v-model="cwFileList"
                :size="50"
                :is-preview="true"
                :is-download="true"
                :file-list="cwFileList"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="创建人：">
              {{ ruleForm.createUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="创建日期：">
              {{ ruleForm.createDate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="更新人：">
              {{ ruleForm.lastEditUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="更新日期：">
              {{ ruleForm.lastEditDate }}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </div>
</template>

<script>
import { getProjectInvoiceById } from '@/api/xmgl/projectInvoice'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'ProjectInvoiceDetail',
  components: {
    UpFile
  },
  data() {
    return {
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
      applyFileList: [],
      cwFileList: [],
      projectInvoiceId: null,
      orgName: '',

      loading: false,
      rules: {
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
    initData() {
      if (this.$route.query.id) {
        this.projectInvoiceId = this.$route.query.id
      }
      if (this.projectInvoiceId) {
        getProjectInvoiceById({ id: this.projectInvoiceId }).then(response => {
          const { data, orgName } = response
          this.ruleForm = data
          this.orgName = orgName
          this.ruleForm.fileList = data.upFile
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
