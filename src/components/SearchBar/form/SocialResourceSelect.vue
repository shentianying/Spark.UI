<template>
  <div class="PersonSelect2">
    <selectSocialResource ref="personRef" v-model="inputVal" :multiple="multiple" @getCheckedItem="getCheckedItem" @getAllOptions="getAllOptions" />
    <el-select
      ref="elSelect"
      v-model="inputVal"
      :disabled="disabled"
      :size="size"
      :multiple="multiple"
      collapse-tags
      clearable
      :placeholder="placeholder"
      :loading="loading"
      @focus="selectSocialResource"
    >
      <el-option
        v-for="(item,index) in list"
        :key="index"
        :label="item[opLabel]"
        :value="item[opValue]"
      />
    </el-select>
  </div>
</template>

<script>
// import { getPersonList } from '@/api/rsgl/person'
import selectSocialResource from '@/components/Other/ywgl/selectSocialResource'
export default {
  name: 'SocialResourceSelect',
  components: { selectSocialResource },
  model: { event: 'change', prop: 'value' },
  props: {
    props: {
      type: Object,
      default() {
        return {
          value: 'id',
          label: 'name'
        }
      }
    },
    propsValue: { type: String, default: '' }, // 与props.value作用相同，但优先于其
    propsLabel: { type: String, default: '' }, // 与props.value作用相同，但优先于其

    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '选择'
    },
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: [Array, String, Number],
      default: ''
    }
  },
  data() {
    return {
      list: [],
      loading: false
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
      },
      get() {
        return this.value
      }
    }
  },
  created() {
  },
  methods: {
    getCheckedItem(val) {
      this.$emit('select', val)
    },
    getAllOptions(options) {
      console.log('获取列表', options)
      this.list = options
    },
    selectSocialResource() {
      this.$refs.elSelect.blur()
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
