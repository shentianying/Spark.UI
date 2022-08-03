<template>

  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="选择节点" prop="pId">
      <org-select2
        v-if="list"
        v-model="ruleForm.pId"
        size="mini"
        :collapse-tags="false"
        :show-all-levels="true"
        :multiple="false"
        :options="list"
        :disabled="obj!==null"
        :filterable="true"
        expand-trigger="hover"
        placeholder="选择分类"
        :check-strictly="true"
        select-style="width:220px;"
      />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input
        v-model="ruleForm.name"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllMonitorNode, addMonitorNode } from '@/api/jkgl/monitor'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'AddMonitorNode',
  components: {
    OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    pid: {
      type: Number,
      default: 0
    }

  },
  data() {
    return {
      ruleForm: {
        id: 0, // 新增为0
        companyId: this.$store.state.user.selectOrgId, // 公司id
        number: '', // 编号
        name: '', // 名称
        ipAddress: '', // IP地址
        loginName: '', // 登录名
        loginPassword: '', // 登录密码
        isMonitor: 0, // 是否是监控
        inUse: 1, // 是否使用
        remark: '', // 备注
        pId: 0
      },
      list: null,
      listLoading: false,
      buttonLoading: false,
      selectionItem: [],
      rules: {
        // propertyArray: [{ type: 'array', required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const postData = this.ruleForm
          this.buttonLoading = true
          addMonitorNode(postData).then(response => {
            this.$message(response.message)
            this.buttonLoading = false
            this.$emit('dialogClose')
          }).catch(() => { this.buttonLoading = false })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    fetchData() {
      this.listLoading = true
      getAllMonitorNode().then(response => {
        response.data.forEach(element => {
          element.pid = element.pId
          element.label = element.name
          delete element.pId
        })
        this.list = response.data
        this.ruleForm.pId = this.pid
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    handleSelectionChange(val) {
      this.selectionItem = val
    }
  }
}
</script>
