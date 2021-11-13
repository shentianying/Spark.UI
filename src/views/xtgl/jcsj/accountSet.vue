<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'ACCOUNTSET_ADD'" type="primary" size="mini" @click="handleAdd">添加</el-button>
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
            <el-form-item label="名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="全名">
              <span>{{ props.row.fullName }}</span>
            </el-form-item>
            <el-form-item label="缩写">
              <span>{{ props.row.shortName }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ props.row.phoneNumber }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="税号">
              <span>{{ props.row.taxNumber }}</span>
            </el-form-item>
            <el-form-item label="开户行">
              <span>{{ props.row.bank }}</span>
            </el-form-item>
            <el-form-item label="账号">
              <span>{{ props.row.accountNumber }}</span>
            </el-form-item>
            <el-form-item label="备注">
              {{ props.row.remark }}
            </el-form-item>
            <el-form-item label="是否使用">
              <el-switch
                v-model="props.row.inUse"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="55" align="center" />
      <el-table-column align="center" label="名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="全名" width="160">
        <template slot-scope="scope">
          {{ scope.row.fullName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="缩写" width="80">
        <template slot-scope="scope">
          {{ scope.row.shortName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话" width="100">
        <template slot-scope="scope">
          {{ scope.row.phoneNumber }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
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
            <el-button v-has="'ACCOUNTSET_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        @close="dialogClose"
      >
        <accountSet-add :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAccountSet } from '@/api/xtgl/accountSet'
import AccountSetAdd from './accountSetAdd'
export default {
  name: 'AccountSet',
  components: {
    AccountSetAdd
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogTableVisible: false,
      dialogTitle: '保存',

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

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
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.isMenu = true

      getAccountSet(postData).then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.currentRow = null
      this.dialogTableVisible = true
    },
    handleEdit(row) {
      this.currentRow = row
      this.dialogTableVisible = true
    }
    // handleDelete() {
    //   if (!this.currentRow) {
    //     this.$message.warning('请选中行')
    //     return false
    //   }
    //   this.$confirm('是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     deleteAccountSet({ id: this.currentRow.id }).then(response => {
    //       this.fetchData()
    //       this.$message.success('删除成功')
    //     })
    //   }).catch(() => {
    //     this.$message.success('已经取消删除')
    //   })
    // },
    // handleCurrentChange(val) {
    //   this.currentRow = val
    // }
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
