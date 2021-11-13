<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.name" placeholder="岗位名称" clearable size="mini" maxlength="11" style="width:120px;" />
        <el-select
          v-if="(postSequenceList||[]).length"
          v-model="search.postSequenceIds"
          collapse-tags
          multiple
          clearable
          style="width:180px;"
          size="mini"
          placeholder="岗位序列"
        >
          <el-option v-for="(item,index) in postSequenceList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-select
          v-if="(bussinessLineList||[]).length"
          v-model="search.bussinessLineIds"
          collapse-tags
          multiple
          clearable
          style="width:150px;"
          size="mini"
          placeholder="所属条线"
        >
          <el-option v-for="(item,index) in bussinessLineList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
      </el-col>
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'POST_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="岗位名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="是否使用">
              <el-switch
                v-model="props.row.inUse"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ props.row.createUserName }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createDate }}</span>
            </el-form-item>
            <el-form-item label="修改人">
              <span>{{ props.row.lastEditUserName }}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{ props.row.lastEditDate }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="55" align="center" />
      <el-table-column align="center" label="岗位名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位序列">
        <template slot-scope="scope">
          {{ postSequenceList.find(f=>f.value === scope.row.postSequenceID).name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属条线">
        <template slot-scope="scope">
          {{ bussinessLineList.find(f=>f.value === scope.row.bussinessLineID).name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="职级范围">
        <template slot-scope="scope">
          {{ scope.row.rankRangeMin }} - {{ scope.row.rankRangeMax }}级
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
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="scope">
          <el-button plain circle size="mini" class="el-icon-edit" title="编辑" @click="handleEdit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

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
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        @close="dialogClose"
      >
        <post-add :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPostPaging } from '@/api/rsgl/post'
import PostAdd from './postAdd'
// import PostDetail from './postDetail'
export default {
  name: 'Post',
  components: {
    PostAdd
  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      postSequenceList: [],
      bussinessLineList: [],
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      search: {
        name: '',
        postSequenceIds: [],
        bussinessLineIds: []
      },
      currentRow: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.name = this.search.name
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.postSequenceIds = this.search.postSequenceIds
      postData.bussinessLineIds = this.search.bussinessLineIds
      getPostPaging(postData).then(response => {
        const { data, count, postSequenceList, bussinessLineList } = response
        this.list = data
        this.total = count
        this.postSequenceList = postSequenceList
        this.bussinessLineList = bussinessLineList
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleAdd() {
      this.currentRow = null
      this.dialogTableVisible = true
    },
    handleEdit(row) {
      this.currentRow = row
      this.dialogTableVisible = true
    },
    goSearch() {
      this.fetchData()
    }
  }
}
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
