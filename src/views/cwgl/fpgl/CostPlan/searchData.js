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
      name: 'costTypes',
      value: [],
      propsLabel: 'name',
      label: '费用类型',
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      isMain: true,
      options: [
      ]
    },
    {
      name: 'supplier',
      value: '',
      label: '供应商',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'name',
      value: '',
      label: '申请人',
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
      disabled: false,
      propsLabel: 'name'
    },
    {
      name: 'pendingPerson',
      value: '',
      label: '待处理',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'amount',
      value: [],
      label: '计划金额',
      placeholder: '输入',
      transformType: 'property-serial', // 转换数据类型
      component: 'InputRange',
      rules: []
    }
  ]
}
