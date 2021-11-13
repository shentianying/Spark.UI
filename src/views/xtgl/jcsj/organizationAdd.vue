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
    <el-form-item label="选择上级菜单" prop="pid">
      <org-select2
        v-model="ruleForm.pid"
        :data-mode="0"
        size="mini"
        :collapse-tags="false"
        :check-strictly="true"
        :show-all-levels="true"
        :multiple="false"
        :filterable="true"
        placeholder="根节点"
        :select-data="ruleForm.pid"
        @change="orgChange($event)"
      />
      <!-- <org-select v-model="orgId" :data-mode="0" :select-data="pid" :show-root-node="true" select-style="width:200px;" /> -->
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" size="mini" />
    </el-form-item>
    <el-form-item label="缩写" prop="shortName">
      <el-input v-model="ruleForm.shortName" size="mini" />
    </el-form-item>
    <el-form-item label="选择绑定公司" prop="accountSetIds">
      <el-select v-model="ruleForm.accountSetIds" multiple placeholder="请选择" style="width:100%">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="类别" prop="categoryId">
      <el-select v-model="ruleForm.categoryId" style="width:100%">
        <el-option v-for="(item,index) in categoryList" :key="index" :label="item.name" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="排序号" prop="sort">
      <el-input-number v-model="ruleForm.sort" size="mini" :min="1" :max="999" />
    </el-form-item>
    <el-form-item label="是否可选择" prop="optional">
      <el-switch
        v-model="ruleForm.optional"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="是否是项目" prop="isProject">
      <el-switch
        v-model="ruleForm.isProject"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="是否统计余额" prop="isSum">
      <el-switch
        v-model="ruleForm.isSum"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="是否可用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
      <!-- <el-select v-model="ruleForm.inUse" size="mini" placeholder="请选择">
        <el-option label="是" value="true" />
        <el-option label="否" value="false" />
      </el-select> -->
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putOrganization, addOrganization } from '@/api/xtgl/organization'
import { getAccountSetByOrgId } from '@/api/xtgl/accountSet'
import OrgSelect2 from '@/components/OrgSelect/index2'
import { getDictionaryList } from '@/api/xtgl/dictionary'
export default {
  name: 'AddOrganization',
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
        name: '',
        shortName: '',
        accountSetIds: [],
        categoryId: '',
        sort: '',
        optional: true,
        isProject: false,
        isSum: false,
        inUse: true,
        pid: 0
      },
      options: [],
      categoryList: [],
      orgId: null,
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '请输入组织机构名称', trigger: 'blur' }],
        accountSetIds: [{ type: 'array', required: true, message: '请至少选择一个公司', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择类别', trigger: 'blur' }]
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
          newObj.accountSetIds = newObj.accountSetIds.join()
          delete newObj.label
          // newObj.pid = this.orgId || 0
          // console.log('要传出去的值：', newObj)
          if (this.obj) {
            this.buttonLoading = true
            putOrganization(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            addOrganization(newObj).then(response => {
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
      getDictionaryList({ type: 'postPoolCategory' }).then(response => {
        const { data } = response
        this.categoryList = data
      })
      if (this.obj) {
        this.orgChange(this.obj.pid)
        var newObj = JSON.parse(JSON.stringify(this.obj))
        newObj.accountSetIds = newObj.accountSetIds.split(',').map(item => Number(item))
        this.ruleForm = newObj
      } else {
        this.orgChange(0)
      }
    },
    orgChange(data) {
      getAccountSetByOrgId({ orgId: data }).then(response => {
        this.options = response.data
      })
    }
  }
}
</script>
