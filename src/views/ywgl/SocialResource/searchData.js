export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'name',
      value: '',
      label: '姓名',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'conpany',
      value: '',
      label: '所在单位',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'tel',
      value: '',
      label: '电话',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'state',
      value: '',
      label: '状态',
      placeholder: '全部',
      component: 'Select',
      multiple: false,
      options: [
        { label: '全部', value: '' },
        { label: '禁用', value: '0' },
        { label: '正常', value: '1' }
      ]
    }
  ]
}
