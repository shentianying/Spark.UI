<template>
  <div class="PersonSelect2">
    <Dialog ref="personRef" v-model="inputVal" :request="fetchData()" :table-column="tableColumn" :multiple="multiple" @save="save" />
    <slot :select="curr">
      <Select
        ref="select"
        v-model="inputVal"
        :props-value="propsValue"
        :props-label="propsLabel"
        :options="list"
        :disabled="disabled"
        :multiple="multiple"
        :size="size"
        :placeholder="placeholder"
        :loading="loading"
        @focus="openDialog"
      />
    </slot>

  </div>
</template>

<script>
import Select from '@/components/SearchBar/form/Select'
import Dialog from './Dialog'
export default {
  name: 'SelectDialog',
  components: { Dialog, Select },
  model: { event: 'change', prop: 'value' },

  props: {
    multiple: { type: Boolean, default: false }, // 默认单选
    propsValue: { type: String, default: 'id' }, // 与props.value作用相同，但优先于其
    propsLabel: { type: String, default: 'name' }, // 与props.value作用相同，但优先于其
    tableColumn: { // 表格渲染的列
      type: Array,
      default() {
        return [
          // { prop: 'number', label: '编号', minWidth: '130' },
          // { prop: 'name', label: '单位名称', minWidth: '90' },
          // { prop: 'corporation', label: '法定代表人', minWidth: '120' }
        ]
      }
    },
    request: {
      type: Object,
      default() {
        return {
          // fn: async(postData) => {
          //     const res = await GetSubcontractorList(postData)
          //     // to do 获取一些需要的数据
          //     if(!this.init){
          //       this.list = options
          //       this.init=true
          //     }
          //     return res
          //   },
          //   params: [
          //     { name: 'type', label: '分包类型', component: Select, props: { propsLabel: 'name', options: (res) => res.subcontractorTypeList }},
          //     { name: 'name', label: '名称或编号', component: 'ElInput' }
          //   ]
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '选择'
    },
    size: {
      type: String,
      default: 'mini'
    },
    value: {
      type: [Array, String, Number],
      default: ''
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      curr: {}
    }
  },
  computed: {
    opLabel() {
      return this.propsLabel || this.props.label
    },
    opValue() {
      return this.propsValue || this.props.value
    },
    inputVal: {
      set(val) {
        this.$emit('change', val)
        this.$emit('input', val)
      },
      get() {
        return this.value
      }
    }
  },
  created() {
  },
  methods: {
    fetchData() {
      const { fn, params } = this.request
      return {
        fn: async(postData) => {
          this.loading = true
          const res = await fn(postData)
          // to do 获取一些需要的数据
          if (!this.init) {
            this.list = res.data
            this.init = true
          }
          this.loading = false
          return res
        },
        params
      }
    },
    save(val) {
      this.curr = val
      this.$emit('select', val)
    },
    openDialog() {
      this.$refs.select.blur()
      this.$refs.personRef.openDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.PersonSelect2{
  width: 100%;
  /deep/.el-select{
    width: 100%;
  }
}
</style>
