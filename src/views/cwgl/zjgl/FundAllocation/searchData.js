export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'orgIdIn',
      value: '',
      component: 'OrgSelect',
      placeholder: '全部',
      label: '调入部门',

      checkStrictly: true,
      isMain: true,
      rules: [],
      options: []
    },
    {
      name: 'orgId',
      value: '',
      component: 'OrgSelect',
      placeholder: '全部',
      label: '调出部门',

      isMain: true,
      checkStrictly: true,
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
      valueFormat: 'yyyy',

      isMain: true,
      rules: []
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input',

      required: false,
      rules: []
    },
    {
      name: 'states',
      value: [],
      label: '状态',
      propsLabel: 'name',
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      rules: []
    }
  ]
}
