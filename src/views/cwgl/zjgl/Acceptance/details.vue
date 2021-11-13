<template>
  <div class="app-container details">
    <div class="info">
      <div class="title">承兑信息</div>
      <div class="info-content">
        <span v-for="(item,key) in infoList" :key="key" :class="{'info-text':true,'monopolize':item.monopolize}">
          {{ item.label }}：{{ item.value }}
          <template v-if="item.name == 'btn'">
            <el-button v-if="gatheringId" :size="size" type="text" @click="handleShouZhi('shou',gatheringId)">收款</el-button>
            <el-button v-if="expendId" :size="size" type="text" @click="handleShouZhi('zhi',expendId)">支出</el-button>
          </template>
        </span>
      </div>
    </div>
    <div class="affirm">
      <el-button v-has="'EXPIRE'" type="primary" :size="size" @click="ensureAcceptDetail">到期确认</el-button>
      <el-button v-has="'EXPIRE'" :size="size" @click="goBack()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { GetAcceptDetailById, EnsureAcceptDetail } from '@/api/cwgl/zjgl/Acceptance.js'
export default {
  name: 'ChengDuiXinXiDetails',
  data() {
    return {
      id: '',
      size: 'mini',
      loading: false,
      gatheringId: '',
      state: -1,
      expendId: '',
      infoList: [
        { label: '票号', value: '', name: 'ticketNumber' },
        { label: '相关单据', value: '', name: 'btn' },
        { label: '部门', value: '', name: 'orgName' },
        { label: '承兑类型', value: '', name: 'capitalType' },
        { label: '开票日期', value: '', name: 'ticketDate' },
        { label: '到期日期', value: '', name: 'expiration' },
        { label: '金额', value: '', name: 'amount' },
        { label: '付款行', value: '', name: 'bank' },
        { label: '出票人', value: '', name: 'drawer' },
        { label: '付款人', value: '', name: 'payer' },
        { label: '收款人', value: '', name: 'payee', monopolize: true },
        { label: '收款日期', value: '', name: 'gatheringDate' },
        { label: '支付日期', value: '', name: 'expendDate' },
        { label: '备注', value: '', name: 'remark' },
        { label: '状态', value: '', name: 'stateName' },
        { label: '制单人', value: '', name: 'createUserName' },
        { label: '制单时间', value: '', name: 'createDate' },
        { label: '更新人', value: '', name: 'lastEditUserName' },
        { label: '更新时间', value: '', name: 'lastEditDate' }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initDat()
    })
  },
  methods: {
    /**
     * @description: 初始化数据
     */
    initDat() {
      const { id } = this.$route.query
      if (id) {
        this.id = id
        this.fetchData()
      }
    },
    /**
     * @description: 获取列表数据、搜索数据
     * @return {*}
     */
    async fetchData() {
      this.loading = true
      try {
        // To do
        const res = await GetAcceptDetailById(this.id)
        this.expendId = res.data.expendId
        this.gatheringId = res.data.gatheringId
        this.state = res.data.state
        const dateList = ['gatheringDate', 'ticketDate', 'expiration', 'expendDate']

        res.data.amount = this.utils.formatMoney(res.data.amount, 2, 0)
        this.infoList.forEach((item) => {
          if (dateList.includes(item.name) && res.data[item.name]) {
            item.value = new Date(res.data[item.name]).toLocaleDateString().replaceAll('/', '-')
          } else {
            item.value = res.data[item.name]
          }
        })
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.loading = false
      }
    },
    ensureAcceptDetail() {
      EnsureAcceptDetail(this.id).then((res) => {
        this.$message.success(res.message)
        this.goBack()
      })
    },
    handleShouZhi(type, id) {
      this.$router.push({ name: 'ShouZhiMessage', query: { type, id, refreshRouterName: this.$route.name }})
    },
    /**
     * 取消并返回上一页
     */
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.details{
  padding-bottom: 64px;
   /deep/.table-header{
    background-color: #F7F7F7;
    font-weight: normal;
    color: #606266;;
  }
  .affirm{
    padding:16px 0 16px 56px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 64px;
  }
  .info{
    .title{
      padding:0 32px 12px 32px;
      color: rgba(16, 16, 16, 100);
      font-size: 16px;
      font-weight: bold;
    }
    .info-content{
      padding:24px 32px;
      border-top: 1px solid rgba(233, 233, 233, 100);
      display: flex;
      flex-wrap: wrap;
      .info-text{
        width: 50%;
        margin-bottom: 16px;
        color: rgba(16, 16, 16, 100);
        font-size: 13px;
        .link{
          font-size: 14px;
          color: #409EFF;
        }
      }

      .info-text.monopolize{
        width: 100%;
      }
    }

  }
}
</style>
