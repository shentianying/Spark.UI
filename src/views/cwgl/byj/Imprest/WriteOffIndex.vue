<template>
  <div class="app-container shoukuan">
    <!-- 备用金冲销列表页 -->
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <el-button :size="size" type="primary" @click="handleEdit('','add')">冲销</el-button>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="备用金冲销列表"
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
        <el-button v-if="row.state === 0 && row.createUserName === user.name" :size="size" type="text" @click="handleEdit(row.id,'edit')">编辑</el-button>
        <el-button v-else :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
      <template v-slot:countCont>
        符合查询条件的金额合计：{{ utils.formatMoney(amount, 2, 0) }}
      </template>
    </TableEx>
  </div>
</template>

<script>
import { formatMoney } from '@/utils'
import TableEx from '@/components/TableEx'
import SearchBar from '@/components/SearchBar'
import { GetImprestWriteOffPaging } from '@/api/cwgl/Impresst'
export default {
  name: 'ImpresstWriteOffIndex',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini',
      searchData: require('./WriteOffSearchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      amount: 0, // 统计金额
      filter: {// 过滤数据
        imprestTypeList: [],
        type: ''
      },
      user: {},
      /* 列表数据相关 */
      table: {
        columns: [
          {
            label: '编号', // 表头
            prop: 'number', // 渲染的属性
            class: 'link', // class
            minWidth: '180', // 最小宽度
            click: (row) => this.handleDetails(row)
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '200'
          },
          {
            label: '冲销人',
            prop: 'personName',
            minWidth: '120'
          },
          {
            label: '冲销方式',
            prop: 'type',
            width: '120'
          },
          {
            align: 'right',
            label: '冲销金额',
            prop: 'amount',
            format: (val, format, row, column) => val < 0 ? formatMoney(Math.abs(val), 2, 0) : formatMoney(val, 2, 0),
            width: '120'
          },
          {
            business: 'state', // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
            options: [
              {
                name: '作废',
                color: 'red',
                value: -1
              },
              {
                name: '制单',
                color: '#919191',
                value: 0
              },
              {
                name: '完成',
                color: '#52C41A',
                value: 10000
              }
            ]
          },
          {
            business: 'createUser' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          }
        ],
        list: [],
        exLoading: false, // 导出loading
        tbLoading: false, // table loading
        total: 0,
        currentPage: 1,
        pageSize: this.utils.getPersonalSettings().pageSize
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { user } = vm.$store.state
      vm.user = user
      vm.fetchData()
    })
  },
  methods: {
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      const postData = this.getSearchData()
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      return GetImprestWriteOffPaging(postData)
    },
    fetchData(type) {
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
      return this.lastSearch
    },
    parseServeDate(res) {
      const {
        data,
        count,
        amount,
        stateList
        // orderTypeList
      } = res
      this.$refs['SearchBar'].setData('states', 'options', stateList, 'init')
      this.amount = amount < 0 ? Math.abs(amount) : amount
      data.forEach(e => {
        e.options = stateList
      })
      // 列表数据初始化
      this.table.list = data
      this.table.total = count
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ImprestWriteOffEdit', query: { type, id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'ImprestWriteOffDetails', query: { id: row.id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>

<style scoped lang="scss">
.shoukuan {
  .action {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
