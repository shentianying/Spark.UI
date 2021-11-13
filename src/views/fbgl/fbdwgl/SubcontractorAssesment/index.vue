<template>
  <div class="app-container shoukuan">
    <SearchBar ref="SearchBar" v-model="searchData" :label-width="labelWidth" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div />
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.types" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="星级评审列表"
      :total="table.total"
      :show-count="false"
      :current-page.sync="table.currentPage"
      :page-size.sync="table.pageSize"
      :export-excel-loading.sync="table.exLoading"
      :columns="table.columns"
      :table-loading="table.tbLoading"
      :list="table.list"
      @fetchData="fetchData"
    >
      <template v-slot:actions="{row}">
        <el-button v-if="row.state === 0" :size="size" type="text" @click="handleEdit(row,'edit')">编辑</el-button>
        <el-button v-else-if="row.state === 1 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleEdit(row, 'approval')">审批</el-button>
        <el-button v-else :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import SearchBar from '@/components/SearchBar'
import { GetSubcontractPeoplePaging } from '@/api/fbgl/subcontractorAssesment'
export default {
  name: 'SubcontractorAssesmentIndex',
  components: {
    TableEx,
    SearchBar
  },
  data() {
    return {
      size: 'mini',
      labelWidth: '85px',
      alterDisabled: false,
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      filter: {// 过滤数据
        type: 3,
        types: [
          { label: '我发起的', value: 0 },
          { label: '待审批', value: 1 },
          { label: '已审批', value: 2 },
          { label: '列表', value: 3 }
        ],
        subcontractorTypeList: [],
        rateList: []
      },
      table: {
        columns: [
          {
            label: '编号', // 表头
            prop: 'number', // 渲染的属性
            class: 'link', // class
            minWidth: '150', // 最小宽度
            click: (row) => this.handleDetails(row)
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '130'
          },
          {
            label: '分包单位名称',
            prop: 'name',
            minWidth: '200'
          },
          {
            label: '分包类型',
            prop: 'subContractorType',
            minWidth: '200'
          },
          {
            label: '法定代表人',
            prop: 'corporation',
            width: '120'
          },
          {
            label: '电话',
            prop: 'phone',
            width: '120'
          },
          {
            label: '委托代理人',
            prop: 'entrustedAgent',
            width: '120'
          },
          {
            label: '星级',
            prop: 'rate',
            width: '120',
            format: (val, format, row, column) => {
              let htmlStr = '' // 星级
              if (val !== '不合格' && val !== '合格') {
                const length = val.length
                htmlStr = `${length}星`
                val = htmlStr
              }
              return val
            }
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          },
          {
            label: '待处理',
            prop: 'pendingPerson',
            width: '150',
            format: (val) => Array.isArray(val) ? val.join('、') : val
          },
          {
            business: 'createUser' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          }
        ],
        list: [],
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
    fetchData(type) {
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
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      // 获取请求参数
      const postData = this.getSearchData()
      postData.type = this.filter.type
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      // 请求开始
      return GetSubcontractPeoplePaging(postData)
    },
    parseServeDate(res) {
      const {
        data,
        count,
        amount,
        subcontractorTypeList,
        rateList
      } = res
      this.$refs['SearchBar'].setData('subcontractorTypes', 'options', subcontractorTypeList, 'init')
      this.$refs['SearchBar'].setData('rates', 'options', rateList, 'init')
      this.$refs['SearchBar'].setData('status', 'options', data[0]?.billFlow?.form?.formState, 'init')
      this.filter.rateList = rateList
      // 列表数据初始化
      this.amount = amount
      this.table.list = data
      this.table.total = count
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
    handleDetails(row, type = 'details') {
      this.$router.push({ name: 'SubcontractorAssesmentDetails', query: { type, id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(row, type) {
      if (type === 'edit') {
        // subcontractorAssesmentId: 分包星级评审id
        this.$router.push({ name: 'SubcontractorEdit', query: { type, id: row.subcontractorId, subcontractorAssesmentId: row.id, rateList: JSON.stringify(this.filter.rateList), refreshRouterName: this.$route.name }})
      } else {
        this.$router.push({ name: 'SubcontractorAssesmentDetails', query: { type, id: row.id, refreshRouterName: this.$route.name }})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shoukuan {
  .action {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
