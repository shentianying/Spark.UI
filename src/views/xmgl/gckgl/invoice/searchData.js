export default [
// 搜索组件渲染列表，具体参考组件内注释
  {
    name: 'orgIds',
    value: [],
    multiple: true,
    component: 'OrgSelect',
    placeholder: '全部',
    checkStrictly: true,
    label: '组织机构',

    isMain: true,
    rules: [],
    options: []
  },
  {
    name: 'number',
    value: '',
    label: '编号',
    placeholder: '输入检索',
    component: 'Input',

    isMain: true,
    rules: []
  },
  {
    name: 'projectName',
    value: '',
    label: '项目名称',
    placeholder: '输入检索',
    component: 'Input',

    isMain: true,
    rules: []
  }
]
