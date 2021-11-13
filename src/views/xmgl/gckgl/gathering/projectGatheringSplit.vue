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
              {{ gatheringType }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="资金类型：">
              {{ capitalType }}
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
              <org-select2
                v-if="orgList"
                :key="keyOrg"
                v-model="ruleForm.splitOrgId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="true"
                :options="orgList"
                :select-data="ruleForm.splitOrgId"
                select-style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="总公司项目：" prop="splitCompanyProjectId">
              <el-input v-model="projectName" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectProject()" />
              </el-input>
              <select-project ref="projectRef" :org="ruleForm.splitOrgId" :multiple="false" @getProject="getProject" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="拆分到总公司：" prop="splitCompanyAmount">
              <el-input v-model="ruleForm.splitCompanyAmount" placeholder="请输入" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="拆分到项目：" prop="splitProjectAmount">
              <el-input v-model="ruleForm.splitProjectAmount" placeholder="请输入" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="集团管理费：" prop="groupManageFee">
              <el-input v-model="ruleForm.groupManageFee" placeholder="请输入" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="收款银行：" prop="bank">
              <el-input v-model="ruleForm.bank" placeholder="请输入" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div v-show="isChengDui" class="detail-container">
        <el-row style="margin:10px 0;">
          <el-col :span="12">
            <p>承兑明细:</p>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button size="mini" type="primary" @click="addRow()">+增加</el-button>
          </el-col>
        </el-row>
        <el-table :data="acceptances" style="width: 100%" size="mini" class="cd-table">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            :index="utils.formatIndex"
            :size="size"
          />
          <el-table-column label="票号" width="120">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.ticketNumber }}</span>
              <el-input v-show="scope.row.isEdit" v-model="scope.row.ticketNumber" :size="size" />
            </template>
          </el-table-column>
          <el-table-column
            label="开票日期"
          >
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.ticketDate | dateFormat }}</span>
              <el-date-picker
                v-show="scope.row.isEdit"
                v-model="scope.row.ticketDate"
                :size="size"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </template>
          </el-table-column>
          <el-table-column label="到期日期">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.expiration | dateFormat }}</span>
              <el-date-picker
                v-show="scope.row.isEdit"
                v-model="scope.row.expiration"
                :size="size"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </template>
          </el-table-column>

          <el-table-column label="金额">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ utils.formatMoney(scope.row.amount,2,0) }}</span>
              <el-input v-show="scope.row.isEdit" v-model="scope.row.amount" :size="size" />
            </template>
          </el-table-column>
          <el-table-column label="出票人">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.drawer }}</span>
              <el-input v-show="scope.row.isEdit" v-model="scope.row.drawer" :size="size" />
            </template>
          </el-table-column>
          <el-table-column label="付款人">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.payer }}</span>
              <el-input v-show="scope.row.isEdit" v-model="scope.row.payer" :size="size" />
            </template>
          </el-table-column>
          <el-table-column label="收款人">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.payee }}</span>
              <el-input v-show="scope.row.isEdit" v-model="scope.row.payee" :size="size" />
            </template>
          </el-table-column>
          <el-table-column label="付款行">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.bank }}</span>
              <el-input v-show="scope.row.isEdit" v-model="scope.row.bank" :size="size" />
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <span v-show="!scope.row.isEdit">{{ scope.row.remark }}</span>
              <el-input v-show="scope.row.isEdit" v-model="scope.row.remark" :size="size" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-if="!scope.row.isEdit ">
                <el-button
                  type="text"
                  :size="size"
                  @click="handleEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  :size="size"
                  @click.native.prevent="deleteRow(scope.$index, acceptances)"
                >
                  删除
                </el-button>
              </div>
              <div v-else>
                <el-button
                  type="text"
                  :size="size"
                  @click="handleSubmitEdit(scope.row)"
                >确定</el-button>
                <el-button
                  type="text"
                  :size="size"
                  @click="handleCancelEdit(scope.row)"
                >取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="text-align:center; margin-top:15px;">
        <el-button v-if="ruleForm.state === 1" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm', 1)">拆分</el-button>
        <el-button v-if="ruleForm.state === 1" size="mini" type="success" :loading="loading" @click="submitForm('ruleForm', 0)">已手动录入</el-button>
        <el-button size="mini" type="info" :loading="loading" @click="closeThePage()">取消</el-button>
      </div>

    </el-card>

  </div>

</template>

