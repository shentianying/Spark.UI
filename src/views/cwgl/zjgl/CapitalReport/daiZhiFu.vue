<template>
  <div class="app-container shouKuan">
    <!-- <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="handelSearch" :show-toggle="false" /> -->
    <el-table
      v-loading="table.loading"
      :data="table.list"
      header-cell-class-name="table-header"
      element-loading-text="Loading"
      :row-class-name="tableRowClassName"
      fit
      :size="size"
      highlight-current-row
    >
      <el-table-column align="center" label="单据名称" :show-overflow-tooltip="true" width="130">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.paymentType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount,2,0) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="cout">
      <i class="el-icon-warning" />符合查询条件的金额合计：
    </div>
    <div class="page">
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
    </div>

  </div>
</template>
<script>
import { GetAcceptDetailCheckList } from '@/api/cwgl/zjgl/Acceptance.js'
// import SearchBar from '@/components/SearchBar'
// import searchData from './daiZhiFuSearch'
export default {
  name: 'DaiZhiFuBaoBiao',
  components: {
    // SearchBar
  },
  data() {
    return {
      // searchData: searchData, // 渲染搜索栏数据
      size: 'mini',
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
      vm.fetchData()
    })
  },
  methods: {
    /**
     * @description: 初始化数据
     */
    // initData() {
    //   if (this.$route.query.orgId) {
    //     this.$set(this.searchData[0], 'value', [this.$route.query.orgId])
    //     this.fetchData()
    //   }
    //   this.fetchData()
    // },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    async fetchData() {
      this.table.loading = true
      try {
        // 获取请求参数
        // const postData = this.getSearchData()
        const postData = {}
        postData.currentPage = this.table.currentPage
        postData.pageSize = this.table.pageSize
        // console.log('fetchData:请求数据', postData)
        // 请求开始
        const response = await GetAcceptDetailCheckList(postData)
        const { data, count } = response

        // 搜索栏数据初始化
        // capitalTypeOptions.forEach(ele => { ele.label = ele.name }) // 资金形式选项数据转换
        // this.searchData = this.searchData.map((item) => {
        //   item.options = item.name === 'capitalTypes' ? capitalTypeOptions : []
        //   return item
        // })

        // 列表数据初始化
        console.log('数据', data)
        this.table.list = data
        this.table.total = count
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
        data[item.name] = item.value
      })
      return data
    },
    /**
     * @description: table行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
     * @param {Object} row 当前行数据
     * @param {Number} rowIndex 当前行index
     * @return {*}
     */
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
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
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(row) {}
  }
}
</script>
<style scoped lang="scss">
.shouKuan{
  /deep/.row-bg-color{
    background-color: #F7F7F7;
  }
  .cout {
    color: #606266;
    font-size: 13px;
    border-radius: 2px;
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 10px;
    .el-icon-warning {
      padding: 0 5px;
      color: #1890ff;
    }
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
