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
      component: 'Select'
    },
    {
      name: 'startTypes',
      value: [],
      label: '开工类型',
      placeholder: '全部',
      component: 'Select'
    },
    {
      name: 'orderUnit',
      value: '',
      label: '指令单位',
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
      name: 'states',
      value: '',
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      options: [
        { label: '全部', value: '' },
        { label: '制单', value: 0 },
        { label: '审批', value: 1 },
        { label: '完成', value: 10000 },
        { label: '作废', value: -1 }
      ]
    },
    {
      name: 'startDate',
      value: [],
      label: '开工日期',
      transformType: 'property-serial',
      placeholder: '选择',
      component: 'DateRange',

      rules: []
    }

  ]
}
