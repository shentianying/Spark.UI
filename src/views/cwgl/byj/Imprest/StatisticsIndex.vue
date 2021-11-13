<template>
  <div class="app-container shouKuan">
    <SearchBar ref="SearchBar" v-model="searchData" :show-toggle="false" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <TableEx
      ref="TableEx"
      excel-name="备用金统计列表"
      :size="size"
      :row-class-name="tableRowClassName"
      :total="table.total"
      :current-page.sync="table.currentPage"
      :page-size.sync="table.pageSize"
      :export-excel-loading.sync="table.exLoading"
      :columns="table.columns"
      :table-loading="table.tbLoading"
      :list="table.list"
      @rowDblclick="handleDetails"
      @fetchData="fetchData"
    >
      <template v-slot:countCont>
        符合查询条件的金额合计：{{ utils.formatMoney(amount,2,0) }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </template>
      <template #actions="{row}">
        <el-button :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import { GetImprestPaging } from '@/api/xmgl/ProjectSettle.js'
import SearchBar from '@/components/SearchBar'
import TableEx from '@/components/TableEx'
// import searchData from './searchData'
export default {
  name: 'ImprestStatisticsIndex',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      amount: '',
      size: 'mini', // 整体大小 medium / small / mini
      searchData: [
        {
          name: 'orgIds',
          value: [],
          multiple: true,
          component: 'OrgSelect',
          placeholder: '全部',
          label: '部门名称',
          isMain: true
        },
        {
          name: 'number',
          value: '',
          label: '工号',
          placeholder: '输入检索',
          component: 'Input',
          isMain: true
        },
        {
          name: 'amount',
          value: [],
          label: '金额',
          placeholder: '输入检索',
          component: 'InputRange',
          isMain: true,
          transformType: 'property-serial'
        }
      ], // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据

      /* 列表数据相关 */
      table: {
        columns: [
          {
            label: '工号', // 表头
            prop: 'number', // 渲染的属性
            minWidth: '120' // 最小宽度
          },
          {
            label: '姓名',
            prop: 'name',
            minWidth: '150'
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '200',
            click: this.handleProjectDetail,
            class: 'link'
          },
          {
            label: '金额',
            prop: 'amount',
            format: 'money',
            minWidth: '120',
            align: 'right'
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
    parseServeDate(res) {
      const {
        data,
        count,
        amount
      } = res
      this.amount = amount
      this.table.list = data
      this.table.total = count
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      // 获取请求参数
      let postData = this.getSearchData()
      postData = {
        ...postData,
        currentPage,
        pageSize
      }
      // 请求开始
      return GetImprestPaging(postData)
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
    tableRowClassName({ row, rowIndex }) {
      return (rowIndex + 1) % 2 === 0 ? 'table-bg' : ''
    },
    /**
     * @description: 路由到项目详情页
     * @param {*} row
     */
    handleProjectDetail(row) {
      this.$router.push({ name: 'OrganizationDetails', params: { id: row.organizationId }, query: { id: row.organizationId, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'PersonDetail', params: { id: row.id }, query: { id: row.id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.shouKuan {
  .action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    .checkbox-group {
      width: auto;
    }
  }
}
</style>
