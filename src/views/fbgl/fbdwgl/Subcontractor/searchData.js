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
      name: 'subcontractorTypes',
      value: [],
      label: '分包类型',
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      isMain: true,
      propsLabel: 'name',
      options: []
    },
    {
      name: 'subcontractor',
      value: '',
      label: '分包单位',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'agent',
      value: '',
      label: '委托代理人',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'isForbidden',
      value: '',
      label: '是否禁用',
      placeholder: '全部',
      component: 'Select',
      propsLabel: 'name',
      options: []
    },
    {
      name: 'rates',
      value: '',
      label: '星级',
      placeholder: '全部',
      component: 'Select',
      propsLabel: 'name',
      multiple: true,
      options: []
    }
  ]
}

