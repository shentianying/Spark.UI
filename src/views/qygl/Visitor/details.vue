<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />意向企业详情</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :label-width="labelWidth"
      :info-list="infoList"
    />
  </div>
</template>

<script>
import { getVisitorById } from '@/api/qygl/visitor.js'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'VisitorDetails',
  components: {
    Detailsedit
  },
  data() {
    return {
      size: 'mini',
      labelWidth: 150,
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
            name,
            telphone,
            orderTime,
            orderSuccessTime,
            visitTime,
            leaveTime,
            orgId,
            regionId,
            receivePerson,
            receiveTel,
            carNum,
            peerNum,
            visitReason,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate
          }

        }
      } = this

      // const m = (val) => this.utils.formatMoney(val, 2, 0)
      // const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      // const a = this.utils.amountInWords
      const info = [
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate }
      ]
      return [
        { label: '访客姓名', value: name },
        { label: '访客电话', value: telphone },
        { label: '预约时间', value: orderTime },
        { label: '预约成功时间', value: orderSuccessTime },
        { label: '到访时间', value: visitTime },
        { label: '离开时间', value: leaveTime },
        { label: '拜访部门', value: orgId },
        { label: '拜访区域', value: regionId },
        { label: '接待人', value: receivePerson },
        { label: '接待人联系方式', value: receiveTel },
        { label: '车牌号', value: carNum },
        { label: '同行人数', value: peerNum },
        { label: '拜访事由', monopolize: true, value: visitReason },
        ...info
        // { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },
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
      getVisitorById({ id: this.myId }).then(res => {
        this.myDetails = res
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息:', e)
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
