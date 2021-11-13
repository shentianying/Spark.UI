<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <el-input v-model="searchText" size="mini" clearable maxlength="11" placeholder="姓名或者工号" style="width:120px;" />&nbsp;&nbsp;
          <org-select2
            v-model="orgValue"
            :data-mode="0"
            size="mini"
            :collapse-tags="false"
            :show-all-levels="true"
            :multiple="false"
            :filterable="true"
            placeholder="部门"
            :check-strictly="true"
            select-style="width:180px;margin-right:10px;"
          />
          <el-select
            v-model="postId"
            placeholder="岗位"
            collapse-tags
            clearable
            filterable
            style="width:180px;margin-right:10px;"
            size="mini"
          >
            <el-option
              v-for="(item,index) in postList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

          <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'PERSON_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      size="mini"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="80">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号" min-width="100">
        <template slot-scope="scope">
          <el-link style="font-size: 12px" @click="handleDetail(scope.row)">{{ scope.row.number }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属岗位" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.post">{{ scope.row.post.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center" min-width="100">
        <template slot-scope="scope">
          <i v-if="scope.row.inUse" class="el-icon-check" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-has="'PERSON_DETAIL'" type="info" plain size="small" icon="el-icon-view" style="padding:6px;" title="查看" @click="handleDetail(scope.row)" />
            <el-button v-has="'PERSON_EDIT'" type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="handleEdit(scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align:center;margin:10px 0;">
      <el-pagination
        background
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="fetchData"
        @size-change="sizeChange"
      />
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        title="设置"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
      >
        <component :is="comName" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPersonPaging } from '@/api/rsgl/person'
import SelectRole from '@/views/xtgl/qxgl/component/selectRole'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'Users',
  components: {
    SelectRole,
    OrgSelect2
  },
  data() {
    return {
      postList: [],
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      searchText: '',
      comName: '',
      orgValue: [],
      postId: null,
      loadOrg: true
    }
  },
  mounted() {
    this.fetchData()
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
      this.loadOrg = false
      this.$nextTick(() => {
        this.loadOrg = true
      })
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.name = this.searchText
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.orgId = this.orgValue
      postData.postId = this.postId

      getPersonPaging(postData).then(response => {
        const { data, count, post } = response
        this.list = data
        this.total = count
        this.postList = post
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    goSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.$router.push({ name: 'PersonEdit', query: { id: 0, refreshRouterName: this.$route.name }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'PersonEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleDetail(row) {
      this.$router.push({ name: 'PersonDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }

}
</script>
<style scoped>
.flexDiv{
  display:flex;align-items:center;
}
</style>
