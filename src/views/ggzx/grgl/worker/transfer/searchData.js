export default [
  // 搜索组件渲染列表，具体参考组件内注释
  {
    name: 'orgInIds',
    value: [],
    multiple: true,
    component: 'OrgSelect',
    placeholder: '全部',
    label: '调入部门',
    labelWidth: 'auto',
    isMain: true,
    rules: [],
    options: []
  },
  {
    name: 'orgOutIds',
    value: [],
    multiple: true,
    component: 'OrgSelect',
    placeholder: '全部',
    label: '调出部门',
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
    name: 'date',
    value: [],
    label: '调出日期',
    placeholder: '选择',
    transformType: 'property-serial', // 转换数据类型
    component: 'DateRange',
    // valueFormat: 'yyyy-MM-dd HH:mm:ss',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  }
]
