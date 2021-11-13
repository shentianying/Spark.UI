<template>
  <div class="app-container shoukuan">
    <!-- 保证金管理 -->
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" />
    <div class="action">
      <div>
        <el-button :size="size" type="primary" icon="el-icon-plus" :disabled="alterDisabled" @click="handleEdit('','add')">新建</el-button>
        <el-button :size="size" :loading="table.exLoading" :disabled="alterDisabled" @click="exportExcel">导出</el-button>
        <el-button :size="size" :loading="table.exLoading" :type="alterDisabled ? 'primary': ''" @click="alterAtion">变更</el-button>
      </div>
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.types" :key="item.value" :label="item.value" :disabled="alterDisabled">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="保证金申请列表"
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
        <!-- row.state:  10 变更-->
        <el-button v-if="row.state === 0" :size="size" type="text" @click="handleEdit(row.id,'edit')">编辑</el-button>
        <el-button v-else-if="row.state === 1 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleDetails(row,'approval')">审批</el-button>
        <el-button v-else-if="row.state === 1000 && utils.IsNextPerson(row.billFlow) && !row.isPayout" :size="size" type="text" @click="handleDetails(row,'pay')">支付</el-button>

        <!-- 变更列表 -->
        <el-button v-else-if="row.state === 1001 && alterDisabled" :size="size" type="text" @click="handleDetails(row,'alteration')">变更</el-button>
        <el-button v-else-if="row.state === 1001" :size="size" type="text" @click="handleDetails(row,'recycle')">回收</el-button>
        <el-button v-else :size="size" type="text" @click="handleDetails(row)">查看</el-button>
      </template>
      <template v-slot:countCont>
        符合查询条件的金额合计：{{ utils.formatMoney(amount,2,0) }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </template>
    </TableEx>

  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import SearchBar from '@/components/SearchBar'
import { GetDepositPaging } from '@/api/cwgl/Deposit'
export default {
  name: 'DepositIndex',
  components: {
    SearchBar,
    TableEx
  },
  data() {
    return {
      alterDisabled: false, // 是否点击变更
      size: 'mini',
      searchData: require('./DepositSearchData').default(), // 渲染搜索栏数据
      lastSearch: null, // 最近一次搜索的数据
      amount: 0, // 统计金额
      filter: {// 过滤数据
        type: 4,
        types: [
          { label: '我发起的', value: 0 },
          { label: '待审批', value: 1 },
          { label: '已审批', value: 2 },
          { label: '变更中', value: 3 },
          { label: '列表', value: 4 }
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
            click: (row) => this.handleDetails(row)
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '200'
          },
          {
            label: '类型',
            prop: 'depositType',
            minWidth: '120'
          },
          {
            label: '领用人',
            prop: 'personName',
            minWidth: '120'
          },
          {
            align: 'right',
            label: '金额',
            prop: 'applicationAmount',
            format: 'money',
            minWidth: '120'
          },
          {
            label: '客商',
            prop: 'bussinessMan',
            width: '120'
          },
          {
            label: '回收日期',
            format: 'date',
            prop: 'planReturnDate',
            width: '120'
          },
          {
            business: 'state' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          },
          {
            label: '支付',
            prop: 'isPayout',
            width: '120',
            format: (val) => val ? '是' : '否'
          },
          {
            label: '回收',
            prop: 'isReturn',
            width: '120',
            format: (val) => val ? '是' : '否'
          },
          {
            label: '待处理',
            prop: 'pendingPerson',
            width: '150',
            format: (val, format, row, column) => {
              if (row.state === 10) {
                const modifyBillFlow = row.modifyBillFlow
                const personList = []
                if (Array.isArray(modifyBillFlow)) {
                  modifyBillFlow.forEach(el => {
                    el.pendingPerson = []
                    el.pendingPerson.push(el.billFlow.billFlowNode.filter(e => e.isCurrentState === true && e.isChecked === false)[0])
                    el?.pendingPerson.forEach(ele => {
                      personList.push(ele?.person.name)
                    })
                  })
                  return personList.join('、')
                } else {
                  return ''
                }
              } else {
                return Array.isArray(val) ? val.join('、') : val
              }
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
    /**
     * @description: 点击变更获取变更列表
     */
    alterAtion() {
      this.alterDisabled ? this.filter.type = 4 : this.filter.type = 3
      this.alterDisabled = !this.alterDisabled
      this.fetchData('filter')
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
      return GetDepositPaging(postData)
    },
    parseServeDate(res) {
      const {
        data,
        count,
        amount
      } = res
      this.$refs['SearchBar'].setData('states', 'options', data[0]?.billFlow?.form?.formState, 'init')
      // this.searchData[2].options = data[0]?.billFlow?.form?.formState
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
      this.lastSearch.isModify = this.alterDisabled
      return this.lastSearch
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row, type = 'details') {
      this.$router.push({ name: 'DepositDetails', query: { type, id: row.id, refreshRouterName: this.$route.name }})
    },
    /**
     * @description: table编辑
     * @param {Object} row
     */
    handleEdit(id = '', type) {
      this.$router.push({ name: 'DepositEdit', query: { type, id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>

<style scoped lang="scss">
.shoukuan {
  .action {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
