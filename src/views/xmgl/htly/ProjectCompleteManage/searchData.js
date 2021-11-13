export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'projectName',
      value: '',
      label: '项目名称',
      placeholder: '输入检索',
      component: 'Input',
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
      name: 'orderTypes',
      value: '',
      label: '指令类型',
      multiple: false,
      placeholder: '全部',
      component: 'Select',
      propsLabel: 'name'
    },
    {
      name: 'states',
      value: '',
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      multiple: false,
      propsLabel: 'name'
    },
    {
      name: 'pendingPerson',
      value: '',
      label: '待处理',
      placeholder: '输入检索',
      component: 'Input'
    }
  ]
}
