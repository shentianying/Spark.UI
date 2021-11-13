<template>
  <div class="app-container details">
    <div class="info">
      <div class="title">支出详情</div>
      <div class="info-content">
        <span v-for="(item,key) in infoList" :key="key" :class="{'info-text':true,'monopolize':item.monopolize}">
          {{ item.label }}：
          <el-link v-if="item.click&&item.value" type="info" :underline="true" @click="item.click(...item.params)">{{ item.value }}</el-link>
          <span v-else>{{ item.value }}</span>
        </span>
      </div>
    </div>
    <div v-if="myDetails&&myDetails.acceptanceList&&myDetails.acceptanceList.length>0" class="list">
      <div class="title">承兑明细</div>
      <el-table
        v-loading="loading"
        class="table"
        size="small "
        :data="myDetails.acceptanceList"
        header-cell-class-name="table-header"
        element-loading-text="Loading"
        fit
        highlight-current-row
      >
        <el-table-column align="center" type="index" label="序号" :show-overflow-tooltip="true" />
        <el-table-column align="center" label="票号">
          <template slot-scope="scope">
            {{ scope.row.ticketNumber }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开票日期">
          <template slot-scope="scope">
            {{ scope.row.ticketDate | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期日期">
          <template slot-scope="scope">
            {{ scope.row.expiration | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额">
          <template slot-scope="scope">
            {{ utils.formatMoney(scope.row.amount,2,0) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
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
import { GetExpendById } from '@/api/cwgl/zjgl/Expend.js'
export default {
  name: 'ZiJinZhiChuDetails',
  data() {
    return {
      loading: false, // 获取数据状态
      myDetails: null // 详情数据
    }
  },
  computed: {
    /**
     * 详情字段计算
     */
    infoList() {
      const {
        number,
        orgName,
        expendTypeName,
        capitalTypeName,
        expendDate,
        personName,
        amount,
        summary,
        remark,
        createUserName,
        createDate,
        lastEditUserName,
        lastEditDate,
        pageName,
        pageId,
        billId
      } = this.myDetails || {}
      const { $moment, goDeal } = this
      // 遍历的数据 label:展示名   value:展示值  monopolize:独占一行   name:对应response返回的属性名  click: 点击时触发的事件 params 点击事件的参数
      return [
        { label: '支出编号', value: number },
        { label: '部门', value: orgName },
        { label: '支出类型', value: expendTypeName },
        { label: '资金形式', value: capitalTypeName },
        { label: '支出日期', value: $moment(expendDate).format('YYYY-MM-DD') },
        { label: '经手人', value: personName },
        { label: '金额', value: this.utils.formatMoney(amount, 2, 0) },
        { label: '摘要', value: summary },
        { label: '备注', value: remark, monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '源头', value: pageName, click: goDeal, params: [pageId, billId] }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData()
    })
  },
  methods: {
    /**
     * @description: 数据获取转换函数
     */
    async fetchData() {
      this.myId = this.$route.query.id
      if (!this.myId) return
      this.loading = true
      try {
        // To do
        const res = await GetExpendById(this.myId)
        this.myDetails = res.data
      } catch (e) {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      } finally {
        this.loading = false
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
