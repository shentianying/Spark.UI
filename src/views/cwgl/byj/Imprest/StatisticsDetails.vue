<template>
  <div class="ImprestStatisticsDetails">
    <el-card>
      <el-tabs :value="activeName" :before-leave="beforeLeave">
        <el-tab-pane label="基本信息" name="1">
          <div class="tabs-header">
            <span class="header-title">基本信息</span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="备用金信息" name="2">
          <div class="tabs-header">
            <span class="header-title">备用金冲销</span>
            <el-date-picker
              v-model="year"
              :clearable="false"
              style="width:90px;"
              :size="size"
              value-format="yyyy"
              type="year"
              placeholder="选择年"
            />
          </div>
          <TableEx
            ref="TableEx"
            excel-name="备用金统计列表"
            :show-count="false"
            :show-actions="false"
            :show-pagination="false"
            :size="size"
            :columns="table.columns"
            :table-loading="table.loading"
            :list="table.list"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { GetImprestListByPersonId } from '@/api/xmgl/ProjectSettle.js'
import TableEx from '@/components/TableEx'
export default {
  name: 'ImprestStatisticsDetails',
  components: { TableEx },
  data() {
    return {
      size: 'mini',
      myDetails: {}, // 详情数据
      activeName: '2',
      filter: {
        year: new Date().getFullYear()

      },
      /* 列表数据相关 */
      table: {
        columns: [
          {
            label: '单据号', // 表头
            prop: 'number', // 渲染的属性
            minWidth: '120' // 最小宽度
          },
          {
            label: '摘要',
            prop: 'summary',
            minWidth: '120'
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '120'
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '120'
          },
          {
            label: '类别', // 表头
            prop: 'type', // 渲染的属性
            format: (val) => val || '',
            minWidth: '85' // 最小宽度
          },
          {
            label: '支付日期', // 表头
            prop: 'payoutDate', // 渲染的属性
            format: 'date',
            minWidth: '120' // 最小宽度
          },
          {
            label: '金额',
            prop: 'amount',
            format: 'money',
            minWidth: '120',
            align: 'right'
          },
          {
            business: 'createUser' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          }
        ],
        list: [],
        loading: false
      }

    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData()
    })
  },
  computed: {
    year: {
      get() {
        return `${this.filter.year}-00-00`
      },
      set(val) {
        this.filter.year = val
      }
    }
  },
  methods: {
    beforeLeave(curr) {
      if (curr === '1') {
        this.$router.push({ name: 'PersonDetail', query: { id: this.myId, refreshRouterName: this.$route.name }})
        return false
      }
      return true
    },
    fetchData() {
      const { id, year } = this.$route.query
      this.myId = id
      GetImprestListByPersonId({ id, year }).then(res => {
        this.myDetails = res
        this.table.list = res.data
        console.log(this.table.list)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title{
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
