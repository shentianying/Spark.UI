<template>
  <div class="app-container">
    <search-form :show-toggle="true">
      <template #row1>
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
      </template>
      <template #row2>
        <el-input-number v-model="search.times" placeholder="报价轮次" controls-position="right" size="mini" :min="null" :step="1" style="width:150px;" />
        <el-input v-model="search.taskNumber" placeholder="任务单号" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-input v-model="search.categoryName" placeholder="材料名" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-date-picker
          v-model="search.deadlineRange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="报价截止开始日期"
          end-placeholder="报价截止结束日期"
          style="width:280px;"
          size="mini"
        />
      </template>
      <template #search>
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="searchData(1)">搜索</el-button>
      </template>
      <!-- <template #other>

      </template> -->
    </search-form>
    <div style="text-align:right;margin-bottom:5px;">
      <el-button :loading="listLoading" type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
        <el-radio-button :label="0">我发起的</el-radio-button>
        <el-radio-button :label="1">待审批</el-radio-button>
        <el-radio-button :label="2">已审批</el-radio-button>
        <el-radio-button :label="3">列表</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <el-form
      ref="ruleForm"
      :model="search"
      :rules="rules"
      size="mini"
      :inline="true"
    >
      <el-col style="text-align:left;">
        <el-form-item label="编号" prop="number">
          <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" />
        </el-form-item>
        <el-form-item label="项目" prop="orgIds">
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
        </el-form-item>
        <el-form-item v-if="(formState||[]).length" label="状态" prop="states">
          <el-select
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
        <el-form-item label="报价截止日期">
          <el-date-picker
            v-model="search.deadlineRange"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="报价截止开始日期"
            end-placeholder="报价截止结束日期"
            style="width:240px;"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="报价轮次">
          <el-input-number v-model="search.times" placeholder="报价轮次" controls-position="right" size="mini" :min="null" :step="1" />
        </el-form-item>
        <el-form-item label="任务单号">
          <el-input v-model="search.taskNumber" placeholder="任务单号" size="mini" clearable maxlength="20" style="width:150px;" />
        </el-form-item>
        <el-form-item label="材料名" prop="categoryName">
          <el-input v-model="search.categoryName" placeholder="材料名" size="mini" clearable maxlength="20" style="width:150px;" />
        </el-form-item>
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="fetchData">搜索</el-button>
        <el-button v-has="'QUOTATION_ADD'" :loading="listLoading" type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col style="text-align:right;margin-bottom:10px;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">我发起的</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button>
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="3">列表</el-radio-button>
        </el-radio-group>
      </el-col>
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
      <!-- <el-table-column type="index" width="55" align="center" /> -->
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
      <el-table-column label="使用部位及用途" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.useSpace }}
        </template>
      </el-table-column>
      <el-table-column label="价格执行期" align="center" min-width="25">
        <template slot-scope="scope">
          {{ scope.row.executeStartDate | dateFormat }} → {{ scope.row.executeEndDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="报价截止日期" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.deadline | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="报价轮次" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.times }}
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="待审批人" min-width="10" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ getPerson(scope.row.billFlow) }}
        </template>
      </el-table-column> -->
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
        <template slot-scope="scope">
          <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===0" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <!-- <el-tooltip content="填报" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===-1" size="mini" class="el-icon-edit-outline" plain circle @click="handleImport(scope.row)" />
          </el-tooltip> -->
          <el-tooltip content="审批" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state>0 && scope.row.state<10000" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
          </el-tooltip>
          <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===10000" size="mini" class="el-icon-view" plain circle @click="attitude(scope.row)" />
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
import { getQuotationPaging } from '@/api/cggl/quotation'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import PlanFrame from './PlanFrame'
import SearchForm from '@/components/Other/searchForm'
export default {
  name: 'Quotation',
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
      comName: 'QuotationEdit',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      planStateList: null,
      planTypeList: null,
      formState: [{
        value: 0,
        name: '制单'
      }, {
        value: 1,
        name: '已提交'
      }, {
        value: 10000,
        name: '完成'
      }],
      currentRow: null,
      search: {
        number: '',
        orgIds: [],
        states: [],
        // deadlineStartDate: null,
        // deadlineEndDate: null,
        deadlineRange: [],
        times: null,
        taskNumber: '',
        categoryName: ''
      },
      rules: {

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
      // postData.deadlineStartDate = this.search.deadlineStartDate
      // postData.deadlineEndDate = this.search.deadlineEndDate
      postData.deadlineRange = this.search.deadlineRange
      postData.times = this.search.times
      postData.taskNumber = this.search.taskNumber
      postData.categoryName = this.search.categoryName
      // postData.companyId = this.$store.state.user.selectOrgId

      getQuotationPaging(postData).then(response => {
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
      this.$router.push({ name: 'QuotationEdit', query: { refreshRouterName: this.$route.name }})
    },
    handleSupplierImport(row) {
      // console.log('this.$route.name:', this.$route.name)
      this.$router.push({ name: 'PriceListSupplier', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit' }, params: { id: row.id }})
    },
    getFormState(row) {
      // if (!row.billFlow) { return '制单' }
      // const formState = row.billFlow.form.formState
      // this.formState = formState
      // const state = row.state
      // if (state === -1) return '作废'
      // const obj = formState.find(f => f.value === state)
      // if (obj) { return obj.name } else { return '状态不详' }
      const state = row.state
      if (state === 0) {
        return '制单'
      } else if (state === 1) {
        return '已提交'
      } else if (state === 10000) {
        return '完成'
      }
    },
    radioChange(value) {
      // 清空条件
      this.search = {
        number: '',
        orgIds: [],
        states: [],
        // deadlineStartDate: null,
        // deadlineEndDate: null,
        deadlineRange: [],
        times: null,
        taskNumber: '',
        categoryName: ''
      }
      // 填充数据
      this.fetchData()
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    handleEdit(row) {
      // console.log('this.$route.name:', this.$route.name)
      this.$router.push({ name: 'QuotationEdit', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit' }, params: { id: row.id }})
    },
    handleImport(row) {
      this.$router.push({ name: 'QuotationSupplier', query: { id: row.id, refreshRouterName: this.$route.name, tab: 'edit' }, params: { id: row.id }})
    },
    attitude(row) {
      this.$router.push({ name: 'QuotationAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    }
  }
}
</script>
