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
      <el-form-item label="加入年度" prop="year">
        <!-- <el-input v-model.number="ruleForm.year" placeholder="请输入" size="mini" maxlength="50" /> -->
        <el-select v-model="ruleForm.year" size="mini" placeholder="请选择" style="width:100%">
          <el-option v-for="(item,index) in yearList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="工人" prop="name">
        <el-input v-model="ruleForm.worker.name" :disabled="true" placeholder="请选择" size="mini" maxlength="50">
          <el-button slot="append" :disabled="disabled" icon="el-icon-search" @click="checkWorker()" />
        </el-input>
      </el-form-item>
      <el-form-item label="加入原因" prop="reason">
        <el-input v-model="ruleForm.reason" type="textarea" :rows="4" maxlength="500" />
      </el-form-item>
      <el-form-item label="加入日期" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
          style="width:100%"
          size="mini"
        />
      </el-form-item>
      <el-form-item label="是否加入黑名单" prop="inUse">
        <el-switch
          v-model="ruleForm.inUse"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item v-if="ruleForm.inUse===false" label="取消原因" prop="reason">
        <el-input v-model="ruleForm.cancelReason" type="textarea" :rows="4" maxlength="500" />
      </el-form-item>
      <el-form-item v-if="ruleForm.inUse===false" label="取消日期" prop="date">
        <el-date-picker
          v-model="ruleForm.cancelDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
          style="width:100%"
          size="mini"
        />
      </el-form-item>
      <el-form-item label="附件" prop="fileList">
        <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" type="textarea" :rows="4" maxlength="500" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
        <!-- <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
    <select-worker ref="workerRef" :worker="worker" @getPersons="getPersons" />
  </div>
</template>

<script>
import { getFormById, saveData } from '@/api/ggzx/workerBlacklist'
import { getDefaultOptions } from '@/api/ggzx/worker'
import UpFile from '@/components/UpLoad/UpFile'
import SelectWorker from '@/components/Other/ggzx/selectWorker'
export default {
  name: 'WorkerBlacklistEdit',
  components: {
    UpFile,
    SelectWorker
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
        worker: {},
        year: null,
        reason: '',
        date: null,
        inUse: true,
        cancelReason: '',
        cancelDate: null,
        fileList: [],
        remark: ''
      },
      worker: null,
      yearList: [],
      disabled: false,
      buttonLoading: false,
      isLoad: false,
      rules: {
        // path: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        year: [{ required: true, message: '请选择', trigger: 'blur' }],
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
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          if (newObj.worker.name === null) {
            this.$message.error('请选择工人！')
          } else {
            this.buttonLoading = true
            const postData = {
              id: newObj.id,
              year: newObj.year,
              workerId: newObj.worker.id,
              reason: newObj.reason,
              date: newObj.date,
              inUse: newObj.inUse,
              cancelReason: newObj.cancelReason,
              cancelDate: newObj.cancelDate,
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
      const workers = []
      workers.push(this.ruleForm.worker)
      this.workerList = workers
      this.disabled = true
      this.buttonLoading = false
    },
    getPersons(person) {
      this.ruleForm.worker = person
      this.worker = person
    },
    checkWorker() {
      this.$refs.workerRef.openDialog()
    }
  }
}
</script>
