<template>
  <div class="app-container shouKuan">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('')">新建</el-button>
      </div>
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.typeOptions" :key="item.value" :label="item.value">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      :total="table.total"
      :current-page.sync="table.currentPage"
      :page-size.sync="table.pageSize"
      :export-excel-loading.sync="table.exLoading"
      :columns="table.columns"
      :table-loading="table.tbLoading"
      :list="table.list"
      :show-count="false"
      @rowDblclick="handleDetails"
      @fetchData="fetchData"
    >
      <template #actions="{row}">
        <el-button v-if="filter.type === '0'" :size="size" type="text" @click="handleEdit(row.id)">编辑</el-button>
        <el-button v-else-if="filter.type === '1'" :size="size" type="text" @click="handleDetails(row,1)">回复</el-button>
        <el-button v-else :size="size" type="text" @click="handleDetails(row,2)">查看</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import { getSocialResourcePaging } from '@/api/ywgl/socialResource.js'
import SearchBar from '@/components/SearchBar'
import TableEx from '@/components/TableEx'
// import searchData from './searchData'
export default {
  name: 'SocialResourceIndex',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      filter: { // 过滤数据
        type: '2', // 类型
        typeOptions: [ // 类型数组
          {
            value: '2',
            name: '列表'
          },
          {
            value: '1',
            name: '回复'
          },
          {
            value: '0',
            name: '编辑'
          }
        ]
      },
      /* 列表数据相关 */
      table: {
        columns: [
          {
            label: '姓名',
            prop: 'name',
            minWidth: '120'
          },
          {
            label: '所在单位',
            prop: 'company',
            minWidth: '200'
          },
          {
            label: '职务',
            prop: 'position',
            width: '120'
          },
          {
            label: '电话',
            prop: 'companyTel',
            width: '120'
          },
          {
            label: '状态',
            prop: 'inUse',
            width: '92',
            format: (val, format, row, column) => {
              return val ? '正常' : '禁用'
            }
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
        count
      } = res

      // 列表数据初始化
      console.log(data)
      this.table.list = data
      this.table.total = count
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    getTable(currentPage = this.table.currentPage, pageSize = this.table.pageSize) {
      // 获取请求参数
      let postData = this.getSearchData()
      postData = {
        ...postData,
        currentPage,
        pageSize,
        type: this.filter.type
      }
      // 请求开始
      return getSocialResourcePaging(postData)
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
    handleDetails(row, type) {
      this.$router.push({ name: 'SocialResourceDetails', query: { id: row.id, type: type, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'SocialResourceEdit', query: { type, id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style scoped lang="scss">
.shouKuan {
  .action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    .checkbox-group {
      width: auto;
    }
  }
}
</style>
