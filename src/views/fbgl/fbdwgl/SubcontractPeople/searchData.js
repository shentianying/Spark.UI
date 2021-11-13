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
      name: 'types',
      value: [],
      label: '类型',
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      isMain: true,
      propsLabel: 'name',
      options: []
    },
    {
      name: 'name',
      value: '',
      label: '姓名',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    }
  ]
}

