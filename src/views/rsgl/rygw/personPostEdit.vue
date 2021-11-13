<template>
  <div class="app-container">
    <span>工号：</span><span>{{ number }}</span>&nbsp;<span>姓名：</span><span>{{ name }}</span>
    <el-divider content-position="left">主岗位信息</el-divider>
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
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
        </el-col>
        <el-col :sm="12" :xs="24">
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
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
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
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="职务" prop="positionId">
            <el-select v-model="ruleForm.positionId" style="width:100%">
              <el-option v-for="(item,index) in positionList" :key="index" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否使用" prop="inUse">
            <el-switch
              v-model="ruleForm.inUse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider content-position="left">其他岗位信息</el-divider>
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-button type="primary" size="mini" @click="addPersonPost">+添加岗位</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="PersonPostTable"
      v-loading="listLoading"
      :data="PersonPostList"
      border
      size="mini"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column align="center" label="组织机构" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位名称" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.post.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.role.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="职务" min-width="160">
        <template slot-scope="scope">
          <span v-if="positionList">{{ positionList.find(f=>f.value === scope.row.positionId).name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="160">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="editPersonPost(scope)" />
            <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="delPersonPost(scope)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <div style="text-align:center;margin-top:10px;">
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm()">更新保存</el-button>
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
        <el-button v-if="ruleForm.postId !== 0" v-has="'USEREDIT_INDEX'" type="success" size="mini" title="" @click="editRange()">编辑人员审核和数据范围➜</el-button>
      </div>
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :user-val="userVal" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPostPoolDetailById, getPostListByOrgId } from '@/api/rsgl/postPool'
import { getAllPersonPostById, addPersonPost, putPersonPost, deletePersonPost, getPersonPostEditInit } from '@/api/rsgl/personPost'
import { getPersonById } from '@/api/rsgl/person'
import PersonPostDetailEdit from './personPostDetailEdit'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'PersonPostEdit',
  components: {
    PersonPostDetailEdit,
    OrgSelect2
  },
  data() {
    return {
      ruleForm: {
        personId: null,
        postId: 0,
        orgId: null,
        postPoolDetailId: null,
        roleId: null,
        positionId: null,
        isMain: true,
        inUse: true
      },
      changeFlag: false,
      number: '',
      name: '',
      listLoading: false,
      loading: false,

      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PersonPostDetailEdit',
      currentRow: null,
      userVal: null,

      postList: [],
      roleList: [],
      positionList: null,
      PersonPostList: [],
      mainPersonPostId: null,
      rules: {
        postPoolDetailId: [{ required: true, message: '必填', trigger: 'blur' }],
        positionId: [{ required: true, message: '必填', trigger: 'blur' }],
        roleId: [{ required: true, message: '必填', trigger: 'blur' }],
        orgId: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {

  },
  activated() {
    if (this.$route.params.id) {
      getPersonById({ id: this.$route.query.id }).then((response) => {
        const { data } = response
        this.number = data.number
        this.name = data.name
        this.ruleForm.orgId = data.organizationId
        this.initData(data.organizationId)
      })

      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.personId = this.$route.query.id
          // 保存数据
          if (this.mainPersonPostId) {
            this.loading = true
            putPersonPost(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => { this.loading = false })
          } else {
            addPersonPost(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => { this.loading = false })
          }
        }
      })
    },
    fetchData() {
      if (this.$route.query.id !== 0) {
        this.listLoading = true
        getAllPersonPostById({ id: this.$route.query.id }).then((response) => {
          const { data, data2 } = response
          if (data === null) {
            this.ruleForm.personId = this.$route.query.id
            this.$message({ message: '主岗位为空请填写！', type: 'warning' })
          } else {
            this.ruleForm.id = data.id
            this.ruleForm.personId = data.personId
            if (data.positionId !== 0) {
              this.ruleForm.positionId = data.positionId
            }
            this.ruleForm.isMain = data.isMain
            this.ruleForm.inUse = data.inUse
            this.mainPersonPostId = data.id
            if (data.orgId === this.ruleForm.orgId) {
              this.ruleForm.postPoolDetailId = data.postPoolDetailId
              this.ruleForm.postId = data.postId
              this.ruleForm.roleId = data.roleId
            }
          }
          this.PersonPostList = data2
          this.listLoading = false
        })
      }
    },
    initData(val) {
      getPersonPostEditInit({ orgId: val }).then(response => {
        const { data1, data2, data3 } = response
        this.postList = data1
        this.roleList = data2
        this.positionList = data3
        this.fetchData()
      })
    },
    getPostList(setVal) {
      getPostListByOrgId({ id: setVal }).then(response => {
        const { data } = response
        this.postList = data
      })
    },
    closeThePage() {
      this.$store.dispatch('tagsView/delView', this.$route)
      // this.$router.go(-1)
      this.$router.push({ name: 'PersonEdit', query: { id: this.ruleForm.personId, refreshRouterName: 'Person' }, params: { id: this.ruleForm.personId }})
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    editPersonPost(d) {
      this.userVal = this.$route.params.id
      this.currentRow = d.row
      this.dialogTitle = '编辑岗位信息'
      this.comName = 'PersonPostDetailEdit'
      this.dialogTableVisible = true
    },
    addPersonPost() {
      this.userVal = this.$route.params.id
      this.currentRow = null
      this.dialogTitle = '添加岗位信息'
      this.comName = 'PersonPostDetailEdit'
      this.dialogTableVisible = true
    },
    delPersonPost(d) {
      // 页面删除
      this.$confirm('此操作将永久删除该岗位信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePersonPost({ id: d.row.id }).then(response => {
          if (response.errorMsg) {
            // 验证错误
            this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
              { dangerouslyUseHTMLString: true })
            return
          }
          this.$message(response.message)
          this.loading = false
          this.fetchData()
        }).catch(() => { this.loading = false })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
    },
    editRange() {
      this.$router.push({ name: 'UserFrame', query: { id: this.$route.query.id, refreshRouterName: 'Person', tab: 'userOrg', showTag: 0 }, params: { id: this.$route.query.id }})
    }
  }
}
</script>
