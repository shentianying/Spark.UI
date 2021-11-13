<template>
  <div class="app-container WriteOffInfo">
    <el-card class="info-card">
      备用金冲销
    </el-card>
    <el-card>
      <div class="info-content">
        <Detailsedit
          v-if="infoList"
          status="checkInfo"
          :info-list="infoList"
        />
      </div>
    </el-card>

  </div>
</template>

<script>
import Detailsedit from '@/components/Detailsedit'
import { GetImprestWriteOffById, InitImprestWriteOff } from '@/api/cwgl/Impresst'
export default {
  name: 'ImprestWriteOffDetails',
  components: {
    Detailsedit
  },
  data() {
    return {
      size: 'mini',
      loading: false, // 请求未完成
      myDetails: {}, // 详情数据
      imprestTypeList: [], // 冲销方式数据
      stateList: [] // 状态列表
    }
  },
  computed: {
    /**
     * 详情各字段计算
     */
    infoList() {
      if (!this.myDetails.data) return
      const {
        myDetails: {
          data: {
            number,
            amount,
            remark,
            personNumber,
            personName,
            createDate,
            createUserName,
            lastEditUserName,
            lastEditDate,
            pageName,
            pageId,
            stateName,
            writeOffMode,
            capitalTypeName,
            orgStr
          }
        }
      } = this
      const { goDeal } = this
      return [
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        { label: '摘要', value: `${personName}${writeOffMode}备用金` },
        { label: '支付方式', value: capitalTypeName },
        { label: '冲销工人号', value: personNumber },
        { label: '姓名', value: personName },
        { label: '冲销金额', value: `${Math.abs(amount)}` },
        { label: '冲销方式', value: writeOffMode },
        { label: '备注', value: remark, monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: stateName },
        { label: '源头', value: pageName, click: goDeal, params: [pageId] }
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
      this.InitImprestWriteOffType()
    },
    /**
     * @description: 初始化冲销方式单选
     */
    InitImprestWriteOffType() {
      InitImprestWriteOff().then(res => {
        this.imprestTypeList = res.typeList
      })
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      this.loading = true
      const res = await GetImprestWriteOffById({ id: this.myId })
      this.myDetails = res
      this.loading = false
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
    getRoute(pageId) {
      // 获取菜单列表
      const getIsMenu = this.$store.getters.menus
      return getIsMenu.find(f => f.id === pageId)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
