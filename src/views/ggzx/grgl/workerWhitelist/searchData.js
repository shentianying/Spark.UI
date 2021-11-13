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
    name: 'workerName',
    value: '',
    label: '工人名称',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: false,
    rules: []
  },
  {
    name: 'idNumber',
    value: '',
    label: '证件号',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: false,
    rules: []
  }
]
