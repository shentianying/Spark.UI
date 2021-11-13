<template>
  <div class="app-container output">
    <SearchBar ref="SearchBar" v-model="searchData" :search="handelSearch" :size="size" />
    <div class="action">
      <el-button v-has="'PROJECTINVOICE_ADD'" :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('','add')">新建</el-button>
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
      v-loading="table.loading"
      :size="size"
      :data="table.list"
      border
      header-cell-class-name="table-header"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @row-dblclick="handleDetails"
    >
      <el-table-column
        align="center"
        label="票号"
        width="130"
      >
        <template slot-scope="scope">
          <a class="link-decoration" href="javascript:;" @click="handleDetails(scope.row)">{{ scope.row.number }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组织机构" min-width="30">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称" min-width="30">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column align="right" header-align="center" label="发票金额" min-width="15">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.amount, 2, 0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票日期" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.date | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="制单人" min-width="10">
        <template slot-scope="scope">
          <el-tooltip placement="top" :enterable="false" effect="light">
            <div slot="content">
              制单人：{{ scope.row.createUserName }} 制单时间：{{ scope.row.createDate }}<br>
              更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate }}
            </div>
            <span>{{ scope.row.createUserName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-has="'PROJECTINVOICE_EDIT'" :size="size" type="text" @click="handleEdit(scope.row.id,'edit')">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="cout">
      <i class="el-icon-warning" />符合查询条件的发票金额为：{{ utils.formatMoney(amount, 2, 0) }}
    </div>

    <div class="page">
      <el-pagination
        background
        :hide-on-single-page="false"
        layout="total, prev, pager, next, sizes, jumper"
        :total="table.total"
        :current-page.sync="table.currentPage"
        :page-size="table.pageSize"
        @current-change="handelSearch"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import { getProjectInvoicePaging } from '@/api/xmgl/projectInvoice'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'
import { ExcelExport } from 'pikaz-excel-js'

export default {
  name: 'ProjectInvoice',
  components: {
    SearchBar,
    ExcelExport
  },
  data() {
    return {
      tabPosition: 0,
      size: 'mini', // 整体大小 medium / small / mini
      searchData: searchData, // 渲染搜索栏数据
      amount: 0, // 统计发票金额

      filename: '工程款发票列表',
      exLoading: false,
      sheet: [],

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
  activated() {
    console.info('actived')
    this.fetchData()
  },
  created() {
    console.info('created')
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
        postData.currentPage = this.table.currentPage
        postData.pageSize = this.table.pageSize
        console.log('fetchData:请求数据', postData)

        // 请求开始
        const response = await getProjectInvoicePaging(postData)
        const {
          data,
          count,
          amount
        } = response

        this.amount = amount
        // 搜索栏数据初始化

        // 列表数据初始化
        this.table.list = data
        this.table.total = count
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
        postData.currentPage = this.table.currentPage
        postData.pageSize = this.table.total
        const { data } = await getProjectInvoicePaging(postData)

        const table = data
        this.sheet = [{
          sheetName: '工程款发票列表',
          keys: [
            'orgName',
            'projectName',
            'number',
            'amount',
            'date',
            'remark',
            'createUserName',
            'createDate'
          ],
          tHeader: [
            '组织机构',
            '项目',
            '票号',
            '金额',
            '开票日期',
            '备注',
            '制单人',
            '制单日期'
          ],
          table
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
      this.searchData.forEach(item => {
        data[item.name] = item.value
      })
      return data
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
    async handelSearch() {
      await this.fetchData()
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'ProjectInvoiceDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ProjectInvoiceEdit', query: { type, id, refreshRouterName: this.$route.name }, params: { id: id, type: 3 }})
    }
  }
}
</script>
<style scoped lang="scss">
.output {
  .excel-export{
    margin-left:10px;
    display: inline-block;
  }
  .link-decoration {
    text-decoration: underline;
  }
  .action {
    margin-bottom: 22px;
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
  .page {
    text-align: right;
    margin: 10px 0;
  }

  /deep/.table-header {
    background-color: #f7f7f7;
    font-weight: normal;
    color: #606266;
  }
}
</style>
