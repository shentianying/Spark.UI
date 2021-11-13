<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="searchText" placeholder="名称" clearable size="mini" maxlength="11" style="width:120px;" />
        <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
      </el-col>
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'POSTPOOL_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
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

      <el-table-column type="index" width="55" align="center" />
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="orgName" align="center" label="适用范围">
        <template slot-scope="scope">
          <span v-if="scope.row.category === 1">
            {{ scope.row.orgName }}
          </span>
          <span v-else>
            {{ categoryList.find(f=>f.value === scope.row.category).name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别">
        <template slot-scope="scope">
          {{ categoryList.find(f=>f.value === scope.row.category).name }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-has="'POSTPOOL_DETAIL'" type="info" plain size="small" icon="el-icon-view" style="padding:6px;" title="查看" @click="handleDetail(scope.row)" />
            <el-button v-has="'POSTPOOL_EDIT'" type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="handleEdit(scope.row)" />
          </el-button-group>
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
import { getPostPoolPaging } from '@/api/rsgl/postPool'

export default {
  name: 'PostPool',
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
      searchText: '',
      categoryList: []
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

      getPostPoolPaging(postData).then(response => {
        const { data, count, categoryList } = response
        this.list = data
        this.total = count
        this.categoryList = categoryList
        this.listLoading = false
        // console.log(data)
      })
    },
    handleAdd(row) {
      this.$router.push({ name: 'PostPoolEdit', query: { refreshRouterName: this.$route.name }, params: { type: 3 }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'PostPoolEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleDetail(row) {
      this.$router.push({ name: 'PostPoolDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
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
