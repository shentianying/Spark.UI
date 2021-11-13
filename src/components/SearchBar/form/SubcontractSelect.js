
const settings = {
  request: {
    fn: GetSubcontractList,
    params: [
      { name: 'subcontractPeople', label: '分包人', component: 'ElInput' },
      { name: 'subcontractor', label: '分包单位', component: 'ElInput' },
      { name: 'projectName', label: '项目', component: 'ElInput' },
      { name: 'name', label: '合同名称', component: 'ElInput' },
      { name: 'number', label: '合同号', component: 'ElInput' }
    ]
  },
  tableColumn: [ // 表格列
    { prop: 'number', label: '编号', minWidth: '130' },
    { prop: 'orgName', label: '组织机构', minWidth: '90' },
    { prop: 'projectName', label: '项目', minWidth: '130' },
    { prop: 'name', label: '名称', minWidth: '90' },
    { prop: 'subcontractor', label: '分包单位', minWidth: '130' },
    { prop: 'subcontractPeople', label: '分包人', minWidth: '90' },
    { prop: 'subPart', label: '分包部位', minWidth: '90' },
    { prop: 'corporation', label: '法定代表人', minWidth: '90' }
  ]
}

import SelectDialog from '@/components/SelectDialog'
import { GetSubcontractList } from '@/api/fbgl/subcontracts'
export default {
  name: 'SubcontractSelect',
  functional: true,
  render(h, { props, data, children }) {
    const config = Object.assign(data, { props: Object.assign(props, settings) })
    return h(SelectDialog, config, children)
  }
}

