<template>
  <el-select
    ref="elSelect"
    v-model="inputVal"
    :filter-method="filterMethod"
    collapse-tags
    :filterable="filterable"
    :disabled="disabled"
    clearable
    :size="size"
    :placeholder="placeholder"
    :multiple="multiple"
    @focus="focus"
  >
    <el-option
      v-for="(option) in filterOptions"
      :key="option[opValue]"
      :label="formatOption(option)"
      :value="option[opValue]"
    />
  </el-select>
</template>

<script>
export default {
  model: { event: 'change', prop: 'value' },
  props: {
    props: {
      type: Object,
      default() {
        return {
          // 该属性对应el-option label属性的格式化输入，类似c语言中的printf，例子如下：
          // format:'{{value}}-{{label}}'  select选项格式为: 1-小明
          // 其中label、value为option对象的属性名
          // 请注意不支持反斜杠转义，双大括号内是属性名，不可有空格或其他字符
          format: '', // format属性优先于label
          value: 'value', // 该属性决定选择option对象中哪个属性作为el-option value值
          label: 'label' // 该属性决定选择option对象中哪个属性作为el-option label值
          // search: ['value', 'label'] // 搜索配对的属性
        }
      }
    },
    filterable: {
      type: Boolean,
      default: false
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
      default: 'mini'
    },
    value: {
      type: [Array, String, Number],
      default: ''
    },
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    opLabel() {
      return this.propsLabel || this.props.label
    },
    opValue() {
      return this.propsValue || this.props.value
    },
    filterOptions() {
      let res = this.options
      if (this.keyword) {
        const options = this.options.map(option => {
          let tmp = ''
          const { value, label, search } = this.props
          // console.log(11111, this.props)
          if (Array.isArray(search) && search.length) {
            tmp = search.map(k => option[k]).join('')
          } else {
            tmp = option[label].toString() + option[value]
          }
          const searchText = this.props.format ? this.formatOption(option) : tmp
          return { ...option, searchText: searchText }
        })
        // console.log(options)
        res = this.fuzzyQuery(options, this.keyword)
      }
      return res
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
  methods: {
    blur() {
      this.$refs.elSelect.blur()
    },

    focus(...args) {
      this.filterMethod('')
      this.$emit('focus', ...args)
    },
    /**
     * @description: 使用spilt方法实现模糊查询
     * @param  {Array}  list     进行查询的字符串数组
     * @param  {String} keyWord  查询的关键词
     * @return {Array}           查询的结果
     */
    fuzzyQuery(list, keyWord) {
      var arr = []
      for (var i = 0; i < list.length; i++) {
        if (list[i].searchText.split(keyWord).length > 1) {
          arr.push(list[i])
        }
      }
      return arr
    },
    /**
     * @description:修改关键字
     * @param {*} keyWord 关键字
     */
    filterMethod(keyword) {
      this.keyword = keyword
    },
    /**
     * @description: 格式化字符串
     * @param {Object} option
     * @return {String} 格式化后的字符串
     */
    formatOption(option) {
      let formatText = this.props.format
      if (formatText) {
        const matchArr = [...formatText.matchAll(/{{(\w+)}}/g)]
        matchArr.forEach(item => {
          const replaceText = item[0]
          const optionKey = item[1]
          formatText = formatText.replace(replaceText, option[optionKey])
        })
      } else {
        const key = this.opLabel
        formatText = option[key]
      }
      return formatText
    }
  }
}
</script>

<style>

</style>
