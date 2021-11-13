<template>
  <div class="app-container output">
    <SearchBar ref="SearchBar" v-model="searchData" :search="handelSearch" :size="size" />
    <div class="action">
      <el-button v-has="'PROJECTOUTPUT_ADD'" :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('','add')">新建</el-button>
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
      <div style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">我发起的</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button>
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="3">列表</el-radio-button>
        </el-radio-group>
      </div>
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
        label="编号"
        width="150"
      >
        <template slot-scope="scope">
          <a class="link-decoration" href="javascript:;" @click="handleDetails(scope.row)">{{ scope.row.number }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组织机构" width="120">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称" width="120">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目经理" width="120">
        <template slot-scope="scope">
          {{ scope.row.managerName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="月份" width="120">
        <template slot-scope="scope">
          {{ scope.row.outputYear }}-
          <span v-if="scope.row.outputMonth == 0">年度调节</span>
          <span v-else>{{ scope.row.outputMonth }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" header-align="center" label="对内产值" width="120">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.internalOutput, 2, 0) }}
        </template>
      </el-table-column>
      <el-table-column align="right" header-align="center" label="对外产值" width="120">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.externalOutput, 2, 0) }}
        </template>
      </el-table-column>
      <el-table-column align="right" header-align="center" label="应收款" width="120">
        <template slot-scope="scope">
          {{ utils.formatMoney(scope.row.receivable, 2, 0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getType(scope.row.state)" size="mini" effect="plain">{{ scope.row.stateName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="待处理" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.pendingPerson!=null">{{ scope.row.pendingPerson.join(',') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制单人" width="120">
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
          <el-button v-if="scope.row.state==0" v-has="'PROJECTOUTPUT_EDIT'" :size="size" type="text" @click="handleEdit(scope.row.id,'edit')">编辑</el-button>
          <el-button v-else-if="scope.row.state==1 && utils.IsNextPerson(scope.row.billFlow)" v-has="'PROJECTOUTPUT_ATTITUDE'" :size="size" type="text" @click="handleAttitude(scope.row)">审批</el-button>
          <el-button v-else :size="size" type="text" @click="handleDetails(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="cout">
      <i class="el-icon-warning" />符合查询条件的对内产值合计：{{ utils.formatMoney(internalOutput, 2, 0) }}&nbsp;对外产值合计：{{ utils.formatMoney(externalOutput, 2, 0) }}&nbsp;应收款合计：{{ utils.formatMoney(receivable, 2, 0) }}
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
import { getProjectOutputPaging } from '@/api/xmgl/projectOutput'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'
import { ExcelExport } from 'pikaz-excel-js'

export default {
  name: 'ProjectOutput',
  components: {
    SearchBar,
    ExcelExport
  },
  data() {
    return {
      tabPosition: 0,
      size: 'mini', // 整体大小 medium / small / mini
      searchData: searchData, // 渲染搜索栏数据
      internalOutput: 0, // 统计对内产值
      externalOutput: 0, // 统计对外产值
      receivable: 0, // 统计应收款
      stateList: [], // 单据状态

      filename: '工程产值应收款列表',
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
        postData.type = this.tabPosition
        console.log('fetchData:请求数据', postData)

        // 请求开始
        const response = await getProjectOutputPaging(postData)
        const {
          data,
          count,
          projectStateList,
          internalOutput,
          externalOutput,
          receivable
        } = response

        this.internalOutput = internalOutput
        this.externalOutput = externalOutput
        this.receivable = receivable
        // 搜索栏数据初始化
        projectStateList.forEach(ele => {
          // 项目状态选项数据转换
          ele.label = ele.name
        })

        if (count > 0) {
          data.forEach(ele => {
            if (ele.billFlow != null) {
              this.stateList = ele.billFlow.form.formState
            }
          })
          this.stateList.forEach(ele => { ele.label = ele.name }) // 数据转换
        }

        this.searchData = this.searchData.map(item => {
          item.options = item.name === 'projectState' ? projectStateList : item.options
          item.options = item.name === 'states' ? this.stateList : item.options
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
        postData.currentPage = this.table.currentPage
        postData.pageSize = this.table.total
        const { data } = await getProjectOutputPaging(postData)

        const table = data.map(item => {
          return { ...item,
            state: item.state === 0 ? '制单' : item.state === 1 ? '审批' : item.state === 10000 ? '完成' : '作废' }
        })
        this.sheet = [{
          sheetName: '工程产值应收款列表',
          keys: [
            'number',
            'orgName',
            'projectName',
            'firstPartyName',
            'outputYear',
            'outputMonth',
            'managerName',
            'internalOutput',
            'externalOutput',
            'receivable',
            'remark',
            'state',
            'createUserName',
            'createDate'
          ],
          tHeader: [
            '编号',
            '地区',
            '项目',
            '甲方名称',
            '年份',
            '月份',
            '项目经理',
            '对内产值',
            '对外产值',
            '应收',
            '备注',
            '状态',
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
      console.log(this.searchData)
      this.searchData.forEach(item => {
        const val = item.value
        if (item.name === 'yearmonth') {
          data.outputYear = val[0]
          data.outputMonth = val[1]
        } else if (item.name === 'year') {
          data.year = new Date(val).getFullYear()
        } else {
          data[item.name] = item.value
        }
      })
      return data
    },
    /**
     * @description: type栏数据转换
     * @param {Number} value
     */
    radioChange(value) {
      // 清空和切换条件
      this.searchData = searchData
      // 填充数据
      this.fetchData()
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
     * @description: 单据状态
     * @param {Object} row
     */
    getFormState(row) {
      if (!row.billFlow) { return '流程空' }
      const formState = row.billFlow.form.formState
      this.formState = formState
      const state = row.state
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    getType(state) {
      var type = 'primary'
      switch (state) {
        case 0:type = 'info'
          break
        case 1:type = 'warning'
          break
        case 1000:type = 'primary'
          break
        case 10000:type = 'success'
          break
        case -1:type = 'danger'
          break
      }
      return type
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'ProjectOutputDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleAttitude(row) {
      this.$router.push({ name: 'ProjectOutputAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ProjectOutputEdit', query: { type, id, refreshRouterName: this.$route.name }, params: { id: id, type: 3 }})
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
