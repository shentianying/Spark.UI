<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />商场活动详情</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :label-width="labelWidth"
      :info-list="infoList"
    />
  </div>
</template>

<script>
import { getAcitivityDetailById } from '@/api/hdgl/acitivity.js'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'AcitivityDetails',
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
            title,
            typeName,
            startDate,
            endDate,
            content,
            remark,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate
          }

        }
      } = this

      // const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      // const a = this.utils.amountInWords
      const info = [
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate }
      ]
      return [
        { label: '活动主题', value: title },
        { label: '活动类型', value: typeName },
        { label: '开始时间', value: d(startDate) },
        { label: '结束时间', value: d(endDate) },
        { label: '内容', monopolize: true, value: content },
        { label: '备注', monopolize: true, value: remark },
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
      getAcitivityDetailById({ id: this.myId }).then(res => {
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
