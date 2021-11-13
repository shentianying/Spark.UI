<template>
  <div class="app-container shouKuan">
    <!-- <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="handelSearch" :show-toggle="false" /> -->
    <div class="action">
      <el-button :size="size" :loading="exLoading || table.loading" @click="exportExcel">导出</el-button>
      <excel-export
        ref="excelExport"
        style="display: none;"
        :size="size"
        class="excel-export"
        book-type="xlsx"
        :filename="filename"
        :sheet="sheet"
        :on-error="onError"
      >
        <el-button :size="size">导出</el-button>
      </excel-export>
    </div>
    <el-table
      v-for="(list,index) in table.list"
      :key="index"
      v-loading="table.loading"
      :max-height="480"
      :data="list"
      :show-header="index==0"
      header-cell-class-name="table-header"
      :element-loading-text="{Loading:index==0}"
      :row-class-name="index==0?tableRowClassName:'sum'"
      fit
      highlight-current-row
      :size="size"
    >
      <el-table-column prop="countRow" align="center" label="公司" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount_wy,2,0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行承兑" min-width="10">
        <template slot-scope="scope">
          <!-- <span v-if="(scope.$index+1) === table.list.length">{{ utils.formatMoney(scope.row.amount_yhcd,2,0) }}</span> -->
          <a class="link-decoration" href="javascript:;" @click="handleDetails(scope.row, 'ChengDuiDaoQi', 2)">{{ utils.formatMoney(scope.row.amount_yhcd,2,0) }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商业承兑" min-width="10">
        <template slot-scope="scope">
          <!-- <span v-if="(scope.$index+1) === table.list.length">{{ utils.formatMoney(scope.row.amount_sycd,2,0) }}</span> -->
          <a class="link-decoration" href="javascript:;" @click="handleDetails(scope.row, 'ChengDuiDaoQi', 3)">{{ utils.formatMoney(scope.row.amount_sycd,2,0) }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="抵物" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount_dw,2,0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="合计" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount_hj,2,0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="其中借款" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount_jk,2,0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="待支付" min-width="10">
        <template slot-scope="scope">
          <!-- <span v-if="(scope.$index+1) === table.list.length">{{ utils.formatMoney(scope.row.amount_dzf,2,0) }}</span> -->
          <a class="link-decoration" href="javascript:;" @click="handleDetails(scope.row, 'DaiZhiFuBaoBiao')">{{ utils.formatMoney(scope.row.amount_dzf,2,0) }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可使用" min-width="10">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount_ksy,2,0) }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { GetCapitalReport } from '@/api/cwgl/zjgl/CapitalReport.js'
// import SearchBar from '@/components/SearchBar'
// import searchData from './searchData'
import { ExcelExport } from 'pikaz-excel-js'

export default {
  name: 'YuEBiaoBiao',
  components: {
    // SearchBar,
    ExcelExport

  },
  data() {
    return {
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      size: 'mini',

      filename: '余额报表',
      exLoading: false,
      sheet: [],
      /* 列表数据相关 */
      table: {
        list: [],
        countRow: [], // 统计行
        loading: false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    async fetchData() {
      this.table.loading = true
      try {
        // 获取请求参数
        const postData = this.getSearchData()
        console.log('fetchData:请求数据', postData)
        // 请求开始
        const response = await GetCapitalReport(postData)
        const { data } = response

        // 列表数据初始化
        const countRow = data.splice(-1, 1)
        this.table.list = [data, countRow]
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.table.loading = false
      }
    },
    /**
     * @description: 设置表格名字
     */
    setFname() {
      let date = this.utils.parseTime(new Date())
      date = date.replace(' ', '_')
      date = date.replace(':', '_')
      this.filename = this.filename + date
    },
    /**
     * @description:表格导出功能
     */
    async exportExcel() {
      try {
        this.exLoading = true
        const postData = this.getSearchData()
        const { data } = await GetCapitalReport(postData)
        this.sheet = [{
          sheetName: '承兑信息列表',
          keys: [
            'orgName',
            'amount_wy',
            'amount_yhcd',
            'amount_sycd',
            'amount_dw',
            'amount_hj',
            'amount_jk',
            'amount_dzf',
            'amount_ksy'
          ],
          tHeader: [
            '公司',
            '银行',
            '银行承兑',
            '商业承兑',
            '抵物',
            '合计',
            '其中借款',
            '待支付',
            '可使用'
          ],
          table: data
        }]
        this.setFname()
        this.$refs.excelExport.pikaExportExcel()
      } catch (e) {
        console.log(e)
        this.onError('获取表格数据失败！')
      } finally {
        this.exLoading = false
      }
    },
    /**
     * @description: excel导出错误处理
     */
    onError(err) {
      this.$message.info('导出失败：' + err)
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
    setConutRow(params) {
      let countRow = []
      if (this.table.countRow.length) {
        const {
          orgName,
          amount_wy,
          amount_yhcd,
          amount_sycd,
          amount_dw,
          amount_hj,
          amount_jk,
          amount_dzf,
          amount_ksy
        } = this.table.countRow[0]
        // console.log(orgName)
        countRow = [
          orgName,
          amount_wy,
          amount_yhcd,
          amount_sycd,
          amount_dw,
          amount_hj,
          amount_jk,
          amount_dzf,
          amount_ksy
        ]
      }

      return countRow.map(v => typeof v === 'number' ? this.utils.formatMoney(v) : v)
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(lastIndex, rowIndex)
      if ((rowIndex + 1) % 2 === 0) {
        return 'table-bg'
      }
      return ''
    },
    /**
     * @description: 路由到详情
     * @param {Object} row
     * @param {String} routerName 路由的name
     * @param {Number|String} capitalType 资金类型
     */
    handleDetails(row, routerName, capitalType) {
      const { orgId, orgName } = row
      const query = { orgId, orgName, capitalType, refreshRouterName: this.$route.name }
      this.$router.push({ name: routerName, query })
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
  /deep/.sum{
    //border:1px solid #1890FF;
    color:#1890FF;
    background-color: #E6F7FF;
  }
  /deep/.table-bg{
    background-color: #F2F2F2;
  }
  .link-decoration {
    text-decoration: underline;
  }
  .action{
    margin-bottom: 22px;
    .excel-export{
    display: inline-block;
    }
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
