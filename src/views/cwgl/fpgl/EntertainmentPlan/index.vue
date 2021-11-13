<template>
  <div class="app-container shoukuan">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button :size="size" type="primary" icon="el-icon-plus" @click="handleEdit('','add')">新建</el-button>
      </div>
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.types" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="招待费计划列表"
      :total="table.total"
      :current-page.sync="table.currentPage"
      :page-size.sync="table.pageSize"
      :export-excel-loading.sync="table.exLoading"
      :columns="table.columns"
      :table-loading="table.tbLoading"
      :list="table.list"
      @fetchData="fetchData"
    >
      <template v-slot:actions="{row}">
        <el-button v-if="row.state === 0" :size="size" type="text" @click="handleEdit(row.id,'edit')">编辑</el-button>
        <el-button v-else-if="row.state === 1 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleDetails(row,'approval')">审批</el-button>
        <!-- <el-button v-else-if="row.state === 10 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleDetails(row,'alteration')">变更</el-button>
        <el-button v-else-if="row.state === 1001 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleDetails(row,'recycle')">回收</el-button>
        <el-button v-else-if="row.state === 1000 && utils.IsNextPerson(row.billFlow) && !row.isPayout" :size="size" type="text" @click="handleDetails(row,'pay')">支付</el-button> -->
        <el-button v-else :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
      <template v-slot:countCont>
        符合查询条件的金额合计：{{ utils.formatMoney(amount,2,0) }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </template>
    </TableEx>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import SearchBar from '@/components/SearchBar'

import { GetEntertainmentPlanPaging } from '@/api/cwgl/EntertainmentPlan'

export default {
  name: 'EntertainmentPlanIndex',
  components: {
    TableEx,
    SearchBar
  },
  data() {
    return {
      size: 'mini',
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      amount: 0, // 统计金额
      filter: {// 过滤数据
        type: 3,
        types: [
          { label: '我发起的', value: 0 },
          { label: '待审批', value: 1 },
          { label: '已审批', value: 2 },
          { label: '列表', value: 3 }
        ]
      },
      table: {
        columns: [
          {
            label: '编号', // 表头
            prop: 'number', // 渲染的属性
            class: 'link', // class
            minWidth: '150', // 最小宽度
            click: (row) => this.handleDetails(row)
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '130'
          },
          {
            label: '事由',
            prop: 'summary',
            minWidth: '150'
          },
          {
            label: '日期',
            format: 'date',
            prop: 'date',
            width: '120'
          },
          {
            align: 'right',
            label: '申请金额',
            format: 'money',
            prop: 'applicationAmount',
            minWidth: '150'
          },
          {
            align: 'right',
            label: '批准金额',
            format: 'money',
            prop: 'amount',
            minWidth: '150'
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          },
          {
            label: '待处理',
            prop: 'pendingPerson',
            minWidth: '100',
            format: (val) => Array.isArray(val) ? val.join('、') : val
          },
          {
            business: 'createUser' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          }
        ],
        list: [],
        tbLoading: false, // table loading
        total: 0,
        currentPage: 1,
        pageSize: this.utils.getPersonalSettings().pageSize
      }
    }
  },
  /**
   * 最后决定使用beforeRouteEnter路由守卫代替activated,和created;
   * 其好处是:无论用哪种方式进入都会触发,并且只触发一次;
   */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData()
    })
  },
  methods: {
    fetchData(type) { // SearchBar 事件类型 重置:reset  搜索:search
      switch (type) {
        case 'filter':
          this.table.currentPage = 1
          break
        case 'reset':
        case 'search':
          this.table.currentPage = 1
          this.lastSearch = null
          break
      }
      this.table.tbLoading = true
      this.getTable()
        .then(res => this.parseServeDate(res))
        .finally(() => {
          this.table.tbLoading = false
        })
    },
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      // 获取请求参数
      const postData = this.getSearchData()
      postData.type = this.filter.type
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      // 请求开始
      return GetEntertainmentPlanPaging(postData)
    },
    parseServeDate(res) {
      const {
        data,
        count,
        amount
      } = res
      this.$refs['SearchBar'].setData('states', 'options', data[0]?.billFlow?.form?.formState, 'init')
      // if (!this.searchData[2].options || !this.searchData[2].options.length) {
      //   this.searchData[2].options = data[0]?.billFlow?.form?.formState
      // }
      // this.searchData[2].options = data[0]?.billFlow?.form?.formState
      // 列表数据初始化
      this.amount = amount
      this.table.list = data
      this.table.total = count
    },
    /**
     * @description: 搜索栏数据转换
     * @return {Object} request数据
     */
    getSearchData() {
      if (this.lastSearch === null) {
        this.lastSearch = {}
        this.searchData.forEach(item => {
          const { value, transformType, name } = item
          if (transformType === 'property-serial') {
            value.forEach((ele, index) => {
              const serial = index + 1
              this.lastSearch[name + serial] = ele
            })
          } else {
            this.lastSearch[name] = value
          }
        })
      }
      // 将查询组件里的状态, 支付, 回收选项与是否点击变更按钮关联
      this.searchData.forEach(item => {
        if (item.hasOwnProperty('disabled')) {
          item.disabled = this.alterDisabled
        }
      })
      this.lastSearch.isModify = this.alterDisabled
      return this.lastSearch
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'EntertainmentPlanEdit', query: { type, id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row, type = 'details') {
      this.$router.push({ name: 'EntertainmentPlanDetails', query: { type, id: row.id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>

<style lang="scss" scoped>
.shoukuan {
  .action {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
