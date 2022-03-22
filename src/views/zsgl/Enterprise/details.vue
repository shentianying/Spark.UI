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
import { getEnterpriseDetailById } from '@/api/zsgl/enterprise.js'
import Detailsedit from '@/components/Detailsedit'
export default {
  name: 'EnterpriseDetails',
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
            companyName,
            legalPerson,
            employeeNum,
            output,
            tax,
            linkMan,
            linkTel,
            officialNet,
            email,
            area,
            address,
            formerName,
            operationState,
            regCapital,
            paidCapital,
            occupation,
            uniSocialCreditCode,
            taxNum,
            businessLicense,
            orgCode,
            setDate,
            startDate,
            endDate,
            enterpriseType,
            checkDate,
            inUse,
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
        { label: '公司名称', value: companyName },
        { label: '曾用名', value: formerName },
        { label: '法定代表人', value: legalPerson },
        { label: '从业人数', value: employeeNum },
        { label: '企业产值', value: output },
        { label: '税收', value: tax },
        { label: '联系人', value: linkMan },
        { label: '联系电话', value: linkTel },
        { label: '官网', value: officialNet },
        { label: '邮箱', value: email },
        { label: '建筑面积', value: area },
        { label: '地址', value: address },
        { label: '经营状态', value: operationState },
        { label: '所属行业', value: occupation },
        { label: '注册资本', value: regCapital },
        { label: '实缴资本', value: paidCapital },
        { label: '统一社会信用代码', value: uniSocialCreditCode },
        { label: '纳税人识别号', value: taxNum },
        { label: '工商注册号', value: businessLicense },
        { label: '组织机构代码', value: orgCode },
        { label: '营业期限起', value: d(startDate) },
        { label: '营业期限止', value: d(endDate) },
        { label: '成立日期', value: d(setDate) },
        { label: '核准日期', value: d(checkDate) },
        { label: '企业类型', value: enterpriseType },
        { label: '是否使用', value: inUse ? '是' : '否' },
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
      getEnterpriseDetailById({ id: this.myId }).then(res => {
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
