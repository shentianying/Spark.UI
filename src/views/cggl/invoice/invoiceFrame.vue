<template>
  <div />
</template>

<script>
import store from '@/store'
export default {
  name: 'CGInvoiceFrame',
  created() {
    if (this.$route.params.type) {
      var t = this.$route.params.type
      store.dispatch('tagsView/delView', this.$router.history.current) // 关闭跳转窗口
      if (t === 1) { // 1:跳转到明细页面
        const queryId = this.$route.query.id
        const queryRefresh = this.$route.query.refreshRouterName
        const paramsId = this.$route.params.id
        this.$router.replace({ name: 'CGInvoiceAttitude', query: { id: queryId, refreshRouterName: queryRefresh }, params: { id: paramsId }})
      } else if (t === 2) { // 2: 跳转列表
        this.$router.replace({ name: 'CGInvoice' })
      } else if (t === 3) {
        // this.comName = 'PlanEdit'
      }
      // this.isLoad = true
    }
  }
}
</script>
