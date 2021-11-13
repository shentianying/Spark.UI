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
      name: 'name',
      value: '',
      label: '工程名称',
      placeholder: '输入检索',
      component: 'Input',
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
      name: 'developer',
      value: '',
      label: '发包单位',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
    {
      name: 'state',
      value: '',
      label: '状态',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select',
      isMain: true
    },
    {
      name: 'professionalType',
      value: '',
      label: '专业类型',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'houseProperty',
      value: [],
      label: '房屋性质',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'informationSource',
      value: [],
      label: '信息来源',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'progress',
      value: [],
      label: '进展情况',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'marketCategory',
      value: '',
      label: '市场类别',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'area',
      value: '',
      label: '区域',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'cooperationMode',
      value: [],
      label: '合作模式',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'dockPerson',
      value: '',
      label: '对接人员',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'trackDepth',
      value: [],
      label: '跟进深度',
      multiple: true,
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'isImportant',
      value: '',
      label: '重要程度',
      placeholder: '全部',
      component: 'Select',
      options: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    },
    {
      name: 'reliableLevel',
      value: '',
      label: '可靠程度',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'trackLevel',
      value: '',
      label: '跟进要求',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
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
      name: 'projectStatus',
      value: '',
      label: '立项情况',
      placeholder: '全部',
      propsLabel: 'name',
      component: 'Select'
    },
    {
      name: 'tenderEndDate',
      value: [],
      label: '投标截止时间',
      placeholder: '选择',
      transformType: 'property-serial', // 转换数据类型
      component: 'DateRange',
      rules: []
    },
    {
      name: 'startDate',
      value: [],
      label: '开工时间',
      placeholder: '选择',
      transformType: 'property-serial', // 转换数据类型
      component: 'DateRange',
      rules: []
    },
    {
      name: 'marketingManager',
      value: '',
      label: '团队负责人',
      placeholder: '输入检索',
      component: 'Input'
    }

  ]
}
