<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadImageAction"
      :data="{dic:'avatar'}"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      accept="image/gif, image/jpeg"
    >
      <img v-if="avatar" :src="avatar" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-button type="primary" size="mini" @click="save">保存</el-button>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'UpImage', // 上传图片
  data() {
    return {
      uploadImageAction: process.env.VUE_APP_BASE_API + '/api/RSGL/person/uploadAvatar',
      avatar: '',
      resourceId: null,
      file: null
    }
  },
  computed: {
    headers() {
      return { Authorization: getToken() }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.avatar = URL.createObjectURL(file.raw) // 作显示的
      this.resourceId = res.data // 保存数据库的值
    },
    beforeAvatarUpload(file) {
      const _this = this
      return new Promise((resolve, reject) => {
        const isLt2M = file.size / 1024 / 1024 < 10 // 判定图片大小是否小于10MB
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
          reject()
        }
        const image = new Image()
        let resultBlob = ''
        image.src = URL.createObjectURL(file)
        image.onload = () => {
          // 调用方法获取blob格式，方法写在下边
          resultBlob = _this.compressUpload(image, file)
          resolve(resultBlob)
        }
        image.onerror = () => {
          reject()
        }
      })
    },
    compressUpload(image, file) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      // const initSize = image.src.length
      const { width } = image
      const { height } = image
      canvas.width = width
      canvas.height = height
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, width, height)

      // 进行最小压缩0.1
      const compressData = canvas.toDataURL(file.type || 'image/jpeg', 0.5)

      // 压缩后调用方法进行base64转Blob，方法写在下边
      const blobImg = this.dataURItoBlob(compressData)
      return blobImg
    },
    dataURItoBlob(data) {
      let byteString
      if (data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(data.split(',')[1])
      } else {
        byteString = unescape(data.split(',')[1])
      }
      const mimeString = data
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]
      const ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], { type: mimeString })
    },
    save() {
      this.$emit('dialogClose', this.avatar)
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-checkbox-group {
  width: 800px;
}
</style>
