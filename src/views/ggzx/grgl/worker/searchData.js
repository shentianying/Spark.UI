export default [
  // 搜索组件渲染列表，具体参考组件内注释
  {
    name: 'orgIds',
    value: [],
    multiple: true,
    component: 'OrgSelect',
    placeholder: '全部',
    label: '所属部门',
    labelWidth: 'auto',
    isMain: true,
    rules: [],
    options: []
  },
  {
    name: 'workTypes',
    value: [],
    multiple: true,
    placeholder: '全部',
    component: 'TreeSelect',
    label: '工种',
    labelWidth: 'auto',
    isMain: true,
    rules: [],
    options: []
  },
  {
    name: 'bdState',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '报到',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '未', value: 0 },
      { label: '已', value: 1 }
    ]
  },
  {
    name: 'pauseState',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '暂退',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '未', value: 0 },
      { label: '已', value: 1 }
    ]
  },
  {
    name: 'exitState',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '退场',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '未', value: 0 },
      { label: '已', value: 1 }
    ]
  },
  {
    name: 'physicalExaminationState',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '体检',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '未体检', value: 0 },
      { label: '已体检', value: 1 }
    ]
  },
  {
    name: 'bank',
    value: '',
    multiple: true,
    placeholder: '全部',
    component: 'Select',
    label: '开户行',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: []
  },
  {
    name: 'accountState',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '账号',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '未确认', value: 0 },
      { label: '已确认', value: 1 }
    ]
  },
  {
    name: 'isReadCard',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '身份证扫描',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '否', value: 0 },
      { label: '是', value: 1 }
    ]
  },
  {
    name: 'isWithInsurance',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '工伤保险',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '未办理', value: 0 },
      { label: '已办理', value: 1 }
    ]
  },
  {
    name: 'year',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '年度',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: []
  },
  {
    name: 'gender',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '性别',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: [
      { label: '全部', value: '' },
      { label: '男', value: '男' },
      { label: '女', value: '女' }
    ]
  },
  {
    name: 'workerType',
    value: '',
    multiple: false,
    placeholder: '全部',
    component: 'Select',
    label: '工人类型',
    labelWidth: 'auto',
    isMain: false,
    rules: [],
    options: []
  },
  {
    name: 'number',
    value: '',
    label: '工号',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  },
  {
    name: 'contractNumber',
    value: '',
    label: '合同号',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  },
  {
    name: 'name',
    value: '',
    label: '姓名',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  },
  {
    name: 'idNumber',
    value: '',
    label: '身份证号',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  },
  {
    name: 'gongzhangIds',
    value: '',
    label: '工长',
    placeholder: '选择',
    component: 'PersonSelect',
    multiple: true
  },
  {
    name: 'remark',
    value: '',
    label: '备注',
    placeholder: '输入检索',
    component: 'Input',
    labelWidth: 'auto',
    isMain: true,
    rules: []
  },
  {
    name: 'ageSection',
    value: [],
    label: '年龄',
    placeholder: '输入',
    component: 'InputRange',
    labelWidth: 'auto',
    rules: []
  },
  {
    name: 'workAgeSection',
    value: [],
    label: '工龄',
    placeholder: '输入',
    component: 'InputRange',
    labelWidth: 'auto',
    rules: []
  },
  {
    name: 'exitDateRange',
    value: [],
    label: '退场日期',
    placeholder: '选择',
    component: 'DateRange',
    // valueFormat: 'yyyy-MM-dd HH:mm:ss',
    labelWidth: 'auto',
    rules: []
  }
]
