<template>
  <div class="alteration">

    <div class="title"><i class="el-icon-info" />变更信息</div>

    <template v-if="type === 'approval'">
      <Detailsedit
        v-if="alterationInfo && alteration.state !== 0"
        status="checkInfo"
        :info-list="alterationInfo"
      />
      <el-form
        v-if="alterationInfo && alteration.state === 0 && isCurrUser"
        ref="approvalForm"
        class="my-form"
        :inline="true"
        :model="approvalForm"
        :rules="alterationRules"
        label-width="120px"
        :size="size"
      >
        <el-form-item label="经手人工号:" prop="personId" :rules="alterationRules.text">
          <PersonSelect v-model="approvalForm.personId" props-label="number" :multiple="false" :size="size" class="input-width" @select="selectPerson2" />
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="approvalForm.person.name" disabled placeholder="请选择经手人" class="input-width" />
        </el-form-item>
        <el-form-item label="回收日期:" prop="returnDate" :rules="alterationRules.date">
          <el-date-picker
            v-model="approvalForm.returnDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            class="input-width"
          />
        </el-form-item>
        <el-form-item />
        <el-form-item prop="reason" label="变更原因:" :rules="alterationRules.text">
          <el-input v-model="approvalForm.reason" placeholder="请输入" class="input-width" type="textarea" />
        </el-form-item>
        <el-form-item />
        <el-form-item label="附件:">
          <up-file
            v-model="approvalForm.fileList"
            :file-size="100"
            :is-preview="true"
            :is-upfile="true"
            :is-delete="true"
          />
        </el-form-item>
        <el-form-item />
        <el-form-item label=" ">
          <el-button :size="size" type="primary" @click="saveFlow(approvalForm)">保存</el-button>
        </el-form-item>

      </el-form>
      <flow-display v-if="alteration.billFlow" ref="flowDisplay" :bill-flow="alteration.billFlow" />
      <flow-attitude
        v-if="attitudePara"
        ref="flowAttitude"
        show
        :para="attitudePara"
        @update="updateFlow"
      >
        <template v-slot:saveBtn="{attitudeType}">
          <el-button v-if="attitudeType===4" :loading="saveLoading" type="success" :size="size" @click="invalidForm()">保存</el-button>
          <el-button :loading="saveLoading" type="success" :size="size" @click="saveFlow(alteration)">保存</el-button>
        </template>
      </flow-attitude>
    </template>
    <template v-else>
      <el-form
        v-if="currStep === 1"
        ref="alterationForm"
        class="padding-50 my-form"
        :inline="true"
        :model="alterationForm"
        :rules="alterationRules"
        label-width="120px"
        :size="size"
      >
        <el-form-item label="经手人工号:" prop="personId" :rules="alterationRules.text">
          <PersonSelect v-model="alterationForm.personId" props-label="number" :multiple="false" :size="size" class="input-width" @select="selectPerson" />
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="alterationForm.name" disabled placeholder="请选择经手人" class="input-width" />
        </el-form-item>
        <el-form-item label="回收日期:" prop="returnDate" :rules="alterationRules.date">
          <el-date-picker
            v-model="alterationForm.returnDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            class="input-width"
          />
        </el-form-item>
        <el-form-item />
        <el-form-item prop="reason" label="变更原因:" :rules="alterationRules.text">
          <el-input v-model="alterationForm.reason" placeholder="请输入" class="input-width" type="textarea" />
        </el-form-item>
        <el-form-item />
        <el-form-item label="附件:">
          <up-file
            v-model="alterationForm.fileList"
            :file-size="100"
            :is-preview="true"
            :is-upfile="true"
            :is-delete="true"
          />
        </el-form-item>
        <el-form-item />
        <el-form-item label=" ">
          <el-button :size="size" type="primary" @click="nextStep('alterationForm')">下一步</el-button>
        </el-form-item>

      </el-form>
      <!--流程显示-->
      <template v-if="currStep===2">
        <FlowSelect v-if="alterationForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="alterationForm.billFlow" />
        <div class="botton-box">
          <!-- <template v-if="firstForm.state === 0">
          <el-button :size="size" type="primary" @click="submitForm(1)">提交</el-button>
          <el-button :size="size" @click="submitForm(0)">保存</el-button>
        </template> -->
          <el-button :size="size" type="primary" @click="submitForm(1)">提交</el-button>
          <el-button :size="size" @click="setActive(1)">上一步</el-button>
          <el-button :size="size" @click="back()">取消</el-button>
        <!-- <el-button v-if="firstForm.id && firstForm.state === 0" :size="size" @click="invalidForm()">作废</el-button> -->
        <!-- <el-button :size="size" @click="back()">取消</el-button> -->
        </div>
      </template>
    </template>

  </div>
</template>

