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
      name: 'name',
      value: '',
      multiple: true,
      placeholder: '输入检索',
      component: 'Input',
      label: '领用人',
      isMain: true
    },
    {
      name: 'depositTypes',
      value: [],
      label: '类型',
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      isMain: true,
      options: [
        { label: '投标保证金', value: 1 },
        { label: '履约保证金', value: 2 },
        { label: '投标保函', value: 3 },
        { label: '履约保函', value: 4 },
        { label: '农民工保证金', value: 5 },
        { label: '押金', value: 6 }
      ]
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'year',
      value: '',
      placeholder: '请选择',
      dateType: 'year',
      valueFormat: 'yyyy',
      component: 'DatePicker',
      label: '期间',
      rules: []
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
      propsLabel: 'name',
      multiple: true,
      disabled: false
    },
    {
      name: 'paymentState',
      value: '',
      label: '支付',
      placeholder: '全部',
      component: 'Select',
      disabled: false,
      options: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    },
    {
      name: 'returnState',
      value: '',
      label: '回收',
      placeholder: '全部',
      component: 'Select',
      disabled: false,
      options: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    },
    {
      name: 'amount',
      value: [],
      label: '金额',
      placeholder: '输入',
      transformType: 'property-serial', // 转换数据类型
      component: 'InputRange',
      rules: []
    },
    {
      name: 'returnDate',
      value: [],
      label: '回收日期',
      placeholder: '选择',
      transformType: 'property-serial', // 转换数据类型
      component: 'DateRange',
      rules: []
    }
  ]
}
