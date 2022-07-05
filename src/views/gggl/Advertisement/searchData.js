export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'name',
      value: '',
      label: '广告主题',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'types',
      value: [],
      label: '类型',
      isMain: true,
      placeholder: '全部',
      component: 'Select',
      multiple: true,
      propsLabel: 'name',
      options: []
    }
  ]
}
