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
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="ruleForm.name" size="mini" maxlength="20" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch
        v-model="ruleForm.status"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="1"
        :inactive-value="0"
      />
      <!-- <el-select v-model="ruleForm.status" size="mini" placeholder="请选择" style="width:220px;">
        <el-option label="正常" value="1" />
        <el-option label="停用" value="0" />
      </el-select> -->
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="ruleForm.remark" size="mini" maxlength="80" />
    </el-form-item>

    <el-form-item>
      <el-button v-if="roleId" v-has="'ROLE_EDIT'" type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button v-else v-has="'ROLE_ADD'" type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putRole, addRole, getRoleById } from '@/api/xtgl/role'
export default {
  name: 'RoleEdit',
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
        status: 1,
        remark: '',
        companyId: this.$store.state.user.selectOrgId
      },
      roleId: null,
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]

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
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.status = Number(newObj.status)
          if (this.roleId) {
            this.buttonLoading = true
            putRole(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
          if (!this.roleId) {
            addRole(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    initData() {
      this.roleId = this.$route.query.id // 获取操作类型 0 修改 , 1 添加
      if (this.roleId) {
        getRoleById({ id: this.roleId }).then(response => {
          this.ruleForm = response.data
          this.ruleForm.idType = Number(this.ruleForm.idType)
        }).catch(() => {
          this.$message.error('信息错误')
          this.closeThePage()
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>
