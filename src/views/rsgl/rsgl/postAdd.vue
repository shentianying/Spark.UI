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

    <el-form-item label="岗位名称" prop="name">
      <el-input v-model="ruleForm.name" size="mini" maxlength="50" />
    </el-form-item>

    <el-form-item label="岗位序列" prop="postSequenceID">
      <el-select v-model="ruleForm.postSequenceID" style="width:100%">
        <el-option v-for="(item,index) in postSequenceList" :key="index" :label="item.name" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="所属条线" prop="bussinessLineID">
      <el-select v-model="ruleForm.bussinessLineID" style="width:100%">
        <el-option v-for="(item,index) in bussinessLineList" :key="index" :label="item.name" :value="item.value" />
      </el-select>
    </el-form-item>

    <!-- <el-form-item label="职级范围" required>
      <el-input-number v-model="ruleForm.rankRangeMin" size="mini" :min="1" :max="15" />
      -
      <el-input-number ref="rankRangeMax" v-model="ruleForm.rankRangeMax" size="mini" :min="1" :max="15" />
      级
    </el-form-item> -->

    <el-form-item label="职级范围" required>
      <el-col :span="6">
        <el-form-item prop="rankRangeMin">
          <el-input-number v-model="ruleForm.rankRangeMin" size="mini" :step="1" :min="1" :max="15" />
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="6">
        <el-form-item prop="rankRangeMax">
          <el-input-number v-model="ruleForm.rankRangeMax" size="mini" :step="1" :min="1" :max="15" />级
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label="是否使用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>

    <el-form-item style=" text-align:right;">
      <el-button v-if="obj" type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button v-else type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">添加保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { putPost, addPost } from '@/api/rsgl/post'
import { getDictionaryList } from '@/api/xtgl/dictionary'
export default {
  name: 'AddPost',
  components: {

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
        name: '',
        postSequenceID: '',
        bussinessLineID: '',
        rankRangeMin: 1,
        rankRangeMax: 15,
        sort: 10,
        inUse: true
      },
      buttonLoading: false,
      postSequenceList: [],
      bussinessLineList: [],
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        postSequenceID: [{ required: true, message: '请选择', trigger: 'blur' }],
        bussinessLineID: [{ required: true, message: '请选择', trigger: 'blur' }],
        RankRangeMin: [{ required: true, message: '请输入', trigger: 'blur' }],
        RankRangeMax: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    getDictionaryList({ type: 'postSequence' }).then(response => {
      const { data } = response
      this.postSequenceList = data
    })
    getDictionaryList({ type: 'bussinessLine' }).then(response => {
      const { data } = response
      this.bussinessLineList = data
    })
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (typeof this.ruleForm.rankRangeMin === 'undefined' || typeof this.ruleForm.rankRangeMax === 'undefined') {
            this.$alert('职级范围不能为空，请重新填写！')
            return
          }
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          if (newObj.rankRangeMax < newObj.rankRangeMin) {
            this.$alert('职级范围颠倒，请重新填写！')
            return
          }
          if (this.obj) {
            this.buttonLoading = true
            putPost(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            addPost(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields()
    // },
    initData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm = newObj
      }
    }
  }
}
</script>
