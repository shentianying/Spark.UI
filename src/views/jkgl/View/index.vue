<template>
  <div class="app-container">
    <div style="padding-bottom:10px;">
      <el-button v-has="'MONITORNODE_ADD'" type="primary" size="mini" @click="addMonitorNode">添加节点</el-button>
    </div>
    <el-container style="height:calc(100vh - 162px);">
      <el-aside width="300px">
        <el-alert
          title="监控点"
          type="success"
          :closable="false"
        />
        <el-input
          v-model="filterText"
          size="mini"
          placeholder="输入关键字进行查找"
        />
        <el-tree
          ref="tree"
          :data="list"
          node-key="id"
          :filter-node-method="filterNode"
          highlight-current
          :expand-on-click-node="false"
          :props="defaultProps"
          :default-expanded-keys="expandIds"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span style="width:100px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis" :title="node.label">{{ data.label }}</span>
            <span v-if="data.isMonitor" style="width:80px;">{{ data.ipAddress }}</span>
            <!-- <span style="width:14px;">
              <i v-if="data.isMonitor" class="el-icon-check" />
              <i v-else class="el-icon-close" /></span> -->
            <span v-else>
              <el-button-group>
                <el-button v-has="'MONITORNODE_EDIT'" type="text" size="mini" icon="el-icon-edit" style="padding:6px;" title="编辑" @click.stop="() => update(data)" />
                <el-button v-has="'MONITORNODE_DELETE'" type="text" icon="el-icon-delete" size="mini" style="padding:6px;" title="删除" @click.stop="() => remove(node, data)" />
              </el-button-group>
            </span>
          </span>
        </el-tree>
      </el-aside>

      <el-main style="padding-top:0px;">
        <el-alert
          :title="'预览 '+ (currentMonitor?currentMonitor.label:'')"
          type="success"
          :closable="false"
        />
        <div id="divPlugin" class="plugin" />

      </el-main>
    </el-container>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        width="70%"
      >
        <component :is="comName" :obj="currentRow" :nodes="checkedNodes" :pid="pid" @addItemclose="addItemClose" @addCategoryClose="addCategoryClose" @addProClose="addProClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { WebVideoCtrl } from '../../../../public/hikvision/webVideoCtrl.js'
import { getMonitorList, getMonitorById, deleteMonitorNode } from '@/api/jkgl/monitor.js'
import AddMonitorNode from './components/addMonitorNode'
import { getTree } from '@/utils/index'

