<template>
  <div class="app-container worker">
    <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="handelSearch" />
    <div class="action">
      <div>
        <!-- <el-button v-has="'DIAOBO_EDIT'" :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('')">新建</el-button> -->
        <el-button v-has="'WORKER_EXPORT'" :size="size" :loading="exLoading || table.loading" @click="exportExcel">导出</el-button>
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
      <el-radio-group v-model="filter.type" class="checkbox-group" :size="size" @change="typeChange">
        <el-radio-button v-for="item in filter.typeOptions" :key="item.value" :label="item.value">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      v-loading="table.loading"
      :size="size"
      :data="table.list"
      header-cell-class-name="table-header"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @row-dblclick="handleDetails"
    >
      <el-table-column align="center" label="年度" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.year }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="工号"
        :show-overflow-tooltip="true"
        width="130"
      >
        <template slot-scope="scope">
          <!-- {{ scope.row.number }} -->
          <a class="link-decoration" href="javascript:;" @click="handleDetails(scope.row)">{{ scope.row.number }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.idNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工种" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.workerTypeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工长" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.gongzhangName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工龄" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.workingAge }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="20">
        <template slot-scope="scope">
          <el-popover trigger="hover" :content="scope.row.remark" placement="top">
            <span slot="reference" class="ellipsis-2">{{ scope.row.remark }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制单人" min-width="10">
        <template slot-scope="scope">
          <!-- {{ scope.row.createUserName }} -->
          <el-popover trigger="hover" placement="top">
            <p>制单人: {{ scope.row.createUserName }}&nbsp;&nbsp;&nbsp;制单时间: {{ scope.row.createDate }}</p>
            <p>更新人: {{ scope.row.lastEditUserName }}&nbsp;&nbsp;&nbsp;更新时间: {{ scope.row.lastEditDate }}</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.createUserName }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template v-slot="{ row }">
          <el-button v-has="'WORKER_EDIT'" :size="size" type="text" @click="handleEdit(row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="cout">
      <i class="el-icon-warning" />符合查询条件的金额合计：{{ utils.formatMoney(amount,2,0) }}
    </div> -->
    <div class="page">
      <el-pagination

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
import { getWorkerPaging, getDefaultOptions } from '@/api/ggzx/worker'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'
import { ExcelExport } from 'pikaz-excel-js'
export default {
  name: 'Worker',
  components: {
    SearchBar,
    ExcelExport
  },
  data() {
    return {
      size: 'mini',
      searchData: searchData, // 渲染搜索栏数据

      filename: '工人列表',
      exLoading: false, // 导出
      sheet: [],
      filter: { // 过滤数据
        type: '6', // 类型
        typeOptions: [ // 类型数组
          {
            value: '6',
            name: '列表'
          },
          {
            value: '5',
            name: '有保险'
          },
          {
            value: '4',
            name: '无保险'
          },
          {
            value: '3',
            name: '已退场'
          },
          {
            value: '1',
            name: '暂退'
          },
          {
            value: '2',
            name: '已报到'
          },
          {
            value: '0',
            name: '未报到'
          }
        ]
      },
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
     * 类型重新选择的事件
     */
    typeChange() {
      this.fetchData()
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
        const { currentPage, pageSize } = this.table
        // 请求开始
        const response = await getWorkerPaging({
          ...postData,
          currentPage,
          pageSize,
          type: this.filter.type
        })
        const { data, count, yearOptions } = response
        // 初始化数据获取
        const default_options = await getDefaultOptions()
        const { workOptions, workerOptions, bankOptions } = default_options
        workOptions.forEach(ele => {
          // 资金形式选项数据转换
          ele.label = ele.name
        })
        workerOptions.forEach(ele => {
          // 资金形式选项数据转换
          ele.label = ele.name
        })
        bankOptions.forEach(ele => {
          // 资金形式选项数据转换
          ele.label = ele.name
        })

        // 搜索栏数据初始化
        this.searchData = this.searchData.map(item => {
          item.options =
            item.name === 'year' ? yearOptions : item.options
          item.options =
            item.name === 'workTypes' ? workOptions : item.options
          item.options =
            item.name === 'bank' ? bankOptions : item.options
          item.options =
            item.name === 'workerType' ? workerOptions : item.options
          return item
        })

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
        postData.currentPage = 1
        postData.pageSize = this.table.total
        const { data } = await getWorkerPaging(postData)
        const table = data.map(item => {
          return {
            ...item
          }
        })
        this.sheet = [{
          sheetName: '工人列表',
          keys: [
            'year',
            'orgName',
            'number',
            'name',
            'idNumber',
            'age',
            'workerTypeName',
            'gongzhangName',
            'workingAge',
            'remark',
            'createUserName'
          ],
          tHeader: [
            '年度',
            '项目',
            '工号',
            '姓名',
            '身份证号',
            '年龄',
            '工种',
            '工长',
            '工龄',
            '备注',
            '制单人'
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
        // if (item.name === 'year') {
        //   data['year'] = new Date(item.value).getFullYear()
        // } else {
        //   data[item.name] = item.value
        // }
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
    handelSearch() {
      this.table.currentPage = 1 // 返回第一页
      this.fetchData()
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'WorkerDetails', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} id
     */
    handleEdit(id) {
      this.$router.push({ name: 'WorkerEdit', query: { id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.worker {
  .link-decoration {
    text-decoration: underline;
  }
  .state{
    display: flex;
    justify-content: center;
    align-items: center;

    .circle.primary{
      background-color: #1890FF;
    }
    .circle.success{
      background-color: #52C41A;
    }
    .circle.error{
      background-color: #F5222D;
    }
    .circle.wran{
      background-color: #FA8C16;
    }
    .circle{
      border-radius: 50%;
      width: 5px;
      height: 5px;
      margin-right: 5px;
      background-color: rgba(145, 145, 145, 100);
    }
  }
  .action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    .excel-export{
      margin-left:10px;
      display: inline-block;
    }
    .checkbox-group {
      width: auto;
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
