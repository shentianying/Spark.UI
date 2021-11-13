export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'orgIds',
      value: [],
      multiple: true,
      component: 'OrgSelect',
      placeholder: '全部',
      label: '所属部门',

      isMain: true,
      options: []
    },
    {
      name: 'capitalTypes',
      value: [],
      multiple: true,
      placeholder: '全部',
      component: 'CapitalSelect',
      label: '资金形式',

      isMain: true,
      rules: [],
      options: []
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'ElInput',

      isMain: true,
      rules: []
    },
    {
      name: 'gatheringTypes',
      value: '',
      multiple: true,
      placeholder: '全部',
      component: 'Select',
      label: '收款类型',

      isMain: false,
      rules: [],
      options: []
    },
    {
      name: 'bank',
      value: '',
      label: '收款银行',
      placeholder: '输入检索',
      component: 'Input',

      rules: []
    },
    {
      name: 'year',
      value: '',
      placeholder: '全部',
      dateType: 'year',
      valueFormat: 'yyyy',
      component: 'DatePicker',
      label: '期间',

      isMain: false,
      rules: []
    },
    {
      name: 'person',
      value: '',
      label: '经手人',
      placeholder: '选择',
      component: 'PersonSelect',
      multiple: true
    },
    {
      name: 'amount',
      value: [],
      label: '金额区间',
      placeholder: '输入',
      transformType: 'property-serial', // 转换数据类型
      component: 'InputRange',

      rules: []
    },
    {
      name: 'date',
      value: [],
      label: '日期',
      placeholder: '选择',
      transformType: 'property-serial', // 转换数据类型
      component: 'DateRange',

      rules: []
    },
    {
      name: 'state',
      value: 0,
      label: '状态',
      placeholder: '选择',
      component: 'Select',
      propsLabel: 'name',
      rules: []
    }
  ]
}
