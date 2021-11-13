import './index.scss'
import { getValueByPath, formatText, formatFunc } from '../util'

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
                  click(row) {}, //  单击事件。当前行作为参数，处理好的数据直接return

                  // 下面是el-table-column参数，具体请查看element文档
                  align: 'center', // 对齐方式
                  width: '130', // 宽度
                  minWidth: '10' // 最小宽度
                }
  */
function template(h) {
  const { formatPopper, click, formatCont, column, defaultTooltip, popperClass, tooltipEffect, index } = this
  const defaultSlot = {
    default: (scope) => (
      <el-tooltip class='column-wrapper' open-delay={column.openDelay || 0} disabled={defaultTooltip} popper-class={popperClass} placement='top' effect={tooltipEffect}>
        <div slot='content' domPropsInnerHTML={formatPopper(scope.row, column, scope)} />
        <div
          class='column-wrapper'
          class={column.class}
          onClick={() => click(scope.row, column, scope)}
          domPropsInnerHTML={formatCont(scope.row, column, scope)}
        />
      </el-tooltip>
    )
  }
  return (
    <el-table-column
      class='TableExColumn'
      props={{
        fixed: index === 0 ? 'left' : null,
        ...column
      }}
      show-overflow-tooltip={defaultTooltip}
      scopedSlots={column.type ? null : defaultSlot }
    />
  )
}
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    tooltipEffect: {
      type: String,
      default: 'light'
    },
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
  computed: {
    defaultTooltip() {
      return typeof this.column.formatPopper !== 'function'
    }

  },
  render(h) {
    let content
    if (typeof this.column.render === 'function') {
      content = this.column.render.call(this, h)
    } else {
      content = template.call(this, h)
    }
    return content
  },
  methods: {
    click(row, scope) {
      const ck = this.column.click
      if (typeof ck === 'function') {
        ck(row, this.column, scope)
      }
    },
    formatPopper(row, column, scope) {
      const cb = column.formatPopper
      if (typeof cb === 'function') {
        const { prop } = column
        const val = getValueByPath(row, prop)
        return cb(val, formatFunc, row, column, scope)
      } else {
        return this.formatCont(row, column, scope)
      }
    },
    formatCont(row, column, scope) {
      const { format } = column
      return formatText(format, row, column, scope)
    },
    getValueByPath(...arg) {
      return getValueByPath(...arg)
    },
    formatText(...arg) {
      return formatText(...arg)
    }

  }
}
