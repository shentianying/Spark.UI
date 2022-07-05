<template>
  <div class="app-container tablelist">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('','add')">新建</el-button>
        <el-button :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="活动列表"
      :total="table.total"
      :current-page.sync="table.currentPage"
      :page-size.sync="table.pageSize"
      :export-excel-loading.sync="table.exLoading"
      :columns="table.columns"
      :show-count="false"
      :table-loading="table.tbLoading"
      :list="table.list"
      @fetchData="fetchData"
      @rowDblclick="handleDetails"
    >
      <template v-slot:actions="{row}">
        <el-button :size="size" type="text" @click="handleEdit(row.id,'edit')">编辑</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import { getAcitivityPaging } from '@/api/hdgl/acitivity.js'
import SearchBar from '@/components/SearchBar'

export default {
  name: 'Acitivity',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据

      /* 列表数据相关 */
      table: {
        // columns注释在 @/components/TableEx/index.vue
        columns: [
          {
            label: '活动主题', // 表头
            prop: 'title', // 渲染的属性
            class: 'link', // class
            width: '150', // 宽度
            click: (row) => {
              this.handleDetails(row)
            }
          },
          {
            label: '活动类型',
            prop: 'typeName',
            width: '120'
          },
          {
            label: '开始时间',
            prop: 'startDate',
            width: '120',
            format: 'date'
          },
          {
            label: '结束时间',
            prop: 'endDate',
            width: '120',
            format: 'date'
          },
          {
            label: '活动内容',
            prop: 'content',
            width: '120'
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
        activityTypeList
      } = res
      // 列表数据初始化
      console.log('列表数据:', data)
      this.$refs['SearchBar'].setData('types', 'options', activityTypeList, 'init')
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
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      // 请求开始
      return getAcitivityPaging(postData)
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
      this.$router.push({ name: 'ActivityDetail', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ActivityEdit', query: { type, id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.tablelist {
  .action {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

}
</style>

