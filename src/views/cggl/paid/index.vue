<template>
  <div class="app-container">
    <search-form :show-toggle="true">
      <template #row1>
        <el-input v-model="search.number" placeholder="采购付款编号" size="mini" clearable maxlength="20" style="width:150px;" />
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
        <el-input v-model="search.contractNumber" placeholder="合同编号" size="mini" clearable maxlength="20" style="width:150px;" />
      </template>
      <!-- <template #row2>
        <el-input v-model="search.contractNumber" placeholder="合同编号" size="mini" clearable maxlength="20" style="width:150px;" />
      </template> -->
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
        <el-form-item label="采购付款编号" prop="number">
          <el-input v-model="search.number" placeholder="采购付款编号" size="mini" clearable maxlength="20" style="width:150px;" />
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
        <el-form-item label="合同编号" prop="contractNumber">
          <el-input v-model="search.contractNumber" placeholder="合同编号" size="mini" clearable maxlength="20" style="width:150px;" />
        </el-form-item>
        <el-form-item label="申请金额" prop="applyAmount">
          <el-input-number v-model="search.applyAmount" placeholder="申请金额" size="mini" :step="0.0001" :min="null" style="width:150px;" />
        </el-form-item>
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="fetchData">搜索</el-button>
      </el-col>
      <el-col style="text-align:right;">
        <el-button :loading="listLoading" type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
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
      border
      highlight-current-row
      size="mini"
    >
      <!-- <el-table-column type="index" width="55" align="center" /> -->
      <el-table-column label="采购付款编号" header-align="center" width="130">
        <template slot-scope="scope">
          <el-link :underline="false" size="mini" style="font-size: 12px;" @click="paidDetail(scope.row)">{{ scope.row.number }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="合同号" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.contract.number }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.contract.supplier.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="应付金额" header-align="center" align="right" width="130">
        <template slot-scope="scope">
          ￥{{ Number(scope.row.dues).toFixed(4) }}
        </template>
      </el-table-column>
      <el-table-column label="已付金额" header-align="center" align="right" width="130">
        <template slot-scope="scope">
          ￥{{ Number(scope.row.paid).toFixed(4) }}
        </template>
      </el-table-column>
      <el-table-column label="发票金额" header-align="center" align="right" width="130">
        <template slot-scope="scope">
          ￥{{ Number(scope.row.invoice).toFixed(4) }}
        </template>
      </el-table-column> -->
      <el-table-column label="申请金额" header-align="center" align="right" width="130">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.applyAmount,2,0) }}
        </template>
      </el-table-column>
      <el-table-column label="审批金额" header-align="center" align="right" width="130">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.attitudeAmount,2,0) }}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" header-align="center" align="right" width="130">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount,2,0) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="日期" header-align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.contractDate | dateFormat }}
        </template>
      </el-table-column> -->
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
            <el-button v-if="scope.row.state===0" v-has="'CONTRACT_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip content="审批" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state>0" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
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
import { getCGPaidPaging } from '@/api/cggl/paid'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import { getOrganizationList } from '@/api/xtgl/organization'
import SearchForm from '@/components/Other/searchForm'
export default {
  name: 'Paid',
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
      formState: null,
      currentRow: null,
      orgList: null,
      search: {
        number: '',
        orgIds: [],
        states: [],
        contractNumber: '',
        applyAmount: null
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
      postData.contractNumber = this.search.contractNumber
      postData.applyAmount = this.search.applyAmount
      // postData.companyId = this.$store.state.user.selectOrgId

      getCGPaidPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        // this.formState = data.billFlow.form.formState
        this.listLoading = false
      })

      // getOrganizationList().then(response => {
      //   const { data } = response
      //   const pOrgs = data.filter(f => f.isProject)
      //   console.log('pOrgs:', pOrgs)
      //   this.orgList = pOrgs
      // })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd(row) {
      this.$router.push({ name: 'PaidEdit', query: { refreshRouterName: this.$route.name }, params: { type: 3 }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'PaidEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    attitude(row) {
      this.$router.push({ name: 'PaidAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
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
        number: '',
        orgIds: [],
        states: [],
        contractNumber: '',
        applyAmount: null
      }
      // 填充数据
      this.fetchData()
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    paidDetail(row) {
      this.$router.push({ name: 'PaidDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    }
  }
}
</script>
