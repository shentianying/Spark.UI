<template>
  <!-- 级联树形 -->
  <el-cascader
    v-model="modelValue"
    class="OrgSelect"
    :options="list"
    :props="props"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :separator="separator"
    :collapse-tags="collapseTags"
    :show-all-levels="false"
    :style="selectStyle"
  />
</template>
<script>
/**
 * 基于@components/OrgSelect/index2.vue的修改
 * 由于原组件双向绑定方式的问题，导致在其父组件修改prop时不能更新到组件内，故在这里再做修改
 */
import { getCurrentUserOrg } from '@/api/xtgl/role'
import { toTree, getTree, findPNode } from '@/utils/index'

export default {
  name: 'OrgSelect',
  components: {
  },

  model: {
    prop: 'selectValue', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    selectValue: { type: [String, Number, Array], default: null }, // 获取你选中的值，传出去的v-model的值
    // 组件参数
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    collapseTags: { type: Boolean, default: true }, // 已选中的选项的Tag，是否折叠显示
    multiple: { type: Boolean, default: false },
    checkStrictly: { type: Boolean, default: true }, // 是否严格的遵守父子节点不互相关联
    expandTrigger: { type: String, default: 'click' }, // click / hover
    propsValue: { type: String, default: 'id' }, // 绑定的字段值
    propsLabel: { type: String, default: 'name' }, // 绑定的文本
    size: { type: String, default: 'mini' }, // 可选值：medium / small / mini
    filterable: { type: Boolean, default: false }, // 搜索功能
    placeholder: { type: String, default: '选择' }, // 输入框占位文本
    separator: { type: String, default: '/' }, // 选项分隔符
    showAllLevels: { type: Boolean, default: false }, // 输入框中是否显示选中值的完整路径
    options: { type: Array, default: null }, // 可选项数据源，键名可通过 Props 属性配置
    selectStyle: { type: String, default: '' }, // 样式
    // showRootNode: { type: Boolean, default: false }, // 是否显示根节点
    dataMode: { type: Number, default: 0 } // 数据默认显示方式 0：全部显示，1：根据自己的权限显示
  },
  data() {
    return {
      list: [],
      props: {
        expandTrigge: 'click', // 触发方式 click hover
        multiple: false, // 是否多选
        checkStrictly: false, // 是否严格的遵守父子节点不互相关联
        emitPath: true, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置false，则只返回该节点的值
        lazy: false, //	是否动态加载子节点，需与 lazyLoad 方法结合使用
        lazyLoad: (node, resolve) => { resolve }, // 加载动态数据的方法，仅在 lazy 为 true 时有效 ---- function(node, resolve)，node为当前点击的节点，resolve为数据加载完成的回调(必须调用)
        value: 'id', // 指定选项标签为选项对象的某个属性值
        label: 'name', // 指定选项标签为选项对象的某个属性值
        children: 'children', // 指定选项的子选项为选项对象的某个属性值
        disabled: 'disabled', // 指定选项标签为选项对象的某个属性值
        leaf: 'leaf' // 指定选项的叶子节点的标志位为选项对象的某个属性值
      },
      orgList: [],
      rootNode: [{ id: 0, pid: 0, name: '根节点', value: 0 }] // 根节点
    }
  },
  computed: {
    modelValue: {
      get() {
        // console.log(this.filterParentNodes(this.selectValue))
        return this.filterParentNodes(this.selectValue)
      },
      set(val) {
        const value = val || []
        if (this.multiple) {
          // 多选
          this.$emit('change', value.map(m => { return m[m.length - 1] }))
        } else {
          // 单选
          this.$emit('change', value[value.length - 1])
        }
      }
    }
  },
  created() {
    this.props.multiple = this.multiple
    this.props.checkStrictly = this.checkStrictly
    this.props.expandTrigger = this.expandTrigger
    this.props.value = this.propsValue
    this.props.label = this.propsLabel
  },
  mounted() {
    if (Array.isArray(this.options) && this.options.length) {
      this.orgList = this.options
      this.list = getTree(0, [...this.orgList])
    } else {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      getCurrentUserOrg().then(response => {
        const { data, currentOrgList } = response
        this.orgList = currentOrgList // 当前公司的所有组织机构list
        if (!data) return
        if (this.dataMode === 0) {
          const newList = currentOrgList.map(v => {
            return {
              ...v,
              disabled: !v.optional
            }
          })
          this.list = toTree(newList)
        } else if (this.dataMode === 1) {
          var org = this.processData([...data], currentOrgList)
          this.list = toTree(org)
        }
      })
    },
    // 根据 arr 找到每项所有对应的所有父节点的数组 =>匹配组件数据格式 如：arr=[19] 返回 [[2, 3, 8, 19]]
    filterParentNodes(arr) {
      if (!this.multiple) { arr = [arr] }
      var result = []
      // console.log('2执行这里:forEach', this.options)
      arr.forEach(e => {
        const idArr = findPNode(this.orgList, e).map(m => { return m.id }).reverse()
        if (this.multiple) {
          if (idArr.length > 0) { result.push(idArr) }
        } else { result = idArr }
      })
      return result
    },
    // toTree(data) {
    //   const result = []
    //   if (!Array.isArray(data)) {
    //     return result
    //   }
    //   data.forEach(item => {
    //     delete item.children
    //   })
    //   const map = {}
    //   data.forEach(item => {
    //     map[item.id] = item
    //   })
    //   data.forEach(item => {
    //     const parent = map[item.pid]
    //     if (parent) {
    //       (parent.children || (parent.children = [])).push(item)
    //     } else {
    //       result.push(item)
    //     }
    //   })
    //   return result
    // },
    // getChildrenNodes(data, arr) {
    //   if (data.children) {
    //     data.children.forEach(element => {
    //       arr.push(element.id)
    //       if (element.children) {
    //         this.getChildrenNodes(element, arr)
    //       }
    //     })
    //   }
    //   return arr
    // },
    processData(userOrgList, currentOrgList) {
      // console.log('1执行这里:forEach', this.options)
      currentOrgList.forEach(e => {
        e.disabled = !userOrgList.find(f => f.id === e.id && e.optional)
      })
      return currentOrgList
    }
  }
}
</script>
<style lang="scss" scoped>
//由于filterable开启时，高度会于普通输入框不一致，故这里做穿透，保证所有输入框样式一致。
.OrgSelect{
  width:100%
  /* /deep/.el-cascader__tags{
    align-items: center;
  }
  /deep/.el-input--mini .el-input__inner{
    height: 28px !important;
  } */
}

</style>
