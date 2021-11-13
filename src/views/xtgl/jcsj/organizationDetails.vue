<template>
  <div>
    <el-card>
      <Detailsedit
        v-if="myDetails"
        status="checkInfo"
        :info-list="infoList"
      />
      <el-tabs :value="activeName">
        <el-tab-pane label="备用金统计" name="1">
          <div class="tabs-header">
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
        <el-tab-pane label="其他信息" name="2">
          <div class="tabs-header">
            其他信息
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

</template>

<script>
import { GetImprestListByPersonId } from '@/api/xmgl/ProjectSettle.js'
import TableEx from '@/components/TableEx'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'OrganizationDetails',
  components: { TableEx, Detailsedit },
  props: {
    obj: {
      type: Object,
      default: null
    }

  },
  data() {
    return {
      size: 'mini',
      myDetails: {}, // 详情数据
      activeName: '1',
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
    },
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          data: {
            name,
            isProject,
            categoryId,
            inUse
          }
        }
      } = this
      return [
        { label: '名称', value: name },
        { label: '类别', value: categoryId },
        { label: '是否项目', value: isProject ? '是' : '否' },
        { label: '是否使用', value: inUse ? '是' : '否' }
      ]
    }
  },
  methods: {
    fetchData() {
      const { id, year } = this.$route.query
      this.myId = id
      GetImprestListByPersonId({ id: 1, year }).then(res => {
        this.myDetails = res
        this.table.list = res.data
        console.log(this.table.list)
      })
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.infoList = newObj
      }
    }
  }
}
</script>

<style>

</style>
