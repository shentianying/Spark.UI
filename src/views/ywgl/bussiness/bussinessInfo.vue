<template>
  <div class="app-container list">
    <SearchBar ref="SearchBar" v-model="searchData" :search="fetchData" :size="size" :loading="table.tbLoading" :label-width="labelWidth" />
    <div class="action">
      <div>
        <el-button v-has="'BUSSINESSINFO_ADD'" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd">新建</el-button>
      </div>
      <el-radio-group v-model="filter.type" :size="size" @change="fetchData('filter')">
        <el-radio-button v-for="item in filter.types" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <TableEx
      ref="TableEx"
      :size="size"
      excel-name="业务信息列表"
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
        <el-button v-if="filter.type === 0" v-has="'BUSSINESSINFO_EDIT'" :size="size" type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button v-else-if="filter.type === 1 && utils.IsNextPerson(row.billFlow)" :size="size" type="text" @click="handleReply(row)">审批</el-button>
        <el-button v-else-if="filter.type === 7" v-has="'BUSSINESSINFO_DETAIL'" :size="size" type="text" @click="handleDetail(row.id)">查看</el-button>
        <el-button v-else v-has="'BUSSINESSINFO_REPLY'" :size="size" type="text" @click="handleReply(row)">回复</el-button>
      </template>
    </TableEx>

  </div>
</template>

<script>
import { getBussinessInfoPaging } from '@/api/ywgl/bussinessInfo'
import SearchBar from '@/components/SearchBar'
import TableEx from '@/components/TableEx'
export default {
  name: 'BussinessInfo',
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
        type: 2,
        types: [
          { label: '我发起的', value: 0 },
          { label: '立项审批', value: 1 },
          { label: '在跟踪', value: 2 },
          { label: '合同签订', value: 3 },
          { label: '失标总结', value: 4 },
          { label: '总结完成', value: 5 },
          { label: '合同履约', value: 6 },
          { label: '列表', value: 7 }
        ],
        areaList: [], // 区域
        cooperationModeList: [], // 合作模式
        marketCategoryList: [],
        professionalTypeList: [],
        progressList: [],
        trackDepthList: [],
        informationSourceList: [],
        housePropertyList: [],
        developerList: [],
        personList: [],
        dockPersonList: [],
        reliableLevelList: [],
        trackLevelList: [],
        traceLevelList: [],
        importantTypeList: [],
        projectStatusList: [] // 立项状态
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
            label: '专业类型',
            prop: 'professionalType',
            width: '100'
          },
          {
            label: '工程名称',
            prop: 'projectName',
            minWidth: '120'
          },
          {
            label: '发包单位',
            prop: 'developer',
            minWidth: '120'
          },
          {
            align: 'right',
            label: '预估造价(万元)',
            prop: 'cost',
            format: 'money',
            minWidth: '120'
          },
          {
            label: '可靠级别',
            prop: 'reliableLevel',
            width: '100'
          },
          {
            label: '重要',
            prop: 'isImportant',
            width: '100',
            format: (val) => val ? '<i class="el-icon-check" />' : ''
          },
          {
            label: '营销经理',
            prop: 'manager',
            minWidth: '120'
          },
          {
            label: '跟踪级别',
            prop: 'traceLevel',
            minWidth: '120'
          },
          {
            label: '进展',
            prop: 'progress',
            minWidth: '120'
          },
          {
            label: '暂定开工日期',
            prop: 'startDate',
            format: 'date',
            minWidth: '120'
          },
          {
            label: '状态',
            prop: 'formStateName',
            minWidth: '80'
          },
          {
            label: '跟踪人',
            prop: 'trackPerson',
            minWidth: '100'
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
        cityList,
        managementiStateList,
        marketCategoryList,
        professionalTypeList,
        progressList,
        trackDepthList,
        informationSourceList,
        projectPropertyList,
        dockPersonList,
        importantTypeList,
        reliableLevelList,
        trackLevelList,
        formState
      } = res

      this.$refs['SearchBar'].setData('area', 'options', cityList, 'init')
      this.$refs['SearchBar'].setData('cooperationMode', 'options', managementiStateList, 'init')
      this.$refs['SearchBar'].setData('marketCategory', 'options', marketCategoryList, 'init')
      this.$refs['SearchBar'].setData('professionalType', 'options', professionalTypeList, 'init')
      this.$refs['SearchBar'].setData('progress', 'options', progressList, 'init')
      this.$refs['SearchBar'].setData('trackDepth', 'options', trackDepthList, 'init')
      this.$refs['SearchBar'].setData('informationSource', 'options', informationSourceList, 'init')
      this.$refs['SearchBar'].setData('houseProperty', 'options', projectPropertyList, 'init')
      this.$refs['SearchBar'].setData('dockPerson', 'options', dockPersonList, 'init')
      this.$refs['SearchBar'].setData('isImportant', 'options', importantTypeList, 'init')
      this.$refs['SearchBar'].setData('reliableLevel', 'options', reliableLevelList, 'init')
      this.$refs['SearchBar'].setData('trackLevel', 'options', trackLevelList, 'init')
      this.$refs['SearchBar'].setData('state', 'options', formState, 'init')
      this.$refs['SearchBar'].setData('projectStatus', 'options', data[0]?.billFlow?.form?.formState, 'init')
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
      return getBussinessInfoPaging(postData)
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
      this.$router.push({ name: 'BussinessInfoEdit', query: { refreshRouterName: this.$route.name }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'BussinessInfoAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleAttitude(row) {
      this.$router.push({ name: 'BussinessInfoAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleReply(row) {
      this.$router.push({ name: 'BussinessInfoReply', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleDetail(id) {
      this.$router.push({ name: 'BussinessInfoDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
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
