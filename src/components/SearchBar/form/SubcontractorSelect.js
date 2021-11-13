import SelectDialog from '@/components/SelectDialog'
import { GetSubcontractorList } from '@/api/fbgl/subcontractor'
import Select from '@/components/SearchBar/form/Select'

const settings = {
  request: {
    fn: GetSubcontractorList,
    params: [
      { name: 'type', label: '分包类型', component: Select, props: { propsLabel: 'name', options: (res) => res.subcontractorTypeList }},
      { name: 'name', label: '名称或编号', component: 'ElInput' }
    ]
  },
  tableColumn: [ // 表格列
    { prop: 'number', label: '编号', minWidth: '130' },
    { prop: 'name', label: '单位名称', minWidth: '90' },
    { prop: 'corporation', label: '法定代表人', minWidth: '120' }
  ]
}

export default {
  name: 'SubcontractorSelect',
  functional: true,
  render(h, { props, data, children }) {
    const config = Object.assign(data, { props: Object.assign(props, settings) })
    return h(SelectDialog, config, children)
  }
}
