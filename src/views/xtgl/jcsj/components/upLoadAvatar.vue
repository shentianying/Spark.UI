<template>
  <el-upload
    class="avatar-uploader"
    :action="uploadImageAction"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    accept="image/gif, image/jpeg"
  >
    <img v-if="avatar" :src="avatar" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
  </el-upload>
</template>

<script>
export default {
  name: 'UpImage', // 上传图片
  data() {
    return {
      uploadImageAction: 'http://aaaa.com/api/EntryForm/UpLoadImage',
      avatar: '',
      avatarTemp: ''
    }
  },
  methods: {
    // 上传文件的方法
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.url !== file.url)
    },
    handlePreview(file) {
      // window.open(file.url);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
    },
    // handleError(err, file, fileList) {
    //   this.$message.error('出错了')
    // },
    handleSuccess(response, file, fileList) {
      this.fileList.push({ name: file.name, url: response })
    },
    handleAvatarSuccess(res, file) {
      this.Avatar = URL.createObjectURL(file.raw) // 作显示的
      this.AvatarTemp = res // 保存数据库的值
    },
    beforeFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt2M
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
    }
  }
}
</script>

<style scoped>
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
