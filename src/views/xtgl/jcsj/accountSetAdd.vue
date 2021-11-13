<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class=""
    size="mini"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="ruleForm.name" size="mini" maxlength="50" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="公司全名" prop="fullName">
          <el-input v-model="ruleForm.fullName" size="mini" maxlength="150" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="公司缩写" prop="shortName">
          <el-input v-model="ruleForm.shortName" size="mini" maxlength="20" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="公司地址" prop="address" maxlength="100">
          <el-input v-model="ruleForm.address" size="mini" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="ruleForm.phoneNumber" size="mini" maxlength="20" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="税号" prop="taxNumber">
          <el-input v-model="ruleForm.taxNumber" size="mini" maxlength="50" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="开户行" prop="bank">
          <el-input v-model="ruleForm.bank" size="mini" maxlength="50" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="账号" prop="accountNumber">
          <el-input v-model="ruleForm.accountNumber" size="mini" maxlength="40" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="是否使用" prop="inUse">
          <el-switch
            v-model="ruleForm.inUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" />
    </el-row>

    <el-form-item label="备注" prop="remark">
      <el-input v-model="ruleForm.remark" show-word-limit type="textarea" size="mini" maxlength="500" />
    </el-form-item>

    <el-form-item style=" text-align:right;">
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putAccountSet, addAccountSet } from '@/api/xtgl/accountSet'
export default {
  name: 'AddAccountSet',
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        fullName: '',
        shortName: '',
        taxNumber: '',
        address: '',
        phoneNumber: '',
        bank: '',
        accountNumber: '',
        remark: '',
        inUse: true
      },
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '请输入组织机构名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          if (this.obj) {
            this.buttonLoading = true
            putAccountSet(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            addAccountSet(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    initData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm = newObj
      }
    }
  }
}
</script>
