<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="0"
          size="mini"
          :collapse-tags="false"
          :show-all-levels="false"
          :multiple="true"
          expand-trigger="hover"
          placeholder="选择项目"
          :check-strictly="false"
          select-style="min-width:100px;"
        />
        <el-select
          v-if="(formState||[]).length"
          v-model="search.states"
          collapse-tags
          multiple
          clearable
          style="width:150px;"
          size="mini"
          placeholder="状态"
        >
          <!-- <el-option :disabled="true" label="全部" :value="999" /> -->
          <el-option v-for="(item,index) in formState" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-input v-model="search.categoryName" placeholder="材料名" size="mini" clearable maxlength="20" style="width:150px;" />
        <!-- <el-button :loading="listLoading" type="primary" size="mini" @click="fetchData">搜索</el-button> -->
        <!-- <el-button circle :loading="listLoading" icon="el-icon-search" size="mini" @click="fetchData" /> -->
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="searchData(1)">搜索</el-button>
        <el-button type="primary" :loading="listLoading" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">我发起的</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button>
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="3">列表</el-radio-button>
        </el-radio-group>
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
      :header-cell-style="{'text-align': 'center'}"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="编号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="待审批人" min-width="10" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ getPerson(scope.row.billFlow.billFlowNode) }}
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" min-width="10">
        <template slot-scope="scope">
          <el-tooltip placement="top" :enterable="false" effect="light">
            <div slot="content">
              制单人：{{ scope.row.createUserName }} 制单时间：{{ scope.row.createDate }}<br>
              更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate }}
            </div>
            <span>{{ scope.row.createUserName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="10">
        <!-- <template slot-scope="scope">
          <el-tag type="primary" effect="plain">{{ getFormState(scope.row) }}</el-tag>
        </template> -->
        <template slot-scope="scope">
          <i v-if="scope.row.state===-1" class="el-icon-delete" />
          <i v-if="scope.row.state===0" class="el-icon-edit" />
          <i v-if="scope.row.state===1" class="el-icon-refresh" />
          <i v-if="scope.row.state===10000" class="el-icon-finished" />
          {{ getFormState(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===0" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip content="审查" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===1" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
          </el-tooltip>
          <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===10000" size="mini" class="el-icon-view" plain circle @click="detail(scope.row)" />
          </el-tooltip>
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

    <!-- <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        width="70%"
        :modal-append-to-body="false"
        @close="dialogClose"
      >
        <component :is="comName" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div> -->
  </div>
</template>

<script>
import { getBusinessCostPaging } from '@/api/cggl/businessCost'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import PlanFrame from './PlanFrame'
export default {
  name: 'TargetCost',
  components: {
    // PlanFrame
    OrgSelect2
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      planTypeList: null,
      formState: null,
      currentRow: null,
      search: {
        number: '',
        orgIds: [],
        states: [],
        categoryName: ''
      },
      tabPosition: 3 // 0:我发起，1：待审批 2:已审批
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
    searchData(currentPage) {
      this.currentPage = currentPage
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true

      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.type = this.tabPosition
      postData.number = this.search.number
      postData.orgIds = this.search.orgIds
      postData.states = this.search.states
      postData.categoryName = this.search.categoryName
      // postData.companyId = this.$store.state.user.selectOrgId

      getBusinessCostPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd(row) {
      this.$router.push({ name: 'BusinessCostEdit', query: { id: 0, refreshRouterName: this.$route.name }})
    },
    handleEdit(row) {
      // console.log('this.$route.name:', this.$route.name)
      this.$router.push({ name: 'BusinessCostEdit', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit' }, params: { id: row.id }})
    },
    attitude(row) {
      this.$router.push({ name: 'BusinessCostAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    detail(row) {
      this.$router.push({ name: 'BusinessCostAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    radioChange(value) {
      // 清空条件
      this.search = {
        number: '',
        orgIds: [],
        states: [],
        categoryName: ''
      }
      // 填充数据
      this.fetchData()
    },
    getFormState(row) {
      if (!row.billFlow) { return '流程空' }
      const formState = row.billFlow.form.formState
      this.formState = formState
      const state = row.state
      if (state === -1) return '作废'
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    getPerson(bfn) {
      var arr = bfn.filter(f => f.isCurrentState && !f.isChecked)
      return arr.map(m => m.person.name).join('、')
    },
    tableRowClassName({ row, rowIndex }) {
      // const state = row.state
      // if (state === 1) {
      //   return 'review-row';
      // } else if (state === 10000) {
      //   return 'success-row';
      // }
      return ''
    }
  }
}
</script>

<style>
  .el-table .review-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
