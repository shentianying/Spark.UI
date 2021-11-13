<template>
  <!-- 级联树形 -->
  <el-cascader
    v-model="modelValue"
    :options="myOptions"
    :props="propsData"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :separator="separator"
    :collapse-tags="collapseTags"
    :show-all-levels="showAllLevels"
    :style="selectStyle"
  />
</template>
<script>
/**
 * !!!!!!请注意el-cascader存在bug，options中的value不能为number类型的0!!!!!!否则点击清空标签时会报错并且不能清空
 * 如下:
 * options: [{
          value: 0,     //这个不能是number类型的0，可以替换成'0'！！！！！！
          label: '指南',
          children: [{
            value: '1',
            label: '设计原则',
            children: [{
              value: 1,
              label: '一致'
            }]
          }]
 *
 *
 * 由于上述bug，在本组件中会将所有value转换成string类型（通过value.toString()），并且在返回时自动转换其对应类型。
 * 基于@components/OrgSelect/index2.vue的修改
 * 由于原组件双向绑定方式的问题，导致在其父组件修改prop时不能更新到组件内，故在这里再做修改
 */

export default {
  name: 'TreeSelect',
  components: {
  },
  model: {
    prop: 'selectValue', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    selectValue: { type: [String, Number, Array], default: null }, // 获取你选中的值，传出去的v-model的值
    options: { type: Array, default: null }, // 可选项数据源，键名可通过 Props 属性配置
    // 组件参数
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    collapseTags: { type: Boolean, default: true }, // 已选中的选项的Tag，是否折叠显示
    multiple: { type: Boolean, default: false },
    checkStrictly: { type: Boolean, default: false }, // 是否严格的遵守父子节点不互相关联
    expandTrigger: { type: String, default: 'click' }, // click / hover
    propsValue: { type: String, default: '' }, // 绑定的字段值
    propsLabel: { type: String, default: '' }, // 绑定的文本
    props: { type: Object, default() {
      return {}
    } },
    size: { type: String, default: 'mini' }, // 可选值：medium / small / mini
    filterable: { type: Boolean, default: false }, // 搜索功能
    placeholder: { type: String, default: '选择' }, // 输入框占位文本
    separator: { type: String, default: '/' }, // 选项分隔符
    showAllLevels: { type: Boolean, default: false }, // 输入框中是否显示选中值的完整路径
    selectStyle: { type: String, default: 'width:100%' }, // 样式
    // showRootNode: { type: Boolean, default: false }, // 是否显示根节点
    dataMode: { type: Number, default: 0 } // 数据默认显示方式 0：全部显示，1：根据自己的权限显示
  },
  data() {
    return {
      valueType: 'number'
    }
  },
  computed: {
    myOptions() {
      const options = JSON.parse(JSON.stringify(this.options))
      this.transfOptions(options)
      return options
    },
    propsData() {
      const defaultConfig = {
        expandTrigge: 'click', // 触发方式 click hover
        multiple: false, // 是否多选
        checkStrictly: false, // 是否严格的遵守父子节点不互相关联
        emitPath: true, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置false，则只返回该节点的值
        lazy: false, //	是否动态加载子节点，需与 lazyLoad 方法结合使用
        lazyLoad: (node, resolve) => { resolve }, // 加载动态数据的方法，仅在 lazy 为 true 时有效 ---- function(node, resolve)，node为当前点击的节点，resolve为数据加载完成的回调(必须调用)
        value: 'value', // 指定选项标签为选项对象的某个属性值
        label: 'name', // 指定选项标签为选项对象的某个属性值
        children: 'children', // 指定选项的子选项为选项对象的某个属性值
        disabled: 'disabled', // 指定选项标签为选项对象的某个属性值
        leaf: 'leaf' // 指定选项的叶子节点的标志位为选项对象的某个属性值
      }
      const { multiple, checkStrictly, expandTrigger, propsValue, propsLabel } = this
      const props = {
        ...defaultConfig,
        ...this.props,
        multiple,
        checkStrictly,
        expandTrigger,
        value: propsValue || defaultConfig.value,
        label: propsLabel || defaultConfig.label
      }
      return props
    },
    modelValue: {
      get() {
        if (this.selectValue || (this.selectValue === 0 || this.selectValue === '0')) {
          return this.findAllNodeParents(this.selectValue, this.myOptions)
        } else {
          return []
        }
      },
      set(val) {
        let value = val
        if (this.multiple) {
          // 多选
          value = value.map(m => {
            return this.valueType === 'number' ? Number(m[m.length - 1]) : m[m.length - 1]
          })
          this.$emit('change', value)
        } else {
          // 单选
          value = this.valueType === 'number' ? Number(value[value.length - 1]) : value[value.length - 1]
          this.$emit('change', value)
        }
      }
    }
  },
  created() {

  },
  methods: {
    /**
     * @description: 将optons所有value值转换成string类型
     */
    transfOptions(options) {
      const { value, children } = this.propsData
      if (Array.isArray(options)) {
        options.forEach(e => {
          this.valueType = typeof e[value]
          this.$set(e, value, e[value].toString())
          if (e[children]) {
            this.transfOptions(e[children])
          }
        })
      }
    },
    /**
     * @description: 找到子节点数组的所有父节点
     */
    findAllNodeParents(nodes, options) {
      if (Array.isArray(nodes)) {
        return nodes.map(node => {
          return this.findNodeParents(node, options)
        })
      } else {
        return this.findNodeParents(nodes, options)
      }
    },
    /**
     * @description: 根据子节点找其所有父节点
     * @param {*} arr
     */
    findNodeParents(node, options) {
      const { value, children } = this.propsData
      if (Array.isArray(options)) {
        const len = options.length
        for (let i = 0; i < len; i++) {
          const e = options[i]
          if (e[value].toString() === node.toString()) {
            return [node.toString()]
          } else if (e[children]) {
            const data = this.findNodeParents(node, e[children])
            if (data.length) {
              data.unshift(e.value)
              return data
            }
          }
        }
      }
      return []
    }
  }
}
</script>
<style scoped>

</style>
