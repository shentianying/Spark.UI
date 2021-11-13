<template>
  <el-row style="margin-top:40px;">
    <el-col :span="8" :offset="8">
      <el-alert
        title="提示"
        type="error"
        :closable="false"
        description="您没有权限访问"
        show-icon
      />
      <p style="text-align:center;">
        <el-button size="mini" type="primary" @click="toIndex">返回首页</el-button>
      </p>

    </el-col>
  </el-row>

</template>

<script>

export default {
  name: 'Page404',
  methods: {
    toIndex() {
      location.href = ''
    }
  }

}
</script>

<style scoped>

</style>
