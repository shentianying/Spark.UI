export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'projectName',
      value: '',
      multiple: true,
      placeholder: '输入检索',
      component: 'Input',
      label: '项目名称',
      isMain: true
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'orgIds',
      value: [],
      multiple: true,
      component: 'OrgSelect',
      placeholder: '全部',
      label: '组织机构',
      isMain: true
    },
    {
      name: 'projectState',
      value: '',
      label: '项目状态',
      placeholder: '全部',
      component: 'Select',
      propsLabel: 'name'
    },
    {
      name: 'pendingPerson',
      value: '',
      label: '待处理',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'states',
      value: [],
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      propsLabel: 'name'
    }
  ]
}
