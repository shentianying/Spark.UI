<template>
  <div class="app-container">
    <span>工号：</span><span>{{ number }}</span>&nbsp;<span>姓名：</span><span>{{ name }}</span>
    <el-divider content-position="left">主岗位信息</el-divider>
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      label-width="120px"
      class
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="组织机构" prop="orgId">
            {{ ruleForm.organization.name }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="岗位名称" prop="postId">
            {{ ruleForm.post.name }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="角色名称" prop="roleId">
            {{ ruleForm.role.name }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="职务" prop="positionId">
            <span v-if="positionList.length>0 && positionId>0">{{ positionList.find(f=>f.value === ruleForm.positionId).name }}</span>
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
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider content-position="left">其他岗位信息</el-divider>

    <el-table
      ref="UserPostTable"
      v-loading="listLoading"
      :data="personPostList"
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
          <span v-if="positionList.length>0">{{ positionList.find(f=>f.value === scope.row.positionId).name }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <div style="text-align:center;margin-top:10px;">
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
      </div>
    </div>

  </div>
</template>
<script>
import { getAllPersonPostById } from '@/api/rsgl/personPost'
import { getPersonById } from '@/api/rsgl/person'
export default {
  name: 'PersonPostDetail',
  components: {

  },
  data() {
    return {
      ruleForm: {
        id: 0,
        postId: null,
        post: {
          name: ''
        },
        orgId: null,
        organization: {
          name: ''
        },
        postPoolDetailId: null,
        postPoolDetail: {
          postPool: {
            name: ''
          }
        },
        roleId: null,
        role: {
          name: ''
        },
        positionId: null,
        isMain: true,
        inUse: true
      },
      number: '',
      name: '',
      positionList: [],
      listLoading: false,
      personPostList: []
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
      })
      this.fetchData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    async fetchData() {
      if (this.$route.query.id !== 0) {
        await getAllPersonPostById({ id: this.$route.query.id }).then((response) => {
          const { data, data2, data3 } = response
          this.positionList = data3
          if (data !== null) {
            this.ruleForm = data
          }
          this.personPostList = data2
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>
