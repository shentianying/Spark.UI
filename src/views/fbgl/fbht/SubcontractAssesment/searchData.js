export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
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
      name: 'projectName',
      value: '',
      label: '项目',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'subcontractor',
      value: '',
      label: '分包单位',
      placeholder: '全部',
      component: 'Input'
    },
    {
      name: 'subcontractPeople',
      value: '',
      label: '分包人',
      placeholder: '全部',
      component: 'Input'
    },
    {
      name: 'subPart',
      value: '',
      label: '分包部位',
      placeholder: '全部',
      component: 'Input'
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
      multiple: true,
      propsLabel: 'name'
    }
  ]
}
