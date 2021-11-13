<template>
  <div class="app-container">
    <search-form :show-toggle="true">
      <template #row1>
        <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="0"
          size="mini"
          :collapse-tags="true"
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
      </template>
      <template #row2>
        <el-select
          v-model="search.buyerIds"
          size="mini"
          filterable
          remote
          reserve-keyword
          collapse-tags
          multiple
          clearable
          :remote-method="(query)=>{getRemotePerson(query)}"
          placeholder="采购员"
          :loading="loading"
          style="width:150px;"
        >
          <el-option
            v-for="(item,index) in personList"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
            <span>{{ getOrgList.find(f=>f.id===item.organizationId).name }}-{{ item.name }}</span>
          </el-option>
        </el-select>
        <el-date-picker
          v-model="search.createRange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="下达时间开始"
          end-placeholder="下达时间结束"
          style="width:240px;"
          size="mini"
        />
        <el-input v-model="search.categoryName" placeholder="材料名" size="mini" clearable maxlength="20" style="width:150px;" />
      </template>
      <template #search>
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="searchData(1)">搜索</el-button>
      </template>
      <!-- <template #other>

      </template> -->
    </search-form>
    <!-- <el-form
      ref="ruleForm"
      :model="search"
      :rules="rules"
      size="mini"
      :inline="true"
    >
      <el-form-item label="编号" prop="number">
        <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" />
      </el-form-item>
      <el-form-item label="项目" prop="orgIds">
        <org-select2
          v-model="search.orgIds"
          :data-mode="0"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="true"
          expand-trigger="hover"
          placeholder="选择项目"
          :check-strictly="false"
          select-style="min-width:100px;"
        />
      </el-form-item>
      <el-form-item label="状态" prop="states">
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
          <el-option v-for="(item,index) in formState" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="采购员" prop="buyerIds">
        <el-select
          v-model="search.buyerIds"
          size="mini"
          filterable
          remote
          reserve-keyword
          collapse-tags
          multiple
          clearable
          :remote-method="(query)=>{getRemotePerson(query)}"
          placeholder="采购员"
          :loading="loading"
          style="width:150px;"
        >
          <el-option
            v-for="(item,index) in personList"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
            <span>{{ getOrgList.find(f=>f.id===item.organizationId).name }}-{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下达日期">
        <el-date-picker
          v-model="search.createRange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:240px;"
          size="mini"
        />
      </el-form-item>
      <el-form-item label="材料名" prop="categoryName">
        <el-input v-model="search.categoryName" placeholder="请输入" size="mini" clearable maxlength="20" style="width:150px;" />
      </el-form-item>
      <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="fetchData">搜索</el-button>
    </el-form> -->

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
      :header-cell-style="{'text-align': 'center'}"
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
      <el-table-column label="采购员" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.person.name }}
        </template>
      </el-table-column>
      <el-table-column label="下达时间" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.createDate | dateTimeFormat }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="10">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state===0" size="mini" type="primary" effect="plain">待确认</el-tag>
          <el-tag v-if="scope.row.state===-1" size="mini" type="success" effect="plain">拒收</el-tag>
          <el-tag v-if="scope.row.state===10000" size="mini" type="info" effect="plain">已确认</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="10">
        <template slot-scope="scope">
          <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
            <el-button size="mini" class="el-icon-view" plain circle @click="taskDetail(scope.row)" />
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
import { getCGTaskPaging } from '@/api/cggl/task'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import PlanFrame from './PlanFrame'
import { getPersonList } from '@/api/rsgl/person'
import SearchForm from '@/components/Other/searchForm'
export default {
  name: 'Task',
  components: {
    // PlanFrame
    OrgSelect2,
    SearchForm
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      comName: 'TargetCostEdit',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      planStateList: null,
      planTypeList: null,
      currentRow: null,
      search: {
        number: '',
        orgIds: [],
        states: [],
        buyerIds: null,
        // createStartDate: null,
        // createEndDate: null,
        createRange: [],
        categoryName: ''
      },
      rules: {

      },
      formState: [],
      personList: [],
      loading: false
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
    }
  },
  mounted() {
    this.formState = [{
      value: 0,
      name: '待确认'
    }, {
      value: -1,
      name: '拒收'
    }, {
      value: 10000,
      name: '已确认'
    }]
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
      postData.number = this.search.number
      postData.orgIds = this.search.orgIds
      postData.states = this.search.states
      postData.buyerIds = this.search.buyerIds
      // postData.createStartDate = this.search.createStartDate
      // postData.createEndDate = this.search.createEndDate
      postData.createRange = this.search.createRange
      postData.categoryName = this.search.categoryName
      // postData.companyId = this.$store.state.user.selectOrgId

      getCGTaskPaging(postData).then(response => {
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
    // handleAdd(row) {
    //   this.$router.push({ name: 'TargetCostEdit', query: { refreshRouterName: this.$route.name }})
    // },
    taskDetail(row) {
      var isCheck = false
      if (row.state === 10000) { isCheck = true }
      this.$router.push({ name: 'TaskDetail', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'detail' }, params: { id: row.id, isCheck: isCheck }})
    },
    priceListEdit(row) {
      // console.log('this.$route.name:', this.$route.name)
      this.$router.push({ name: 'QuotationAdd', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit' }, params: { id: row.id }})
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    getRemotePerson(query) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          getPersonList().then(response => {
            this.personList = response.data
            this.loading = false
          })
        }, 200)
      } else {
        this.personList = []
      }
    }
  }
}
</script>
