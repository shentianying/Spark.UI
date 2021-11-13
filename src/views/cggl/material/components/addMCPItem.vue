<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    label-width="100px"
    size="mini"
  >
    <el-form-item label="材料属性">
      {{ obj.property.name }}
    </el-form-item>
    <el-form-item label="允许手动输入" prop="canInput">
      <el-switch
        v-model="ruleForm.canInput"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="是否必输" prop="isRequired">
      <el-switch
        v-model="ruleForm.isRequired"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="是否目标成本必输" prop="isTargetRequired">
      <el-switch
        v-model="ruleForm.isTargetRequired"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="可选项" prop="itemName">
      <el-input
        v-model="ruleForm.itemName"
        type="textarea"
        placeholder="添加可选项（支持多行批量添加。一行一个，回车换行）"
        maxlength="500"
        show-word-limit
        rows="10"
      />
    </el-form-item>
    <!-- <el-form-item
      v-for="(item,index) in ruleForm.list"
      :key="index"
      align="right"
      :label="'项'+(index+1)"
      :prop="'list.'+index+'.name'"
      :rules="{
        required:true,message:'不能为空',trigger:'blur'
      }"
    >
      名称：<el-input v-model="item.name" style="width:150px" />
      排序号：<el-input-number v-model="item.sort" style="width:100px" :min="1" :max="999" />
      <el-button @click.prevent="removeItem(item)">删除</el-button>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      <!-- <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { putMaterialCategoryProperty } from '@/api/cggl/material'
export default {
  name: 'AddMCPItem',
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
        list: [],
        id: null,
        isRequired: false,
        isTargetRequired: false,
        canInput: false,
        itemName: '',
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
          var items = [] // 拼装子项数据
          var cnaArr = this.ruleForm.itemName.split('\n').filter(a => a.trim()) // 分割并且去掉空行
          cnaArr = Array.from(new Set(cnaArr)) // ES6 去掉重复项
          cnaArr.forEach(e => {
            var a = {}
            a.categoryId = this.obj.categoryId
            a.propertyId = this.obj.propertyId
            a.mCPId = this.obj.id
            a.name = e
            a.sort = 10
            items.push(a)
          })
          var postData = {
            id: this.ruleForm.id,
            isRequired: this.ruleForm.isRequired,
            isTargetRequired: this.ruleForm.isTargetRequired,
            canInput: this.ruleForm.canInput,
            mCPItem: items
          }
          putMaterialCategoryProperty(postData).then(response => {
            this.$message(response.message)
            this.buttonLoading = false
            this.$emit('addItemclose')
          }).catch(() => { this.buttonLoading = false })
          // AddMaterialCategoryPropertyItem(postData).then(response => {
          //   this.$message(response.message)
          //   this.buttonLoading = false
          //   this.$emit('addItemclose')
          // }).catch(() => { this.buttonLoading = false })
        }
      })
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields()
    // },
    // addItem() {
    //   this.ruleForm.list.push({ name: '', sort: 1 })
    // },
    // removeItem(item) {
    //   var index = this.ruleForm.list.indexOf(item)
    //   if (index !== -1) {
    //     this.ruleForm.list.splice(index, 1)
    //   }
    // },
    initData() {
      var newObj = JSON.parse(JSON.stringify(this.obj))
      var itemsStr = ''
      newObj.mcpItem.forEach(e => {
        itemsStr += e.name + '\n'
      })
      this.ruleForm = {
        itemName: itemsStr,
        isRequired: newObj.isRequired,
        isTargetRequired: newObj.isTargetRequired,
        canInput: newObj.canInput,
        id: newObj.id
      }
      // getMaterialCategoryPropertyItem({ mcpId: this.obj.id }).then(response => {
      //   const { data } = response
      //   var itemsStr = ''
      //   data.forEach(e => {
      //     itemsStr += e.name + '\n'
      //   })
      //   this.ruleForm.name = itemsStr
      // })
    }
  }
}
</script>
