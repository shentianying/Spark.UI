<template>
  <el-table-column
    class="TableExColumn"
    :align="column.align"
    :label="column.label"
    :min-width="column.minWidth"
    :width="column.width"
    :show-overflow-tooltip="true"
  >
    <template #default="scope">
      <el-tooltip :disabled="!isCustom(column)" placement="top" effect="light">
        <div slot="content" v-html="formatPopper(scope.row,column)" />
        <div
          class="column-wrapper"
          :class="column.class"
          @click="click(scope.row,column)"
          v-html="formatCont(scope.row,column)"
        />
      </el-tooltip>
      <!-- <el-popover
          :popper-class="popperClass"
          :disabled="isDisabled(column)"
          trigger="hover"
          placement="top"
        >
          <div v-html="formatPopper(scope.row,column)" />
          <EllipsisText
            slot="reference"
            :class="column.class"
            :line-clamp="column.lineClamp || 1"
            :content="formatCont(scope.row,column)"
            @click="click(scope.row,column)"
            @ellipsis="disabled=$event"
          />
        </el-popover> -->

    </template>
  </el-table-column>
</template>

<script>
/* 当前已经废弃 */

/**
  * @column
               {
                  label: '部门', // 表头
                  prop: 'number', // 渲染的属性
                  // 输出前对数据进行转换处理。支持字符串或者函数

                  formatPopper(val, format, row, column)  提示的格式化方式默认使用format。
                  formatExport(val, format, row, column)  表格导出使用的格式化方式默认使用format。
                  format(val,format, row, column)         自定义转换函数。处理好的数据直接return（接受字符串或者自定义函数）

                  format:'date',  金额万分位:money;  日期:date  目前只接受两种

                  class: 'link', // 自定义类名
                  popoverType: 'createUserName', // 制单人:createUserName; 不设置时只有文本被折叠时展示(popover内容是所有内容包括被折叠部分)
                  lineClamp: 1, // 超出多少行隐藏,默认1行隐藏               这里决定多少行被折叠
                  click(row) {}, //  单击事件。当前行作为参数，处理好的数据直接return

                  // 下面是el-table-column参数，具体请查看element文档
                  align: 'center', // 对齐方式
                  width: '130', // 宽度
                  minWidth: '10' // 最小宽度
                }
  */

import { getValueByPath, formatText } from '../util'

export default {
  props: {
    popperClass: {
      type: String,
      default: 'popper-cont'
    },
    column: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  watch: {
    'scope.row'(val) {

    }
  },

  methods: {
    click(row) {
      const ck = this.column.click
      if (typeof ck === 'function') {
        ck(row, this.column)
      }
    },
    isCustom(column) {
      return typeof column.formatPopper === 'function'
    },
    formatPopper(row, column) {
      const cb = column.formatPopper
      if (typeof cb === 'function') {
        const { format, prop } = column
        const val = getValueByPath(row, prop)
        return cb(val, format, row, column)
      } else {
        return this.formatCont(row, column)
      }
    },
    formatCont(row, column) {
      const { format, prop } = column
      const val = getValueByPath(row, prop)
      return formatText(val, format, row, column)
    },
    getValueByPath(...arg) {
      return getValueByPath(...arg)
    },
    formatText(...arg) {
      return formatText(...arg)
    }

  }
}
</script>
<style lang="scss">
.el-tooltip__popper{
  max-width: 65vw;
  max-height: 60vh;
}
// .popper-cont {
//   max-width: 50vw;
//   max-height: 50vh;
//   overflow: auto;
//   &::-webkit-scrollbar {
//     /*滚动条整体样式*/
//     display:none;
//     width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
//   }
//   &::-webkit-scrollbar-thumb {
//     /*滚动条里面小方块*/
//     border-radius: 10px;
//     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     background: #9c9c9cc2;
//   }
//   &::-webkit-scrollbar-track {
//     /*滚动条里面轨道*/
//     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     border-radius: 10px;
//     background: #ededed;
//   }
// }
.column-wrapper{
    overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
  }
</style>
<style lang="scss" scoped>
.link {
    cursor: pointer;
    text-decoration: underline;
  }

</style>
