export default [
  // 搜索组件渲染列表，具体参考组件内注释
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
    name: 'posts',
    value: '',
    multiple: true,
    placeholder: '全部',
    component: 'Select',
    label: '职务',
    labelWidth: 'auto',
    isMain: true,
    rules: [],
    options: []
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
  }
]
