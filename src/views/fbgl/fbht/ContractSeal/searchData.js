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
      name: 'orgIds2',
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
      name: 'subcontractor',
      value: '',
      label: '分包单位',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'subcontractPeople',
      value: '',
      label: '分包人',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'subPart',
      value: '',
      label: '分包部位',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'isSeal',
      value: [],
      propsLabel: 'name',
      label: '是否用章',
      placeholder: '全部',
      component: 'Select'
    }
  ]
}
