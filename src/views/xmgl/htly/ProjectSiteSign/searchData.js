export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'projectName',
      value: '',
      multiple: true,
      component: 'Input',
      placeholder: '全部',
      label: '项目名称',
      isMain: true
    },
    {
      name: 'name',
      value: '',
      label: '名称',
      placeholder: '输入检索',
      component: 'Input',
      isMain: true
    },
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
      name: 'year',
      value: '',

      valueFormat: 'yyyy',
      placeholder: '全部',
      dateType: 'year',
      component: 'DatePicker',
      label: '期间'
    },
    {
      name: 'progressTypes',
      value: '',

      label: '进度',
      multiple: false,
      placeholder: '全部',
      component: 'Select'
    },
    {
      name: 'coordinateTypes',
      value: '',

      label: '是否协助',
      multiple: false,
      placeholder: '全部',
      component: 'Select'
    },
    {
      name: 'projectState',
      value: '',

      label: '项目状态',
      placeholder: '全部',
      component: 'Select'
    },
    {
      name: 'warningState',
      value: '',

      label: '预警状态',
      placeholder: '全部',
      component: 'Select'
    },
    {
      name: 'firstRepresent',
      value: '',

      label: '甲方代表',
      placeholder: '输入检索',
      component: 'Input'
    },
    {
      name: 'states',
      value: '',

      label: '状态',
      placeholder: '全部',
      component: 'Select',
      multiple: false,
      propsLabel: 'name'
    },
    {
      name: 'reportAmount',
      value: [],
      transformType: 'property-serial',
      label: '上报值',
      placeholder: '输入',
      component: 'InputRange'
    },
    {
      name: 'approveAmount',
      value: [],
      transformType: 'property-serial',
      label: '审定值',
      placeholder: '输入',
      component: 'InputRange'
    },
    {
      name: 'costAmount',
      value: [],
      transformType: 'property-serial',
      label: '成本值',
      placeholder: '输入',
      component: 'InputRange'
    }
  ]
}
