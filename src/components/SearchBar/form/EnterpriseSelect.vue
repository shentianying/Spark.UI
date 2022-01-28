
<script>
import SelectDialog from '@/components/SelectDialog'
import { getEnterpriseList } from '@/api/zsgl/enterprise'
import Select from '@/components/SearchBar/form/Select'

const settings = {
  title: '选择企业',
  request: {
    fn: getEnterpriseList,
    params: [
      { name: 'type', label: '企业类型', component: Select, props: { propsLabel: 'name', options: (res) => res.enterpriseTypeList }},
      { name: 'name', label: '名称或编号', component: 'ElInput' }
    ]
  },
  tableColumn: [ // 表格列
    { prop: 'companyName', label: '公司名称', minWidth: '90' },
    { prop: 'legalPerson', label: '法定代表人', minWidth: '120' },
    { prop: 'linkMan', label: '联系人', minWidth: '120' }
  ]
}

export default {
  name: 'EnterpriseSelect',
  functional: true,
  render(h, { props, data, children }) {
    const config = Object.assign(data, { props: Object.assign(props, settings) })
    return h(SelectDialog, config, children)
  }
}

</script>
