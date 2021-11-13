<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="searchText" placeholder="类型或类型名称" size="mini" clearable maxlength="11" style="width:140px;" />
        <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button v-has="'DICTIONARY_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>

    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
        tooltip-effect="light"
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column align="center" label="id" width="60">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="pid" width="60">
          <template slot-scope="scope">
            {{ scope.row.pId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="公司" min-width="10" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.companyName || '公用' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型名称" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.typeName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" min-width="10" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="值" width="60">
          <template slot-scope="scope">
            {{ scope.row.value }}
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="10" show-overflow-tooltip class-name="hidden-sm-and-down">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" width="60">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="使用" width="60">
          <template slot-scope="scope">
            <i v-if="scope.row.inUse" class="el-icon-check" />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
              <el-button v-has="'DICTIONARY_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="text-align:center;margin:10px 0;">
      <el-pagination
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
        title="保存"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
      >
        <component :is="comName" :post-type-list="postTypeList" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getDictionaryPaging } from '@/api/xtgl/dictionary'
// import { getTree } from '@/utils/index'
import DictionaryEdit from './dictionaryEdit'
export default {
  name: 'Dictionary',
  components: {
    DictionaryEdit
  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      postTypeList: [],
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      searchText: '',
      comName: 'DictionaryEdit'
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
      postData.type = this.searchText
      getDictionaryPaging(postData).then(response => {
        const { data1, data2, count } = response
        this.list = data1
        this.total = count
        // data2
        if (data2) {
          var newTypeList = [...new Set(data2.map(m => m.type))] // 类型 去重
          newTypeList = newTypeList.map(m => { return { type: m } })
          newTypeList.forEach(e => {
            var findData = data2.find(f => f.type === e.type && f.typeName !== '')
            if (findData) {
              e.typeName = findData.typeName
            } else {
              e.typeName = ''
            }
          })
          this.postTypeList = newTypeList
        }

        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleDelete() {
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleEdit(row) {
      this.currentRow = row
      this.dialogTableVisible = true
    },
    handleAdd() {
      this.currentRow = null
      this.dialogTableVisible = true
    },
    goSearch() {
      this.fetchData()
    }
  }
}
</script>
