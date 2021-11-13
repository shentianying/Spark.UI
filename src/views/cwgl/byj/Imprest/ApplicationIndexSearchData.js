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
      label: '领用人',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'states',
      value: [],
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      propsLabel: 'name',
      multiple: true,
      isMain: true
    },
    {
      name: 'paymentState',
      value: '',
      label: '支付',
      placeholder: '全部',
      component: 'Select',
      options: [
        { label: '全部', value: '' },
        { label: '否', value: 0 },
        { label: '是', value: 1 }
      ]
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
