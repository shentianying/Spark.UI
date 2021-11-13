<template>
  <div>
    <el-row>
      <el-col :span="6" />
      <el-col :span="6" />
      <el-col :span="6" />
    </el-row>
    <h1>提示：{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Transfer',
  data() {
    return {
      msg: ''
    }
  },
  watch: {
  },
  created() {
    // 参数 格式 id+3个随机数字
    // console.log('接收到的参数：', this.$route.query.id)
    const queryId = this.$route.query.id
    if (queryId) {
      this.msg = '跳转中....'
      const msgId = queryId.substring(0, queryId.length - 3)
      const str = queryId.substring(queryId.length - 3)

      this.$store.dispatch('user/checkMessage', { id: msgId, str: str }).then((obj) => {
        const { pageId, billId, billFlowId } = obj
        this.$router.push({ name: 'Dashboard', params: { pageId: pageId, billId: billId, billFlowId: billFlowId }})
      }).catch((error) => {
        this.$message.info(error)
      })
    }
    if (this.$route.query.msg !== '') {
      this.msg = this.$route.query.msg
    }
  },
  methods: {
  }
}
</script>
