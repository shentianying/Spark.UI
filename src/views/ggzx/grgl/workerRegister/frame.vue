<template>
  <div />
</template>

<script>
import store from '@/store'
export default {
  name: 'WorkerRegisterFrame',
  created() {
    if (this.$route.params.type) {
      var t = this.$route.params.type
      store.dispatch('tagsView/delView', this.$router.history.current) // 关闭跳转窗口
      const queryId = this.$route.query.id
      const queryRefresh = this.$route.query.refreshRouterName
      const paramsId = this.$route.params.id
      if (t === 1) { // 1:跳转到审批页面
        this.$router.replace({ name: 'WorkerRegisterAttitude', query: { id: queryId, refreshRouterName: queryRefresh }, params: { id: paramsId }})
      } else if (t === 2) { // 2: 跳转列表
        this.$router.replace({ name: 'WorkerRegister' })
      } else if (t === 3) { // 3：跳转到编辑页面
        this.$router.replace({ name: 'WorkerRegisterEdit', query: { id: queryId, refreshRouterName: queryRefresh }, params: { id: paramsId }})
      }
      // this.isLoad = true
    }
  }
}
</script>
