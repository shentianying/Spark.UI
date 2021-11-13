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
        <el-form-item label="组织机构" prop="orgId">
          <org-select2
            v-model="ruleForm.orgId"
            size="mini"
            :collapse-tags="false"
            :show-all-levels="true"
            :multiple="false"
            :select-data="ruleForm.orgId"
            :filterable="true"
            expand-trigger="hover"
            placeholder="请选择"
            :check-strictly="true"
            select-style="width:100%"
            @change="orgChange"
          />
        </el-form-item>

        <el-form-item label="岗位名称" prop="postPoolDetailId">
          <el-select v-model="ruleForm.postPoolDetailId" filterable placeholder="请选择" style="width:100%" @change="postChange">
            <el-option
              v-for="(item,index) in postList"
              :key="index"
              :label="item.post.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="角色名称" prop="roleId">
          <el-select v-model="ruleForm.roleId" filterable placeholder="请选择" style="width:100%" disabled>
            <el-option
              v-for="(item,index) in roleList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="职务" prop="positionId">
          <el-select v-model="ruleForm.positionId" style="width:100%">
            <el-option v-for="(item,index) in positionList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否使用" prop="inUse">
          <el-switch
            v-model="ruleForm.inUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
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
import { getPostListByOrgId, getPostPoolDetailById } from '@/api/rsgl/postPool'
import { addPersonPost, putPersonPost, getPersonPostEditInit } from '@/api/rsgl/personPost'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'PersonPostDetailEdit',
  components: {
    OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    userVal: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ruleForm: {
        personId: null,
        postId: null,
        orgId: null,
        postPoolDetailId: null,
        roleId: null,
        positionId: null,
        isMain: false,
        inUse: true
      },
      changeFlag: false,
      postList: [],
      roleList: [],
      positionList: [],
      buttonLoading: false,
      rules: {
        postPoolDetailId: [{ required: true, message: '必填', trigger: 'blur' }],
        positionId: [{ required: true, message: '必填', trigger: 'blur' }],
        roleId: [{ required: true, message: '必填', trigger: 'blur' }],
        orgId: [{ required: true, message: '必填', trigger: 'blur' }]
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
          newObj.personId = this.userVal
          if (this.obj) {
            this.buttonLoading = true
            putPersonPost(newObj)
              .then((response) => {
                this.$message(response.message)
                this.buttonLoading = false
                this.$emit('dialogClose')
              }).catch(() => { this.buttonLoading = false })
          } else {
            addPersonPost(newObj)
              .then((response) => {
                this.$message(response.message)
                this.buttonLoading = false
                this.$emit('dialogClose')
              }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    initData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        getPersonPostEditInit({ orgId: newObj.orgId }).then(response => {
          const { data1, data2, data3 } = response
          this.postList = data1
          this.positionList = data3
          this.roleList = data2
          this.ruleForm = newObj
        })
      } else {
        getPersonPostEditInit({ orgId: 0 }).then(response => {
          const { data2, data3 } = response
          this.positionList = data3
          this.roleList = data2
          this.changeFlag = true
        })
      }
    },
    getPostList(setVal) {
      getPostListByOrgId({ id: setVal }).then(response => {
        const { data } = response
        this.postList = data
      })
    },
    postChange(val) {
      getPostPoolDetailById({ id: val }).then(response => {
        const { data } = response
        this.ruleForm.postId = data.postId
        this.ruleForm.roleId = data.roleId
      })
    },
    orgChange(val) {
      if (this.changeFlag) {
        if (val) {
          this.ruleForm.postPoolDetailId = null
          this.ruleForm.roleId = null
          this.getPostList(val)
        }
      } else {
        this.changeFlag = true
      }
    }
  }
}
</script>
