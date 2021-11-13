<template>
  <div class="app-container details">
    <!-- 详情部分 -->
    <div class="info">
      <div class="title">资金{{ type==='shou'?'收款':'支出' }}详情</div>
      <div class="info-content">
        <span v-for="(item,key) in infoList" :key="key" :class="{'info-text':true,'monopolize':item.monopolize}">
          {{ item.label }}：
          <el-button v-if="item.click&&item.value" :size="size" type="text" @click="item.click(...item.params)">{{ item.value }}</el-button>
          <span v-else>{{ item.value }}</span>
        </span>
        <div class="line-dashed" />
      </div>
    </div>
    <!-- 列表部分 -->
    <div class="list">
      <div class="title">承兑明细</div>
      <el-table
        v-loading="table.loading"
        class="table"
        :size="size"
        :data="table.list"
        header-cell-class-name="table-header"
        element-loading-text="Loading"
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" type="index" />
        <el-table-column align="center" label="票号" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.ticketNumber }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开票日期" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.ticketDate | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期日期" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.expiration | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额" min-width="10">
          <template slot-scope="scope">
            {{ utils.formatMoney(scope.row.amount,2,0) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="10">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// monopolize
import { GetPaymentById } from '@/api/cwgl/zjgl/Gathering.js'
import { GetExpendById } from '@/api/cwgl/zjgl/Expend.js'
export default {
  name: 'ShouZhiMessage',
  data() {
    return {
      type: 'shou', // shou:收款 zhi:支出
      id: '',
      size: 'mini',
      table: {
        list: [],
        loading: false
      },
      details: {}
    }
  },
  computed: {
    infoList() {
      let tmp1 = []
      let tmp2 = []
      const {
        orgName,
        gatheringDate,
        gatheringTypeName,
        bank,
        summary,
        expendDate,
        expendTypeName,
        number,
        pageName,
        pageId,
        billId,
        amount,
        personName,
        capitalTypeName,
        remark,
        createUserName,
        createDate,
        lastEditUserName,
        lastEditDate
      } = this.details
      const formatDate = date => this.$moment(date).format('YYYY-MM-DD')
      if (this.type === 'shou') {
        // 支出 摘要 summary
        tmp1 = [{ label: '部门', value: orgName, monopolize: true }]
        tmp2 = [
          { label: '收款日期', value: formatDate(gatheringDate) },
          { label: '收款类型', value: gatheringTypeName },
          { label: '收款银行', value: bank }
        ]
      } else {
        tmp1 = [
          { label: '部门', value: orgName },
          { label: '摘要', value: summary }
        ]
        tmp2 = [
          { label: '支出日期', value: formatDate(expendDate) },
          { label: '支出类型', value: expendTypeName, monopolize: true }
        ]
      }
      return [
        { label: '编号', value: number },
        { label: '源头', value: pageName, click: this.goDeal, params: [pageId, billId] },
        ...tmp1,
        { label: '金额', value: amount },
        { label: '经手人', value: personName },
        { label: '资金形式', value: capitalTypeName },
        ...tmp2,
        { label: '备注', value: remark, monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate }
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
      // 获取路由信息 shou:收款 zhi:支出
      const { type, id } = this.$route.query
      if (!type) {
        return
      }
      this.type = type
      this.id = id
      this.fetchData()
    },
    /**
     * @description: 数据获取
     */
    async fetchData() {
      this.table.loading = true
      try {
        // To do
        const func = this.type === 'shou' ? GetPaymentById : GetExpendById
        const res = await func(this.id)
        this.table.list = res.data.acceptanceList
        res.data.amount = this.utils.formatMoney(res.data.amount, 2, 0)
        this.details = res.data
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.table.loading = false
      }
    },
    /**
     * 前往源头
     * @param {*} pageId 路由id
     * @param {*} billId 单据id
     */
    goDeal(pageId, billId) {
      if (!pageId) return
      const { routerName } = this.getRoute(pageId)
      this.$router.replace({ name: routerName, query: { id: billId, refreshRouterName: this.$route.name }, params: { id: billId, type: 1 }})
    },
    /**
     * 获取源头路由
     * @param {*} pageId 路由ID
     * @returns 对应路由
     */
    getRoute(pageId) {
      // 获取菜单列表
      const getIsMenu = this.$store.getters.menus
      return getIsMenu.find(f => f.id === pageId)
    }
  }
}
</script>

<style lang="scss" scoped>
.details{
   /deep/.table-header{
    background-color: #F7F7F7;
    font-weight: normal;
    color: #606266;;
  }

    .list{
      padding:0 32px;
      .title{
        padding-bottom: 24px;
      color: rgba(16, 16, 16, 100);
      font-size: 16px;
      font-weight: bold;
    }
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
      .line-dashed{
        border-bottom: 1px dashed rgba(233, 233, 233, 100);
        width: 100%;
      }
      .info-text{
        width: 50%;
        margin-bottom: 16px;
        color: rgba(16, 16, 16, 100);
        font-size: 13px;
      }
      .info-text.monopolize{
        width: 100%;
      }
    }

  }
}
</style>
