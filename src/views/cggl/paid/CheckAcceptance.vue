<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <org-select2
          v-model="search.orgIds"
          :data-mode="1"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="true"
          filterable
          expand-trigger="hover"
          placeholder="选择部门"
          :check-strictly="true"
          select-style="min-width:110px;"
        />
        <el-input v-model="search.ticketNumber" placeholder="票号" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-button :loading="loading" type="primary" size="mini" @click="initData">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
      height="350"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" fixed="left" align="center" width="55" />
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="票号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.ticketNumber }}
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center; margin-top:15px;">
      <el-button size="mini" type="success" :loading="loading" @click="checkAcceptance()">确定</el-button>
    </div>
  </div>
</template>
<script>
import { GetAcceptDetailCheckList } from '@/api/cwgl/zjgl/Acceptance.js'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'CheckAcceptance',
  components: {
    OrgSelect2
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      taskList: [],
      search: {
        ticketNumber: '',
        orgIds: []
      },
      loading: false,
      list: [],
      multipleSelection: []
    }
  },
  computed: {
  },
  watch: {
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      var postData = {}
      postData.currentPage = 1
      postData.pageSize = 100000
      postData.ticketNumber = this.search.ticketNumber
      postData.orgIds = this.search.orgIds
      postData.capitalTypes = []
      postData.capitalTypes.push(this.obj.capitalType)
      GetAcceptDetailCheckList(postData).then(response => {
        const { data } = response
        this.list = data
        this.$refs.multipleTable.clearSelection()
        this.$nextTick(function() {
          this.list.forEach(e => {
            var row = this.obj.list.find(f => f.ticketNumber === e.ticketNumber && f.amount === e.amount)
            if (row) {
              this.$refs.multipleTable.toggleRowSelection(e, true)
            } else {
              this.$refs.multipleTable.toggleRowSelection(e, false)
            }
          })
        })
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    checkAcceptance() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择承兑明细')
      } else {
        var sum_amount = 0
        this.multipleSelection.forEach(e => {
          sum_amount += e.amount
        })
        var data = {
          id: this.obj.id,
          capitalType: this.obj.capitalType,
          list: this.multipleSelection,
          amount: sum_amount
        }
        this.$emit('dialogClose', data, 'add')
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
