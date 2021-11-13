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
        <el-input v-model="search.supplierName" placeholder="供应商名称" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-select v-model="search.type" multiple style="width:150px" size="mini" placeholder="评审类型">
          <el-option label="入库评审" value="1">入库评审</el-option>
          <el-option label="星级评审" value="2">星级评审</el-option>
        </el-select>
      </template>
      <template #search>
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="searchData(1)">搜索</el-button>
      </template>
      <!-- <template #other>

      </template> -->
    </search-form>
    <div style="text-align:right;margin-bottom:5px;">
      <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
        <el-radio-button :label="0">我发起的</el-radio-button>
        <el-radio-button :label="1">待审批</el-radio-button>
        <el-radio-button :label="2">已审批</el-radio-button>
        <el-radio-button :label="3">列表</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <!-- <el-table-column type="index" width="55" align="center" /> -->
      <el-table-column label="编号" header-align="center" width="130">
        <template slot-scope="scope">
          <!-- <el-link :underline="false" style="font-size: 12px;" @click="attitude(scope.row)">{{ scope.row.number }}</el-link> -->
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="所属项目" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.supplier.name }}
        </template>
      </el-table-column>
      <el-table-column label="评审类型" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column label="评级" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.rate }}
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
            <el-button v-if="scope.row.state===0" v-has="'SUPPLIERASSESMENT_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
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
import { getSupAssesmentPaging } from '@/api/cggl/supplierAssesment'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SearchForm from '@/components/Other/searchForm'
export default {
  name: 'SupplierAssesment',
  components: {
    OrgSelect2,
    SearchForm
  },
  data() {
    return {
      list: [{
        number: '',
        organization: {},
        supplier: {},
        typeName: '',
        rate: '',
        remark: '',
        billFlow: {
          form: {
            formState: []
          },
          billFlowNode: []
        },
        createUserName: '',
        createDate: null,
        lastEditUserName: '',
        lastEditDate: null
      }],
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      formState: null,
      currentRow: null,
      search: {
        number: '',
        orgIds: [],
        states: [],
        supplierName: '',
        attitudeTypes: [],
        type: []
      },
      tabPosition: 3 // 0:我发起，1：待审批 2:已审批,3：列表
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
      postData.supplierName = this.search.supplierName
      postData.attitudeTypes = this.search.attitudeTypes

      getSupAssesmentPaging(postData).then(response => {
        const { data, count } = response
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
          if (element.tyep === 1) {
            element.typeName = '入库评审'
          }
          if (element.type === 2) {
            element.typeName = '星级评审'
          }
        })
        this.list = data
        this.total = count
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleEdit(row) {
      this.$router.push({ name: 'SupplierAssesmentEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.supplierId, type: row.type }})
    },
    attitude(row) {
      this.$router.push({ name: 'SupplierAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
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
        supplierName: '',
        attitudeTypes: [],
        type: []
      }
      // 填充数据
      this.fetchData()
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    }
  }
}
</script>
