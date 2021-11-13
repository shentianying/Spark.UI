// const stateOptions = [ // 状态数组
//   {
//     value: '-1',
//     name: '作废'
//   },
//   {
//     value: '0',
//     name: '制单'
//   },
//   {
//     value: '1',
//     name: '审批'
//   },
//   {
//     value: '10',
//     name: '变更'
//   },
//   {
//     value: '1000',
//     name: '支付'
//   },
//   {
//     value: '1001',
//     name: '回收'
//   },
//   {
//     value: '10000',
//     name: '完成'
//   }
// ]
// import { initDictionary } from '../../api/xtgl/dictionary'

// 从字典中获取选项数据
// let dictionaries
// initDictionary().then(res => {
//   dictionaries = res.data1
// })
export default {
  createUser: {
    label: '制单人',
    prop: 'createUserName',
    render(h) {
      return (
        <el-table-column
          class='TableExColumn'
          label='制单人'
          min-width='100'
          scopedSlots={{
            default: ({ row }) => {
              const { createUserName, createDate, lastEditUserName, lastEditDate } = row
              const style = {
                borderCollapse: 'separate',
                borderSpacing: '10px 0',
                border: 0
              }
              return (
                <el-tooltip class='column-wrapper' open-delay={500} placement='top' effect='light'>
                  <table slot='content' style={style}>
                    <tr>
                      <td>制单人:{createUserName}</td>
                      <td>制单时间:{createDate}</td>
                    </tr>
                    <tr>
                      <td>更新人:{lastEditUserName}</td>
                      <td>更新时间:{lastEditDate}</td>
                    </tr>
                  </table>
                  <span class='column-wrapper'>{createUserName}</span>
                </el-tooltip>
              )
            }
          }}
        />
      )
    }
  },
  state: {
    label: '状态',
    prop: 'state',
    minWidth: '100',
    formatExport: (val, format, row, column) => {
      const { state, billFlow } = row
      const options = column.options || billFlow?.form?.formState
      return options && options.find(e => e.value === state)?.name
    }, // 表格导出使用的格式化方式默认使用format。
    format: (val, format, row, column) => {
      // console.log(column)
      const { state, billFlow } = row
      const options = column.options || billFlow?.form?.formState
      const { name, color } = options && options.find(e => e.value === state)
      return (`
                <div class="state">
                    <div style="background-color:${color};" class="circle state-${state}" ></div>
                    ${name}
                </div>
      `)
    }
  }
}
