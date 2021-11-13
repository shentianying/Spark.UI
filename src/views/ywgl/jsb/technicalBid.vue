<template>
  <div class="app-container list">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" :label-width="labelWidth" />
    <div class="action">
      <div>
        <el-button v-has="'TECHNICALBID_ADD'" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd">新建</el-button>
      </div>
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.types" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="技术标评审列表"
      :total="table.total"
      :show-count="false"
      :current-page.sync="table.currentPage"
      :page-size.sync="table.pageSize"
      :export-excel-loading.sync="table.exLoading"
      :columns="table.columns"
      :table-loading="table.tbLoading"
      :list="table.list"
      @fetchData="fetchData"
      @rowDblclick="handleDetail($event.id)"
    >
      <template v-slot:actions="{row}">
        <el-button v-if="row.state === 0" v-has="'TECHNICALBID_EDIT'" :size="size" type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button v-else-if="row.state === 1 && utils.IsNextPerson(row.billFlow)" v-has="'TECHNICALBID_ATTITUDE'" :size="size" type="text" @click="attitude(row)">审批</el-button>
        <el-button v-else v-has="'TECHNICALBID_DETAIL'" :size="size" type="text" @click="handleDetail(row.id)">查看</el-button>
      </template>
    </TableEx>

  </div>
</template>

<script>
import { getTechnicalBidPaging } from '@/api/ywgl/technicalBid'
import SearchBar from '@/components/SearchBar'
import TableEx from '@/components/TableEx'
export default {
  name: 'TechnicalBid',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      labelWidth: '100px',
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据

      filter: { // 过滤数据
        type: 3,
        types: [
          { label: '我发起的', value: 0 },
          { label: '待审批', value: 1 },
          { label: '已审批', value: 2 },
          { label: '列表', value: 3 }
        ],
        tenderModeList: [],
        technicalTypeList: [],
        reliableLevelList: [],
        bussinessTypeList: []
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
              this.handleDetail(row.id)
            }
          },
          {
            label: '组织机构',
            prop: 'orgName',
            width: '120'
          },

          {
            label: '招标形式',
            prop: 'tenderMode',
            width: '100'
          },
          {
            label: '可靠级别',
            prop: 'reliableLevel',
            width: '100'
          },
          {
            label: '工程名称',
            prop: 'projectName',
            minWidth: '120'
          },
          {
            label: '业务类型',
            prop: 'bussinessType',
            width: '100'
          },
          {
            label: '技术标形式',
            prop: 'technicalType',
            width: '100'
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          },
          {
            label: '待处理',
            prop: 'pendingPerson',
            format: (val) => Array.isArray(val) ? val.join('、') : val,
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
    parseServeDate(res) {
      const {
        data,
        count,
        tenderModeList,
        reliableLevelList,
        technicalTypeList,
        bussinessTypeList
      } = res
      this.$refs['SearchBar'].setData('tenderMode', 'options', tenderModeList, 'init')
      this.$refs['SearchBar'].setData('reliableLevel', 'options', reliableLevelList, 'init')
      this.$refs['SearchBar'].setData('technicalType', 'options', technicalTypeList, 'init')
      this.$refs['SearchBar'].setData('bussinessType', 'options', bussinessTypeList, 'init')
      this.$refs['SearchBar'].setData('states', 'options', data[0]?.billFlow?.form?.formState, 'init')
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
      // 请求开始
      return getTechnicalBidPaging(postData)
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
    handleAdd() {
      this.$router.push({ name: 'TechnicalBidEdit', query: { refreshRouterName: this.$route.name }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'TechnicalBidEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id, type: 3 }})
    },
    attitude(row) {
      this.$router.push({ name: 'TechnicalBidAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleDetail(id) {
      this.$router.push({ name: 'TechnicalBidDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    }
  }
}
</script>
<style scoped lang="scss">
.list {
  .action {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

}
</style>
