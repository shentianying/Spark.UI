<template>
  <div class="app-container details">
    <div class="title"><i class="el-icon-info" />其他合同详情</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="infoList"
    />
    <div class="dashLine" />
    <h4>附件列表</h4>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="upFileList"
    />
  </div>
</template>

<script>
import { GetMonitorById } from '@/api/jkgl/monitor'
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
            projectName,
            orgName,
            name,
            contractTypeName,
            subcontractor,
            signDate,
            isSave,
            paymentTerms,
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
        { label: '编号', value: number },
        { label: '项目', value: projectName },
        { label: '组织机构', value: orgName },
        { label: '合同名称', value: name },
        { label: '类别', value: contractTypeName },
        { label: '合作单位', value: subcontractor },
        { label: '签订日期', value: d(signDate) },
        { label: '存档', value: isSave ? '是' : '否' },
        { label: '付款条款', value: paymentTerms },
        { label: '备注', value: remark },
        ...info
        // { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },
      ]
    },
    /**
     * 附件列表
     */
    upFileList() {
      const {
        myDetails: {
          data: {
            contractUpFile,
            assesmentUpFile
          }
        }
      } = this

      return [
        { label: '合同', value: contractUpFile || [], component: 'UpFile', monopolize: true },
        { label: '评审记录', value: assesmentUpFile || [], component: 'UpFile', monopolize: true }
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
      GetMonitorById({ id: this.myId }).then(res => {
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
