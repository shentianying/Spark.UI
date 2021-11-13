<template>
  <div class="app-container">
    <div>
      <h2 v-if="supplierId">供应商编辑</h2>
      <h2 v-else>供应商添加</h2>
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
          <el-form-item label="编号：" prop="number">
            <!-- <el-input v-model="ruleForm.number" maxlength="10" /> -->
            <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="ruleForm.name" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="曾用名：" prop="oldName">
            <el-input v-model="ruleForm.oldName" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="地址：" prop="address">
            <el-input v-model="ruleForm.address" maxlength="200" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="所在城市：" prop="city">
            <org-select2
              v-if="treeData"
              v-model="ruleForm.city"
              :data-mode="0"
              size="mini"
              :options="treeData"
              :select-data="ruleForm.city"
              :collapse-tags="true"
              :show-all-levels="false"
              :multiple="false"
              expand-trigger="hover"
              placeholder="选择所在城市"
              :check-strictly="false"
              select-style="width:100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="Email：" prop="email">
            <el-input v-model="ruleForm.email" maxlength="100" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24" prop="url">
          <el-form-item label="网址：">
            <el-input v-model="ruleForm.url" maxlength="80" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24" prop="corporation">
          <el-form-item label="法人代表：">
            <el-input v-model="ruleForm.corporation" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24" prop="capital">
          <el-form-item label="注册资金(万)：">
            <el-input v-model="ruleForm.capital" maxlength="10" />
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
          <el-form-item label="联系人：" prop="contacts">
            <el-input v-model="ruleForm.contacts" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人电话：" prop="contactsPhone">
            <el-input v-model="ruleForm.contactsPhone" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="开户行：" prop="bankName">
            <el-input v-model="ruleForm.bankName" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="银行账号：" prop="bankAccount">
            <el-input v-model="ruleForm.bankAccount" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <!-- <el-col :sm="12" :xs="24">
          <el-form-item label="评级：" prop="rate">
            <el-rate v-model="ruleForm.rate" />
          </el-form-item>
        </el-col> -->

        <el-col :sm="12" :xs="24">
          <el-form-item label="业务城市：" prop="businessCity">
            <org-select2
              v-if="treeData"
              v-model="ruleForm.businessCity"
              :data-mode="0"
              size="mini"
              :options="treeData"
              :select-data="ruleForm.businessCity"
              :collapse-tags="true"
              :show-all-levels="false"
              :multiple="true"
              expand-trigger="hover"
              placeholder="选择业务城市"
              :check-strictly="false"
              select-style="width:100%;"
            />
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
          <el-form-item label="是否使用：" prop="inUse">
            <el-switch
              v-model="ruleForm.inUse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24" />
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="上传附件">
            <up-file
              v-model="fileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="fileList"
            >
              提示：上传营业资质等相关附件
            </up-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="">
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
        <el-button v-if="ruleForm.rate<0" type="primary" plain size="mini" :loading="buttonLoading" @click="attitude(ruleForm.id,1)">入库评审</el-button>
        <el-button v-if="ruleForm.rate>=0" type="primary" plain size="mini" :loading="buttonLoading" @click="attitude(ruleForm.id,2)">星级评审</el-button>
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getSupplierById, addSupplier, putSupplier, getSupplierEditInit } from '@/api/cggl/supplier'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'SupplierAdd',
  components: {
    UpFile,
    OrgSelect2
  },
  data() {
    return {
      ruleForm: {
        number: '',
        name: '',
        oldName: '',
        address: '',
        city: null,
        email: '',
        url: '',
        corporation: '',
        capital: null,
        companyPhone: '',
        contacts: '',
        contactsPhone: '',
        bankName: '',
        bankAccount: '',
        rate: 0,
        mainBusiness: '',
        businessCity: null,
        remark: '',
        inUse: true,
        state: 0
      },
      fileList: [],
      supplierId: null,
      buttonLoading: false,
      treeData: null,
      orgValue: null,
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        mainBusiness: [{ required: true, message: '必填', trigger: 'blur' }],
        businessCity: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  mounted() {
  },
  activated() {
    this.initData()
    if (this.$route.params.id) {
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.businessCity = newObj.businessCity ? newObj.businessCity.join() : ''
          let tempIds = []
          if (this.fileList.length) {
            tempIds = this.fileList.map(m => { return { id: m.id, addFlag: m.addFlag } })
          }
          var postData = { supplier: newObj, fileList: tempIds }
          if (this.supplierId) {
            // 修改
            this.buttonLoading = true
            putSupplier(postData).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.closeThePage()
              // this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            // 添加
            this.buttonLoading = true
            addSupplier(postData).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.closeThePage()
              // this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    initData() {
      new Promise((resolve, reject) => {
        getSupplierEditInit().then(response => {
          const { data } = response
          data.forEach(element => {
            element.label = element.name
          })
          resolve(data)
        })
      }).then(treeData => {
        this.supplierId = this.$route.query.id
        if (this.supplierId) {
          getSupplierById({ id: this.supplierId }).then(response => {
            const { data, files } = response
            data.businessCity = data.businessCity.split(',').map(m => Number(m))
            this.treeData = treeData
            this.ruleForm = data

            this.fileList = files // 附件
          })
        } else {
          this.ruleForm.city = null
          this.treeData = treeData
        }
      }).catch(() => {
        this.$message.error('信息错误')
      })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    attitude(id, type) {
      this.closeThePage()
      this.$router.push({ name: 'SupplierAssesmentEdit', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id, type: type }})
    }
  }
}
</script>
