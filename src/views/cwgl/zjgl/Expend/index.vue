<template>
  <div class="app-container zhiFu">
    <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="fetchData" :loading="table.tbLoading" />
    <div class="action">
      <el-button :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('','add')">新建</el-button>
      <el-button :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="资金支出列表"

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
      <template v-slot:actions="{row}">
        <el-button v-if="row.state==0" :size="size" type="text" @click="handleEdit(row.id,'edit')">编辑</el-button>
      </template>
      <template v-slot:countCont>
        符合查询条件的金额合计：{{ utils.formatMoney(amount,2,0) }}
      </template>
    </TableEx>
  </div>
</template>

<script>
// import { getBussinessInfoPaging, getBussinessInfoEditInit } from '@/api/ywgl/bussinessInfo'
import TableEx from '@/components/TableEx'
import { GetExpendPaging, GetDefaultOptions } from '@/api/cwgl/zjgl/Expend.js'
import SearchBar from '@/components/SearchBar'
// import searchData from './searchData'
// import { getPersonList } from '@/api/rsgl/person'
export default {
  name: 'ZiJinZhiChu',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      amount: 0, // 统计金额

      /* 列表数据相关 */
      table: {
        columns: [
          {
            label: '编号', // 表头
            prop: 'number', // 渲染的属性
            class: 'link', // class
            width: '130', // 宽度
            click: (row) => this.handleDetails(row)
          },
          {
            label: '部门',
            prop: 'orgName',
            width: '130'
          },
          {
            label: '摘要',
            prop: 'summary',
            width: '100'
          },
          {
            label: '支出类型',
            prop: 'expendType',
            width: '100'
          },
          {
            label: '支付方式',
            prop: 'capitalType',
            width: '100'
          },
          {
            label: '经手人',
            prop: 'personName',
            width: '100'
          },
          {
            label: '支付日期',
            format: 'date',
            prop: 'expendDate',
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
            prop: 'state',
            minWidth: '100',
            format: state => state === 0 ? '正常' : '作废'
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
      vm.fetchData()
    })
  },
  created() {
    // 获取状态列表只需要一次
    this.getStateList()
  },
  methods: {
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
     * 获取状态列表
     */
    async getStateList() {
      const { stateOptions } = await GetDefaultOptions()
      this.$refs['SearchBar'].setData('state', 'options', stateOptions, 'init')
      // this.searchData.find(v => v.name === 'state').options = stateOptions.map(v => {
      //   return {
      //     label: v.name,
      //     value: v.value
      //   }
      // })
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    parseServeDate(response) {
      const {
        data,
        count,
        amount,
        expendTypOptions,
        capitalTypeOptions
      } = response

      this.amount = amount
      // 搜索栏数据初始化
      expendTypOptions.forEach(ele => {
        ele.label = ele.name
      }) // 资金形式选项数据转换
      capitalTypeOptions.forEach(ele => {
        ele.label = ele.name
      }) // 收款类型选项数据转换
      this.searchData = this.searchData.map(item => {
        item.options = item.name === 'expendTypes' ? expendTypOptions : item.options
        item.options = item.name === 'capitalTypes' ? capitalTypeOptions : item.options
        return item
      })

      // 列表数据初始化
      this.table.list = data
      this.table.total = count
    },
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      const postData = this.getSearchData()
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      console.log('fetchData:请求数据', postData)
      // 请求开始
      return GetExpendPaging(postData)
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
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'ZiJinZhiChuDetails', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ZiJinZhiChuEdit', query: { id, type, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.zhiFu {
  .action {
    margin-bottom: 22px;
  }
}
</style>
