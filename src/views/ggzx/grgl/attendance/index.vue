<template>
  <div class="app-container Attendance">
    <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="fetchData" :loading="table.tbLoading" />
    <div class="action">
      <el-button :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新建</el-button>
      <el-button :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="工人考勤列表"
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
        <!-- 符合查询条件的金额合计：{{ utils.formatMoney(amount,2,0) }} -->
        符合查询条件的金额合计：{{ attendanceDaysAmount }}天，{{ utils.formatMoney(salaryAmount,2,0) }}元，人均日工资{{ utils.formatMoney(salaryAvg,2,0) }}元
      </template>
    </TableEx>
  </div>
</template>

<script>
import { getListPaging, getDefaultOptions } from '@/api/ggzx/attendance'
import SearchBar from '@/components/SearchBar'
import TableEx from '@/components/TableEx'
export default {
  name: 'WorkerAttendance',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      attendanceDaysAmount: 0, // 统计出勤
      salaryAmount: 0, // 统计工资
      salaryAvg: 0, // 人均日工资

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
            label: '项目',
            prop: 'orgName',
            width: '130'
          },
          {
            label: '年份',
            prop: 'year',
            width: '100'
          },
          {
            label: '月份',
            prop: 'month',
            width: '100'
          },
          {
            label: '出勤总计',
            prop: 'attendanceDay',
            width: '100'
          },
          {
            label: '工资总计',
            prop: 'salary',
            width: '100'
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '150'
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
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
    this.getDefaultOptions()
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
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      // 获取请求参数
      const postData = this.getSearchData()
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      console.log('fetchData:请求数据', postData)
      return getListPaging(postData)
    },
    /**
     * 获取初始下拉状态
     */
    async getDefaultOptions() {
      const { yearOptions, monthOptions } = await getDefaultOptions()
      this.$refs['SearchBar'].setData('year', 'options', yearOptions, 'init')
      this.$refs['SearchBar'].setData('month', 'options', monthOptions, 'init')
      // this.searchData.find(v => v.name === 'state').options = stateOptions.map(v => {
      //   return {
      //     label: v.name,
      //     value: v.value
      //   }
      // })
    },
    parseServeDate(response) {
      const {
        data,
        count,
        attendanceDaysAmount,
        salaryAmount,
        salaryAvg
      } = response
      this.attendanceDaysAmount = attendanceDaysAmount
      this.salaryAmount = salaryAmount
      this.salaryAvg = salaryAvg

      this.$refs['SearchBar'].setData('states', 'options', data[0]?.billFlow?.form?.formState, 'init')

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
      return this.lastSearch
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'AttendanceDetail', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'WorkerAttendanceEdit', query: { type, id, refreshRouterName: this.$route.name }})
    },
    handleAdd() {
      this.$router.push({ name: 'WorkerAttendanceAdd', query: { refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.Attendance {
  .action {
    margin-bottom: 22px;
  }

}
</style>
