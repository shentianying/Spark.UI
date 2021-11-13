<template>
  <div class="app-container SubcontractPeopleInfo">
    <el-card class="info-card">
      分包人
    </el-card>
    <el-card>
      <div class="info-content">
        <Detailsedit
          v-if="myDetails"
          status="checkInfo"
          :info-list="infoList"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import Detailsedit from '@/components/Detailsedit'
import { GetSubcontractPeopleById } from '@/api/fbgl/subcontractPeople'

export default {
  name: 'SubcontractPeopleDetails',
  components: {
    Detailsedit
  },
  data() {
    return {
      loading: false, // 请求未完成
      myDetails: null // 详情数据
    }
  },
  computed: {
    infoList() {
      const {
        myDetails: {
          orgStr,
          typeName,
          data: {
            name,
            idNumber,
            address,
            tel,
            phone,
            fax,
            email,
            isForbidden,
            remark,
            upFile,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate
          }
        }
      } = this
      return [
        { label: '分包人姓名', value: name },
        { label: '身份证号', value: idNumber },
        { label: '部门', value: orgStr },
        { label: '地址', value: address },
        { label: '电话', value: tel },
        { label: '手机', value: phone },
        { label: '传真', value: fax },
        { label: 'Email', value: email },
        { label: '类型', value: typeName },
        { label: '是否禁用', value: isForbidden ? '是' : '否' },
        { label: '备注', monopolize: true, value: remark },
        { label: '附件', monopolize: true, component: 'UpFile', value: upFile || [] },
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
      const { id } = this.$route.query
      this.myId = id
      this.fetchData()
    },
    async fetchData() {
      if (!this.myId) return
      this.loading = true
      const res = await GetSubcontractPeopleById({ id: this.myId })
      this.myDetails = res
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
