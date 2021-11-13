<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" tab-position="top" :lazy="true">
      <el-tab-pane label="基本信息" name="基本信息">
        <el-divider content-position="left">基本信息</el-divider>
        <el-form
          ref="ruleForm"
          status-icon
          :model="ruleForm"
          label-width="120px"
          class
          size="mini"
        >
          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="姓名" prop="name">
                {{ ruleForm.name }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="工号" prop="number">
                {{ ruleForm.number }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="部门" prop="organizationId">
                {{ orgStr }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="岗位" prop="postId">
                <span v-if="ruleForm.post">{{ ruleForm.post.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="人员类型" prop="personTypeID">
                <span v-if="personTypeList.length>0">{{ personTypeList.find(f=>f.value === ruleForm.personTypeID).name }}</span>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="证件类型" prop="idType">
                <span v-if="personTypeList.length>0">{{ idTypeList.find(f=>f.value === ruleForm.idType).name }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="证件号码" prop="idNumber">
                {{ ruleForm.idNumber }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="电话号码" prop="phoneNumber">
                {{ ruleForm.phoneNumber }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="身份证地址" prop="idAddress">
                {{ ruleForm.idAddress }}
              </el-form-item>
            </el-col>

            <el-col :sm="12" :xs="24">
              <el-form-item label="家庭地址" prop="homeAddres">
                {{ ruleForm.homeAddres }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="性别" prop="gender">
                {{ ruleForm.gender }}
              </el-form-item>
            </el-col>

            <el-col :sm="12" :xs="24">
              <el-form-item label="民族" prop="nation">
                {{ ruleForm.nation }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">

            <el-col :sm="12" :xs="24">
              <el-form-item label="出生日期" prop="birthDate">
                {{ ruleForm.birthDate }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="开户行" prop="awBank">
                <span v-if="bankList && ruleForm.awBank!= null">{{ bankList.find(f=>f.value === ruleForm.awBank).name }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">

            <el-col :sm="12" :xs="24">
              <el-form-item label="账号" prop="account">
                {{ ruleForm.account }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="账号是否确认" prop="isConfirmAccount">
                <el-switch v-model="ruleForm.isConfirmAccount" active-color="#13ce66" inactive-color="#ff4949" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="备注" prop="remark">
                {{ ruleForm.remark }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="是否可用" prop="inUse">
                <el-switch v-model="ruleForm.inUse" active-color="#13ce66" inactive-color="#ff4949" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="账号有效期" prop="expirationDate">
                {{ ruleForm.expirationDate }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="是否可登录" prop="isUser">
                <el-switch v-model="ruleForm.isUser" active-color="#13ce66" inactive-color="#ff4949" disabled />
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <el-divider content-position="left">岗位信息</el-divider>
        <el-table
          ref="PersonPostTable"
          v-loading="listLoading"
          :data="PersonPostList"
          border
          size="mini"
        >
          <el-table-column type="index" width="55" align="center" />
          <el-table-column align="center" label="组织机构" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.organization.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="岗位名称" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.post.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色名称" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.role.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="职务" min-width="160">
            <template slot-scope="scope">
              <span v-if="positionList && scope.row.positionId>0">{{ positionList.find(f=>f.value === scope.row.positionId).name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否主岗位" align="center" min-width="100">
            <template slot-scope="scope">
              <i v-if="scope.row.isMain" class="el-icon-check" />
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align:center;margin-top:20px;">
          <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="备用金信息" name="备用金信息">
        <div class="tabs-header">
          <span class="header-title">备用金冲销</span>
          <el-date-picker
            v-model="imprestYear"
            :clearable="false"
            style="width:90px;"
            size="mini"
            value-format="yyyy"
            type="year"
            placeholder="选择年"
            @change="getImprestList"
          />
        </div>

        <TableEx
          :show-count="false"
          :show-actions="false"
          :show-pagination="false"
          size="mini"
          :columns="imprestTable.columns"
          :table-loading="imprestTable.loading"
          :list="imprestTable.list"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getPersonById } from '@/api/rsgl/person'
import { GetImprestListByPersonId } from '@/api/xmgl/ProjectSettle.js'
import { getPersonPostListById } from '@/api/rsgl/personPost'
import TableEx from '@/components/TableEx'
export default {
  name: 'PersonDetail',
  components: { TableEx },
  data() {
    return {
      ruleForm: {
        name: '',
        number: '',
        companyId: this.$store.state.user.selectOrgId,
        organizationId: null,
        postId: 0,
        personTypeID: null,
        inUse: true,
        isUser: true,
        idType: '',
        idNumber: '',
        phoneNumber: '',
        idAddress: '',
        homeAddres: '',
        gender: '',
        nation: '',
        birthDate: null,
        expirationDate: '',
        remark: '',
        post: [],
        organization: []
      },
      imprestTable: {
        year: new Date().getFullYear(),
        columns: [
          {
            label: '单据号', // 表头
            prop: 'number', // 渲染的属性
            minWidth: '120' // 最小宽度
          },
          {
            label: '摘要',
            prop: 'summary',
            minWidth: '120'
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '120'
          },
          {
            label: '部门',
            prop: 'orgName',
            minWidth: '120'
          },
          {
            label: '类别', // 表头
            prop: 'type', // 渲染的属性
            format: (val) => val || '',
            minWidth: '85' // 最小宽度
          },
          {
            label: '支付日期', // 表头
            prop: 'payoutDate', // 渲染的属性
            format: 'date',
            minWidth: '120' // 最小宽度
          },
          {
            label: '金额',
            prop: 'amount',
            format: 'money',
            minWidth: '120',
            align: 'right'
          },
          {
            business: 'createUser' // 业务部分的快捷使用参考 src\components\TableEx\Column\businessList.js
          }
        ],
        list: [],
        loading: false
      },
      activeTab: '基本信息',
      orgStr: '',
      listLoading: false,
      positionList: [], // 职务
      PersonPostList: [], // 岗位信息
      idTypeList: [], // 证件类型列表
      bankList: [],
      personTypeList: [] // 员工类型列表
    }
  },
  computed: {
    imprestYear: {
      get() {
        return `${this.imprestTable.year}-00-00`
      },
      set(val) {
        this.imprestTable.year = new Date(val).getFullYear()
      }
    }
  },
  watch: {
    activeTab(val) {
      switch (val) {
        case '备用金信息':
          this.getImprestList()
          break

        default:
          break
      }
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.fetchData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    } else {
      this.$refs['ruleForm'].resetFields()
    }
  },
  methods: {
    getImprestList() {
      this.imprestTable.loading = true
      GetImprestListByPersonId({ id: this.$route.query.id, year: this.imprestTable.year }).then(res => {
        this.imprestTable.list = res.data
      }).finally(() => {
        this.imprestTable.loading = false
      })
    },
    async fetchData() {
      if (this.$route.query.id !== 0) {
        this.listLoading = true
        await getPersonById({ id: this.$route.query.id }).then((response) => {
          const { data, data1, orgStr, data3, data4, data5 } = response
          // 3.员工类型下拉数据
          this.personTypeList = data3
          // 4.证件类型下拉数据
          this.idTypeList = data4
          // 5.开户行类型下拉数据
          this.bankList = data5
          this.ruleForm = data
          this.orgStr = orgStr
          this.userOrg = data1
          this.ruleForm.idType = Number(this.ruleForm.idType)
        })
        getPersonPostListById({ id: this.$route.query.id }).then((response) => {
          const { data, data1 } = response
          this.positionList = data1
          this.PersonPostList = data
          this.listLoading = false
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
.tabs-header{
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title{
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
