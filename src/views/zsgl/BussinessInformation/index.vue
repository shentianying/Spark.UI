<template>
  <div class="app-container tablelist">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.keyName" placeholder="请输入资讯关键字" clearable size="mini" maxlength="11" style="width:120px;" />
        <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeTab" :lazy="true" @tab-click="setSelected">
      <el-tab-pane :label="tabsInfo[0].label" :name="tabsInfo[0].name">
        <el-table
          v-loading="listLoading"
          :data="infoList"
          element-loading-text="Loading"
          fit
          :show-header="false"
          highlight-current-row
          size="mini"
          @row-click="handleDetails"
        >
          <el-table-column>
            <template slot-scope="scope">
              <h3>{{ scope.row.title }}</h3>
              {{ scope.row.content }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="tabsInfo[1].label" :name="tabsInfo[1].name">
        <el-table
          v-loading="listLoading"
          :data="infoList"
          element-loading-text="Loading"
          fit
          :show-header="false"
          highlight-current-row
          size="mini"
          @row-click="handleDetails"
        >
          <el-table-column>
            <template slot-scope="scope">
              <h3>{{ scope.row.title }}</h3>
              {{ scope.row.content }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div style="text-align:center;margin:10px 0;">
      <el-pagination
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="fetchData"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import { getBussinessInformationPaging } from '@/api/zsgl/bussinessInformation.js'

export default {
  name: 'BussinessInformation',
  components: {

  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      activeTab: 'display',
      tabsInfo: [
        { name: 'display', selected: false, label: '行业展会' },
        { name: 'association', selected: false, label: '行业协会' }
      ],
      infoList: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      search: {
        keyName: '',
        type: 1,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  /**
   * 最后决定使用beforeRouteEnter路由守卫代替activated,和created;
   * 其好处是:无论用哪种方式进入都会触发,并且只触发一次;
   */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.tabsInfo[0].selected = true
      vm.fetchData()
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.getTable()
        .then(res => this.parseServeDate(res))
        .finally(() => {
          this.listLoading = false
        })
    },
    parseServeDate(res) {
      const {
        data,
        count
      } = res
      // 列表数据初始化
      console.log('列表数据:', data)
      this.infoList = data
      this.total = count
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    getTable(currentPage = this.currentPage, pageSize = this.pageSize) {
      // 获取请求参数
      const postData = this.search
      postData.currentPage = currentPage
      postData.pageSize = pageSize
      // 请求开始
      return getBussinessInformationPaging(postData)
    },
    /**
     * @description: 路由到详情页
     * @param {*} row
     */
    handleDetails(row) {
      if (row.url !== '') {
        window.open(row.url, '_blank')
      }
    },
    goSearch() {
      this.fetchData()
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    // 解决 一次打开 多个选项卡一次性 加载 所有数据的问题
    setSelected(tag) {
      this.tabsInfo[Number(tag.index)].selected = true
      this.search.type = Number(tag.index) + 1
      this.fetchData()
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

