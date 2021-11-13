<template>
  <div class="app-container shouKuan">
    <SearchBar ref="SearchBar" v-model="searchData" :size="size" :search="fetchData" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button v-has="'DIAOBOEDIT_ADD'" :size="size" icon="el-icon-plus" type="primary" @click="handleEdit('')">新建</el-button>
        <el-button v-has="'DIAOBAO_IMPORT'" :size="size" :loading="table.exLoading" @click="exportExcel">导出</el-button>
      </div>
      <el-radio-group v-model="filter.type" class="checkbox-group" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.typeOptions" :key="item.value" :label="item.value">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="资金调拨列表"
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
        <el-button v-if="row.state === 0" v-has="'DIAOBOEDIT_EDIT'" :size="size" type="text" @click="handleEdit(row.id)">编辑</el-button>
        <el-button v-else-if="row.state === 1 && IsNextPerson(row.billFlow)" v-has="'DIAOBO_DETAILS'" :size="size" type="text" @click="handleDetails(row)">审批</el-button>
        <el-button v-else-if="row.state === 1000 && IsNextPerson(row.billFlow)" v-has="'DIAOBO_DETAILS'" :size="size" type="text" @click="handleDetails(row)">支付</el-button>
        <el-button v-else v-has="'DIAOBO_DETAILS'" :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
      <template v-slot:countCont>
        符合查询条件的金额合计：{{ utils.formatMoney(amount,2,0) }}
      </template>
    </TableEx>

  </div>
</template>

<script>
// import { getBussinessInfoPaging, getBussinessInfoEditInit } from '@/api/ywgl/bussinessInfo'
import { GetFundAllocationPaging } from '@/api/cwgl/zjgl/FundAllocation.js'
import SearchBar from '@/components/SearchBar'
// import searchData from './searchData'
import TableEx from '@/components/TableEx'
export default {
  name: 'ZiJinDiaoBo',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      size: 'mini',
      searchData: require('./searchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      amount: 0, // 统计金额

      filter: { // 过滤数据
        type: '3', // 类型
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
            minWidth: '130', // 宽度
            click: (row) => this.handleDetails(row)
          },
          {
            label: '调出部门',
            prop: 'orgIdObj.name',
            minWidth: '130'
          },
          {
            label: '调入部门',
            prop: 'orgIdInObj.name',
            minWidth: '100'
          },
          {
            label: '金额',
            align: 'right',
            prop: 'amount',
            format: 'money',
            width: '100'
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          },
          {
            label: '支付',
            prop: 'payerId',
            format: (val) => val ? '是' : '否',
            width: '50'
          },
          {
            label: '待处理',
            prop: 'billFlow',
            format: (billFlow) => this.getPerson(billFlow),
            minWidth: '150'
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
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    parseServeDate(response) {
      const { data, count, totalAmount } = response
      this.$refs['SearchBar'].setData('states', 'options', data[0]?.billFlow?.form?.formState, 'init')
      this.amount = totalAmount
      // 列表数据初始化
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
      // const { currentPage, pageSize } = this.table
      return GetFundAllocationPaging({
        ...postData,
        currentPage,
        pageSize,
        type: this.filter.type
      })
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
      this.$router.push({ name: 'ZiJinDiaoBoDetails', query: { id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} id
     */
    handleEdit(id = '') {
      this.$router.push({ name: 'ZiJinDiaoBoEdit', query: { id, refreshRouterName: this.$route.name }})
    },
    /**
     * 获取待处理人
     * @param {Object} bf 流程对象
     * @returns {String} 待处理人字符串
     */
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    /**
     * 判断自己是否是待处理人
     */
    IsNextPerson(bf) {
      const arr = bf?.billFlowNode?.filter(f => f.isCurrentState && !f.isChecked) || []
      return arr.find(v => v.person.id === this.$store.state.user.uid)
    }
  }
}
</script>
<style scoped lang="scss">
.shouKuan {
  .link-decoration {
    text-decoration: underline;
  }
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
