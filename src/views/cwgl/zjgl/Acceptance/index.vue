<template>
  <div class="app-container shouKuan">
    <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="fetchData" :loading="table.tbLoading" />
    <div class="action">
      <el-button :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="资金承兑列表"
      :show-actions="false"
      :show-count="false"
      :total="table.total"
      :current-page.sync="table.currentPage"
      :page-size.sync="table.pageSize"
      :export-excel-loading.sync="table.exLoading"
      :columns="table.columns"
      :table-loading="table.tbLoading"
      :list="table.list"
      @fetchData="fetchData"
      @rowDblclick="handleDetails"
    >
      <!-- <template v-slot:actions="{row}">
        <el-button
            v-has="'EXPIRE'"
            :size="size"
            :disabled="promise(row.expiration,row.state,row)"
            type="text"
            @click="handleDetails(row,'affirm')"
          >到期确认</el-button>
      </template> -->
    </TableEx>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import { GetAcceptDetailPaging } from '@/api/cwgl/zjgl/Acceptance.js'
import SearchBar from '@/components/SearchBar'
// import searchData from './searchData'
export default {
  name: 'ChengDuiXinXiIndex',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      /* 列表数据相关 */
      table: {
        columns: [
          {
            label: '票号', // 表头
            prop: 'ticketNumber', // 渲染的属性
            class: 'link', // class
            width: '130', // 宽度
            click: (row) => this.handleDetails(row)
          },
          {
            label: '收款部门',
            prop: 'orgName',
            width: '130'
          },
          {
            label: '类型',
            prop: 'capitalType',
            width: '100'
          },
          {
            label: '开票日期',
            prop: 'ticketDate',
            format: 'date',
            width: '100'
          },
          {
            label: '到期日期',
            prop: 'expiration',
            format: 'date',
            width: '100'
          },
          {
            label: '付款人',
            prop: 'payer',
            width: '100'
          },
          {
            label: '收款银行',
            prop: 'bank',
            width: '100'
          },
          {
            label: '金额',
            align: 'right',
            prop: 'amount',
            format: 'money',
            width: '100'
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '150'
          },
          {
            label: '状态',
            prop: 'stateName',
            minWidth: '100',
            formatExport: (val) => val, // 表格导出使用的格式化方式默认使用format。
            format: (val, format, row, column) => {
              return (`
                <div class="state">
                  <div class="circle ${row.state === 1 ? 'success' : ''}" ></div>
                  ${val}
                </div>
              `)
            }
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
      vm.fetchData()
    })
  },
  methods: {
    /**
     * @description: 权限判断
     */
    promise(expiration, state, row) {
      // 本地时间>到期时间 并且 state是未支付状态
      if (new Date() > new Date(expiration) && state === 0) {
        return false
      }
      return true
    },
    parseServeDate(res) {
      const { data, count, stateOptions, capitalTypeOptions } = res
      // 搜索栏数据初始化
      stateOptions.forEach(ele => { ele.label = ele.name }) // 资金形式选项数据转换
      capitalTypeOptions.forEach(ele => { ele.label = ele.name }) // 收款类型选项数据转换
      this.searchData = this.searchData.map((item) => {
        item.options = item.name === 'states' ? stateOptions : item.options
        item.options = item.name === 'capitalTypes' ? capitalTypeOptions : item.options
        return item
      })

      // 列表数据初始化
      this.table.list = data
      this.table.total = count
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      const postData = this.getSearchData()
      console.log(postData)
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      console.log('fetchData:请求数据', postData)
      return GetAcceptDetailPaging(postData)
    },
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
    /**
     * @description:表格导出功能
     */
    async exportExcel() {
      const Excel = this.$refs['TableEx'].initExcel()
      this.getTable(1, this.table.total).then(({ data }) => {
        Excel.format([{ ...Excel.sheet[0], table: data }]).export()
      }).catch(() => {
        this.$message.error('导出失败')
        Excel.cancel()
      })
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row, type) {
      this.$router.push({ name: 'ChengDuiXinXiDetails', query: { id: row.id, type, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.shouKuan{
  /deep/.state{
    display: flex;
    justify-content: center;
    align-items: center;
    .circle.success{
      background-color: rgba(82, 196, 26, 100);
    }
    .circle{
      border-radius: 50%;
      width: 5px;
      height: 5px;
      margin-right: 5px;
      background-color: rgba(145, 145, 145, 100);
    }
  }
  .action{
    margin-bottom: 22px;
    .excel-export{
    display: inline-block;
    }
  }
}
</style>
