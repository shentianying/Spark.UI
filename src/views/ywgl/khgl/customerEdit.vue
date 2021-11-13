<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="客户名称:" prop="name">
            <el-input v-model="ruleForm.name" maxlength="45" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="类别:" prop="customerType">
            <el-select v-model="ruleForm.customerType" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in customerTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="法定代表人:" prop="legalPerson">
            <el-input v-model="ruleForm.legalPerson" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人:" prop="linkMan">
            <el-input v-model="ruleForm.linkMan" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人电话:" prop="linkManTel">
            <el-input v-model="ruleForm.linkManTel" maxlength="11" />
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人职位:" prop="linkManPosition">
            <el-input v-model="ruleForm.linkManPosition" maxlength="18" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人主管范围:" prop="linkManChiefArea">
            <el-input v-model="ruleForm.linkManChiefArea" maxlength="45" />
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="资金来源:" prop="capitalSource">
            <el-input v-model="ruleForm.capitalSource" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24" prop="capital">
          <el-form-item label="注册资金：">
            <el-input v-model="ruleForm.capital" type="number" maxlength="20">
              <i slot="suffix" style="margin-right: 10px;">万元</i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24" prop="companyPhone">
          <el-form-item label="公司电话：">
            <el-input v-model="ruleForm.companyPhone" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="地址：" prop="address">
            <el-input v-model="ruleForm.address" maxlength="200" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="Email：" prop="email">
            <el-input v-model="ruleForm.email" maxlength="100" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="主营：" prop="mainBusiness">
            <el-input v-model="ruleForm.mainBusiness" type="textarea" :rows="4" maxlength="500" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="4" maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否可用:" prop="inUse">
            <el-switch v-model="ruleForm.inUse" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>
        </el-col>
        <el-col />
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="上传附件">
            <up-file
              v-model="ruleForm.upFile"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="ruleForm.upFile"
            >
              提示：上传营业资质等相关附件
            </up-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="text-align:center;margin-top:20px;">
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getCustomerById, putCustomer, addCustomer } from '@/api/ywgl/customer'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'CustomerEdit',
  components: {
    UpFile
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
      buttonLoading: false,
      refreshRouterName: '',
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '不能为空', trigger: 'blur' }],
        linkMan: [{ required: true, message: '不能为空', trigger: 'blur' }],
        linkManTel: [{ required: true, message: '不能为空', trigger: 'blur' }],
        customerType: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.fetchData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    getDictionarysByTypes({ types: 'customerType' }).then(response => {
      const { data } = response
      // 1.客户类型下拉列表
      this.customerTypeList = data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var postData = JSON.parse(JSON.stringify(this.ruleForm))
          console.log(postData)
          let tempIds = []
          if (postData.upFile.length) {
            tempIds = postData.upFile.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.fileList = tempIds
          if (this.$route.query.id) {
            this.buttonLoading = true
            putCustomer(postData)
              .then((response) => {
                this.$message(response.message)
                this.buttonLoading = false
                this.closeThePage()
              }).catch(() => { this.buttonLoading = false })
          } else {
            this.buttonLoading = true
            addCustomer(postData)
              .then((response) => {
                this.$message(response.message)
                this.buttonLoading = false
                this.closeThePage()
              })
              .catch(() => {
                this.buttonLoading = false
              })
          }
        }
      })
    },
    async fetchData() {
      if (this.$route.query.id !== 0) {
        await getCustomerById({ id: this.$route.query.id }).then((response) => {
          const { data } = response
          this.ruleForm = data
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>
