<template>
  <el-tabs v-model="currTab" class="app-container SubcontractorDetails">
    <el-tab-pane name="details">
      <template v-if="active === 1">
        <div slot="label" class="title"><i class="el-icon-info" />分包单位</div>
        <Detailsedit
          v-if="myDetails"
          status="checkInfo"
          :info-list="infoList"
          :label-width="labelWidth"
        />
        <div class="title"><i class="el-icon-info" />{{ title }}</div>
        <template v-if="type === 'details'">
          <TableEx
            class="padding-50"
            :show-count="false"
            :show-actions="false"
            :show-pagination="false"
            :size="size"
            :columns="table.columns"
            :table-loading="table.loading"
            :list="table.list"
          />
        </template>

        <el-form
          v-else
          ref="submitSetForm"
          :rules="submitRules"
          class="padding-50 firstForm"
          :inline="true"
          :model="submitSetForm"
          label-width="120px"
          :size="size"
        >
          <el-form-item prop="rate" label="评审级别:">
            <el-select v-model="submitSetForm.rate" placeholder="请选择" class="input-width">
              <el-option
                v-for="item in filter.rateList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="remark" label="评审说明:">
            <el-input v-model="submitSetForm.remark" placeholder="请输入" class="input-width" />
          </el-form-item>
        </el-form>
        <div class="actions">
          <el-button v-if="type !== 'details'" :size="size" type="primary" @click="nextStep('submitSetForm')">下一步</el-button>
        </div>
      </template>
      <!--流程显示-->
      <template v-if="active===2">
        <div slot="label" class="title">审批流程</div>
        <flow-select v-if="submitSetForm.billFlow" ref="flowSelect" class="form-card" :bill-flow="submitSetForm.billFlow" />
        <div class="botton-box">
          <template v-if="submitSetForm.state === 0">
            <el-button :size="size" type="primary" :loading="addbtnLoad" @click="submitForm(1)">提交</el-button>
            <el-button :size="size" @click="submitForm(0)">保存</el-button>
          </template>
          <el-button :size="size" @click="setActive(1)">上一步</el-button>
          <el-button :size="size" @click="back('SubcontractorEdit')">取消</el-button>
        </div>
      </template>
    </el-tab-pane>
    <el-tab-pane v-if="type === 'details'" name="ht">
      <div slot="label" class="title"><i class="el-icon-info" />分包合同</div>
      <TableEx
        class="padding-50"
        :show-count="false"
        :show-actions="false"
        :show-pagination="false"
        :size="size"
        :columns="htTable.columns"
        :table-loading="htTable.loading"
        :list="htTable.list"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Detailsedit from '@/components/Detailsedit'
