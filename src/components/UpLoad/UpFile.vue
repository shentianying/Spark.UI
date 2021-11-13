<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="postUrl"
      :multiple="false"
      :disabled="!isUpfile"
      :headers="headers"
      :data="postData"
      :show-file-list="showFileList"
      :accept="accept"
      :file-list="fileList"
      :limit="limit"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-progress="handleProgress"
    >
      <el-link v-if="isUpfile" slot="trigger">点击上传</el-link>
      <!-- <el-button v-if="isUpfile" slot="trigger" style="display:inline;" size="mini" type="primary">点击上传</el-button> -->
      <!-- <el-button v-if="mode===1" style="margin-left: 10px;" size="small" type="success" @click="ShowRenameDialog">重命名</el-button> -->
      <div v-if="isUpfile" slot="tip" class="el-upload__tip"><slot /><b>【{{ limit? "最多上传" + limit + "个，" : "" }}文件限制{{ fileSize }}MB】</b></div>
      <div>
        <table class="tableStyle">
          <tr v-for="(item,index) in fileList" :key="index">
            <td>
              <el-link @click="filenameClick(item)">{{ (index+1) }}、<svg-icon :icon-class="getFileIcon(item.fileName)" style="font-size: large;" /> {{ item.fileName }}({{ item.fileSize | fileSize }})</el-link>
            </td>
            <td>
              <el-tooltip v-if="isPreview" :style="canPreview(item)?'':'visibility:hidden'" class="item" effect="dark" content="预览" placement="top-start">
                <el-link @click="preview(item)"><i class="el-icon-view" /></el-link>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="下载" placement="top-start">
                <el-link v-if="isDownload" class="mLeft10" type="primary" @click="download(item)"><i class="el-icon-download" /></el-link>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-link v-if="isDelete" class="mLeft10" type="danger" @click="deleteFile(item,index)"><i class="el-icon-close" /></el-link>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="重命名" placement="top-start">
                <el-link v-if="isRename" class="mLeft10" type="info" @click="rename(item)"><i class="el-icon-edit-outline" /></el-link>
              </el-tooltip>
            </td>
          </tr>
        </table>
      </div>
      <el-progress v-show="showProgress" :percentage="percentage" />
    </el-upload>

    <!--图片显示-->
    <div v-if="dialogImageVisible">
      <el-dialog
        title="图片预览"
        :destroy-on-close="true"
        style="text-align:center;"
        :append-to-body="true"
        :visible.sync="dialogImageVisible"
      >
        <el-image
          :src="imageUrl"
          :preview-src-list="[imageUrl]"
        />
      </el-dialog>
    </div>
    <!--PDF 预览-->
    <div>
      <el-dialog
        title="PDF 预览"
        :visible.sync="viewVisible"
        width="80%"
        :append-to-body="true"
        center
        @close="closeDialog"
      >
        <div style="margin-bottom: 15px; text-align: right;">
          <el-button type="primary" size="small" @click.stop="previousPage">
            上一页
          </el-button>
          <el-button type="primary" size="small" @click.stop="nextPage">
            下一页
          </el-button>
          <span>当前第{{ pdfPage }}页 / 共{{ pageCount }}页</span>
          <!-- 共{{ pageCount }}页 -->
        </div>
        <div>
          <pdf
            :src="pdfSrc"
            :page="pdfPage"
            style="display: inline-block; width: 100%"
            @num-pages="pageCount = $event"
            @page-loaded="pdfPage = $event"
          />
          <!-- <pdf
            v-for="i in pageCount"
            ref="pdf"
            :key="i"
            :src="pdfSrc"
            :page="i"
          /> -->
        </div>
        <div style="margin-bottom: 15px; text-align: right;">
          <el-button type="primary" size="small" @click.stop="previousPage">
            上一页
          </el-button>
          <el-button type="primary" size="small" @click.stop="nextPage">
            下一页
          </el-button>
          <span>当前第{{ pdfPage }}页 / 共{{ pageCount }}页</span>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        title="重命名"
        :visible.sync="renameDialog"
        @close="closeRenameDialog"
      >
        <el-input v-model.trim="newValue" style="width:200px;" maxlength="50" />
        {{ extension }}
        <el-button type="primary" :loading="buttonLoading" size="mini" @click="renameSave">保存</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getFile, putFileName } from '@/api/xtgl/upfile'
