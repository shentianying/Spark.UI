<template>
  <div class="app-container shouKuan">
    <!-- <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="handelSearch" :show-toggle="false" /> -->
    <!-- <h3 class="org-name">公司名称：{{ orgName }}</h3> -->
    <p>公司名称：{{ orgName }}</p>
    <el-table
      v-loading="table.loading"
      :size="size"
      :max-height="480"
      :data="table.list"
      header-cell-class-name="table-header"
      element-loading-text="Loading"
      :row-class-name="tableRowClassName"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="到期月份" :show-overflow-tooltip="true" width="130">
        <template slot-scope="scope">
          {{ scope.row.month }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期金额" min-width="10">
        <template slot-scope="scope">
          <!-- <a class="link-decoration" href="javascript:;" @click="handleDaoQi(scope.row)">{{ utils.formatMoney(scope.row.amount1,2,0) }}</a> -->
          {{ utils.formatMoney(scope.row.amount1,2,0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="自开金额" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount2,2,0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结余金额" min-width="10">
        <template slot-scope="scope">
          <a class="link-decoration" href="javascript:;" @click="handleDaoQi(scope.row)">{{ utils.formatMoney(scope.row.amount3,2,0) }}</a>

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { GetExpirStatist } from '@/api/cwgl/zjgl/Acceptance.js'
// import SearchBar from '@/components/SearchBar'
import searchData from './chengDuiDaoQiSearch'
export default {
  name: 'ChengDuiDaoQi',
  components: {
    // SearchBar
  },
  data() {
    return {
      size: 'mini',
      searchData: searchData, // 渲染搜索栏数据
      orgName: '总计', // 公司名称
      /* 列表数据相关 */
      table: {
        list: [],
        loading: false
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
      const { orgName, orgId, capitalType } = this.$route.query
      this.$set(this.searchData[0], 'value', orgId)
      this.$set(this.searchData[1], 'value', capitalType)
      this.orgName = orgName
      this.fetchData()
      // this.fetchData()
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    async fetchData() {
      this.table.loading = true
      try {
        // 获取请求参数
        const postData = this.getSearchData()
        // console.log('fetchData:请求数据', postData)
        // 请求开始
        const response = await GetExpirStatist(postData)
        const { data } = response

        // 搜索栏数据初始化
        /* capitalTypeOptions.forEach(ele => { ele.label = ele.name }) // 资金形式选项数据转换
        this.searchData = this.searchData.map((item) => {
          item.options = item.name === 'capitalTypes' ? capitalTypeOptions : []
          return item
        }) */

        // 列表数据初始化
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
        data[item.name] = item.value
      })
      return data
    },
    /**
     * @description: 路由到chengduixinxi
     * @param {Object} row
     */
    handleDaoQi(row) {
      const query = {
        ...this.getSearchData(),
        orgName: this.orgName, month: row.month, refreshRouterName: this.$route.name
      }
      this.$router.push({ path: '/cwgl/zjgl/CapitalReport/chengduixinxi', query })
    },
    /**
     * @description: 搜索
     */
    handelSearch() {
      this.fetchData()
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
    }
  }
}
</script>
<style scoped lang="scss">
.org-name {
  color: #101010;
  font-size: 16px;
  margin-bottom: 16px;
}
.shouKuan{
  .link-decoration {
    text-decoration: underline;
  }
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
