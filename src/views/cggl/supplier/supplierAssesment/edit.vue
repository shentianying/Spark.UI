<template>
  <div class="app-container">
    <div v-show="active===0">
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
            <el-form-item label="供应商名称">
              <el-link :underline="false" @click="openSupplier(ruleForm.supplier.id)">{{ ruleForm.supplier.name }}</el-link>
            </el-form-item>
            <el-form-item label="曾用名">
              {{ ruleForm.supplier.oldName }}
            </el-form-item>
            <el-form-item label="地址">
              {{ ruleForm.supplier.address }}
            </el-form-item>
            <el-form-item label="所在城市">
              {{ ruleForm.supplier.cities.name }}
            </el-form-item>
            <el-form-item label="Email">
              {{ ruleForm.supplier.email }}
            </el-form-item>
            <el-form-item label="网址">
              {{ ruleForm.supplier.url }}
            </el-form-item>
            <el-form-item label="法人代表">
              {{ ruleForm.supplier.corporation }}
            </el-form-item>
            <el-form-item label="注册资金">
              {{ ruleForm.supplier.capital }}
            </el-form-item>
            <el-form-item label="公司电话">
              {{ ruleForm.supplier.companyPhone }}
            </el-form-item>
            <el-form-item label="联系人">
              {{ ruleForm.supplier.contacts }}
            </el-form-item>
            <el-form-item label="联系人电话">
              {{ ruleForm.supplier.contactsPhone }}
            </el-form-item>
            <el-form-item label="评审类型">
              {{ ruleForm.typeName }}
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item
              v-if="activate"
              label="所属部门"
              prop="orgId"
            >
              <org-select2
                v-model="ruleForm.orgId"
                :data-mode="0"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :select-data="ruleForm.orgId"
                select-style="width:100%;"
              />
            </el-form-item>
            <el-form-item label="供应商编号">
              {{ ruleForm.supplier.number }}
            </el-form-item>
            <el-form-item label="开户行">
              {{ ruleForm.supplier.bankName }}
            </el-form-item>
            <el-form-item label="银行账号">
              {{ ruleForm.supplier.bankAccount }}
            </el-form-item>
            <el-form-item label="业务城市">
              {{ ruleForm.supplier.businessCityStr }}
            </el-form-item>
            <el-form-item label="主营">
              {{ ruleForm.supplier.mainBusiness }}
            </el-form-item>
            <el-form-item label="供应商备注信息">
              {{ ruleForm.supplier.remark }}
            </el-form-item>
            <el-form-item label="供应商相关附件">
              <up-file key="fileListKey" v-model="ruleForm.supplier.fileList" :is-preview="true" :is-upfile="false" :is-delete="false" :file-list="ruleForm.supplier.fileList" />
            </el-form-item>
            <el-form-item label="供应商是否使用">
              <el-switch
                v-model="ruleForm.supplier.inUse"
                disabled
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item v-if="type===2" label="等级">
              <el-rate v-model="ruleForm.rate" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
            <!-- <el-form-item label="附件">
              <up-file key="fileListKey" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow()">下一步➜</el-button>
      </div>
    </div>
    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm(1)">提交</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="submitForm(0)">保存</el-button>
        <el-button size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" :file-list="fileList" fullscreen="fullscreen" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getSupAssesmentByIdAndType, getBillFlow, saveSupplierAssesment } from '@/api/cggl/supplierAssesment'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'SupplierAssesmentEdit',
  components: {
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude,
    OrgSelect2
  },
  data() {
    return {
      id: null,
      type: null,
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        rate: null,
        remark: '',
        supplier: {
          fileList: [],
          cities: {
            name: ''
          }
        },
        type: null,
        typeName: ''
      },
      loading: false,
      activate: true,
      active: 0,
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      billFlow: null,
      isLoad: false,
      attitudePara: {},
      loadFlow: false,
      fileListKey: 0,
      rules: {}
    }
  },
  watch: {
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      if (this.$route.params.id && this.$route.params.type) {
        this.id = this.$route.params.id
        this.type = this.$route.params.type
      }
      if (this.id && this.type) {
        this.loading = true
        this.activate = false // 销毁部门组件
        await getSupAssesmentByIdAndType({ id: this.id, type: this.type }).then(response => this.setData(response))
      }
    },
    setData(response) {
      this.fileListKey++
      const { id, data, billFlowData, files } = response
      if (id) {
        if (data.state > 0) {
          this.closeThePage()
          this.$router.push({ name: 'SupplierAttitude', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
        }
        this.ruleForm = data
        this.ruleForm.supplier.fileList = files
        this.billFlow = billFlowData
        this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
        this.isLoad = true
        this.loading = false // loading 状态关闭
        this.activate = true // 加载部门组件
      } else {
        this.ruleForm = data
        this.ruleForm.supplier.fileList = files
        this.isLoad = true
        this.loading = false // loading 状态关闭
        this.activate = true // 加载部门组件
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    },
    openSupplier(id) {
      this.$router.push({ name: 'SupplierDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    // 根据表单获取流程
    getDynamicFlow() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const postData = { ...this.ruleForm }
          console.log(postData)
          getBillFlow(postData).then(response => {
            this.loading = false
            if (response.success) {
              this.billFlow = response.data.billFlow
              this.active = 1
            } else {
              this.$message(response.message)
            }
          }).catch(() => { this.loading = false })
        }
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    submitForm(state) {
      // 提交审批流程
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.ruleForm.state = state
          const billFlow = this.$refs.flowSelect.getBillFlow()
          console.log('获取的billFlow:', billFlow)
          this.ruleForm.billFlow = billFlow
          if (this.type === 1) {
            this.ruleForm.rate = -1
          }
          const postdata = {
            id: this.ruleForm.id,
            orgId: this.ruleForm.orgId,
            supplierId: this.id,
            state: this.ruleForm.state,
            rate: this.ruleForm.rate,
            type: this.type,
            remark: this.ruleForm.remark,
            billFlow: billFlow
          }

          saveSupplierAssesment(postdata).then(response => {
            this.closeThePage()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
