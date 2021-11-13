<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    label-width="100px"
    size="mini"
  >
    <el-form-item label="材料属性">
      {{ obj.name }}
    </el-form-item>
    <el-form-item label="可选项">
      <el-input
        v-model="ruleForm.name"
        type="textarea"
        placeholder="添加可选项（支持多行批量添加。一行一个，回车换行）"
        maxlength="500"
        show-word-limit
        rows="10"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import { AddMaterialCategoryPropertyItem, getMaterialCategoryPropertyItem } from '@/api/cggl/material'
export default {
  name: 'AddMCPItem2',
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
        sort: 10
      },
      buttonLoading: false
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          var postData = []
          var cnaArr = this.ruleForm.name.split('\n').filter(a => a.trim()) // 分割并且去掉空行
          cnaArr = Array.from(new Set(cnaArr)) // ES6 去掉重复项
          cnaArr.forEach(e => {
            var a = {}
            a.name = e
            a.sort = 1
            postData.push(a)
          })

          this.$emit('addItemClose', postData)
        }
      })
    },

    initData() {
      if (this.obj.MCPItem.length) {
        var itemsStr = ''
        this.obj.MCPItem.forEach(e => {
          itemsStr += e.name + '\n'
        })
        this.ruleForm.name = itemsStr
      }
    }
  }
}
</script>
