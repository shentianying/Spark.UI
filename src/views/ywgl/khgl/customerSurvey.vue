<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      label-width="130px"
      class
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="客户名称：" prop="name">
            {{ ruleForm.name }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="类别：" prop="customerType">
            {{ ruleForm.customerType }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="法定代表人：" prop="legalPerson">
            {{ ruleForm.legalPerson }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人：" prop="linkMan">
            {{ ruleForm.linkMan }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人电话：" prop="linkManTel">
            {{ ruleForm.linkManTel }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人职位：" prop="linkManPosition">
            {{ ruleForm.linkManPosition }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人主管范围：" prop="linkManChiefArea">
            {{ ruleForm.linkManChiefArea }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="资金来源：" prop="capitalSource">
            {{ ruleForm.capitalSource }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24" prop="capital">
          <el-form-item label="注册资金(万)：">
            {{ ruleForm.capital }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24" prop="companyPhone">
          <el-form-item label="公司电话：">
            {{ ruleForm.companyPhone }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="地址：" prop="address">
            {{ ruleForm.address }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="Email：" prop="email">
            {{ ruleForm.email }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="主营：" prop="mainBusiness">
            {{ ruleForm.mainBusiness }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="备注：" prop="remark">
            {{ ruleForm.remark }}
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
          <el-form-item label="创建时间：">
            {{ ruleForm.createDate | dateTimeFormat }}
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
          <el-form-item label="更新时间：">
            {{ ruleForm.lastEditDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否可用：" prop="inUse">
            <el-switch v-model="ruleForm.inUse" active-color="#13ce66" inactive-color="#ff4949" disabled />
          </el-form-item>
        </el-col>
        <el-col />
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="附件：">
            <up-file v-model="ruleForm.upFile" :is-preview="true" :file-list="ruleForm.upFile" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider content-position="left">调研信息</el-divider>
    <div class="flex_div" style="text-align:right;margin-bottom:10px">
      <el-button size="mini" @click="add()">+添加调研信息</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="surveyList"
      border
      size="mini"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column align="left" header-align="center" label="调研信息" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="附件" min-width="120">
        <template slot-scope="scope">
          <up-file v-model="scope.row.upFiles" :is-preview="true" :file-list="scope.row.upFiles" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加人" width="120">
        <template slot-scope="scope">
          <el-tooltip placement="top" :enterable="false" effect="light">
            <div slot="content">
              添加人：{{ scope.row.createUserName }} 添加时间：{{ scope.row.createDate }}<br>
              更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate }}
            </div>
            <span>{{ scope.row.createUserName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="120">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="80">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
            <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :customer="customer" @dialogClose="dialogClose" />
      </el-dialog>
    </div>

    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomerById, deleteCustomerSurvey } from '@/api/ywgl/customer'
import UpFile from '@/components/UpLoad/UpFile'
import CustomerSurveyAdd from './customerSurveyAdd'
export default {
  name: 'CustomerSurvey',
  components: {
    UpFile,
    CustomerSurveyAdd
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        customerType: null,
        companyId: this.$store.state.user.selectOrgId,
        legalPerson: '',
        linkMan: '',
        linkManTel: '',
        linkManPosition: '',
        linkManChiefArea: '',
        capitalSource: '',
        capital: 0,
        companyPhone: '',
        address: '',
        email: '',
        mainBusiness: '',
        remark: '',
        inUse: true,
        upFile: [],
        fileList: []
      },
      customerTypeList: [], // 客户类别列表
      surveyList: [],
      fileList: [],
      listLoading: false,
      refreshRouterName: '',
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'CustomerSurveyAdd',
      currentRow: null,
      customer: null
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.fetchData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    } else {
      this.$refs['ruleForm'].resetFields()
    }
  },
  mounted() {
  },
  methods: {
    async fetchData() {
      if (this.$route.query.id !== 0) {
        await getCustomerById({ id: this.$route.query.id }).then((response) => {
          const { data, data1, dictionaries } = response
          this.ruleForm = data
          this.surveyList = data1
          this.ruleForm.customerType = dictionaries[0].name
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    edit(d) {
      this.currentRow = d.row
      this.customer = this.$route.query.id
      this.dialogTitle = '编辑调研信息'
      this.comName = 'CustomerSurveyAdd'
      this.dialogWidth = '50%'
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.customer = this.$route.query.id
      this.dialogTitle = '添加调研信息'
      this.comName = 'CustomerSurveyAdd'
      this.dialogWidth = '50%'
      this.dialogTableVisible = true
    },
    del(d) {
    // 页面删除
      this.$confirm('此操作将永久删除该调研信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomerSurvey({ id: d.row.id }).then(response => {
          if (response.errorMsg) {
            // 验证错误
            this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
              { dangerouslyUseHTMLString: true })
            return
          }
          this.$message(response.message)
          this.loading = false
          this.fetchData()
        }).catch(() => { this.loading = false })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    }
  }
}
</script>
