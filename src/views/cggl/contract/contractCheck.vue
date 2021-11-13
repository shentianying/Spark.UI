<template>
  <div class="app-container">
    <!-- <div class="flex_div">
      <el-button :loading="listLoading" type="success" size="mini" @click="checkTask()">确定</el-button>
      <el-button :loading="loading" type="danger" size="mini" @click="closeThePage()">X</el-button>
    </div> -->
    <el-row v-if="obj===null" style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="1"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="true"
          filterable
          expand-trigger="hover"
          placeholder="选择部门"
          :check-strictly="true"
          select-style="min-width:110px;"
        />
        <el-button :loading="listLoading" type="primary" size="mini" @click="initData">搜索</el-button>
      </el-col>
      <!-- <el-col :span="8" style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">我发起的</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button>
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="3">列表</el-radio-button>
        </el-radio-group>
      </el-col> -->
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="contractList"
      highlight-current-row
      element-loading-text="Loading"
      border
      fit
      size="mini"
      :header-cell-style="{'text-align': 'center'}"
      @current-change="handleCurrentChange"
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
      <el-table-column label="日期" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.contractDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="供货方式" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.howSupply }}
        </template>
      </el-table-column>
      <el-table-column label="违约责任" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.breachDuty }}
        </template>
      </el-table-column>
      <el-table-column label="其他说明事项" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.explain }}
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
        @current-change="initData"
        @size-change="sizeChange"
      />
    </div>
    <div style="text-align:center; margin-top:15px;">
      <el-button size="mini" type="success" :loading="listLoading" @click="checkContract()">确定</el-button>
    </div>
  </div>
</template>
<script>
import OrgSelect2 from '@/components/OrgSelect/index2'
import { getContractPaging } from '@/api/cggl/contract'
export default {
  name: 'ContractCheck',
  components: {
    OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
      },
      contractList: [],
      search: {
        number: '',
        orgIds: [],
        states: [],
        supplierIds: [],
        categoryName: ''
      },
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      loading: false,
      listLoading: false
    }
  },
  computed: {
  },
  watch: {
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.listLoading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.number = this.search.number
      postData.orgIds = this.search.orgIds
      postData.states = this.search.states
      postData.states.push(10000) // 已确认的合同
      postData.supplierIds = this.search.supplierIds
      postData.categoryName = this.search.categoryName
      getContractPaging(postData).then(response => {
        const { data, count } = response
        this.contractList = data
        this.total = count
        this.listLoading = false
      })
    },
    checkContract() {
      var data = this.ruleForm
      if (!data.number) {
        this.$message.error('请选择合同。')
      } else {
        this.$emit('dialogClose', data, 'checkContract')
      }
    },
    handleCurrentChange(val) {
      this.loading = true
      this.ruleForm = val
      this.loading = false
    },
    sizeChange(val) {
      this.pageSize = val
      this.initData()
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