import svgIcons from '@/utils/svg-icons'
// import Rename from './Rename'
import pdf from 'vue-pdf'
// 上传文件组件
export default {
  name: 'UpFile',
  components: {
    pdf
    // Rename
  },
  model: {
    prop: 'fileList', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    limit: { type: Number, default: null }, // 上传数量
    fileSize: { type: Number, default: 10 }, // 上传大小
    accept: { type: String, default: 'image/*,.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar, .pdf, .dwg, .txt' }, // 上传类型
    postData: { type: Object, default: () => { return { } } }, // 上传参数{}
    showFileList: { type: Boolean, default: false }, // 是否显示文件列表
    fileList: { type: [String, Number, Array], default: null }, // 文件数据
    mode: { type: Number, default: 0 }, // 0：查看，1：编辑
    isPreview: { type: Boolean, default: true }, // 是否预览
    isDownload: { type: Boolean, default: true }, // 是否下载
    isDelete: { type: Boolean, default: false }, // 是否删除
    isRename: { type: Boolean, default: false }, // 是否重命名
    isUpfile: { type: Boolean, default: false } // 是否显示上传按钮
  },
  data() {
    var path = process.env.VUE_APP_BASE_API
    path = path + (path.slice(-1) === '/' ? '' : '/') + 'api/xtgl/upfile/upLoadFile'
    return {
      postUrl: path,
      imageUrl: '',
      dialogTitle: '信息',
      dialogImageVisible: false,

      showProgress: false,
      percentage: 0,

      // PDF预览
      viewVisible: false,
      pdfSrc: null,
      pdfPage: 1,
      pageCount: 0,

      // viewVisible2: false,
      newValue: '',
      buttonLoading: false,
      renameDialog: false,
      extension: '',
      renameObj: '',
      svgIcons
    }
  },
  computed: {
    headers() {
      return { Authorization: getToken() }
    }
  },
  created() {
    // console.log('输出fileList:', this.fileList)
  },
  methods: {
    handleSuccess(response, file, fileList) {
      // name:上传文件显示的名称 id:编号  addFlag:是否是新添加的
      this.$emit('change', [...this.fileList, { fileName: file.name, id: response.data, fileSize: file.size, addFlag: true }])
      // this.fileList.push({ fileName: file.name, id: response.data, fileSize: file.size, addFlag: true })
      // console.log('handleSuccess：', response, file, fileList)
    },
    // handleExceed(files, fileList) {
    //   console.log('handleExceed')
    // },
    beforeUpload(file) {
      // console.log('beforeUpload:', file)
      return new Promise((resolve, reject) => {
        const isLt2M = file.size / 1024 / 1024 < this.fileSize // 判定图片大小是否小于10MB
        if (!isLt2M) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB!`)
          reject()
        }
        resolve()
      })
    },
    // beforeRemove(file, fileList) {
    //   // 加个判断，因为上传 判断文件大小 返回false 或者返回 reject 会触发当前的钩子，status为 ready
    //   if (file && file.status === 'success') {
    //     // 编辑模式才能删除
    //     if (this.mode === 1) {
    //       this.fileList.splice(this.fileList.findIndex(item => item.id === file.id), 1)
    //     } else {
    //       return false
    //     }
    //   }
    //   console.log('触发beforeRemove：file:', file)
    // },
    handleProgress(event, file, fileList) {
      // console.log('event:', event, file, fileList)
      this.showProgress = true
      this.percentage = event.percent
      if (event.percent === 100) {
        this.showProgress = false
        this.percentage = 0
      }
    },
    // handlePreview(file) {
    // },
    // handleError(err, file, fileList) {
    //   console.log('handleError：', err, file, fileList)
    // },
    // handleChange(file, fileList) {
    //   console.log('handleChange：', file, fileList)
    // },
    // PDF预览
    closeDialog() {
      this.pdfPage = 1
    },

    // PDF改变页数
    previousPage() {
      var p = this.pdfPage
      p = p > 1 ? p - 1 : this.pageCount
      this.pdfPage = p
    },
    nextPage() {
      var p = this.pdfPage
      p = p < this.pageCount ? p + 1 : 1
      this.pdfPage = p
    },
    // 根据后台返回的数据流，创建文件url地址
    GetObjectUrl(mime, res) {
      var blob = null
      if (mime === '.zip') {
        blob = new Blob([res], { type: 'application/zip' })
      } else if (mime === '.doc' || mime === '.docx') {
        blob = new Blob([res], { type: 'application/msword' })
      } else if (mime === '.ppt' || mime === '.pptx') {
        blob = new Blob([res], { type: 'application/vnd.ms-powerpoint' })
      } else if (mime === '.xls' || mime === '.xlsx') {
        blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      } else {
        blob = new Blob([res])
      }
      return window.URL.createObjectURL(blob)
    },
    // ShowRenameDialog() {
    //   this.viewVisible2 = true
    // },
    getFile(file, type) {
      // type :0 查看 ，1 下载
      var imgPrefix = ['.jpg', '.jpeg', '.png', '.gif'] // 图片类型
      const prefix = file.fileName.substring(file.fileName.lastIndexOf('.')).toLowerCase() // 获取文件后缀
      // 根据文件类型选择不同的预览方式
      getFile({ id: file.id, addFlag: file.addFlag }).then(response => {
        // console.log('返回流类型：', response)
        // 创建文件地址
        var blobUrl = this.GetObjectUrl(prefix, response)
        if (type === 0) {
        // 图片的 接收方法
          if (imgPrefix.includes(prefix)) {
            this.imageUrl = blobUrl
            this.dialogImageVisible = true
          } else if (prefix === '.pdf') {
            this.pdfSrc = pdf.createLoadingTask(blobUrl)
            // this.pdfSrc.promise.then(pdf => {
            //   console.log('pdf的属性:', pdf)
            //   this.pageCount = pdf.numPages
            // }).catch(err => {
            //   console.error('pdf 加载失败', err)
            // })
            this.viewVisible = true
          } else {
            this.$message.info('只支持图片、pdf查看')
            return false
          }
        } else if (type === 1) {
          // excel ppt word 之类格式的文件，不支持显示，只提供下载
          const eleLink = document.createElement('a')
          eleLink.download = file.fileName
          eleLink.style.display = 'none'
          eleLink.href = blobUrl
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
        } else {
          this.$message.info('类型错误')
        }
      }).catch(() => {
        this.$message.error('文件读取错误')
      })
    },
    canPreview(file) {
      var prefix = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'] // 可预览类型
      return prefix.includes(
        file.fileName.substring(file.fileName.lastIndexOf('.')).toLowerCase())
    },
    filenameClick(file) {
      if (this.canPreview(file)) {
        if (this.isPreview) this.getFile(file, 0)
        else if (this.isDownload) this.getFile(file, 1)
      } else {
        if (this.isDownload) this.getFile(file, 1)
      }
    },
    preview(file) {
      if (file.fileName.lastIndexOf('.') <= 0) {
        this.$message.info('无效的文件')
        return
      }
      this.getFile(file, 0)
    },
    download(file) {
      this.getFile(file, 1)
    },
    deleteFile(file, index) {
      this.fileList.splice(index, 1)
    },
    rename(file) {
      this.renameDialog = true
      const lastIndex = file.fileName.lastIndexOf('.')
      if (lastIndex <= 0) {
        this.$message.info('文件名格式错误')
        return
      }
      this.newValue = file.fileName.substring(0, lastIndex)
      this.extension = file.fileName.substring(lastIndex)
      this.selectObj = file
    },
    renameSave() {
      if (this.newValue === '') {
        this.$message.info('不能为空')
        return
      }
      const newName = this.newValue + this.extension
      var postData = { id: this.selectObj.id, newName: newName, addFlag: this.selectObj.addFlag }
      // 修改后端的文件名
      this.buttonLoading = true
      putFileName(postData).then(response => {
        this.$message.info(response)
        // 修改前端 的文件名
        this.selectObj.name = newName
        this.renameDialog = false // 关闭
        this.buttonLoading = false
        this.$message.info(response.message)
      })
    },
    closeRenameDialog() {
      this.renameDialog = false
    },
    getFileIcon(fileName) {
      const prefix = fileName.substring(fileName.lastIndexOf('.')).toLowerCase() // 获取文件后缀
      var svg = 'form'
      switch (prefix) {
        case '.jpg': case '.jpeg': case '.png': case '.gif': case '.bmp': // 图片类型
          svg = 'image'
          break
        case '.pdf':
          svg = 'pdf'
          break
        case '.txt':
          svg = 'txt'
          break
        case '.doc': case '.docx':
          svg = 'word'
          break
        case '.ppt': case '.pptx':
          svg = 'ppt'
          break
        case '.xls': case '.xlsx':
          svg = 'excel'
          break
        case '.rar': case '.zip': case '.7z':
          svg = 'rar'
          break
        case '.dwg':
          svg = 'cad'
          break
        default:
          break
      }
      return svg
    }

  }
}
</script>
<style scoped>
.avatar-uploader >>> .el-upload{ display: inline; border:none;}
.mLeft10{ margin-left: 10px;}
.tableStyle{width:100%;border:0px;text-align:left}
.tableStyle td{ height:30px;}
</style>
