export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'name',
      value: '',
      label: '公司名称',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'operationStates',
      value: [],
      label: '经营状态',
      isMain: true,
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      propsLabel: 'name',
      options: []
    }
  ]
}
