<template>
  <div class="app-container">
    <search-form :show-toggle="false">
      <template #row1>
        <el-input v-model="searchText" size="mini" clearable maxlength="20" placeholder="名称" style="width:120px;" />
      </template>
      <!-- <template #row2>
      </template> -->
      <template #search>
        <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
      </template>
      <template #other>
        <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
      </template>
    </search-form>
    <!-- <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <el-input v-model="searchText" size="mini" clearable maxlength="20" placeholder="名称" style="width:120px;" />
          <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
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
      <el-table-column align="center" label="编号" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          <el-link :underline="false" style="font-size: 12px;" @click="handleDetail(scope.row.id)">{{ scope.row.number }}</el-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="主营" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.mainBusiness }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司电话" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.companyPhone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.contacts }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.contactsPhone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="星级" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.rate }}
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
        <!-- <template slot-scope="scope">
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
        </template> -->
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleDel(scope.row.id)">删除</el-button>
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
import { getSupplierPaging } from '@/api/cggl/supplier'
import { formatTime } from '@/utils/index'
import SearchForm from '@/components/Other/searchForm'
export default {
  name: 'Supplier',
  components: {
    SearchForm
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

      // organizationId: this.$store.state.user.selectOrgId
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
    }
  },
  mounted() {
    // console.log('index 页面：router:', this.$route)
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.getPorperty()
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    goSearch() {
      this.getPorperty()
    },
    getPorperty() {
      this.listLoading = true
      var postData = {}
      postData.name = this.searchText
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      // postData.orgId = this.orgValue
      getSupplierPaging(postData).then(response => {
        const { data, count } = response
        // 星级数字更改显示：-1——不合格 0——合格等等
        data.forEach(element => {
          if (element.rate === -1) {
            element.rate = '不合格'
          }
          if (element.rate === 0) {
            element.rate = '合格'
          }
          if (element.rate === 1) {
            element.rate = '⭐'
          }
          if (element.rate === 2) {
            element.rate = '⭐⭐'
          }
          if (element.rate === 3) {
            element.rate = '⭐⭐⭐'
          }
          if (element.rate === 4) {
            element.rate = '⭐⭐⭐⭐'
          }
          if (element.rate === 5) {
            element.rate = '⭐⭐⭐⭐⭐'
          }
          element.message = '制单人：' + element.createUserName + '  制单时间：' + formatTime(new Date(element.createDate), '{y}-{m}-{d} {h}:{i}:{s}') + '\n' + '更新人：' + element.lastEditUserName + '更新时间：' + formatTime(new Date(element.lastEditDate), '{y}-{m}-{d} {h}:{i}:{s}')
        })
        this.list = data
        this.total = count
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.getPorperty()
    },
    handleAdd() {
      this.$store.dispatch('tagsView/delView', { name: 'SupplierAdd' })
        .then(() => {
          this.$router.push({ name: 'SupplierAdd', query: { refreshRouterName: this.$route.name }})
        })
    },
    handleEdit(id) {
      this.$router.push({ name: 'SupplierAdd', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    handleDetail(id) {
      this.$router.push({ name: 'SupplierDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    handleApproval(id, type) {
      this.$router.push({ name: 'SupplierAttitude', query: { id: id, type: type, refreshRouterName: this.$route.name }, params: { id: id }})
    }
    // ,
    // handleDel(id) {
    //   this.$confirm('是否确定删除?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     deleteMaterialProperty({ id: id }).then(response => {
    //       this.getPorperty()
    //       this.$message.success(response.message)
    //     })
    //   }).catch(() => {
    //     this.$message.info('已经取消删除')
    //   })
    // }
  }
}
</script>
