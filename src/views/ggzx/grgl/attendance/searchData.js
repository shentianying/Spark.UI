export default () => {
  return [
    // 搜索组件渲染列表，具体参考组件内注释
    {
      name: 'orgIds',
      value: [],
      multiple: true,
      component: 'OrgSelect',
      placeholder: '全部',
      label: '所属项目',

      isMain: true,
      options: []
    },
    {
      name: 'year',
      value: null,
      component: 'Select',
      label: '年份',
      isMain: true,
      rules: [],
      options: []
    },
    {
      name: 'month',
      value: null,
      component: 'Select',
      label: '月份',
      isMain: true,
      rules: [],
      options: []
    },
    {
      name: 'number',
      value: '',
      label: '编号',
      placeholder: '输入检索',
      component: 'Input',
      labelWidth: 'auto',
      isMain: true,
      rules: []
    },
    {
      name: 'workerName',
      value: '',
      label: '工人姓名',
      placeholder: '输入检索',
      component: 'Input',
      labelWidth: 'auto',
      isMain: false,
      rules: []
    },
    {
      name: 'workerNumber',
      value: '',
      label: '工号',
      placeholder: '输入检索',
      component: 'Input',
      labelWidth: 'auto',
      isMain: false,
      rules: []
    },
    {
      name: 'workerType',
      value: null,
      component: 'Select',
      label: '工人类型',
      isMain: false,
      rules: [],
      options: []
    },
    {
      name: 'createUserIds',
      value: '',
      label: '制单人',
      placeholder: '选择',
      component: 'PersonSelect',
      isMain: false,
      multiple: true
    },
    {
      name: 'states',
      value: [],
      label: '状态',
      placeholder: '选择',
      component: 'Select',
      propsLabel: 'name',
      rules: [],
      isMain: false,
      multiple: true
    }
  ]
}
