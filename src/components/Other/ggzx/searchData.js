export default [
  // 搜索组件渲染列表，具体参考组件内注释
  {
    name: 'year',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '年度',
    labelWidth: 'auto',
    isMain: true,
    rules: [],
    options: []
  },
  {
    name: 'orgIds',
    value: [],
    multiple: true,
    component: 'OrgSelect',
    placeholder: '全部',
    label: '所属项目',
    labelWidth: 'auto',
    isMain: true,
    rules: [],
    options: []
  },
  {
    name: 'number',
    value: '',
    label: '工号',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: false,
    rules: []
  },
  {
    name: 'name',
    value: '',
    label: '姓名',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: false,
    rules: []
  }
]