<template>
  <div class="app-container">
    <div v-if="this.$route.query.id"><span>工号：</span><span>{{ number }}</span>&nbsp;<span>姓名：</span><span>{{ name }}</span></div>
    <el-tabs v-model="activeTab" tab-position="left" :lazy="true" @tab-click="setSelected">
      <el-tab-pane v-if="this.$route.query.showTag" :label="tabsInfo[0].label" :name="tabsInfo[0].name">
        <user-edit v-if="tabsInfo[0].selected" :id="Number(this.$route.query.id)" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[1].label" :name="tabsInfo[1].name">
        <select-role v-if="tabsInfo[1].selected" :id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[2].label" :name="tabsInfo[2].name">
        <userCheckupOrganization v-if="tabsInfo[2].selected" :id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[3].label" :name="tabsInfo[3].name">
        <user-data-range v-if="tabsInfo[3].selected" :id="this.$route.query.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getPersonById } from '@/api/rsgl/person'
import SelectRole from '@/views/xtgl/qxgl/component/selectRole'
import UserEdit from './components/userEdit'
import UserCheckupOrganization from './components/userCheckupOrganization'
import UserDataRange from './components/userDataRange'
export default {
  name: 'UserFrame',
  components: {
    SelectRole,
    UserEdit,
    UserDataRange,
    UserCheckupOrganization
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      name: '',
      number: '',
      activeTab: 'edit',
      tabsInfo: [
        { name: 'edit', selected: false, label: '用户信息' },
        { name: 'userRole', selected: false, label: '用户权限' },
        { name: 'userOrg', selected: false, label: '用户审核范围' },
        { name: 'userDataRang', selected: false, label: '用户数据范围' }
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
      console.log('添加')
      // 没参数显示默认的选项
      this.tabsInfo[0].selected = true
    }
  },
  activated() {
    if (!this.$route.query.tab) {
      // 没参数显示默认的选项
      this.tabsInfo[0].selected = true
    }
    if (this.$route.params.id) {
      getPersonById({ id: this.$route.query.id }).then((response) => {
        const { data } = response
        this.number = data.number
        this.name = data.name
      })

      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
  },
  methods: {
    // 解决 一次打开 多个选项卡一次性 加载 所有数据的问题
    setSelected(tag) {
      // this.tabsInfo[Number(tag.index)].selected = true  //如果有上面或中间不显示的tab，跳转tab时会不显示，index会重新排序
      this.tabsInfo.find(f => f.name === tag.name).selected = true
    }
  }
}
</script>
