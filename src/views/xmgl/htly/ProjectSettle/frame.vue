<script>
export default {
  name: 'ProjectSettleFrame',
  created() {
    const { type: t, id: paramsId } = this.$route.params
    if (t) {
      const { $store } = this
      const { id: queryId, refreshRouterName: queryRefresh } = this.$route.query
      $store.dispatch('tagsView/delView', this.$router.history.current) // 关闭跳转窗口
      if (t === 1) { // 1:跳转到明细页面
        this.$router.replace({ name: 'ProjectSettleDetails', query: { id: queryId, refreshRouterName: queryRefresh }, params: { id: paramsId }})
      } else if (t === 2) { // 2: 跳转列表
        this.$router.replace({ name: 'ProjectSettleIndex' })
      } else if (t === 3) {
        this.comName = 'PlanEdit'
      }
    }
  },
  render() {
    return '<div />'
  }
}
</script>
