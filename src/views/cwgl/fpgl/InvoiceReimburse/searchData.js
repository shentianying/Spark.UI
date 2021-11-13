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
      name: 'reimburseType',
      value: [],
      propsLabel: 'name',
      label: '报销类型',
      placeholder: '全部',
      component: 'Select',
      isMain: true,
      options: [
      ]
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
    },
    {
      name: 'invoiceTypes',
      value: [],
      propsLabel: 'name',
      label: '发票类型',
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      options: [
      ]
    },
    {
      name: 'name',
      value: '',
      label: '报销人',
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
      name: 'paymentState',
      value: [],
      propsLabel: 'name',
      label: '支付',
      placeholder: '全部',
      component: 'Select',
      options: [
      ]
    }
  ]
}
