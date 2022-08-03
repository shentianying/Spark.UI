<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />监控详情</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="infoList"
    />
  </div>
</template>

<script>
import { getMonitorById } from '@/api/jkgl/monitor'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'MonitorDetails',
  components: {
    Detailsedit
  },
  data() {
    return {
      size: 'mini',
      myDetails: null // 详情数据

    }
  },
  computed: {
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          data: {
            number,
            name,
            pId,
            ipAddress,
            loginName,
            loginPassword,
            inUse,
            remark,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate
          }

        }
      } = this

      const info = [
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate }
      ]
      return [
        { label: '编号', value: number },
        { label: '名称', value: name },
        { label: 'IP地址', value: ipAddress },
        { label: '节点', value: pId },
        { label: '登录名', value: loginName },
        { label: '密码', value: loginPassword },
        { label: '是否使用', value: inUse ? '是' : '否' },
        { label: '备注', value: remark, monopolize: true },
        ...info
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData()
    })
  },
  methods: {
    /**
     * @description: 初始化数据
     */
    initData() {
      const { id } = this.$route.query
      this.myId = id
      this.fetchData()
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      getMonitorById({ id: this.myId }).then(res => {
        this.myDetails = res
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.details{
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }
  .dashLine {
    height: 1px;
    border-top: 1px dashed #cecece;
    margin-bottom: 20px;
    margin-top: 20px;
  }
}
</style>
