<template>
  <!--准备弃用的组件-->
  <treeselect
    v-model="modelValue"
    placeholder="请选择"
    :multiple="multiple"
    :searchable="searchable"
    :disabled="disabled"
    :clearable="clearable"
    :default-expand-level="1"
    :flat="flat"
    :value-consists-of="valueConsistsOf"
    :options="list"
    :max-height="maxHeight"
    :open-on-focus="false"
    :open-on-click="true"
    :append-to-body="false"
    :always-open="false"
    :join-values="false"
    :style="selectStyle"
  />
</template>
<script>
import { getOrganizationList } from '@/api/xtgl/organization'

import Treeselect from '@riophae/vue-treeselect'
import { getTree } from '@/utils/index'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'TreeselectComponent',
  components: {
    Treeselect
  },
  model: {
    prop: 'selectValue', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    // 插件官网： https://www.vue-treeselect.cn/
    searchable: { type: Boolean, default: true },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    maxHeight: { type: Number, default: 200 },
    flat: { type: Boolean, default: false },
    valueConsistsOf: { type: String, default: 'BRANCH_PRIORITY' }, // 1.BRANCH_PRIORITY 默认分支节点 2.LEAF_PRIORITY 值是 叶子节点 数组 3.All 所有节点 4.ALL_WITH_INDETERMINATE
    selectValue: { type: [String, Number, Array], default: null }, // 获取你选中的值，传出去的v-model的值
    treeData: { type: Array, default: null }, // 传进来的初始化数据
    selectData: { type: [String, Number, Array], default: null }, // 初始化选中的数据
    selectStyle: { type: String, default: 'width:100%' }, // 选择css样式
    showRootNode: { type: Boolean, default: false }, // 是否显示根节点
    dataMode: { type: Number, default: 0 } // treeData传进来的数据就无效 0：全部显示，1：根据自己的权限显示
  },
  data() {
    return {
      modelValue: null,
      list: [],
      listTemp: [], //  临时变量
      allOrgList: [],
      rootNode: [{ id: 0, pid: 0, label: '根节点' }] // 根节点
    }
  },
  watch: {
    modelValue(value) {
      this.$emit('change', value)
    }
  },
  mounted() {
    // console.log('树形数据1 treeData:', this.treeData)
    // console.log('下拉组件 selectData:', this.selectData)
    if (this.selectData) {
      // console.log('下拉组件 selectData:', this.selectData)
      this.modelValue = this.selectData
    }
    if (this.treeData) {
      this.list = getTree(0, this.treeData)
      console.log('this.list:', this.list)
      this.addRootNode()
    } else {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      getOrganizationList().then(response => {
        const { data } = response
        this.allOrgList = data
        data.forEach(ele => {
          ele.label = ele.name
        })

        if (this.dataMode === 0) { // *******************0**********************
          // 绑定全部的组织机构数据
          this.list = getTree(0, data).filter(f => f.id === this.$store.state.user.selectOrgId)
        } else if (this.dataMode === 1) { // *******************1**********************
          // 根据自己的权限来显示数据
          const userOrgList = this.$store.state.user.info.userOrgList
          const selectOrgId = this.$store.state.user.selectOrgId
          var orgIds = userOrgList.filter(f => f.companyId === selectOrgId).map(m => { return m.organizationId })
          // console.log('orgIds:', orgIds)
          let arr1 = []
          orgIds.forEach(orgId => {
            var temp2 = getTree(orgId, data) // 根据orgid 获取组织机构树形
            // console.log('temp2:', temp2)
            // 有叶子节点,说明当前节点是父级
            if (temp2.length) {
              var leafNodes = this.getChildrenNodes({ children: temp2 }, [])
              // 添加 子节点
              arr1 = [...arr1, ...this.allOrgList.filter(f => leafNodes.includes(f.id))]
            }
            // 添加 父节点
            arr1.push(this.allOrgList.find(f => f.id === orgId))
          })
          // console.log('当前arr1:', arr1)
          this.list = this.toTree(arr1)
        }
        this.addRootNode()
      })
    },
    toTree(data) {
      const result = []
      if (!Array.isArray(data)) {
        return result
      }
      data.forEach(item => {
        delete item.children
      })
      const map = {}
      data.forEach(item => {
        map[item.id] = item
      })
      data.forEach(item => {
        const parent = map[item.pid]
        if (parent) {
          (parent.children || (parent.children = [])).push(item)
        } else {
          result.push(item)
        }
      })
      return result
    },
    getChildrenNodes(data, arr) {
      if (data.children) {
        data.children.forEach(element => {
          arr.push(element.id)
          if (element.children) {
            this.getChildrenNodes(element, arr)
          }
        })
      }
      return arr
    },
    addRootNode() {
      // 添加根节点
      if (this.showRootNode) {
        // 根节点下面有数据，就添加children
        // if (this.listTemp.length) { this.rootNode[0].children = this.listTemp }
        this.rootNode[0].children = this.list
        // 没数据，就只显示一个根节点
        this.list = this.rootNode
      }
    }

  }
}
</script>
<style>
/* .vue-treeselect >>> .vue-treeselect__control{
    font-size: 14px;
    height: 28px;
    line-height: 28px;
}
.vue-treeselect >>> .vue-treeselect__menu-container{
    font-size: 14px;
} */

.vue-treeselect {
  font-size:14px;

}
.vue-treeselect__control{
  height: 28px;
  line-height: 28px;
}
.vue-treeselect__value-container{
  top:-3px;
}
</style>
