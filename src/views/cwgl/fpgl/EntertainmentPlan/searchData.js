export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'orgIds',
      value: [],
      multiple: true,
      component: 'OrgSelect',
      placeholder: '全部',
      label: '部门名称',
      isMain: true
    },
    {
      name: 'year',
      value: '',
      placeholder: '请选择',
      dateType: 'year',
      valueFormat: 'yyyy',
      component: 'DatePicker',
      isMain: true,
      label: '期间',
      rules: []
    },
    {
      name: 'states',
      value: [],
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      isMain: true,
      propsLabel: 'name'
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'pendingPerson',
      value: '',
      label: '待处理',
      placeholder: '输入',
      component: 'Input'
    },
    {
      name: 'summary',
      value: '',
      label: '事由',
      placeholder: '输入检索',
      component: 'Input'
    }
  ]
}
