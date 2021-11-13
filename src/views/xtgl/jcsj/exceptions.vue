<template>
  <div class="app-container">
    <!-- <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'ACCOUNTSET_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row> -->

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
      <el-table-column align="center" label="异常信息">
        <template slot-scope="scope">
          {{ scope.row.errorInfo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="触发用户" width="150">
        <template slot-scope="scope">
          {{ scope.row.triggerUserName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-has="'ACCOUNTSET_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column> -->
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
import { getExceptionsPaging } from '@/api/xtgl/message'
export default {
  name: 'Exceptions',
  components: {
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogTableVisible: false,
      dialogTitle: '保存',

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize
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
      getExceptionsPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }
}
</script>
