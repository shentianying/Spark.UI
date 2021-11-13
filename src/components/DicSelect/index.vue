<template>
  <el-select v-model="modelValue" :size="size" placeholder="请选择" :style="selectStyle">
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :label="item.name"
      :value="item.value"
    />
  </el-select>
</template>
<script>
import { getDictionaryList } from '@/api/xtgl/dictionary'
export default {
  model: {
    prop: 'selectValue', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    dicType: { type: String, default: '' },
    selectStyle: { type: String, default: 'width:100%' },
    size: { type: String, default: 'mini' },
    // eslint-disable-next-line vue/require-default-prop
    selectValue: [String, Number]
  },
  data() {
    return {
      list: null,
      modelValue: null
      // selectStyle: 'width:100%'
    }
  },
  watch: {
    modelValue(value) {
      this.$emit('change', value)
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // console.log('this.dicType: ', this.dicType)
      var postData = { companyId: this.$store.state.user.selectOrgId, type: this.dicType }
      getDictionaryList(postData).then(response => {
        this.list = response.data
      })
    }
  }
}
</script>