<script>
import FlowSelect from '@/components/Flow/flowSelect'
import PersonSelect from '@/components/SearchBar/form/PersonSelect'
import UpFile from '@/components/UpLoad/UpFile'
import FlowAttitude from '@/components/Flow/flowAttitude'
import Detailsedit from '@/components/Detailsedit'
import FlowDisplay from '@/components/Flow/flowDisplay'
import { GetModifyBillFlow, AddDepositModify, CheckDepositModify, DeleteDepositModify } from '@/api/cwgl/Deposit.js'
export default {
  components: {
    PersonSelect,
    UpFile,
    FlowSelect,
    FlowAttitude,
    Detailsedit,
    FlowDisplay
  },
  props: {
    type: { // 审批:approval 新增:add
      type: String,
      default: 'add'
    },
    alteration: { // 变更信息
      type: Object,
      default: null
    },
    details: { // 详情信息
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      size: 'mini',
      currStep: 1, // 步骤
      saveLoading: false,
      approvalForm: {
        person: {
          number: '',
          name: ''
        },
        reason: '',
        returnDate: '',
        fileList: []
      },
      alterationForm: {
        billFlow: null,
        depositId: '',
        state: 1,
        id: 0,
        personId: '',
        name: '',
        returnDate: '',
        reason: '',
        fileList: []
      },
      alterationRules: {
        text: [{ required: true, message: '请输入内容', trigger: 'change' }],
        date: [{ required: true, message: '请输入日期', trigger: 'change' }]
      }
    }
  },
  computed: {
    isCurrUser() {
      return this.$store.state.user.uid === this.alteration.createUserId
    },
    attitudePara() {
      const { billFlow, id, billFlowId } = this.alteration
      return { formId: billFlow?.formId, billFlowId, planId: id }
    },
    alterationInfo() {
      const {
        person: {
          number,
          name
        },
        reason,
        returnDate,
        upFile
      } = this.alteration

      // 数据格式化
      // const m = (val) => this.utils.formatMoney(val, 2, 4)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      // const a = this.utils.amountInWords

      return [
        { label: '经手人工号', value: number },
        { label: '经手人', value: name },
        { label: '回收日期', value: d(returnDate), monopolize: true },
        { label: '变更原因', value: reason, monopolize: true },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true }
      ]
    }
  },
  watch: {
    details: {
      immediate: true,
      handler(val) {
        if (val && !this.isSetSlterationForm) {
          const {
            person: {
              name
            },
            personId,
            planReturnDate,
            upFile
          } = val.data
          Object.assign(this.alterationForm, { returnDate: planReturnDate, name, personId, fileList: upFile || [] })
        }
      }
    },
    alteration: {
      immediate: true,
      handler(val) {
        if (val) {
          if (this.type === 'add') {
            const {
              person: {
                name
              },
              personId,
              reason,
              returnDate,
              upFile
            } = val
            this.isSetSlterationForm = true
            Object.assign(this.alterationForm, { returnDate, name, reason, personId, fileList: upFile || [] })
          } else {
            this.approvalForm = { ...val, fileList: val.upFile || [] }
          }
        }
      }
    }
  },
  methods: {
    invalidForm() {
      this.$confirm('是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        // const attitude = this.$refs.flowAttitude.getPostData()
        DeleteDepositModify({ id: this.alteration.id }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.goBack() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.saveLoading = false
        })
      })
    },
    saveFlow(depositModify = this.alteration) {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        const attitude = this.$refs.flowAttitude.getPostData()
        CheckDepositModify({ attitude, depositModify }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.goBack() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.saveLoading = false
        })
      })
    },
    /**
     * 返回上一页，并关闭当前页
     */
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    selectPerson2(user) {
      Object.assign(this.approvalForm.person, user)
    },
    selectPerson(user) {
      this.alterationForm.personId = user.id
      this.alterationForm.name = user.name
    },
    setActive(curr) {
      this.currStep = curr
    },
    submitForm() {
      const { id, personId, PlanReturnDate } = this.details.data
      const req = {
        ...this.alterationForm,
        depositId: id,
        formerPersonId: personId,
        formerReturnDate: PlanReturnDate
      }

      if (this.alterationForm.billFlow) {
        const billFlow = this.$refs.flowSelect.getBillFlow()
        if (billFlow) {
          req.billFlow = billFlow
          AddDepositModify(req).then((res) => {
          // 添加
            this.$message.success(res.message)
            this.goBack()
          })
        } else {
          return this.$message.error('获取流程数据失败')
        }
      } else {
        return this.$message.error('流程数据不能为空')
      }
    },
    /**
     * 提交审批意见以后的回调函数
     */
    updateFlow() {
      // 直接返回
      this.goBack()
    },
    /**
     * @description: 变更下一步
     */
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 获取流程数据
          const { data: { id, personId, PlanReturnDate, orgId }} = this.details
          const req = {
            ...this.alterationForm,
            orgId,
            depositId: id,
            formerPersonId: personId,
            formerReturnDate: PlanReturnDate
          }
          if (this.alteration?.billFlowData) req.billFlowId = this.alteration.billFlowData.id
          GetModifyBillFlow(req).then(({ data, success, message }) => {
            if (success) {
              this.alterationForm.billFlow = data.billFlow
              this.setActive(2)
            } else {
              this.$message.error(message)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.alteration{
  .botton-box {
    margin-top: 40px;
    text-align: center;
  }
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }
  /deep/.el-form.my-form {
  .el-form-item{
    width:45%
  }
  .input-width {
    width: 272px;
  }
  .el-form-item__label{
    font-weight: normal;
    color: #101010;
    }
  }
  .padding-50{
    padding: 10px 50px;
  }
}

</style>
