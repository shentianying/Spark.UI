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
    <el-form-item label="年度" prop="year">
      <!-- <el-input v-model.number="ruleForm.year" placeholder="请输入" size="mini" maxlength="50" /> -->
      <el-select v-model="ruleForm.year" size="mini" placeholder="请选择" style="width:100%">
        <el-option v-for="(item,index) in yearList" :key="index" :label="item.name" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="工人工号" prop="number">
      <el-input v-model="ruleForm.number" placeholder="请输入" size="mini" maxlength="50" />
    </el-form-item>
    <el-form-item label="工人名称" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入" size="mini" maxlength="50" />
    </el-form-item>
    <el-form-item label="证件号" prop="idNumber">
      <el-input v-model="ruleForm.idNumber" placeholder="请输入" size="mini" maxlength="50" />
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="ruleForm.type" style="width:100%">
        <el-option v-for="(item,index) in whitelistTypeList" :key="index" :label="item.name" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="原因" prop="reason">
      <el-input v-model="ruleForm.reason" type="textarea" :rows="4" maxlength="500" />
    </el-form-item>
    <el-form-item label="附件" prop="fileList">
      <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="ruleForm.remark" type="textarea" :rows="4" maxlength="500" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button v-if="ruleForm.id!==0" v-has="WHITELIST_DELETE" type="danger" size="mini" :loading="buttonLoading" @click="handleDelete(ruleForm.id)">移除</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getFormById, saveData, deleteData } from '@/api/ggzx/workerWhitelist'
import { getDefaultOptions } from '@/api/ggzx/worker'
import UpFile from '@/components/UpLoad/UpFile'
import { validateData } from '@/utils/validate'
export default {
  name: 'WorkerWhitelistEdit',
  components: {
    UpFile
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        year: null,
        number: '',
        name: '',
        idNumber: '',
        type: null,
        reason: '',
        fileList: [],
        remark: ''
      },
      whitelistTypeList: null,
      yearList: [],
      disabled: false,
      buttonLoading: false,
      isLoad: false,
      rules: {
        // path: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        year: [{ required: true, message: '请选择', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入', trigger: 'blur' }]
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
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!validateData.idCode(this.ruleForm.idNumber).isSuccess) {
            this.$message.error(validateData.idCode(this.ruleForm.idNumber).msg)
            return false
          } else {
            var newObj = JSON.parse(JSON.stringify(this.ruleForm))
            this.buttonLoading = true
            const postData = {
              id: newObj.id,
              year: newObj.year,
              number: newObj.number,
              name: newObj.name,
              idNumber: newObj.idNumber,
              type: newObj.type,
              reason: newObj.reason,
              remark: newObj.remark,
              fileList: newObj.fileList
            }
            saveData(postData).then(response => {
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
        // this.ruleForm = newObj
        getFormById({ id: newObj.id }).then(response => this.setData(response))
      }
      this.whitelistTypeList = this.list
      getDefaultOptions().then(op => {
        const { yearOptions } = op
        this.yearList = yearOptions
      })
    },
    setData(response) {
      this.fileListKey++
      this.buttonLoading = true
      const { data, fileList } = response
      this.ruleForm = data
      this.ruleForm.fileList = fileList
      this.disabled = true
      this.buttonLoading = false
    },
    handleDelete(id) {
      this.$confirm('确定要移除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        deleteData({ id: id }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.buttonLoading = false
            this.$emit('dialogClose')
          } else {
            this.$message.error(res.message)
            this.buttonLoading = false
            this.$emit('dialogClose')
          }
        }).finally(() => {
          this.listLoading = false
        })
      })
    }
  }
}
</script>
