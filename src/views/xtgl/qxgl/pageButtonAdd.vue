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
    <el-form-item label="所属菜单" prop="pageId">
      <org-select2
        v-if="treeList"
        v-model="ruleForm.pageId"
        size="mini"
        :collapse-tags="false"
        :show-all-levels="true"
        :multiple="false"
        :filterable="true"
        placeholder="请选择菜单"
        props-label="routerTitle"
        :options="treeList"
        :select-data="ruleForm.pageId"
        :check-strictly="false"
      />
    </el-form-item>
    <el-form-item label="说明" prop="name">
      <el-input v-model="ruleForm.name" size="mini" maxlength="30" style="width:200px;" />
      <el-checkbox v-model="ruleForm.isView" @change="isView">查看</el-checkbox>
      <el-tooltip class="item" effect="dark" content="如果是查看权限的话，就勾上" placement="top-start">
        <i class="el-icon-question" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="标识" prop="code">
      <el-input v-model="ruleForm.code" size="mini" maxlength="30" />
    </el-form-item>
    <el-form-item label="controller" prop="controller">
      <el-input v-model="ruleForm.controller" size="mini" maxlength="30" />
    </el-form-item>
    <el-form-item label="action" prop="action">
      <el-input v-model="ruleForm.action" size="mini" maxlength="50" />
    </el-form-item>
    <el-form-item label="序号" prop="sort">
      <el-input-number v-model="ruleForm.sort" :min="1" :max="20" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addPermit, updatePermit, GetAllList } from '@/api/xtgl/page'
// import { getTree } from '@/utils/index'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'AddButton',
  components: {
    // Treeselect
    OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    currentPage: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        code: '',
        controller: '',
        action: '',
        pageId: null,
        sort: null,
        isView: false
      },
      treeList: null,
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        controller: [{ required: true, message: '请输入', trigger: 'blur' }],
        action: [{ required: true, message: '请输入', trigger: 'blur' }],
        pageId: [{ required: true, message: '请选择', trigger: 'change' }],
        sort: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  // watch: {
  //   'ruleForm.pageId': {
  //     handler: function(value, oldvalue) {
  //       if (!oldvalue) {
  //         this.$refs['ruleForm'].validateField('pageId', (valid) => {})
  //       }
  //     }, deep: true
  //   }
  // },
  mounted() {
    this.initData()

    this.listLoading = true
    GetAllList().then(response => {
      this.treeList = response.data
      this.$refs['ruleForm'].validateField('pageId', (valid) => {})
      this.listLoading = false
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.code = newObj.code.toUpperCase()
          if (this.obj) {
            this.buttonLoading = true
            updatePermit(newObj).then(response => {
              this.$message(response.message)
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            this.buttonLoading = true
            addPermit(newObj).then(response => {
              this.$message(response.message)
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
      } else {
        // 初始化选中项
        this.ruleForm.pageId = this.currentPage.id
      }
    },
    isView(checked) {
      if (checked) {
        this.ruleForm.name = '查看'
      }
    }
  }
}
</script>
