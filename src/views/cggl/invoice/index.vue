<template>
  <div class="app-container">
    <search-form :show-toggle="true">
      <template #row1>
        <el-input v-model="search.invoiceNumber" placeholder="发票号码" size="mini" clearable maxlength="20" style="width:150px;margin-bottom:5px" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="1"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="true"
          expand-trigger="hover"
          placeholder="选择部门"
          :check-strictly="true"
          select-style="min-width:100px;"
        />
        <el-select
          v-if="(formState||[]).length"
          v-model="search.states"
          collapse-tags
          multiple
          clearable
          style="width:140px;"
          size="mini"
          placeholder="状态"
        >
          <el-option v-for="(item,index) in formState" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </template>
      <template #row2>
        <el-select v-model="search.supplierId" clearable filterable size="mini" placeholder="供应商">
          <el-option v-for="(item,index) in supplierList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker
          v-model="search.invoicingDateRange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始开票日期"
          end-placeholder="结束开票日期"
          style="width:240px;"
          size="mini"
        />
        <el-select
          v-model="search.invoiceType"
          collapse-tags
          clearable
          style="width:120px;"
          size="mini"
          placeholder="开票类型"
        >
          <el-option v-for="(item,index) in invoiceTypes" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </template>
      <template #search>
        <el-button :loading="listLoading" type="primary" size="mini" @click="searchData(1)">搜索</el-button>
      </template>
      <!-- <template #other>

      </template> -->
    </search-form>

    <div style="text-align:right;margin-bottom:5px;">
      <el-button v-has="'INVOICE_ADD'" :loading="listLoading" type="primary" size="mini" @click="handleAdd">+添加</el-button>
      <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
        <el-radio-button :label="0">我发起的</el-radio-button>
        <el-radio-button :label="1">待审批</el-radio-button>
        <el-radio-button :label="2">已审批</el-radio-button>
        <el-radio-button :label="3">列表</el-radio-button>
      </el-radio-group>
    </div>

    <el-table
      v-if="invoiceTypes"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      size="mini"
    >
      <!-- <el-table-column type="index" width="55" align="center" /> -->
      <el-table-column label="编号" header-align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>

      <el-table-column label="发票号码" align="center" width="140">
        <template slot-scope="scope">
          {{ scope.row.invoiceNumber }}
        </template>
      </el-table-column>

      <el-table-column label="部门" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>

      <el-table-column label="供应商" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.supplier.name }}
        </template>
      </el-table-column>

      <el-table-column label="开票日期" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.invoicingDate | dateFormat }}
        </template>
      </el-table-column>

      <el-table-column label="开票金额" header-align="center" align="right" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>

      <el-table-column label="开票类型" align="center" min-width="10">
        <template slot-scope="scope">
          {{ invoiceTypes.find(f => f.value === scope.row.type).name }}
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" min-width="10">
        <template slot-scope="scope">
          <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="待审批人" min-width="10" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ getPerson(scope.row.billFlow) }}
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

      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===0" v-has="'INVOICE_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip content="审查" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state>0" v-has="'INVOICEATTITUDE_INDEX'" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
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
  </div>
</template>

<script>
import { getInvoicePaging, initiInvoiceEdit } from '@/api/cggl/invoice'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SearchForm from '@/components/Other/searchForm'
// import { unique } from '@/utils/index'

export default {
  name: 'CGInvoice',
  components: {
    OrgSelect2,
    SearchForm
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

      formState: [],
      currentRow: null,
      orgList: null,
      supplierList: null,
      invoiceTypes: null,
      search: {
        invoiceNumber: '',
        orgIds: null,
        supplierId: null,
        projectId: null,
        invoiceType: null,
        states: [],
        invoicingDateRange: []
      },
      tabPosition: 3 // 0:我发起，1：待审批 2:已审批 3.列表
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
    }
  },
  mounted() {
    initiInvoiceEdit().then(res => {
      const { invoiceTypes, supplierList } = res
      this.invoiceTypes = invoiceTypes
      this.supplierList = supplierList
    })
    if (!this.$route.params.refresh) {
      this.fetchData()
    }
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
      postData.invoiceNumber = this.search.invoiceNumber
      postData.invoicingDate = this.search.invoicingDateRange || []
      postData.supplierId = this.search.supplierId
      postData.invoiceType = this.search.invoiceType
      if (this.search.orgIds) {
        postData.orgIds = this.search.orgIds || []
      }
      postData.states = this.search.states

      getInvoicePaging(postData).then(response => {
        const { data, count } = response
        // data.forEach(row => {
        //   this.formState = this.formState.concat(row.billFlow.form.formState)
        // })
        // this.formState = unique(this.formState)

        this.list = data
        this.total = count
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.$router.push({ name: 'CGInvoiceEdit', query: { refreshRouterName: this.$route.name }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'CGInvoiceEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    attitude(row) {
      this.$router.push({ name: 'CGInvoiceAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
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
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    radioChange(value) {
      // 清空条件
      this.search = {
        invoiceNumber: '',
        orgIds: null,
        supplierId: null,
        projectId: null,
        invoiceType: null,
        states: [],
        invoicingDateRange: []
      }
      // 填充数据
      this.fetchData()
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        if ((arr || []).length > 0) { return arr.map(m => m.person.name).join('、') } else { return '-' }
      }
      return '-'
    }
  }
}
</script>
<style scoped>
</style>
