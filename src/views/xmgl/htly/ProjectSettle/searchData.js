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
      name: 'states',
      value: '',
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      multiple: false,
      propsLabel: 'name'
    }, // MyDateRang
    {
      name: 'settleDate',
      value: [],
      label: '审定日期',
      placeholder: '选择',
      component: 'DateRange',
      transformType: 'property-serial', // 转换数据类型

      rules: []
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
