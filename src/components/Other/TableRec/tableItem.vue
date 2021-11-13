<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :size="size"
      :show-summary="isShowSummary"
      :height="height"
    >
      <el-table-column
        v-if="isShowBox"
        type="selection"
        width="55"
        align="center"
      />
      <template>
        <column-item
          v-for="item in col"
          :key="item.label"
          :col="item"
          :attend-options="attendOptions"
        />
      </template>
    </el-table>
  </div>
</template>
<script>
import ColumnItem from './columnItem'
export default {
  name: 'TableItem',
  components: {
    ColumnItem
  },
  props: {
    // 表格数据
    list: {
      type: Array,
      default: () => []
    },
    // 树型结构表头数据
    col: {
      type: Array,
      default: () => []
    },
    // 设置表格大小
    size: {
      type: String,
      default: 'mini' // 默认mini
    },
    // 是否在表格下方显示合计
    isShowSummary: {
      type: Boolean,
      default: false
    },
    // 设置表格高度,固定表头
    height: {
      type: String,
      default: null // 默认不固定表头
    },
    // 判断是否显示多选框
    isShowBox: {
      type: Boolean,
      default: false // 默认不展示
    },
    // 加载
    loading: {
      type: Boolean,
      default: false
    },
    attendOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style>
/* 处理表格表头和内容错位问题 */
.el-table th.gutter {
  display: table-cell !important;
}
.el-table th,
.el-table td {
  padding: 7px 0 !important;
}
</style>
