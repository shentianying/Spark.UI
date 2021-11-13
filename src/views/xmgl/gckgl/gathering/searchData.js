export default [
// 搜索组件渲染列表，具体参考组件内注释
  {
    name: 'orgIds',
    value: [],
    multiple: true,
    component: 'OrgSelect',
    placeholder: '全部',
    label: '组织机构',
    checkStrictly: true,
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
    name: 'gatheringTypes',
    value: [],
    multiple: true,
    placeholder: '全部',
    component: 'Select',
    label: '收款类型',

    isMain: false,
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
    rules: [],
    options: []
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
    name: 'person',
    value: '',
    label: '经手人',
    placeholder: '输入检索',
    component: 'Input',

    isMain: false,
    rules: []
  },
  {
    name: 'yearmonth',
    value: [],
    placeholder: '选择',
    component: 'YearMonth',
    label: '收款月份',
    isMain: false
  }
]
