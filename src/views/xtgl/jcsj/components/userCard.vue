<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <!-- <div style="text-align:center;">
        <el-avatar v-if="avatarSrc" :src="avatarSrc" />
        <el-avatar v-else>admin</el-avatar>
        <el-link type="primary" @click="dialogTableVisible=true">上传头像</el-link>
      </div>
      <div style="text-align:center;">
        <div>工号：1111</div>
        <div>角色:2222</div>
      </div> -->
    </div>
    <div v-if="dialogTableVisible">
      <el-dialog
        title="上传头像"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
      >
        <component :is="comName" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import UpLoadImage from '@/components/UpLoad/Image'
export default {
  name: 'UserCard',
  components: {
    UpLoadImage
  },
  props: {
  },
  data() {
    return {
      dialogTableVisible: false,
      comName: 'UpLoadImage',
      avatarSrc: null
    }
  },
  methods: {
    dialogClose(postAvatar) {
      this.dialogTableVisible = false
      this.avatarSrc = postAvatar
    }
  }
}
</script>
