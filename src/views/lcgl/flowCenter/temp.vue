<template>
  <div class="app-container">
    <h1>流程模板</h1>
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <el-input v-model="searchText" size="mini" clearable maxlength="20" placeholder="流程模板名称" style="width:120px;" />
          <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
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
      <el-table-column align="center" label="流程名称" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="编号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.flowNo }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.createDate | dateTimeFormat }}
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

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
      >
        <!-- <add-material-property :obj="currentRow" @dialogClose="dialogClose" /> -->
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getFlowPaging } from '@/api/xtgl/flow'
export default {
  name: 'MyFlow',
  components: {

  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

      currentRow: null,
      buttonLoading: false,
      searchText: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var postData = {}
      //   postData.name = this.searchText
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      getFlowPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    }
  }

}
</script>
<style scoped>
</style>
