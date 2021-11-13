<template>
  <div class="table-extend">
    <excel-export
      v-show="false"
      ref="excelExport"
      :size="size"
      book-type="xlsx"
      :filename="tmpExcelName"
      :sheet="sheet"
      :on-error="onExcelExportError"
    />
    <el-table
      v-loading="tableLoading"
      :tooltip-effect="tooltipEffect"
      :row-class-name="rowClassName"
      :size="size"
      :data="list"
      header-cell-class-name="table-header"
      highlight-current-row
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
    >
      <slot name="tbAfter" />
      <TableExColumn v-for="(column, index) in bColumns" :key="index" :index="index" :tooltip-effect="tooltipEffect" :popper-class="popperClass" :column="column" />
      <slot />
      <el-table-column
        v-if="showActions"
        label="操作"
        align="center"
        :width="actionsWidth"
        fixed="right"
      >
        <template #default="{row, column, $index, store}">
          <slot name="actions" :row="row" :column="column" :$index="$index" :store="store" />
        </template>
      </el-table-column>
    </el-table>
    <slot v-if="showCount" name="count">
      <div class="count">
        <i class="el-icon-warning" />
        <slot name="countCont">
          <span v-html="countCont" />
        </slot>
      </div>
    </slot>
    <div v-if="showPagination" class="page">
      <el-pagination
        background
        :hide-on-single-page="false"
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script>
/**
 * @method
 *          initExcel         initExcel(list)   返回Excel对象 {sheet, export}
 *                            sheet：的tHeader、keys通过遍历column.label、column.prop而来,所以提供column很重要
 *                            export(sheet): export是function，调用即导出，参数则是sheet
 *
 *
 * @props:
 *              columns:[]         // 需要渲染的列数据，但这不是必要的，可以使用tbAfter插槽或者默认插槽插入内容
 *              list:[]            // 列表数据
 *
 *
 *              exportExcelLoading  // 导出表格状态
 *              excelName           // 导出表格名字
 *
 *              tooltip-effect	    // tooltip effect属性: dark/light 默认:light
 *              row-class-name	   //行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
 *                        	 参数:Function({row, rowIndex})/String
 *
 *              actionsWidth:120  // 默认操作栏宽度
 *              showActions       // 展示默认操作栏(如当前操作栏不满足需求可用默认插槽或者具名插槽tbAfter插入el-table-column)
 *
 *
 *              currentPage:1      // 当前页数，支持 .sync 修饰符
 *              pageSize:10        // 每页显示条目个数，支持 .sync 修饰符
 *              total:0            // 总条目
 *              size:'mini'        // 组件大小
 *              tableLoading:true       // 加载状态
 *              showActions:true   // 显示默认操作栏
 *              showCount:true     // 显示默认统计栏
 *              countCont:''       // 统计栏文字，可插入html(实际通过v-html插入该内容)
 *
 *              popperClass:''     // popperover自定义类名(popperover只有超出隐藏时才展示)
 *
 * @slot: 在本组件中提供了以下：
 *             如果columns属性不能满足要求可以通过插槽去扩展
 *               tbAfter:  在遍历渲染props（el-table-column）之前；使用时请先插入el-table-column，与el-table中使用是一致的
 *               默认插槽:  在遍历渲染props（el-table-column）之后；使用时请先插入el-table-column，与el-table中使用是一致的
 *               actions:  操作栏插槽，在这里请直接插入按钮不需要el-table-column，如果不需要这列请使用props showActions参数隐藏
 *               count:    自定义统计栏插槽
 *               countCont 统计栏文字内容
 *
 *
 * @event  本组件提供了以下事件：
 *
 *               rowDblclick:    当某一行被双击时会触发该事件；参数 row, column, event(参考Element Table Events)
 *               currentChange:   当前页改变; 参数 current
 *               sizeChange:      当分页大小被改变; 参数 size
 *               fetchData:       当页改变或者页大小改变时触发
 *
 * @column对象
 *               {
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

import TableExColumn from './Column/index.js'
import businessList from './businessList'
import { formatText } from './util'
import { ExcelExport } from 'pikaz-excel-js'
export default {
  name: 'TableEx',
  components: {
    TableExColumn,
    ExcelExport
  },
  props: {
    tooltipEffect: {
      type: String,
      default: 'light'
    },
    excelName: {
      type: String,
      default: '导出列表'
    },
    rowClassName: {
      type: [Function, String],
      default: ''
    },
    actionsWidth: {
      type: Number,
      default: 120
    },
    showActions: {
      // 显示默认操作栏
      type: Boolean,
      default: true
    },
    showPagination: {
      // 显示分页器
      type: Boolean,
      default: true
    },
    popperClass: {
      // popper自定义类
      type: String,
      default: 'popper-cont'
    },
    showCount: {
      // 显示统计
      type: Boolean,
      default: true
    },
    countCont: {
      // 统计栏文字，可插入html
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'mini'
    },
    tableLoading: {
      // table Loading状态
      type: Boolean,
      default: false
    },
    exportExcelLoading: {
      // Excel Loading状态
      type: Boolean,
      default: false
    },
    total: {
      // total	总条目数	number
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    columns: {
      // 需要渲染的列数据，但这不是必要的，可以使用tbAfter插槽或者默认插槽插入内容
      type: Array,
      default() {
        return [
          // {
          //   label: '部门', // 表头
          //   prop: 'number', // 渲染的属性
          //   // 输出前对数据进行转换处理。支持字符串或者函数

          //   formatPopper(val, format, row, column)  提示的格式化方式默认使用format。
          //   formatExport(val, format, row, column)  表格导出使用的格式化方式默认使用format。
          //   format(val,format, row, column)         自定义转换函数。处理好的数据直接return（接受字符串或者自定义函数）

          //   format:'date',  金额万分位:money;  日期:date  目前只接受两种

          //   class: 'link', // 自定义类名
          //   popoverType: 'createUserName', // 制单人:createUserName; 不设置时只有文本被折叠时展示(popover内容是所有内容包括被折叠部分)
          //   lineClamp: 1, // 超出多少行隐藏,默认1行隐藏               这里决定多少行被折叠
          //   click(row) {}, //  单击事件。当前行作为参数，处理好的数据直接return
          //   // 下面是el-table-column参数，具体请查看element文档
          //   align: 'center', // 对齐方式
          //   width: '130', // 宽度
          //   minWidth: '10' // 最小宽度
          // }
        ]
      }
    },
    list: {
      // 渲染数据
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {

      tmpExcelName: '',
      sheet: []
    }
  },
  computed: {
    bColumns() {
      return this.columns.map((column) => {
        return { ...businessList[column.business], ...column }
      })
    }
  },
  methods: {

    /**
     * @description:表格导出功能
     */
    initExcel(table = []) {
      this.$emit('update:exportExcelLoading', true)
      const sheet1 = { sheetName: this.excelName, keys: [], tHeader: [], table }
      this.bColumns.forEach(column => {
        sheet1.keys.push(column.prop)
        sheet1.tHeader.push(column.label)
      })
      this.setFname()
      const self = this
      return {
        sheet: [sheet1],
        format(sheet = this.sheet) {
          try {
            self.bColumns.forEach(column => {
              sheet = sheet.map(item => {
                const table = item.table.map(row => {
                  const val = self.formatExport(row, column)
                  return { ...row, [column.prop]: val }
                })
                return { ...item, table }
              })
            })
            this.sheet = sheet
          } catch (error) {
            self.$emit('update:exportExcelLoading', false)
          }
          return this
        },
        cancel() {
          self.$emit('update:exportExcelLoading', false)
        },
        export(sheet) {
          self.sheet = sheet || this.sheet
          self.$refs.excelExport.pikaExportExcel()
          self.$emit('update:exportExcelLoading', false)
          return this
        } }
    },
    // async exportExcel(params) {
    //   this.$emit('update:exportExcelLoading', true)
    //   let sheet1
    //   try {
    //     const table = await params()
    //     sheet1 = { sheetName: this.excelName, keys: [], tHeader: [], table }
    //     this.bColumns.forEach(column => {
    //       sheet1.keys.push(column.prop)
    //       sheet1.tHeader.push(column.label)
    //       sheet1.table = sheet1.table.map(row => {
    //         const val = this.formatExport(row, column)
    //         return { ...row, [column.prop]: val }
    //       })
    //     })
    //   } catch (e) {
    //     console.log('导出错误，错误信息：', e)
    //     this.$message.error('导出错误')
    //     this.$emit('update:exportExcelLoading', false)
    //   }

    //   const self = this
    //   const Excel = {
    //     sheet: [sheet1],
    //     export(sheet) {
    //       self.sheet = sheet || this.sheet
    //       self.$refs.excelExport.pikaExportExcel()
    //       self.$emit('update:exportExcelLoading', false)
    //     }
    //   }
    //   return Excel
    // },
    /**
     * @description: 设置表格名字
     */
    setFname() {
      let date = this.utils.parseTime(new Date())
      date = date.replace(' ', '_')
      date = date.replace(':', '_')
      this.tmpExcelName = this.excelName + date
    },
    /**
     * @description: excel导出错误处理
     */
    onExcelExportError(err) {
      // this.$message.info('导出失败：' + err)
      self.$emit('update:exportExcelLoading', false)
      this.$emit('onExcelExportError', err)
    },
    formatExport(row, column) {
      const { formatExport, format } = column
      return formatText(formatExport || format, row, column)
    },
    formatCont(row, column) {
      const { format } = column
      return formatText(format, row, column)
    },
    rowDblclick(...args) {
      this.$emit('rowDblclick', ...args)
    },
    rowClick(...args) {
      this.$emit('rowClick', ...args)
    },
    fetchData() {
      this.$emit('fetchData')
    },
    /**
     * @description: 当前页变化
     * @param {Number} val 当前页
     */
    currentChange(current) {
      this.$emit('update:currentPage', current)
      this.$emit('currentChange', current)
      this.fetchData()
    },
    /**
     * @description: 设置分页大小
     * @param {Number} val 页大小
     */
    sizeChange(pageSize) {
      this.$emit('update:currentPage', 1) // 重置当前页
      this.$emit('update:pageSize', pageSize)
      this.$emit('sizeChange', pageSize)
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-extend {
  .count {
    color: #606266;
    font-size: 13px;
    border-radius: 2px;
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 10px;
    .el-icon-warning {
      padding: 0 5px;
      color: #1890ff;
    }
  }
  .page {
    text-align: right;
    margin: 10px 0;
  }
  /deep/ .el-table__fixed,/deep/ .el-table__fixed-right{
    height: 100% !important;
  }
  /deep/.table-header {
    background-color: #f7f7f7;
    color:#333;
  }
}
</style>
