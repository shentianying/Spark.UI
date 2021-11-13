<template>
  <div class="app-container shouKuan">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('','add')">新建</el-button>
      <!-- <el-button :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button> -->
      </div>
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.types" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      excel-name="项目开工管理"
      :show-count="false"
      :size="size"
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
        <el-button v-if="row.state === 0" :size="size" type="text" @click="handleEdit(row.id,'edit')">编辑</el-button>
        <el-button v-else-if="row.state === 1 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleDetails(row)">审批</el-button>
        <el-button v-else :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import { GetProjectStartManagePaging } from '@/api/xmgl/ProjectStartManage.js'
import SearchBar from '@/components/SearchBar'
// import searchData from './searchData'
export default {
  name: 'ProjectStartManageIndex',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      approveAmount: 0, // 审定金额
      costAmount: 0, // 成本金额
      reportAmount: 0, // 上报金额

      filter: { // 过滤数据
        type: 3,
        types: [
          { label: '我发起的', value: 0 },
          { label: '待审批', value: 1 },
          { label: '已审批', value: 2 },
          { label: '列表', value: 3 }
        ]
      },

      /* 列表数据相关 */
      table: {
        // columns注释在 @/components/TableEx/index.vue
        columns: [
          {
            label: '编号', // 表头
            prop: 'number', // 渲染的属性
            class: 'link', // class
            width: '150', // 宽度
            click: (row) => {
              this.handleDetails(row)
            }
          },
          {
            label: '项目',
            prop: 'projectName',
            minWidth: '130'
          },
          {
            label: '组织机构',
            prop: 'orgName',
            minWidth: '130'
          },
          {
            label: '开工日期',
            prop: 'startDate',
            format: 'date',
            width: '100'
          },
          {
            label: '开工类型',
            prop: 'startType',
            width: '100'
          },
          {
            label: '指令单位',
            prop: 'orderUnit',
            width: '100'
          },
          {
            label: '指令人',
            prop: 'orderPeople',
            width: '100'
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          },
          {
            label: '待处理',
            prop: 'pendingPerson',
            format: (val, format, row, column) => Array.isArray(val) ? val.join('、') : val,
            width: '100'
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
  /**
   * 最后决定使用beforeRouteEnter路由守卫代替activated,和created;
   * 其好处是:无论用哪种方式进入都会触发,并且只触发一次;
   */
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
        startTypeList,
        projectStateList
      } = res
      // 搜索栏数据初始化
      const tranOptions = (ele) => {
        return { ...ele, label: ele.name }
      }
      const allItem = { name: '全部', value: '' }
      startTypeList.unshift(allItem)
      projectStateList.unshift(allItem)
      const startTypes = startTypeList.map(tranOptions)
      const projectStates = projectStateList.map(tranOptions)
      this.searchData = this.searchData.map(item => {
        item.options = item.name === 'startTypes' ? startTypes : item.options
        item.options = item.name === 'projectState' ? projectStates : item.options
        return item
      })

      // 列表数据初始化
      console.log('列表数据:', data)
      this.table.list = data
      this.table.total = count
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      // 获取请求参数
      const postData = this.getSearchData()
      postData.type = this.filter.type
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      postData.states = typeof postData.states === 'number' ? [postData.states] : []
      postData.startTypes = typeof postData.startTypes === 'number' ? [postData.startTypes] : []
      // 请求开始
      return GetProjectStartManagePaging(postData)
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
      this.$router.push({ name: 'ProjectStartManageDetails', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ProjectStartManageEdit', query: { type, id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.shouKuan {
  .action {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

}
</style>

