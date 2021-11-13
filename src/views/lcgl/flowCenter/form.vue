<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <el-input v-model="searchText" size="mini" clearable maxlength="20" placeholder="表单名称" style="width:120px;" />
          <el-button type="primary" size="mini" @click="fetchData()">搜索</el-button>
        </div>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button v-has="'FORM_ADD'" type="primary" size="mini" @click="handleAdd()">添加</el-button>
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
      <el-table-column align="center" label="表单名称" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="表单值" width="150px">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="字段" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.formFlowField.map(m=>{ return m.field}).join('、') }}
        </template>
      </el-table-column>
      <el-table-column label="关联页面" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.page ? scope.row.page.routerTitle:'' }}
        </template>
      </el-table-column>
      <el-table-column label="是否需要审批" align="center" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.needCheckup"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="是否使用" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.inUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-has="'FORM_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <!-- <el-dropdown split-button size="small">
            <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
              <i class="el-icon-search" />
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-tooltip class="item" effect="dark" content="编辑表单" placement="left">
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

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        width="80%"
      >
        <component :is="comName" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getFormPaging } from '@/api/xtgl/form'
import FormAdd from './formAdd'

export default {
  name: 'Form',
  components: {
    FormAdd
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
      searchText: '',

      currentRow: null,
      comName: 'FormAdd'
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.name = this.searchText

      getFormPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
      })
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.currentRow = null
      this.comName = 'FormAdd'
      this.dialogTableVisible = true
    },
    handleEdit(row) {
      this.currentRow = row
      this.dialogTitle = `编辑表单-${row.name}`
      this.comName = 'FormAdd'
      this.dialogTableVisible = true
    }
  }
}
</script>
<style>

</style>
