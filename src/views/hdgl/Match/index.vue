<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <el-input v-model="search.number" size="mini" clearable maxlength="20" placeholder="单据编号" style="width:160px;" />
          <el-select v-model="search.formId" placeholder="选择单据类型" clearable filterable size="mini" style="width:120px;">
            <el-option v-for="(item,index) in formList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="search.state" size="mini" clearable placeholder="单据状态" style="width:100px;">
            <el-option label="制单中" :value="0" />
            <el-option label="审批中" :value="1" />
            <el-option label="已完成" :value="10000" />
          </el-select>
          <el-select v-model="search.grade" size="mini" clearable placeholder="重要程度" style="width:100px;">
            <el-option v-for="(item,index) in gradeList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
          <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
      <!-- <el-col :span="8" style="text-align:right;">
        <el-button type="primary" size="mini" @click="handleAdd">添加流程</el-button>
      </el-col> -->
      <el-col :span="8" style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="1">待处理</el-radio-button>
          <!-- <el-radio-button :label="4">制单</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button> -->
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="0">我发起的</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column align="center" label="单据编号" :show-overflow-tooltip="true" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.billNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据名称" min-width="10">
        <template slot-scope="scope">
          <el-link type="primary" @click="goList(scope.row)">{{ scope.row.form.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="摘要" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.summary }}
        </template>
      </el-table-column>

      <el-table-column align="right" header-align="center" label="单据金额" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批人" min-width="10">
        <template slot-scope="scope">
          <span>{{ getPerson(scope.row.billFlowNode) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="制单人" width="80">
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
      <el-table-column align="center" label="状态" width="60">
        <template slot-scope="scope">
          <el-tag size="mini" type="primary" effect="plain">
            {{ (scope.row.form.formState || []).find(f=>f.value === scope.row.state).name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" :loading="loading" @click="goDeal(scope.row)">
            <span v-if="scope.row.state === 0">制单</span>
            <span v-if="[-1,10000].includes(scope.row.state)">查看</span>
            <span v-if="scope.row.state>0&&scope.row.state<10000">{{ getStr(scope.row.billFlowNode) }}</span>
          </el-button>
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
import { getBillFlowPaging, initMyBillFlow } from '@/api/xtgl/billFlow'
import store from '@/store'
export default {
  name: 'Match',
  components: {
  },
  data() {
    return {
      list: [],
      loading: false,
      formList: null,
      gradeList: null,
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

      currentRow: null,
      buttonLoading: false,
      search: {
        number: '',
        formId: null,
        state: null,
        grade: null // 1重要 -1不重要 0普通
      },
      tabPosition: 1 // 0:我发起，1：待审批 2:已审批
    }
  },
  activated() {
    if (this.$route.params.tab) {
      this.clear()
      this.search.grade = this.$route.params.grade
      this.tabPosition = this.$route.params.tab
      this.fetchData()
    }
  },
  mounted() {
    if (!this.$route.params.tab) {
      this.fetchData()
    }
  },
  created() {
    initMyBillFlow().then(response => {
      const { formList, dicList } = response
      this.formList = formList
      this.gradeList = dicList
    }).catch(() => { })
  },
  methods: {
    fetchData() {
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.type = this.tabPosition
      postData.number = this.search.number
      postData.formId = this.search.formId
      postData.state = this.search.state
      postData.grade = this.search.grade
      this.loading = true
      getBillFlowPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    handleAdd() {
      // this.dialogTableVisible = true
    },
    goSearch() {
      this.fetchData()
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    goDeal(row) {
      const { routerName } = this.getRoute(row)
      this.$router.replace({ name: routerName, query: { id: row.billId, refreshRouterName: this.$route.name }, params: { id: row.billId, type: 1 }})
    },
    goList(row) {
      // 跳转列表页面
      const { routerName } = this.getRoute(row)
      // console.log('routerName:', routerName)
      this.$router.replace({ name: routerName, params: { type: 2 }})
    },
    getRoute(row) {
      // 获取菜单列表
      const getIsMenu = store.getters.menus
      return getIsMenu.find(f => f.id === row.form.pageId)
    },
    getPerson(bfn) {
      if (bfn) {
        var arr = bfn.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    getStr(bfn) {
      if (bfn) {
        const arr = bfn.filter(f => f.isCurrentState && !f.isChecked)
        const ps = arr.map(m => m.personId)
        if (ps.includes(this.$store.state.user.info.uid)) return '审批'
        else return '查看'
      }
    },
    radioChange(value) {
      // 清空条件
      this.clear()
      // 填充数据
      this.fetchData()
    },
    clear() { // 清空条件
      this.search.number = ''
      this.search.formId = null
      this.search.state = null
      this.search.grade = null
    }
  }

}
</script>
<style scoped>
</style>
