<template>
  <SelectDialog v-model="inputVal" :request="request" :table-column="tableColumn" />
</template>

<script>
import SelectDialog from '@/components/SelectDialog'
import { GetProjectSiteSignList } from '@/api/fbgl/subcontractSignSet.js'
// import Select from '@/components/SearchBar/form/Select'
export default {
  name: 'SubcontractorSelect',
  components: { SelectDialog },
  model: { event: 'change', prop: 'value' },
  props: {
    value: {
      type: [Array, String, Number],
      default: ''
    }
  },
  data() {
    return {
      request: {
        fn: GetProjectSiteSignList,
        params: [
          { name: 'projectName', label: '项目', component: 'ElInput' },
          { name: 'name', label: '签证名称', component: 'ElInput' },
          { name: 'number', label: '编号', component: 'ElInput' }
        ]
      },
      tableColumn: [ // 表格列
        { prop: 'number', label: '编号', minWidth: '130' },
        { prop: 'projectName', label: '项目', minWidth: '90' },
        { prop: 'name', label: '名称', minWidth: '120' },
        { prop: 'occurDate', label: '指令日期', minWidth: '130', format: 'date' },
        { prop: 'reportAmount', label: '上报值（元）', minWidth: '120', format: 'money' },
        { prop: 'approveAmount', label: '审定值（元）', minWidth: '120', format: 'money' },
        { prop: 'costAmount', label: '成本值（元）', minWidth: '130', format: 'money' },
        { prop: 'progressTypeName', label: '进度', minWidth: '90' },
        { prop: 'createUserName', label: '制单人', minWidth: '120' }
      ]
    }
  },
  computed: {
    inputVal: {
      set(val) {
        this.$emit('change', val)
      },
      get() {
        return this.value
      }
    }
  }
}
</script>

<style>

</style>
