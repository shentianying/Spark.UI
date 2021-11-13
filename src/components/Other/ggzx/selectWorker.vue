<template>
  <!--选择工人-->
  <div v-if="open">
    <el-dialog
      title="选择工人"
      :destroy-on-close="true"
      :width="dialogWidth"
      :visible.sync="open"
      :append-to-body="true"
    >
      <SearchBar ref="SearchBar" v-model="searchData" size="mini" :search="fetchData" :loading="tableLoading" />
      <el-table
        ref="selectTable"
        v-loading="tableLoading"
        :row-key="(row) => row.id"
        :data="tableList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
        height="350"
      >
        <el-table-column type="index" width="55" align="center" />
        <el-table-column align="center" label="工号" width="100">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.organization.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="身份证号" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.idNumber }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.age }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工种" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.workType.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工龄" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.workingAge }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-tag v-if="worker!==null&&worker.id===scope.row.id" type="info">已选择</el-tag>
            <el-button v-else type="primary" plain size="mini" @click="save(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div style="margin-top:20px;text-align:center">
        <el-button size="mini" :disabled="(selectionItem || []).length<=0" type="danger" :loading="buttonLoading" style="width:100%" @click="save">确认</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { getWorkerList } from '@/api/ggzx/worker'
import SearchBar from '@/components/SearchBar'
import searchData from './searchData'
export default {
  name: 'WorkerSelect',
  components: {
    SearchBar
  },
  props: {
    dialogWidth: { type: String, default: '70%' }, // 弹出层的宽度
    type: { type: Number, default: null },
    orgIds: { type: Array, default: () => [] }, // 默认选中项目组
    worker: { type: Object, default: null }, // 默认已选择工人
    year: { type: Number, default: new Date().getFullYear() }, // 年份-默认当年
    bdState: { type: Boolean, default: null }, // 是否报到
    ispause: { type: Boolean, default: null }, // 是否暂退
    isexit: { type: Boolean, default: null } // 是否退场
  },
  data() {
    return {
      open: false,
      disabled: false,
      buttonLoading: false,
      tableList: [],
      tableLoading: null,
      searchData: searchData,
      refresh: false
    }
  },
  activated() {
    this.fetchData()
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    openDialog() {
      // 清空数据
      this.tableList = []
      this.searchData = this.searchData.map(item => {
        item.value =
            item.name === 'year' ? this.year : item.value
        item.value =
            item.name === 'orgIds' ? this.orgIds : item.value
        item.value =
            item.name === 'number' ? '' : item.value
        item.value =
            item.name === 'name' ? '' : item.value
        return item
      })
      this.open = true
      this.refresh = true
      this.goSearch()
    },
    fetchData() {
      this.goSearch()
    },
    goSearch() {
      const postData = this.getSearchData()
      this.buttonLoading = true
      setTimeout(() => {
        this.getPersonList(postData)
      }, 700)
    },
    /**
     * @description: 搜索栏数据转换
     * @return {Object} request数据
     */
    getSearchData() {
      const lastSearch = {}
      this.searchData.forEach(item => {
        const { value, transformType, name } = item
        if (transformType === 'property-serial') {
          value.forEach((ele, index) => {
            const serial = index + 1
            lastSearch[name + serial] = ele
          })
        } else {
          lastSearch[name] = value
        }
      })
      return lastSearch
    },
    getPersonList(postData) {
      getWorkerList({
        ...postData,
        year: this.year,
        bdState: this.bdState,
        ispause: this.ispause,
        isexit: this.isexit,
        isRefresh: this.refresh
      }).then(res => {
        const { data, yearOptions } = res
        this.tableList = data
        this.buttonLoading = false
        this.searchData = this.searchData.map(item => {
          item.options =
              item.name === 'year' ? yearOptions : item.options
          return item
        })
      }).catch(() => { this.buttonLoading = false })
    },
    save(row) {
      this.buttonLoading = true
      // 触发父组件的事件
      setTimeout(() => {
        this.$emit('getPersons', row)
        this.buttonLoading = false
        this.open = false
      }, 300)
    }
  }
}
</script>
<style lang="scss" scoped>
.tips{
  font-size: 12px;
}
.selectbar__username {
  width:120px;
  /deep/ .el-input__validateIcon {
    display: none;
  }
}
</style>
