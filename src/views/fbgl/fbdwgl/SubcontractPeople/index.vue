<template>
  <div class="app-container shoukuan">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :show-toggle="false" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <el-button :size="size" type="primary" icon="el-icon-plus" @click="handleEdit('','add')">新建</el-button>
      <!-- @click="handleEdit('','add')" -->
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="分包人管理列表"
      :total="table.total"
      :show-count="false"
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
        <el-button :size="size" type="text" @click="handleEdit(row.id, 'edit')">编辑</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import SearchBar from '@/components/SearchBar'
import { GetSubcontractPeoplePaging } from '@/api/fbgl/subcontractPeople'
export default {
  name: 'SubcontractPeopleIndex',
  components: {
    TableEx,
    SearchBar
  },
  data() {
    return {
      size: 'mini',
      // labelWidth: 100,
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      table: {
        columns: [
          {
            label: '分包人姓名', // 表头
            prop: 'name', // 渲染的属性
            minWidth: '90' // 最小宽度
            // fixed: 'left'
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '130'
          },
          {
            label: '类型',
            prop: 'type',
            minWidth: '130'
          },
          {
            label: '身份证号',
            prop: 'idNumber',
            minWidth: '150'
          },
          {
            label: '地址',
            prop: 'address',
            minWidth: '150'
          },
          {
            label: '电话',
            prop: 'phone',
            minWidth: '100'
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
        typeList
      } = res
      this.$refs['SearchBar'].setData('types', 'options', typeList, 'init')
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
    handleDetails(row) {
      this.$router.push({ name: 'SubcontractPeopleDetails', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'SubcontractPeopleEdit', query: { type, id, refreshRouterName: this.$route.name }})
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