<script>
import { getProjectGatheringWithSplitById, splitProjectGathering, handInputProjectGathering } from '@/api/xmgl/projectGathering'
import { validateData, validate } from '@/utils/validate'
import SelectProject from '@/components/Other/xmgl/selectProject'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ProjectGatheringSplit',
  components: {
    SelectProject,
    OrgSelect2
  },
  data() {
    return {
      size: 'mini',
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        companyId: this.$store.state.user.selectOrgId,
        projectId: null,
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
      orgName: '',
      gatheringType: '',
      capitalType: '',
      projectGatheringId: null,
      projectName: '',
      orgList: [],
      keyOrg: 0,
      acceptances: [],
      isChengDui: false,

      loading: false,
      rules: {
        splitCompanyProjectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        splitOrgId: [{ required: true, message: '请总公司地区', trigger: 'change' }],
        splitCompanyAmount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' }
        ],
        splitProjectAmount: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: validate.money, message: '金额格式不正确' }
        ],
        groupManageFee: [
          { validator: validate.money, message: '金额格式不正确', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'ruleForm.splitCompanyAmount': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue) {
          this.ruleForm.groupManageFee = this.ruleForm.gatheringAmount - this.ruleForm.splitCompanyAmount - this.ruleForm.splitProjectAmount
        }
      }, deep: true
    },
    'ruleForm.splitProjectAmount': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue) {
          this.ruleForm.groupManageFee = this.ruleForm.gatheringAmount - this.ruleForm.splitCompanyAmount - this.ruleForm.splitProjectAmount
        }
      }, deep: true
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    submitForm(formName, state) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.State = 10000
          this.loading = true

          if (state === 1) {
            const AcceptanceList = []
            if (newObj.capitalType === 2 || newObj.capitalType === 3) {
              for (const item of this.acceptances) {
                if (!item.ticketDate) {
                  this.$message.error('请填写开票日期')
                  return false
                }
                if (!item.expiration) {
                  this.$message.error('请填写到期日期')
                  return false
                }
                if (new Date(item.ticketDate) > new Date(item.expiration)) {
                  this.$message.error('开票日期不能晚于到期日期')
                  return false
                }
                if (!validateData.money(item.amount).isSuccess) {
                  this.$message.error('金额格式不正确')
                  return false
                }
                if (!item.drawer) {
                  this.$message.error('请填写出票人')
                  return false
                }
                if (!item.payer) {
                  this.$message.error('请填写付款人')
                  return false
                }
                if (!item.payee) {
                  this.$message.error('请填写收款人')
                  return false
                }
                const tmp = { ...item }
                delete tmp.isEdit
                delete tmp.backups
                AcceptanceList.push(tmp)
              }
            }
            const data = { projectGathering: newObj, acceptanceList: AcceptanceList }
            splitProjectGathering(data).then(response => {
              if (response.errorMsg) {
              // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => {
              this.loading = false
            })
          } else if (state === 0) {
            handInputProjectGathering(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    initData() {
      this.projectGatheringId = this.$route.query.id
      if (this.projectGatheringId) {
        getProjectGatheringWithSplitById({ id: this.projectGatheringId }).then(response => {
          const { data, acceptances, orgList, orgName, splitCompanyProject, gatheringType, capitalType } = response
          this.orgList = orgList
          this.ruleForm = data
          this.orgName = orgName
          if (data.capitalType === 2 || data.capitalType === 3) {
            this.isChengDui = true
          }
          this.keyOrg += 1
          this.capitalType = capitalType.name
          this.gatheringType = gatheringType.name
          this.projectName = splitCompanyProject
          this.acceptances = acceptances
          if (Array.isArray(this.acceptances)) {
            this.acceptances.forEach(ele => {
              this.$set(ele, 'isEdit', false)
              this.$set(ele, 'backups', JSON.stringify(ele))
            })
          }
        })
      }
    },
    handleEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    handleSubmitEdit(row) {
      this.$set(row, 'isEdit', false)
    },
    /**
     * @description: 列表行内编辑取消修改
     * @param {*} row
     * @return {*}
     */
    handleCancelEdit(row) {
      Object.assign(row, JSON.parse(row.backups))
    },
    addRow() {
      const row = { isEdit: false, isAdd: true }
      this.$set(row, 'backups', JSON.stringify(row))
      row.isEdit = true
      this.acceptances.push(row)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    selectProject() {
      this.$refs.projectRef.openDialog()
    },
    getProject(data) {
      if (data.length > 0) {
        this.ruleForm.splitCompanyProjectId = data[0].id
        this.projectName = data[0].name
        this.ruleForm.splitOrgId = data[0].orgId
        this.keyOrg += 1
      }
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
.detail-container {
  margin-left: 16px;
  border-top: 1px dotted #ccc;
}
</style>