export default {
  name: 'MonitorView',
  components: {
    AddMonitorNode
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',

      tableList: [],
      tableListLoading: false,

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

      currentRow: null,

      currentMonitor: null,
      checkedNodes: [],
      comName: 'AddMonitorNode',
      pid: 0,
      buttonLoading: false,

      expandIds: [],

      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      companyId: this.$store.state.user.selectOrgId,

      hkvInfo: {
        ip: '1.1.1.1', // 海康威视摄像头/硬盘录像机的ip地址
        port: '81', // 海康威视摄像头/硬盘录像机的端口
        username: 'admin', // 海康威视摄像头/硬盘录像机的用户名
        password: 'admin12345', // 海康威视摄像头/硬盘录像机的密码
        channels: [] // 海康威视摄像头/硬盘录像机的通道
      },
      mySelectWnd: 0, // 当前选中的窗口
      g_bPTZAuto: false,
      iProtocol: 1,
      loginLoading: false,
      startPlayLoading: false,
      iStreamType: 1,
      bZeroChannel: false,
      iRtspPort: 0
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getMonitor()
    this.videoInitPlugin() // 初始化video界面
  },
  methods: {
    getMonitor() {
      getMonitorList().then(response => {
        response.data.forEach(element => {
          element.pid = element.pId
          element.label = element.name
          delete element.pId
        })
        this.list = getTree(0, response.data)
        // console.log(this.list)
      })
    },
    addCategoryClose(pid) {
      this.expandIds = [pid]
      this.dialogTableVisible = false
      this.getMonitor()
    },
    addItemClose() {
      this.dialogTableVisible = false
      if (this.currentRow) { this.getProperty(this.currentRow.categoryId) }
      // this.getProperty(this.currentCategory.categoryId)
    },
    addProClose() {
      this.dialogTableVisible = false
      if (this.currentCategory) { this.getProperty(this.currentCategory.id) }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    addMonitorNode() {
      this.dialogTitle = '添加节点'
      this.currentRow = null
      this.pid = 0
      this.comName = 'AddMonitorNode'
      this.dialogTableVisible = true
    },
    remove(node, data) {
      if (node.childNodes.length) {
        this.$message.warning('请先删除下级类别或监控点')
        return
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMonitorNode({ id: data.id }).then(response => {
          this.getMonitor()
          this.$message(response.message)
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    update(data) {
      this.dialogTitle = '监控点名称修改'
      this.comName = 'AddMonitorNode'
      this.currentRow = data
      this.dialogTableVisible = true
    },
    handleNodeClick(data, node) {
      // console.log('node节点信息:', node)
      this.currentRow = null
      if (node.data.isMonitor) {
        this.currentMonitor = data
        this.getMonitorView(data.id)
        this.currentRow = data
      } else {
        // this.$message('必须是三级目录')
        this.currentMonitor = null
        this.tableList = []
      }
    },
    getMonitorView(monitorId) {
      this.tableListLoading = true
      getMonitorById({ id: monitorId }).then(response => {
        this.tableList = response.data
        this.tableListLoading = false
      }).catch(() => { this.tableListLoading = false })
    },
    onLogin() {
      var that = this
      that.loginLoading = true

      // 登录设备
      WebVideoCtrl.I_Login(that.hkvInfo.ip, that.iProtocol, that.hkvInfo.port, that.hkvInfo.username, that.hkvInfo.password, {
        async: false,
        success: function(xmlDoc) {
          // console.log('xmlDoc2', xmlDoc);//不能删除
          // TODO 获取通道信息
          that.getChannelInfo()
          that.getDevicePort(that.hkvInfo.ip + '_' + that.hkvInfo.port)
          that.loginLoading = false

          that.$message({
            showClose: true,
            message: '登录成功',
            type: 'success'
          })
        },
        error: function() {
          that.loginLoading = false
          that.$message({
            showClose: true,
            message: '登录失败',
            type: 'error'
          })
        }
      })
    },
    onLogout() {
      this.hkvInfo.channels = []
      var szDeviceIdentify = this.hkvInfo.ip + '_' + this.hkvInfo.port
      var iRet = WebVideoCtrl.I_Logout(szDeviceIdentify)
      if (iRet === 0) {
        this.$message({
          showClose: true,
          message: '退出成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: '退出失败',
          type: 'error'
        })
      }
    },
    clickStartRealPlay() {
      // 开始预览
      var that = this
      that.startPlayLoading = true
      var szDeviceIdentify = that.hkvInfo.ip + '_' + that.hkvInfo.port

      var j = that.hkvInfo.channels.length > 4 ? 4 : that.hkvInfo.channels.length
      for (var i = 0; i < j; i++) {
        setTimeout(that.startRealPlay(szDeviceIdentify, i, that.hkvInfo.channels[i]), 500)
      }
      that.startPlayLoading = false
    },
    videoInitPlugin: function() {
      var iRet = WebVideoCtrl.I_CheckPluginInstall()
      if (iRet === -1) {
        alert('您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装')
        return
      }
      this.initPlugin()
    },
    initPlugin: function() {
      var that = this

      WebVideoCtrl.I_InitPlugin(500, 300, {
        bWndFull: true, // 是否支持单窗口双击全屏，默I_CheckPluginInstall
        iWndowType: 2,
        myCbSelWnd: function(xmlStr) { // 自己新增的方法
          var jsonObj = that.$x2js.xml2js(xmlStr)
          that.mySelectWnd = jsonObj.RealPlayInfo.SelectWnd
          var szInfo = '当前选择的窗口编号:' + that.mySelectWnd
          console.log(szInfo)
        },
        cbInitPluginComplete: function() {
          WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin')
          // 检查插件是否最新
          if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
            alert('检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级!')
            return
          }
        }
      })
    },
    getDevicePort: function(szDeviceIdentify) {
      var oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify)
      this.iRtspPort = oPort.iRtspPort
    },
    startRealPlay: function(szDeviceIdentify, iWndIndex, iChannelID) {
      var that = this
      WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
        iRtspPort: that.iRtspPort,
        iWndIndex: iWndIndex,
        iStreamType: 1,
        iChannelID: iChannelID,
        bZeroChannel: that.bZeroChannel,
        success: function() {
          that.$notify({
            title: '成功',
            message: '开始预览通道' + iChannelID + '成功',
            type: 'success'
          })
        },
        error: function(status, xmlDoc2) {
          console.log(xmlDoc2) // 不能删除
          that.$notify({
            title: '失败',
            message: '开始预览通道' + iChannelID + '失败',
            type: 'error'
          })
          if (status === 403) {
            console.log('szInfo 设备不支持Websocket取流!')
          } else {
            console.log('开始预览失败 ', status, xmlDoc2)
          }
        }
      })
    },
    clickStopRealPlay: function() {
      var j = this.hkvInfo.channels.length > 4 ? 4 : this.hkvInfo.channels.length
      for (var i = 0; i < j; i++) {
        setTimeout(this.stopRealPlay(i), 1000)
      }
    },
    stopRealPlay: function(iWndIndex) {
      var that = this
      WebVideoCtrl.I_Stop({
        iWndIndex: iWndIndex,
        success: function() {
          that.$notify({
            title: '成功',
            message: '停止预览窗口' + iWndIndex + '成功',
            type: 'success'
          })
        },
        error: function() {
          that.$notify({
            title: '失败',
            message: '停止预览窗口' + iWndIndex + '失败',
            type: 'error'
          })
        }
      })
    },
    // 获取通道，实际上可以根据自己的项目，获取数字通道，模拟通道，零通道中的一个或多个，不用全部获取（提高效率）
    getChannelInfo: function() {
      var that = this
      var szDeviceIdentify = this.hkvInfo.ip + '_' + this.hkvInfo.port
      // debugger
      // 数字通道
      that.hkvInfo.channels = []
      WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
        async: false,
        mysuccess: function(xmlStr) {
          console.log('mysuccess I_GetDigitalChannelInfo: ', xmlStr)
          var jsonObj = that.$x2js.xml2js(xmlStr)
          var list = jsonObj.InputProxyChannelStatusList.InputProxyChannelStatus
          for (var x = 0; x < list.length; x++) {
            that.hkvInfo.channels.push(list[x].id)
          }
        },
        success: function(xmlDoc) {
        },
        error: function(status, xmlDoc) {
          console.log('获取数字通道失败')
        }
      }
      )
      // TODO 模拟通道
      // 模拟通道
      WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
        async: false,
        mysuccess: function(xmlStr) {
          var jsonObj = that.$x2js.xml2js(xmlStr)
          console.log('模拟通道mysuccess', xmlStr)
          // var list = jsonObj.VideoInputChannelList;
          // for (var x = 0; x < list.length; x++) {
          //   that.hkvInfo.channels.push(list[x].VideoInputChannel.id);
          // }
          var id = jsonObj.VideoInputChannelList.VideoInputChannel.id
          that.hkvInfo.channels.push(id)
        },
        success: function(xmlStr) {
          console.log('模拟通道success', xmlStr)
        },
        error: function(status, xmlDoc) {
          console.log('模拟通道error', xmlDoc)
        }
      })
      // TODO 零通道
    },
    mouseDownPTZControl: function(iPTZIndex) {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd)

      if (oWndInfo !== null) {
        if (iPTZIndex === 9 && this.g_bPTZAuto) {
          oWndInfo.iPTZSpeed = 0
        } else {
          this.g_bPTZAuto = false
        }

        WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
          iPTZSpeed: 4,
          mysuccess: function(xmlStr) {
            console.log('I_PTZControl', xmlStr)
            if (iPTZIndex === 9 && this.g_bPTZAuto) {
              console.log(oWndInfo.szDeviceIdentify + ' 停止云台成功!mouseDown')
            } else {
              console.log(oWndInfo.szDeviceIdentify + ' 开启云台成功!mouseDown')
            }
            if (iPTZIndex === 9) {
              this.g_bPTZAuto = !this.g_bPTZAuto
            }
          },
          error: function(status, xmlDoc) {
            console.log(oWndInfo.szDeviceIdentify + ' 开启云台失败!mouseDown', status, xmlDoc)
          }
        })
      }
    },
    mouseUpPTZControl: function() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.mySelectWnd)
      if (oWndInfo !== null) {
        WebVideoCtrl.I_PTZControl(1, true, {
          mysuccess: function(xmlStr) {
            console.log(oWndInfo.szDeviceIdentify + ' 停止云台成功!mouseUp', xmlStr)
          },
          error: function(status, xmlDoc) {
            console.log(oWndInfo.szDeviceIdentify + ' 停止云台失败!mouseUp', status, xmlDoc)
          }
        })
      }
    }
  }
}
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .plugin {
    /*width: 500px;*/
    height: 500px;
  }

</style>

