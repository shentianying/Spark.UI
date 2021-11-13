<template>
  <div class="app-container">
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
            {{ ruleForm.number }}
          </el-form-item>
          <el-form-item label="供应商">
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
          <el-form-item label="创建人">
            {{ ruleForm.createUserName }}
          </el-form-item>
          <el-form-item label="提交人">
            {{ ruleForm.submitUserName }}
          </el-form-item>
          <el-form-item label="最后修改人">
            {{ ruleForm.lastEditUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="所属部门">
            {{ orgStr }}
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
          <el-form-item v-if="ruleForm.type===2" label="星级">
            <el-rate v-model="ruleForm.rate" disabled />
          </el-form-item>
          <el-form-item label="备注">
            {{ ruleForm.remark }}
          </el-form-item>
          <el-form-item label="评审类型">
            {{ getTypeName(ruleForm.type) }}
          </el-form-item>
          <el-form-item label="创建日期">
            {{ ruleForm.createDate }}
          </el-form-item>
          <el-form-item label="提交日期">
            {{ ruleForm.submitDate }}
          </el-form-item>
          <el-form-item label="最后修改日期">
            {{ ruleForm.lastEditDate }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :show="true"
      :para="attitudePara"
      @update="updateFlow"
    >
      <template #saveBtn>
        <!--当前审批人拥有支付的操作-->
        <!-- <el-button v-if="showPayButton" size="mini" type="success">特殊操作，支付</el-button> -->
        <!--调用单据中controller操作-->
        <el-button size="mini" type="success" :loading="loading" @click="submitForm()">保存</el-button>
      </template>
      <template #otherBtn>
        <!-- <el-button size="mini" type="der">测试其他插槽</el-button> -->
      </template>
    </flow-attitude>

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
import { getSupAssesmentById, addAttitude } from '@/api/cggl/supplierAssesment'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
export default {
  name: 'SupplierAttitude',
  components: {
    UpFile,
    FlowSelect,
    FlowDisplay,
    FlowAttitude
  },
  data() {
    return {
      id: null,
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
      orgStr: '',
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'PlanDetailAdd',
      currentRow: null,
      billFlow: null,
      isLoad: false,
      attitudePara: {},
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
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.id) {
        this.loading = true
        await getSupAssesmentById({ id: this.id }).then(response => this.setData(response))
      }
    },
    setData(response) {
      console.log(response)
      const { data, orgStr, billFlowData, files } = response
      this.ruleForm = data
      this.ruleForm.supplier.fileList = files
      this.orgStr = orgStr
      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.isLoad = true
      this.loading = false // loading 状态关闭
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
    submitForm() {
      // 保存审批步骤
      // 1.调用组件中的验证
      // 2.获取表单参数数据
      // 3.请求 审批

      const result = this.$refs.flowAttitude.checkValidate()
      if (result) {
        var postData = this.$refs.flowAttitude.getPostData()
        this.loading = true
        addAttitude(postData).then(res => {
          if (res.success) {
            this.$message.success('保存成功')
            // 如果只填写意见不转下一步 需要子组件更新流程审批信息
            // if (this.type !== 2) {
            //   this.list = attitudeList
            // }
            this.closeThePage() // 跳转
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        }).catch(() => { this.loading = false })
      }
    },
    getTypeName(type) {
      if (type === 1) {
        return '入库评审'
      }
      if (type === 2) {
        return '星级评审'
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
