<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
      size="mini"
    >
      <el-form-item label="选择角色" prop="authorizedUesrId">
        <el-select v-if="roleList" v-model="ruleForm.roleId">
          <el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item style=" text-align:right;">
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getRole, addUserRole, putUserRole } from '@/api/xtgl/role'
export default {
  name: 'UserRoleAdd',
  components: {
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ruleForm: {
        roleId: null
      },
      buttonLoading: false,
      roleList: null,
      rules: {
        expirationDate: [{ required: true, type: 'string', message: '不能为空', trigger: ['blur', 'change'] }]
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
          // newObj.authorizedUesrId = Number(newObj.authorizedUesrId)
          if (this.obj) {
            this.buttonLoading = true
            putUserRole(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            newObj.userId = Number(this.id)
            addUserRole(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    initData() {
      getRole().then(response => {
        this.roleList = response.data
      })
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm = newObj
      }
    }
  }
}
</script>
