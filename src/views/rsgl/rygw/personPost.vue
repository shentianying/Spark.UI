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
            :check-strictly="false"
            select-style="width:120px;margin-right:10px;"
          />
          <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="userList"
      border
      size="mini"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主岗位" min-width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.post">{{ scope.row.post.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="160">
        <template slot-scope="scope">
          <!-- <el-dropdown split-button size="small" @click="handleDetail(scope.row)">
            <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
              <i class="el-icon-search" />
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                  <span @click="handleEdit(scope.row)">编辑</span>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button-group>
            <el-button v-has="'PERSONPOST_DETAIL'" type="info" plain size="small" icon="el-icon-view" style="padding:6px;" title="查看" @click="handleDetail(scope.row)" />
            <el-button v-has="'PERSONPOST_EDIT'" type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="handleEdit(scope.row)" />
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

  </div>
</template>
<script>
import { getPersonPaging } from '@/api/rsgl/person'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'PersonPost',
  components: {
    OrgSelect2
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      userList: [],
      listLoading: false,
      searchText: '',
      orgValue: [],

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.name = this.searchText
      postData.orgId = this.orgValue

      getPersonPaging(postData).then(response => {
        const { data, count } = response
        this.userList = data
        this.total = count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAdd(row) {
      this.$router.push({ name: 'PersonPostEdit', query: { refreshRouterName: this.$route.name }, params: { type: 3 }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'PersonPostEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleDetail(row) {
      this.$router.push({ name: 'PersonPostDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    goSearch() {
      this.fetchData()
    }

  }
}
</script>
