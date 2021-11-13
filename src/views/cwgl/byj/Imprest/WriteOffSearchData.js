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
      name: 'name',
      value: '',
      multiple: true,
      placeholder: '输入检索',
      component: 'Input',
      label: '冲销人',
      isMain: true
    },
    {
      name: 'states',
      value: [],
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      propsLabel: 'name',
      multiple: true,
      isMain: true
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'type',
      value: '',
      label: '冲销方式',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select',
      options: [
        { name: '网银冲销', value: '1' },
        { name: '发票冲销', value: '2' }
      ]
    }
  ]
}

