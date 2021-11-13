<template>
  <div class="app-container shouKuan">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('')">新建</el-button>
        <el-button :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button>
      </div>
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.typeOptions" :key="item.value" :label="item.value">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      excel-name="项目结算列表"
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
        <el-button v-if="row.state === 0" :size="size" type="text" @click="handleEdit(row.id)">编辑</el-button>
        <el-button v-else-if="row.state === 1 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleDetails(row)">审批</el-button>
        <el-button v-else :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
    </TableEx>
  </div>
</template>

<script>
import { GetProjectSettlePaging } from '@/api/xmgl/ProjectSettle.js'
import SearchBar from '@/components/SearchBar'
import TableEx from '@/components/TableEx'
// import searchData from './searchData'
export default {
  name: 'ProjectSettleIndex',
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
        state: '1', // 状态
        type: '3', // 类型
        stateOptions: [ // 状态数组
          {
            value: '-1',
            name: '作废'
          },
          {
            value: '0',
            name: '制单'
          },
          {
            value: '1',
            name: '审批'
          },
          {
            value: '1000',
            name: '支付'
          },
          {
            value: '10000',
            name: '完成'
          }
        ],
        typeOptions: [ // 类型数组
          {
            value: '0',
            name: '我发起的'
          },
          {
            value: '1',
            name: '待审批'
          },
          {
            value: '2',
            name: '已审批'
          },
          {
            value: '3',
            name: '列表'
          }
        ]
      },

      /* 列表数据相关 */
      table: {
        columns: [
          {
            label: '编号', // 表头
            prop: 'number', // 渲染的属性
            class: 'link', // class
            minWidth: '180', // 最小宽度
            click: (row) => {
              this.handleDetails(row)
            }
          },
          {
            label: '项目',
            prop: 'projectName',
            minWidth: '200'
          },
          {
            label: '组织机构',
            prop: 'orgName',
            minWidth: '120'
          },
          {
            label: '审定时间',
            format: 'date',
            prop: 'settleDate',
            width: '120'
          },
          {
            label: '审定值',
            prop: 'settleAmount',
            format: 'money',
            minWidth: '120'
          },
          {
            label: '竣工验收日期',
            format: 'date',
            prop: 'finishDate',
            width: '120'
          },
          {
            label: '计算竣工日期',
            format: 'date',
            prop: 'computeFinishDate',
            width: '120'
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          },
          {
            label: '待处理',
            prop: 'pendingPerson',
            format: (val, format, row, column) => {
              return Array.isArray(val) ? val.join('、') : val
            },
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
        count
      } = res
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
      let postData = this.getSearchData()
      postData = {
        ...postData,
        states: postData.states ? [postData.states] : [],
        currentPage,
        pageSize,
        type: this.filter.type
      }
      // 请求开始
      return GetProjectSettlePaging(postData)
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
      this.$router.push({ name: 'ProjectSettleDetails', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'ProjectSettleEdit', query: { type, id, refreshRouterName: this.$route.name }})
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
