<template>
  <div class="app-container">
    <div>
      <h2 v-if="postPoolId">岗位池编辑</h2>
      <h2 v-else>岗位池添加</h2>
      <el-divider />
    </div>
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
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="自动填充" size="mini" disabled />
            </el-form-item>

            <el-form-item v-show="ruleForm.category==1" label="适用范围" prop="orgId">
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
            <el-form-item label="类别" prop="category">
              <el-select v-model="ruleForm.category" style="width:100%" @change="categoryChange">
                <el-option v-for="(item,index) in categoryList" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
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

      <div class="flex_div">
        <el-button :loading="loading" size="mini" @click="add()">+添加岗位</el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column type="index" width="55" align="center" />
        <el-table-column label="岗位名称" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.post.name }}
          </template>
        </el-table-column>
        <el-table-column label="任职资格" align="left" header-align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.qualifications }}
          </template>
        </el-table-column>
        <el-table-column label="岗位职责" align="left" header-align="center" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.postDuty }}
          </template>
        </el-table-column>
        <el-table-column label="行政领导" align="center" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.adminLeaderId == -1">
              {{ }}
            </div>
            <div v-else>
              <span v-if="leaderList">
                {{ leaderList.find(f=>f.id === scope.row.adminLeaderId).postPool.name }}/{{ leaderList.find(f=>f.id === scope.row.adminLeaderId).post.name }}
              </span>
              <span v-else>
                {{ }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="条线领导" align="center" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.lineLeaderId == -1">
              {{ }}
            </div>
            <div v-else>
              <span v-if="leaderList">
                {{ leaderList.find(f=>f.id === scope.row.lineLeaderId).postPool.name }}/{{ leaderList.find(f=>f.id === scope.row.lineLeaderId).post.name }}
              </span>
              <span v-else>
                {{ }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="80">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
              <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <div style="text-align:center;margin-top:10px;">
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm()">更新保存</el-button>
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
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
        <component :is="comName" :obj="currentRow" :is-preview="true" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPostPoolById, putPostPool, addPostPool, getPostPoolEditInit } from '@/api/rsgl/postPool'
import PostPoolDetailAdd from './postPoolDetailAdd'
import OrgSelect2 from '@/components/OrgSelect/index2'

export default {
  name: 'PostPoolEdit',
  components: {
    PostPoolDetailAdd,
    OrgSelect2
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        name: '',
        orgId: null,
        category: '',
        inUse: true
      },
      loading: false,
      activate: false,
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PostPoolDetailAdd',
      currentRow: null,
      list: [],
      categoryList: [],
      postPoolId: null,
      leaderList: null,
      orgList: null,
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        category: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  activated() {
    this.initData()
    if (this.$route.params.id) {
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    // getDictionaryList({ type: 'postPoolCategory' }).then(response => {
    //   const { data } = response
    //   this.categoryList = data
    // })
    // getPostPoolDetailList().then(response => {
    //   const { data } = response
    //   this.leaderList = data
    // })
    // getOrganizationList().then(response => {
    //   const { data } = response
    //   this.orgList = data
    // })
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.ruleForm.category !== 1) {
            this.ruleForm.orgId = 0
          }
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var arrDetail = []
          this.list.forEach(e => {
            var p = {}
            p.id = e.id
            p.postId = e.postId
            p.qualifications = e.qualifications
            p.postDuty = e.postDuty
            p.adminLeaderId = e.adminLeaderId
            p.lineLeaderId = e.lineLeaderId
            p.inUse = 1
            p.roleId = e.roleId
            arrDetail.push(p)
          })
          newObj.postPoolDetail = arrDetail
          if (arrDetail.length < 1) {
            this.$alert('请添加岗位！')
            return
          }
          // console.log(newObj)
          // 保存数据
          this.loading = true
          if (this.postPoolId) {
            putPostPool(newObj).then(response => {
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
            addPostPool(newObj).then(response => {
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
    initData() {
      getPostPoolEditInit().then(response => {
        const { data1, data2, data3 } = response
        this.orgList = data2
        this.categoryList = data1
        this.leaderList = data3
      })
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.postPoolId = this.$route.query.id
      }
      if (this.postPoolId) {
        this.loading = true
        getPostPoolById({ id: this.postPoolId }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data } = response
      var pom = []
      data.postPoolDetail.forEach(e => {
        pom.push({
          id: e.id,
          postId: e.postId,
          post: {
            id: e.post.id,
            name: e.post.name
          },
          qualifications: e.qualifications,
          postDuty: e.postDuty,
          adminLeaderId: e.adminLeaderId,
          lineLeaderId: e.lineLeaderId,
          roleId: e.roleId
        })
      })
      // 填充参数
      this.ruleForm = data
      // 填充 明细列表
      this.list = pom
      // console.log(data)
      this.loading = false // loading 状态关闭
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.addPost(data, state)
      // this.setColumnShow()
      this.dialogTableVisible = false
    },
    addPost(data, state) {
      if (data) {
        if (state === 'add') {
          this.list.push(data)
        } else if (state === 'update') {
          this.list.splice(this.listIndex, 1, data)
        }
      }
    },
    edit(d) {
      this.currentRow = d.row
      // console.log('edit=>d.row:', d.row)
      this.listIndex = d.$index
      this.dialogTitle = '编辑岗位'
      this.comName = 'PostPoolDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.dialogTitle = '添加岗位'
      this.comName = 'PostPoolDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    del(d) {
      // 页面删除
      this.list.splice(d.$index, 1)
    },
    categoryChange(val) {
      if (val === 1) {
        this.ruleForm.name = ''
      } else {
        this.ruleForm.name = this.categoryList.find(f => f.value === val).name
      }
    },
    orgChange(val) {
      if (val) {
        this.ruleForm.name = this.orgList.find(f => f.id === val).name
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
