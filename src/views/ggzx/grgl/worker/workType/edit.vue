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
    <el-form-item label="所属上级工种" prop="pid">
      <treeselect
        v-model="ruleForm.pid"
        placeholder="请选择"
        :multiple="false"
        :default-expand-level="1"
        :flat="true"
        :options="treeList"
        :normalizer="my_normalizer"
      />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" size="mini" maxlength="100" />
    </el-form-item>
    <!-- <el-form-item label="值" prop="value">
      <el-input v-model.number="ruleForm.value" size="mini" maxlength="5" />
    </el-form-item> -->
    <el-form-item label="排序" prop="sort">
      <el-input v-model.number="ruleForm.sort" size="mini" maxlength="5" />
    </el-form-item>
    <el-form-item label="是否可用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="ruleForm.remark" type="textarea" :rows="4" maxlength="500" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllList, saveData } from '@/api/ggzx/workType'
import { getTree } from '@/utils/index'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'WorkTypeEdit',
  components: {
    // OrgSelect2
    Treeselect
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        pid: 0,
        name: '',
        // value: '',
        sort: '',
        remark: '',
        inUse: true
      },
      treeList: null,
      buttonLoading: false,
      isLoad: false,
      rules: {
        // path: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        // name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
        // component: [
        //   { required: true, message: '请选择活动区域', trigger: 'blur' }
        // ]
      }
    }
  },
  wathch: {

  },
  mounted() {
    this.initData()
    this.initTree()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          this.buttonLoading = true
          if (this.obj) {
            newObj.id = this.obj.id
          }
          saveData(newObj).then(response => {
            this.$message(response.message)
            this.buttonLoading = true
            this.$emit('dialogClose')
          }).catch(() => { this.buttonLoading = false })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    initData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        // newObj.inUse = newObj.inUse ? 'true' : 'false'
        this.ruleForm = newObj
        console.log('传过来的数据：', newObj)
      }
    },
    initTree() {
      this.listLoading = true
      getAllList().then(response => {
        response.data.forEach(ele => {
          ele.label = ele.name
        })
        // this.treeList = response.data
        this.isLoad = true
        // console.log('树形结构：', this.treeList)
        const result = getTree(0, response.data)
        this.treeList = [{ id: 0, pid: 0, label: '一级根目录', children: result }]
        this.listLoading = false
      })
    },
    /**
     * 设置禁用
     */
    my_normalizer(node) {
      if (node.id !== 0 && node.pid !== 0) {
        node.isDisabled = true
      } else {
        node.isDisabled = false
      }
      console.log(node)
      return node
    }
  }
}
</script>