import TableEx from '@/components/TableEx'
import FlowSelect from '@/components/Flow/flowSelect'
import { GetSubcontractorDetailById, GetSubcontractorById } from '@/api/fbgl/subcontractor'
import { GetBillFlow, AddSubcontractorAssesment, PutSubcontractorAssesment } from '@/api/fbgl/subcontractorAssesment'
export default {
  name: 'SubcontractorDetails',
  components: {
    Detailsedit,
    TableEx,
    FlowSelect
  },
  data() {
    return {
      size: 'mini',
      addbtnLoad: false,
      selectPlaceholder: '输入选择',
      inputPlaceholder: '请输入',
      type: 'details', // 审核:approval 详情:details 支付:pay 变更:alteration 回收:recycle, reviewStar: 评审星级
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      myDetails: null,
      currTab: 'details',
      labelWidth: 140,
      firstForm: {
        companyId: '',
        orgId: ''
      },
      submitSetForm: {
        id: 0,
        rate: '',
        remark: '',
        subcontractorId: '',
        state: 0,
        billFlow: null
      },
      submitRules: {
        rate: [
          { required: true, message: '请选择星级', trigger: 'change' }
        ]
      },
      table: {
        columns: [
          {
            label: '评审编号', // 表头
            minWidth: '150', // 最小宽度
            prop: 'number',
            class: 'link',
            click: (row) => this.handleDetails(row)
          },
          {
            label: '摘要', // 表头
            minWidth: '180', // 最小宽度
            prop: 'summary'
          },
          {
            label: '状态', // 表头
            minWidth: '80', // 最小宽度
            prop: 'stateName'
          },
          {
            label: '更新日期', // 表头
            minWidth: '120', // 最小宽度
            format: 'date',
            prop: 'lastEditDate'
          },
          {
            label: '提交人', // 表头
            minWidth: '120', // 最小宽度
            prop: 'submitUserName'
          }
        ],
        list: [],
        loading: false
      },
      htTable: {
        columns: [
          {
            label: '评审编号', // 表头
            minWidth: '150', // 最小宽度
            prop: 'number'
          },
          {
            label: '项目', // 表头
            minWidth: '180', // 最小宽度
            prop: 'projectName'
          },
          {
            label: '组织机构', // 表头
            minWidth: '120', // 最小宽度
            prop: 'orgName'
          },
          {
            label: '分包部位', // 表头
            minWidth: '120', // 最小宽度
            prop: 'subPart'
          },
          {
            label: '合同额', // 表头
            minWidth: '150', // 最小宽度
            prop: 'contractAmount',
            format: 'money'
          }
        ],
        list: [],
        loading: false
      },
      filter: {
        rateList: []
      }
    }
  },
  computed: {
    title() {
      const { type } = this
      return type === 'details' ? '星级评审记录' : '星级评审'
    },
    infoList() {
      const {
        myDetails: {
          data: {
            number,
            orgStr,
            name,
            subContractorType,
            address,
            postAddress,
            capital,
            mainBusiness,
            corporation,
            entrustedAgent,
            phone,
            tel,
            fax,
            email,
            regDate,
            taxpayerType,
            workerNum,
            isForbidden,
            bussinessType,
            projectType,
            businessCity,
            postCertificate,
            remark,
            createDate,
            createUserName,
            currentRateDate,
            lastEditUserName,
            lastEditDate,
            rate,
            licenseUpFile,
            licenseStart,
            licenseEnd,
            accountUpFile,
            corporationUpFile,
            infoUpFile,
            deliveryStatementUpFile,
            taxpayerCerUpFile,
            qualificationUpFile,
            qualificationNum,
            regScopeStart,
            regScopeEnd,
            safetyUpFile,
            safetyCerNum,
            safetyPeriodStart,
            safetyPeriodEnd,
            financeReportUpFile,
            upFile
          }
        }
      } = this
      // 数据格式化
      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      return [
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        { label: '单位名称', value: name },
        { label: '分包类型', value: subContractorType },
        { label: '注册地址', value: address },
        { label: '邮寄地址', value: postAddress },
        { label: '注册资本', value: m(capital), unit: '万元' },
        { label: '经营范围', value: mainBusiness },
        { label: '法定代表人', value: corporation },
        { label: '委托代理人', value: entrustedAgent },
        { label: '手机', value: phone },
        { label: '固话', value: tel },
        { label: '传真', value: fax },
        { label: '邮箱', value: email },
        { label: '成立日期', value: d(regDate) },
        { label: '纳税人性质', value: taxpayerType },
        { label: '工人数量', value: workerNum },
        { label: '是否禁用', value: isForbidden ? '是' : '否' },
        { label: '可承接业务类型', value: bussinessType.join('、') },
        { label: '可承接工程类型', value: projectType.join('、') },
        { label: '可施工区域', monopolize: true, value: businessCity.join('、') },
        { label: '上岗证书', value: postCertificate },
        { label: '备注', value: remark },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '星级', value: rate },
        { label: '评审时间', value: currentRateDate },
        { label: '营业执照', monopolize: true, component: 'UpFile', value: licenseUpFile },
        { label: '营业期限', monopolize: true, value: `${d(licenseStart)} 至 ${d(licenseEnd)}` },
        { label: '开户许可证', monopolize: true, component: 'UpFile', value: accountUpFile },
        { label: '法定代表人身份证明', monopolize: true, component: 'UpFile', value: corporationUpFile },
        { label: '分包考察资料', monopolize: true, component: 'UpFile', value: infoUpFile },
        { label: '送达声明', monopolize: true, component: 'UpFile', value: deliveryStatementUpFile },
        { label: '纳税人信息证明', monopolize: true, component: 'UpFile', value: taxpayerCerUpFile },
        { label: '施工资质证书  ', monopolize: true, component: 'UpFile', value: qualificationUpFile },
        { label: '编号', value: qualificationNum },
        { label: '登记范围', value: `${regScopeStart}${regScopeEnd}` },
        { label: '安全生产许可证', monopolize: true, component: 'UpFile', value: safetyUpFile },
        { label: '编号', value: safetyCerNum },
        { label: '有效期', value: `${d(safetyPeriodStart) || ''} 至 ${d(safetyPeriodEnd) || ''}` },
        { label: '财务审计报告', monopolize: true, component: 'UpFile', value: financeReportUpFile },
        { label: '其他附件', monopolize: true, component: 'UpFile', value: upFile }
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
      const { id, type, subcontractorAssesmentId } = this.$route.query
      this.myId = id
      this.active = 1
      this.currTab = 'details'
      this.submitSetForm.subcontractorId = Number(id)
      this.submitSetForm.id = Number(subcontractorAssesmentId) || 0
      this.type = type
      const rateList = this.$route.query.rateList ? JSON.parse(this.$route.query.rateList) : []
      this.filter.rateList = rateList
      this.fetchData()
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      GetSubcontractorDetailById({ id: this.myId }).then(res => {
        this.myDetails = res
        this.htTable.list = res.subcontractList
        this.table.list = res.data.subcontractorAssesment
        if (res.data.rate === '不合格') {
          this.filter.rateList.forEach(el => {
            if (el.name !== '合格') {
              el.disabled = true
            }
          })
        }
      })
      GetSubcontractorById({ id: this.myId }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
      })
    },
    /*
     *下一步
     */
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getBillFlow()
        }
      })
    },
    getBillFlow() {
      // 获取流程数据
      const { state, billFlow } = this.submitSetForm
      const req = {
        ...this.firstForm,
        ...this.submitSetForm,
        state: state || 0
      }
      if (billFlow) req.billFlowId = billFlow.id
      delete req.billFlow
      GetBillFlow(req).then(({ data, success, message }) => {
        if (success) {
          this.submitSetForm.billFlow = data.billFlow
          this.setActive(2)
        } else {
          this.$message.error(message)
        }
      })
    },
    /**
     * 修改填报进度
     */
    setActive(active) {
      this.active = active
    },
    /**
     * 提交表单
     * @param {Number} state 提交类型，0：保存；1：提交; 10000: 修改
     */
    submitForm(state) {
      const req = {
        ...this.firstForm,
        ...this.submitSetForm,
        state
      }
      if (this.submitSetForm.billFlow) {
        // 获取流程组件中的数据
        const billFlow = this.$refs.flowSelect.getBillFlow()
        if (!billFlow) {
          return false
        }
        req.billFlow = billFlow
      } else {
        this.$message.error('流程数据不能为空')
        return
      }
      if (req.id) {
        PutSubcontractorAssesment(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back('SubcontractorIndex')
        })
      } else {
        this.addbtnLoad = true
        AddSubcontractorAssesment(req).then(() => {
          // 添加
          this.$message.success('提交成功')
          this.back('SubcontractorIndex')
        }).finally(() => {
          this.addbtnLoad = false
        }).catch(() => {
          this.addbtnLoad = false
        })
      }
    },
    /**
     * 返回上一页，并关闭当前页
     */
    back(refreshRouterName) {
      // this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
      this.utils.closeAndRefresh(refreshRouterName)
    },
    /**
     * @description: 跳转到对应的评审页面
    */
    handleDetails(row, type = 'details') {
      this.$router.push({ name: 'SubcontractorAssesmentDetails', query: { type, id: row.id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>

<style lang="scss" scoped>
.SubcontractorDetails {
  /deep/.el-form.firstForm {
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
  .common-content {
    margin-bottom: 20px;
  }
  .padding-50{
    padding: 10px 50px;
  }
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .actions{
    margin-left: 100px;
  }
  .botton-box {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
