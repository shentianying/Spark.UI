<template>
  <div class="app-container shouKuan">
    <!-- <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="handelSearch" :show-toggle="false" /> -->
    <p class="org-name">公司名称：{{ orgName }}</p>
    <el-table
      v-loading="table.loading"
      :size="size"
      :data="table.list"
      header-cell-class-name="table-header"
      element-loading-text="Loading"
      :row-class-name="tableRowClassName"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="票号" :show-overflow-tooltip="true" width="130">
        <template slot-scope="scope">
          {{ scope.row.ticketNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票日期" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.ticketDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期日期" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.expiration | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount,2,0) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="page">
      <el-pagination
        small
        background
        :hide-on-single-page="false"
        layout="prev, pager, next, sizes, jumper"
        :total="table.total"
        :current-page.sync="table.currentPage"
        :page-size="table.pageSize"
        @current-change="fetchData"
        @size-change="sizeChange"
      />
    </div> -->

  </div>
</template>

<script>
import { GetAcceptanceListByMonth } from '@/api/cwgl/zjgl/Acceptance.js'
// import SearchBar from '@/components/SearchBar'
import searchData from './chengDuiXinXiSearch'
export default {
  name: 'ChengDuiXinXi',
  components: {
    // SearchBar
  },
  data() {
    return {
      size: 'mini',
      searchData: searchData, // 渲染搜索栏数据
      orgName: '总计',
      /* 列表数据相关 */
      table: {
        list: [],
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: this.utils.getPersonalSettings().pageSize
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData()
    })
  },
  methods: {
    /**
     * @description: 初始化数据
     */
    initData() {
      const { orgId, orgName, capitalType, month } = this.$route.query
      this.$set(this.searchData[0], 'value', orgId)
      this.$set(this.searchData[1], 'value', capitalType)
      this.orgName = orgName
      this.fetchData({ orgId, date: month, capitalType })
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    async fetchData(params) {
      this.table.loading = true
      try {
        // 请求开始
        const response = await GetAcceptanceListByMonth(params)
        const { data } = response

        this.table.list = data
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.table.loading = false
      }
    },
    /**
     * @description: 搜索栏数据转换
     * @return {Object} request数据
     */
    getSearchData() {
      const data = {}
      this.searchData.forEach((item) => {
        if (item.name === 'dateRange') {
          data.startDate = item.value[0]
          data.endDate = item.value[1]
        } else if (item.name === 'moneySection') {
          data.startAmount = item.value[0]
          data.endAmount = item.value[1]
        } else {
          data[item.name] = item.value
        }
      })
      return data
    },
    /**
     * @description: table 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
     * @param {*} row 当前行数据
     * @param {*} rowIndex 当前行index
     * @return {*}
     */
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'row-bg-color'
      }
      return ''
    },
    /**
     * @description: 设置分页大小
     * @param {Number} val
     */
    sizeChange(val) {
      this.table.pageSize = val
      this.fetchData()
    },
    /**
     * @description: 搜索回调
     */
    handelSearch() {
      this.fetchData()
    }
  }
}
</script>
<style scoped lang="scss">
.shouKuan{
  /deep/.row-bg-color{
    background-color: #F7F7F7;
  }
  .page{
    text-align:right;
    margin:10px 0;
  }

  /deep/.table-header{
    background-color: #F7F7F7;
    font-weight: normal;
    color: #606266;;
  }
}
</style>
