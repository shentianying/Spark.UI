export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'name',
      value: '',
      label: '访客姓名',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'tel',
      value: '',
      label: '访客电话',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'carNum',
      value: '',
      label: '车牌',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'receivor',
      value: '',
      label: '接待人',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'date',
      value: [],
      label: '入园日期',
      placeholder: '选择',
      transformType: 'property-serial', // 转换数据类型
      component: 'DateRange',
      dateType: 'date',
      rules: []
    }
  ]
}
