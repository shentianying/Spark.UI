<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" :lazy="true" @tab-click="setSelected">
      <el-tab-pane :label="tabsInfo[0].label" :name="tabsInfo[0].name">
        <role-edit v-if="tabsInfo[0].selected" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[1].label" :name="tabsInfo[1].name">
        <role-permit v-if="tabsInfo[1].selected" :role-ids="this.$route.query.id.toString()" />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import RolePermit from './component/rolePermit'
import RoleEdit from './component/roleEdit'
export default {
  name: 'RoleFrame',
  components: {
    RolePermit,
    RoleEdit
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeTab: 'edit',
      tabsInfo: [
        { name: 'edit', selected: false, label: '编辑' },
        { name: 'rolePermit', selected: false, label: '角色权限设置' }
      ]
    }
  },
  created() {
    if (this.$route.query.tab) {
      // 根据参数选中标签
      const tabsName = this.$route.query.tab
      this.activeTab = tabsName
      // 加载对应子组件
      var item = this.tabsInfo.find(f => f.name === tabsName)
      item.selected = true
    } else {
      // 没参数显示默认的选项
      this.tabsInfo[0].selected = true
    }
  },
  mounted() {
    // this.initData()
  },
  methods: {
    // 解决 一次打开 多个选项卡一次性 加载 所有数据的问题
    setSelected(tag) {
      this.tabsInfo[Number(tag.index)].selected = true
    }
  }
}
</script>
