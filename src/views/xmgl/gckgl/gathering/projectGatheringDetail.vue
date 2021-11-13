<template>
  <div class="app-container ShouKuanEdit">
    <el-card class="info-card">
      工程款信息
    </el-card>
    <el-card class="form-card">
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="160px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号：">
              {{ ruleForm.number }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="组织机构：">
              {{ orgName }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="项目：">
              <span v-if="ruleForm.project">{{ ruleForm.project.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="经手人：">
              <span v-if="ruleForm.person">{{ ruleForm.person.name }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="收款类型：">
              {{ ruleForm.gatheringType }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="资金类型：">
              {{ ruleForm.capitalType }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="收款日期：">
              {{ ruleForm.gatheringDate | dateFormat }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="金额：">
              {{ utils.formatMoney(ruleForm.gatheringAmount, 2, 0) }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="备注：">
              {{ ruleForm.remark }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="总公司地区：" prop="splitOrgId">
              {{ splitOrgName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="总公司项目：" prop="splitCompanyProjectId">
              {{ splitCompanyProject }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="拆分到总公司：" prop="splitCompanyAmount">
              {{ utils.formatMoney(ruleForm.splitCompanyAmount, 2, 0) }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="拆分到项目：" prop="splitProjectAmount">
              {{ utils.formatMoney(ruleForm.splitProjectAmount, 2, 0) }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="集团管理费：" prop="groupManageFee">
              {{ utils.formatMoney(ruleForm.groupManageFee, 2, 0) }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="收款银行：" prop="bank">
              {{ ruleForm.bank }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="创建人：">
              {{ ruleForm.createUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="创建日期：">
              {{ ruleForm.createDate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="拆分人：">
              {{ ruleForm.splitUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="拆分日期：">
              {{ ruleForm.splitDate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="更新人：">
              {{ ruleForm.lastEditUserName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="更新日期：">
              {{ ruleForm.lastEditDate }}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

    </el-card>

  </div>

</template>

<script>
import { getProjectGatheringDetailById } from '@/api/xmgl/projectGathering'
export default {
  name: 'ProjectGatheringDetail',
  components: {
  },
  data() {
    return {
      type: '', // edit：编辑 add:新增
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        companyId: this.$store.state.user.selectOrgId,
        projectId: null,
        gatheringType: '',
        capitalType: '',
        gatheringDate: new Date(),
        personId: this.$store.state.user.uid,
        gatheringAmount: '',
        remark: '',
        state: 0,
        splitOrgId: null,
        splitCompanyProjectId: null,
        splitCompanyAmount: '',
        splitProjectAmount: '',
        groupManageFee: '',
        bank: ''
      },
      projectGatheringId: null,
      orgName: '',
      splitOrgName: '',
      splitCompanyProject: '',

      loading: false,
      rules: {

      }
    }
  },
  activated() {
    console.log('activated')
    if (this.$route.params.id) {
      console.log(this.$route.params.id)
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.active = 0
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    initData() {
      console.log(this.$route.query.id)
      this.projectGatheringId = this.$route.query.id
      if (this.projectGatheringId) {
        getProjectGatheringDetailById({ id: this.projectGatheringId }).then(response => {
          const { data, orgName, splitOrgName, splitCompanyProject, gatheringType, capitalType } = response
          this.ruleForm = data
          this.orgName = orgName
          this.splitOrgName = splitOrgName
          this.splitCompanyProject = splitCompanyProject
          this.ruleForm.capitalType = capitalType.name
          this.ruleForm.gatheringType = gatheringType.name
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.ShouKuanEdit{
  .info-card {
  margin: 16px 24px 0 24px;
  height: 48px;
  line-height: 12px;
  font-size: 16px;
  font-weight: 600;
  }
.form-card {
  margin: 0 24px;
  }
}
</style>
