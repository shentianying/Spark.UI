<template>
  <div class="app-container">
    <div>
      <h2>供应商查看</h2>
      <el-divider />
    </div>
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class=""
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="编号：">
            {{ ruleForm.number }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="名称：">
            {{ ruleForm.name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="曾用名：">
            {{ ruleForm.oldName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="地址：">
            {{ ruleForm.address }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item v-if="ruleForm.cities" label="所在城市：" prop="">
            {{ ruleForm.cities.name }}
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
          <el-form-item label="网址：">
            {{ ruleForm.url }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="法人代表：">
            {{ ruleForm.corporation }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="注册资金(万)：">
            {{ ruleForm.capital }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="公司电话：">
            {{ ruleForm.companyPhone }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人：">
            {{ ruleForm.contacts }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人电话：">
            {{ ruleForm.contactsPhone }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="开户行：">
            {{ ruleForm.bankName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="银行账号：">
            {{ ruleForm.bankAccount }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <!-- <el-col :sm="12" :xs="24">
          <el-form-item label="评级：">
            <el-rate
              v-model="ruleForm.rate"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </el-form-item>
        </el-col> -->
        <el-col :sm="12" :xs="24">
          <el-form-item label="业务城市：">
            {{ businessCityStr }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">

        <el-col :sm="12" :xs="24">
          <el-form-item label="主营：">
            {{ ruleForm.mainBusiness }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="备注：">
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
          <el-form-item label="最后编辑人：">
            {{ ruleForm.lastEditUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="最后编辑时间：">
            {{ ruleForm.lastEditDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否使用：">
            <el-switch
              v-model="ruleForm.inUse"
              disabled
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24" />
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="附件：">
            <up-file v-model="fileList" :is-preview="true" :file-list="fileList" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="">
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSupplierById } from '@/api/cggl/supplier'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'SupplierDetail',
  components: {
    UpFile
  },
  data() {
    return {
      ruleForm: {},
      supplierId: null,
      fileList: [],
      buttonLoading: false,
      businessCityStr: '',
      rules: {
        // path: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        // name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
        // component: [
        //   { required: true, message: '请选择活动区域', trigger: 'blur' }
        // ]
      }
    }
  },
  mounted() {
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    initData() {
      this.supplierId = this.$route.query.id
      if (this.supplierId) {
        getSupplierById({ id: this.supplierId }).then(response => {
          const { data, files, businessCityStr } = response
          this.businessCityStr = businessCityStr
          this.ruleForm = data
          this.fileList = files
        }).catch(() => {
          this.$message.error('信息错误')
          // this.closeThePage()
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>
