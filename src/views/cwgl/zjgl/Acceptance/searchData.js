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
      rules: []
    },
    {
      name: 'capitalTypes',
      value: [],
      multiple: true,
      placeholder: '全部',
      component: 'Select',
      label: '类型',

      required: false,
      isMain: true,
      rules: [],
      options: []
    },
    {
      name: 'ticketNumber',
      value: '',
      label: '票号',
      placeholder: '请输入',
      component: 'Input',

      required: false,
      isMain: true,
      rules: []
    },
    {
      name: 'states',
      value: [0],
      multiple: true,
      placeholder: '全部',
      component: 'Select',
      label: '状态',

      required: false,
      isMain: false,
      rules: [],
      options: []
    },
    {
      name: 'payer',
      value: '',
      label: '付款人',
      placeholder: '输入检索',
      component: 'Input',

      required: false,
      rules: []
    },
    {
      name: 'bank',
      value: '',
      label: '收款银行',
      placeholder: '输入检索',
      component: 'Input',

      required: false,
      rules: []
    },
    {
      name: 'amount',
      value: [],
      label: '金额区间',
      transformType: 'property-serial', // 转换数据类型
      placeholder: '输入',
      component: 'InputRange',

      required: false,
      rules: []
    },
    {
      name: 'ticketDate',
      value: [],
      label: '开票日期',
      placeholder: '选择',
      transformType: 'property-serial', // 转换数据类型
      component: 'DateRange',

      rules: []
    },
    {
      name: 'expiration',
      value: [],
      transformType: 'property-serial', // 转换数据类型
      label: '到期日期',
      placeholder: '选择',
      component: 'DateRange',

      rules: []
    }
  ]
}
