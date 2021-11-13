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
    name: 'workerName',
    value: '',
    label: '工人姓名',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  },
  {
    name: 'registerDate',
    value: [],
    label: '报到日期',
    placeholder: '选择',
    transformType: 'property-serial', // 转换数据类型
    component: 'DateRange',
    // valueFormat: 'yyyy-MM-dd HH:mm:ss',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  }
]
