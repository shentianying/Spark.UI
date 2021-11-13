<template>
  <el-dialog
    title="选择承兑"
    :visible.sync="value"
    :show-close="false"
    class="dialog"
    width="60%"
  >
    <div class="dialog-cont">
      <el-form ref="ruleForm2" :model="params" :inline="true" :size="size">
        <el-form-item label="部门:" prop="orgids">
          <OrgSelect
            v-model="params.orgids"
            multiple
            :size="size"
            :data-mode="0"
            :collapse-tags="true"
            placeholder="请选择部门"
            :check-strictly="true"
          />
        </el-form-item>
        <el-form-item label="承兑号:" prop="ticketNumber">
          <el-input v-model="params.ticketNumber" :size="size" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" :size="size" type="primary" @click="getzjcdDate()">查询</el-button>
          <el-button :size="size" @click="rest()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        class="my-table"
        :data="tableData"
        :size="size"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="id" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="orgName" label="部门" />
        <el-table-column prop="ticketNumber" label="承兑号" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额" show-overflow-tooltip>
          <template slot-scope="scope">{{ utils.formatMoney(scope.row.amount,2,0) }}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="restqx()">取 消</el-button>
        <el-button
          :size="size"
          type="primary"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { GetAcceptDetailCheckList } from '@/api/cwgl/zjgl/Acceptance.js'
import OrgSelect from '@/components/SearchBar/form/OrgSelect' // 部门选择器

export default {
  name: 'AcceptanceCheckList',
  components: {
    OrgSelect
  },
  props: {
    value: Boolean, // 是否显示
    type: { // 资金形式
      type: [Number, String],
      default: 2
    },
    origin: { // 初始数据,会把这个和新选择地数组合并然后去重,通过onchange返回
      type: Array,
      default() {
        return []
      }
    },
    size: { // 组件尺寸
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      tableData: [], // 表格数据
      params: { // 筛选请求参数
        currentPage: 1,
        pageSize: this.utils.getPersonalSettings().pageSize,
        ticketNumber: '',
        orgids: []
      },
      loading: false,
      checkList: [] // 当前选中
    }
  },
  watch: {
    value(val) {
      if (val) this.getzjcdDate()
    }
  },
  methods: {
    // 弹出框选择事件
    handleSelectionChange(val) {
      this.checkList = val
    },
    /**
     * 获取数据
     */
    getzjcdDate() {
      this.loading = true
      GetAcceptDetailCheckList({ ...this.params, capitalTypes: [this.type] }).then(res => {
        if (res.code === 200) {
          const allData = [...this.origin, ...res.data]
          this.tableData = allData.filter((item, index) => {
            // 去重
            return allData.findIndex(v => v.id === item.id) === index
          })
          this.$nextTick(() => {
            this.origin.forEach(row => {
              this.$refs['multipleTable'].toggleRowSelection(row)
            })
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 重置方法
    rest() {
      this.params.ticketNumber = ''
      this.params.orgids = []
      this.getzjcdDate()
    },
    // 取消方法
    restqx() {
      this.params.ticketNumber = ''
      this.params.orgids = []
      this.$emit('input', false)
    },
    /**
     * 确定
     */
    confirm() {
      this.$emit('onchange', this.checkList)
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  .dialog-cont{
    .my-table {
      overflow: auto;
      max-height: 400px;
      width: 100%;
  /deep/.el-table th{
    height: 36px;
  }
  /deep/ .el-table-column--selection .cell {
    padding-left: 0;
  }
}
  }
  .dialog-footer{
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}

</style>
