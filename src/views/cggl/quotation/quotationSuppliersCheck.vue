<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
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
        <el-select v-model="search.supplierIds" size="mini" multiple collapse-tags placeholder="选择供应商" style="width:150px">
          <el-option v-for="(item,index) in suppliers" :key="index" :label="item.name" :value="item.id">
            <span>{{ item.name }}</span>
          </el-option>
        </el-select>
        <el-button :loading="listLoading" type="primary" size="mini" @click="initData">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
      @current-change="handleCurrentChange"
    >
      <!-- <el-table-column type="selection" fixed="left" align="center" width="55" /> -->
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="编号" align="center" min-width="50">
        <template slot-scope="scope">
          {{ scope.row.quotation.number }}
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.quotation.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="使用部位及用途" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.quotation.useSpace }}
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.supplier.name }}
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.supplier.contacts }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.supplier.contactsPhone }}
        </template>
      </el-table-column>
      <el-table-column label="技术标准及称量实际数据" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.standardData }}
        </template>
      </el-table-column>
      <el-table-column label="总价包含" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.amountContain }}
        </template>
      </el-table-column>
      <el-table-column label="供货信息" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.supplyData }}
        </template>
      </el-table-column>
      <el-table-column label="补充说明" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.explain }}
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="text-align:center;margin:10px 0;">
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
    </div> -->
    <!-- <div style="text-align:center; margin-top:15px;">
      <el-button size="mini" type="success" :loading="listLoading" @click="check()">确定</el-button>
    </div> -->
  </div>
</template>
<script>
import { getQuotatitonSuppliers } from '@/api/cggl/quotation'
import OrgSelect2 from '@/components/OrgSelect/index2'
import { getSupplierInfo } from '@/api/cggl/supplier'
export default {
  name: 'TaskCheck',
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
      search: {
        number: '',
        orgIds: [],
        states: [],
        supplierIds: []
      },
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      loading: false,
      list: [],
      fileList: [],
      suppliers: [],
      listLoading: false,
      multipleSelection: [],
      rules: {
        number: [{ required: true, message: '请输入', trigger: 'change' }]
      }
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
      // 供应商  name id
      getSupplierInfo().then((response) => {
        this.suppliers = response.data
      })
      this.listLoading = true
      var postData = {}
      // postData.currentPage = this.currentPage
      // postData.pageSize = this.pageSize
      postData.number = this.search.number
      postData.orgIds = this.search.orgIds
      postData.states = this.search.states
      postData.states.push(10000) // 已确认的任务单
      postData.supplierIds = this.search.supplierIds
      postData.isBuyer = true
      getQuotatitonSuppliers(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      // this.multipleSelection = selection
      this.ruleForm = val
      var data = this.ruleForm
      this.$emit('dialogClose', data, 'add')
    },
    check() {
      if (this.ruleForm.length <= 0) {
        this.$message.error('请选择')
      } else {
        var data = this.ruleForm
        this.$emit('dialogClose', data, 'add')
      }
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
