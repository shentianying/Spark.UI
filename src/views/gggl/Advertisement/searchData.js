export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'name',
      value: '',
      label: '名称',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'ipAddress',
      value: '',
      label: 'IP地址',
      isMain: true,
      placeholder: '输入检索',
      component: 'Input'
    }
  ]
}
