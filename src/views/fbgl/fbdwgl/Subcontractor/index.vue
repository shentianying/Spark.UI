<template>
  <div class="app-container shoukuan">
    <SearchBar ref="SearchBar" v-model="searchData" :label-width="labelWidth" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <el-button :size="size" type="primary" icon="el-icon-plus" @click="handleEdit('','add')">新建</el-button>
    </div>

    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="分包单位入库列表"
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
        <el-button :size="size" type="text" @click="handleEdit(row.id,'edit')">编辑</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import SearchBar from '@/components/SearchBar'

import { GetSubcontractorPaging } from '@/api/fbgl/subcontractor'
export default {
  name: 'SubcontractorIndex',
  components: {
    TableEx,
    SearchBar
  },
  data() {
    return {
      size: 'mini',
      labelWidth: '85px',
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      filter: {
        isForbiddenList: [
          { name: '是', value: 1 },
          { name: '否', value: 0 }
        ],
        rateList: []
      },
      table: {
        columns: [
          {
            label: '编号', // 表头
            prop: 'number', // 渲染的属性
            class: 'link', // class
            minWidth: '150', // 最小宽度
            click: (row) => this.handleDetails(row),
            fixed: 'left'
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
            class: 'red',
            width: '120',
            format: (val, format, row, column) => {
              let htmlStr = '' // 星级
              if (val === '不合格') {
                column.class = 'red'
              } else if (val === '合格') {
                column.class = 'green'
              } else {
                column.class = 'star'
                const length = val.length
                for (let i = 0; i < length; i++) {
                  htmlStr += `<i class="el-icon-star-on" />`
                }
                val = htmlStr
              }
              return val
            }
          },
          {
            label: '是否禁用',
            prop: 'isForbidden',
            minWidth: '80',
            format: (val) => val ? '是' : '否'
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
      // postData.type = this.filter.type
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      // 请求开始
      return GetSubcontractorPaging(postData)
    },
    parseServeDate(res) {
      const {
        data,
        count,
        amount,
        subcontractorTypeList,
        rateList
      } = res
      const { isForbiddenList } = this.filter
      this.$refs['SearchBar'].setData('subcontractorTypes', 'options', subcontractorTypeList, 'init')
      this.$refs['SearchBar'].setData('rates', 'options', rateList, 'init')
      this.$refs['SearchBar'].setData('isForbidden', 'options', isForbiddenList, 'init')
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
      // 将查询组件里的状态, 支付, 回收选项与是否点击变更按钮关联
      this.searchData.forEach(item => {
        if (item.hasOwnProperty('disabled')) {
          item.disabled = this.alterDisabled
        }
      })
      return this.lastSearch
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      this.$router.push({ name: 'SubcontractorDetails', query: { type: 'details', id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'SubcontractorEdit', query: { type, id, rateList: JSON.stringify(this.filter.rateList), refreshRouterName: this.$route.name }})
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
  .table-extend {
    /deep/ .el-table {
      td.el-table__cell {
        div.red {
          color: red;
        }
        div.green {
          color: green;
        }
        div.star {
          color: #409EFF
        }
      }
    }
  }

}

// .cell el-tooltip
</style>
