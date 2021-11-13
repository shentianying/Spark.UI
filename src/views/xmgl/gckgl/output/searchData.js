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
  },
  {
    name: 'year',
    value: '',
    placeholder: '全部',
    dateType: 'year',
    component: 'DatePicker',
    label: '期间',

    isMain: false,
    rules: []
  },
  {
    name: 'projectState',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '项目状态',

    isMain: false,
    rules: [],
    options: []
  },
  {
    name: 'projectManager',
    value: '',
    label: '项目经理',
    placeholder: '输入检索',
    component: 'Input',

    isMain: false,
    rules: []
  },
  {
    name: 'pendingPerson',
    value: '',
    label: '待处理',
    placeholder: '输入检索',
    component: 'Input',

    isMain: false,
    rules: []
  },
  {
    name: 'states',
    value: [],
    multiple: true,
    placeholder: '全部',
    component: 'Select',
    label: '状态',

    required: false,
    isMain: false,
    rules: [],
    options: []
  },
  {
    name: 'yearmonth',
    value: [],
    component: 'YearMonth',
    placeholder: '选择',
    label: '月份',
    isMain: false
  }
]
