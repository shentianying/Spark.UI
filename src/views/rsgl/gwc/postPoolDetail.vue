<template>
  <div class="app-container">
    <div>
      <h2>岗位池查看</h2>
      <el-divider />
    </div>
    <div>
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        label-width="120px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="名称" prop="name">
              {{ ruleForm.name }}
            </el-form-item>

            <el-form-item v-show="ruleForm.categoryId==1" label="适用范围" prop="orgName">
              {{ ruleForm.orgName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="类别" prop="category">
              {{ ruleForm.category }}
            </el-form-item>
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
        <el-table-column label="行政领导" align="center" width="100">
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
        <el-table-column label="条线领导" align="center" width="100">
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
      </el-table>
    </div>

    <div>
      <div style="text-align:center;margin-top:10px;">
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import { getPostPoolById, getPostPoolDetailList } from '@/api/rsgl/postPool'
export default {
  name: 'PostPoolDetail',
  components: {

  },
  data() {
    return {
      ruleForm: {
        id: 0,
        name: '',
        orgName: '',
        category: '',
        inUse: true,
        categoryId: 1
      },
      loading: false,
      currentRow: null,
      list: [],
      categoryList: null,
      postPoolId: null,
      leaderList: null
    }
  },
  mounted() {
    getPostPoolDetailList().then(response => {
      const { data } = response
      this.leaderList = data
    })
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    async initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.postPoolId = this.$route.query.id
      }
      if (this.postPoolId) {
        this.loading = true
        await getPostPoolById({ id: this.postPoolId }).then(response => this.setData(response))
      }
    },
    setData(response) {
      const { data, dictionaries, orgName } = response
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
          lineLeaderId: e.lineLeaderId
        })
      })
      // 填充参数
      this.ruleForm = {
        id: data.id,
        name: data.name,
        orgName: orgName,
        category: dictionaries[0].name,
        inUse: data.inUse,
        categoryId: data.category
      }
      // 填充 明细列表
      this.list = pom
      this.loading = false // loading 状态关闭
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

