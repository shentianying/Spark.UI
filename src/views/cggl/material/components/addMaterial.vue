<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="选择分类" prop="pid">
      <!-- <org-select
        v-if="list"
        v-model="ruleForm.pid"
        :show-root-node="true"
        :select-data="selectData"
        :tree-data="list"
        :multiple="false"
        :disabled="obj!==null"
      /> -->
      <org-select2
        v-if="list"
        v-model="ruleForm.pid"
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
    <el-form-item v-if="show" label="计量单位" prop="unit">
      <el-input v-model="ruleForm.unit" placeholder="米，千克..." maxlength="20" style="width:120px;" />
      <el-checkbox v-model="ruleForm.isMain">是否主材(受控)</el-checkbox>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input
        v-model="ruleForm.name"
        type="textarea"
        placeholder="支持多行批量添加。一行一个，回车换行"
        maxlength="500"
        show-word-limit
        rows="10"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllMaterialCategory, putMaterialCategory, addRangMaterialCategory } from '@/api/cggl/material'
// import OrgSelect from '@/components/OrgSelect/index'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'AddMaterial',
  components: {
    OrgSelect2
    // OrgSelect
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
        unit: '',
        isMain: true,
        pid: 0
      },
      list: null,
      show: false,
      selectData: null,
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  watch: {
    'ruleForm.pid': {
      handler: function(value, oldvalue) {
        if (!oldvalue) {
          this.$refs['ruleForm'].validateField('pid', (valid) => {})
        }
        if (value && this.list) {
          this.showMain(value)
        }
      }, deep: true
    }
  },
  created() {
    getAllMaterialCategory().then(response => {
      const { data } = response
      data.forEach(e => {
        // e.label = e.name
        e.pid = e.pId
      })
      // var arr = [{ id: 0, pid: 0, label: '根节点' }]
      // if (data.length) { arr[0].children = data }
      // this.list = arr
      this.list = data.filter(f => f.level !== 3)
      if (this.obj) {
        // console.log(this.obj.pid)
        // this.selectData = this.obj.pid
        this.ruleForm.pid = this.obj.pid
        this.showMain(this.ruleForm.pid)
      }
    })
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
            putMaterialCategory(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('addCategoryClose', this.ruleForm.pid)
            }).catch(() => { this.buttonLoading = false })
          } else {
            var postData = {}
            var cnaArr = this.ruleForm.name.split('\n').filter(a => a.trim()) // 分割并且去掉空行
            postData.categoryNameArray = Array.from(new Set(cnaArr)) // ES6 去掉重复项
            postData.pid = this.ruleForm.pid
            postData.unit = this.ruleForm.unit
            postData.isMain = this.ruleForm.isMain
            this.buttonLoading = true
            addRangMaterialCategory(postData).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('addCategoryClose', this.ruleForm.pid)
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
        // console.log('传过来的newObj:', newObj)
        this.ruleForm = newObj
      }
    },
    showMain(pid) {
      // 显示受控主材
      if (pid) {
        var l = this.list.find(f => f.id === pid).level
        if (l === 2) { this.show = true } else {
          this.ruleForm.unit = ''
          this.show = false
        }
      }
    }
  }
}
</script>
