export default [
  // 搜索组件渲染列表，具体参考组件内注释
  {
    name: 'orgIds',
    value: [],
    multiple: true,
    component: 'OrgSelect',
    placeholder: '全部',
    label: '所属部门',

    isMain: true,
    rules: [],
    options: []
  },
  {
    name: 'capitalTypes',
    value: [],
    multiple: true,
    placeholder: '全部',
    component: 'CapitalSelect',
    label: '资金形式',

    required: false,
    isMain: true,
    rules: [],
    options: []
  }
]
