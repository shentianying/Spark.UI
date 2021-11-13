export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'orgIds',
      value: [],
      multiple: true,
      component: 'OrgSelect',
      placeholder: '全部',
      label: '组织机构',
      isMain: true
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'name',
      value: '',
      label: '工程名称',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'tenderMode',
      value: [],
      label: '招标形式',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'reliableLevel',
      value: '',
      label: '可靠级别',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'tenderEndDate',
      value: [],
      label: '投标截止日期',
      transformType: 'property-serial',
      placeholder: '选择',
      component: 'DateRange',

      rules: []
    },
    {
      name: 'bussinessType',
      value: [],
      label: '业务类型',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'technicalType',
      value: [],
      label: '技术标形式',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'states',
      value: [],
      label: '状态',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    }

  ]
}
