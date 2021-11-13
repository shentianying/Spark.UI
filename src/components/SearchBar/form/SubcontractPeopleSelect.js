
const settings = {
  request: {
    fn: GetSubcontractPeopleList, // 获取数据方法
    params: [ // 获取方法组件
      { name: 'type', label: '分包类型', component: Select, props: { propsLabel: 'name', options: (res) => res.typeList }},
      { name: 'name', label: '名称', component: 'ElInput' }
    ]
  },
  tableColumn: [ // 表格列
    { prop: 'idNumber', label: '编号', minWidth: '150' },
    { prop: 'name', label: '名称', minWidth: '90' },
    { prop: 'orgName', label: '所在单位', minWidth: '120' }
  ]
}
import SelectDialog from '@/components/SelectDialog'
import { GetSubcontractPeopleList } from '@/api/fbgl/subcontractPeople'
import Select from '@/components/SearchBar/form/Select'
export default {
  name: 'SelectSubcontractPeople',
  functional: true,
  render(h, { props, data, children }) {
    const config = Object.assign(data, { props: Object.assign(props, settings) })
    return h(SelectDialog, config, children)
  }
}

