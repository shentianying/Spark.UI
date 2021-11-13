export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'projectName',
      value: '',
      label: '项目名称',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
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
      name: 'signType',
      value: '',
      propsLabel: 'name',
      label: '签证类型',
      placeholder: '全部',
      component: 'Select',
      isMain: true
    },
    {
      name: 'year',
      value: '',
      placeholder: '请选择',
      dateType: 'year',
      valueFormat: 'yyyy',
      component: 'DatePicker',
      label: '期间'
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'subcontractNumber',
      value: '',
      label: '合同编号',
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
      name: 'orderPeople',
      value: '',
      label: '指令人',
      placeholder: '输入检索',
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
      isMain: true,
      propsLabel: 'name'
    }
  ]
}
