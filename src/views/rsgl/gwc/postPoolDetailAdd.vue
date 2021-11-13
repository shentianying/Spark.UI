<template>
  <div class="app-container">
    <div>
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class=""
        size="mini"
      >
        <el-form-item label="岗位名称" prop="postId">
          <el-select v-model="ruleForm.postId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="(item,index) in postList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任职资格">
          <el-input v-model="ruleForm.qualifications" type="textarea" :rows="3" placeholder="请输入" size="mini" maxlength="300" show-word-limit />
        </el-form-item>

        <el-form-item label="岗位职责">
          <el-input v-model="ruleForm.postDuty" type="textarea" :rows="3" placeholder="请输入" size="mini" maxlength="300" show-word-limit />
        </el-form-item>

        <el-form-item label="行政领导" prop="adminLeaderId">
          <el-cascader
            v-model="ruleForm.adminLeaderId"
            :options="leaderList"
            clearable
            :show-all-levels="true"
            style="width:100%"
          />
        </el-form-item>

        <el-form-item label="条线领导" prop="lineLeaderId">
          <el-cascader
            v-model="ruleForm.lineLeaderId"
            :options="leaderList"
            clearable
            :show-all-levels="true"
            style="width:100%"
          />
        </el-form-item>

        <el-form-item align="center">
          <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { getPostList } from '@/api/rsgl/post'
import { getPostPoolList, getPostPoolById, getPostPoolDetailList } from '@/api/rsgl/postPool'
export default {
  name: 'PostPoolDetailAdd',
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
        postId: null,
        post: null,
        qualifications: '',
        postDuty: '',
        adminLeaderId: null,
        lineLeaderId: null,
        roleId: 0
      },
      buttonLoading: false,
      comName: '',
      postList: [],
      leaderList: null,
      postPoolDetailList: null,
      rules: {
        postId: [{ required: true, message: '请选择', trigger: 'blur' }],
        adminLeaderId: [{ required: true, message: '请选择', trigger: 'blur' }],
        lineLeaderId: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  watch: {

  },
  mounted() {
    getPostList().then(response => {
      const { data } = response
      this.postList = data
    })
    getPostPoolDetailList().then(response => {
      const { data } = response
      this.postPoolDetailList = data
      this.initData()
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 级联中最后一个id
          var computeradminLeaderId = this.ruleForm.adminLeaderId[this.ruleForm.adminLeaderId.length - 1]
          newObj.adminLeaderId = computeradminLeaderId
          var computerlineLeaderId = this.ruleForm.lineLeaderId[this.ruleForm.lineLeaderId.length - 1]
          newObj.lineLeaderId = computerlineLeaderId
          newObj.post = this.postList.find(f => f.id === newObj.postId)
          // console.log('修改后返回的值:', newObj)
          if (this.obj) {
            this.$emit('dialogClose', newObj, 'update')
          } else {
            this.$emit('dialogClose', newObj, 'add')
          }
        }
      })
    },
    initData() {
      const promise = this.getLeader()
      if (this.obj) {
        promise.then(() => {
          var newObj = JSON.parse(JSON.stringify(this.obj))
          this.ruleForm = newObj
          // 拼接岗位池id成二级数组，来匹配 选岗位池 级联菜单
          var adminLeaderIdArray = []
          if (newObj.adminLeaderId !== -1) {
            // getPostPoolDetailById({ id: newObj.adminLeaderId }).then(response => {
            //   const { data } = response
            //   adminLeaderIdArray.push(data.postPoolId)
            // })
            const adminpostPoolId = this.postPoolDetailList.find(f => f.id === newObj.adminLeaderId).postPoolId
            adminLeaderIdArray.push(adminpostPoolId)
          }
          adminLeaderIdArray.push(newObj.adminLeaderId)
          this.ruleForm.adminLeaderId = adminLeaderIdArray

          var lineLeaderIdArray = []
          if (newObj.lineLeaderId !== -1) {
            // getPostPoolDetailById({ id: newObj.lineLeaderId }).then(response => {
            //   const { data } = response
            //   lineLeaderIdArray.push(data.postPoolId)
            // })
            const leaderPostPoolId = this.postPoolDetailList.find(f => f.id === newObj.lineLeaderId).postPoolId
            lineLeaderIdArray.push(leaderPostPoolId)
          }
          lineLeaderIdArray.push(newObj.lineLeaderId)
          this.ruleForm.lineLeaderId = lineLeaderIdArray
        })
      }
    },
    getLeader() {
      const pro1 = new Promise((resolve, reject) => {
        getPostPoolList().then(response => {
          const { data } = response
          this.leaderList = data.map((value, i) => {
            var child = []
            getPostPoolById({ id: value.id }).then(response => {
              const { data } = response
              data.postPoolDetail.forEach(e => {
                child.push({
                  value: e.id,
                  label: e.post.name
                })
              })
            })

            return {
              value: value.id,
              label: value.name,
              children: child
            }
          })
          this.leaderList.push({
            value: -1,
            label: '无'
          })
          // console.log(this.leaderList)
          resolve()
        }).catch(() => { reject() })
      })
      return pro1
    }
  }
}
</script>
