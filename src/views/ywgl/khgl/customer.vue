<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <el-input v-model="searchText" size="mini" clearable maxlength="20" placeholder="客户名称" style="width:120px;" />
          <el-button type="primary" size="mini" icon="el-icon-search" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column align="center" label="编号" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户名称" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="法定代表人" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.legalPerson }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.linkMan }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.linkManTel }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="制单人" min-width="10">
        <template slot-scope="scope">
          <span :title="scope.row.message">
            {{ scope.row.createUserName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-dropdown split-button size="small" @click="handleDetail(scope.row.id)">
            <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
              <i class="el-icon-search" />
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                  <span @click="handleEdit(scope.row.id)">编辑</span>
                </el-tooltip>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-tooltip class="item" effect="dark" content="调研" placement="left">
                  <span @click="handleSurvey(scope.row.id)">调研</span>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { getCustomerPaging } from '@/api/ywgl/customer'
export default {
  name: 'Customer',
  components: {

  },
  data() {
    return {
      list: [],
      listLoading: false,

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

      currentRow: null,
      buttonLoading: false,
      searchText: ''

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
      postData.name = this.searchText
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize

      getCustomerPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    goSearch() {
      this.fetchData()
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.$router.push({ name: 'CustomerEdit', query: { refreshRouterName: this.$route.name }})
    },
    handleEdit(id) {
      this.$router.push({ name: 'CustomerEdit', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    handleDetail(id) {
      this.$router.push({ name: 'CustomerDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    handleSurvey(id) {
      this.$router.push({ name: 'CustomerSurvey', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    }
  }
}
</script>
