<template>
  <div class="app-container EntertainmentDetail">
    <div class="title"><i class="el-icon-info" />招待费计划详情</div>
    <Detailsedit
      v-if="myDetails"
      status="checkInfo"
      :info-list="infoList"
    />
    <div class="dashLine" />
    <TableEx
      ref="TableEx"
      :size="size"
      :show-actions="false"
      :columns="entertainmentPlantable.columns"
      :table-loading="entertainmentPlantable.tbLoading"
      :list="entertainmentPlantable.list"
      :show-count="false"
      :show-pagination="false"
    />
    <!-- <template v-slot:actions="{row}">
        <el-button :size="size" type="text" @click="handleDel(row,'del')">删除</el-button>
      </template> -->
    <flow-display v-if="billFlowData" ref="flowSelect" :is-edit="true" :bill-flow="billFlowData" />
    <flow-attitude
      v-if="attitudePara"
      ref="flowAttitude"
      :to-content="!showPayButton"
      show
      :para="attitudePara"
      @update="updateFlow"
    >
      <template v-slot:saveBtn="{attitudeType}">
        <el-button v-if="attitudeType === 1 || attitudeType===2" :loading="saveLoading" type="success" :size="size" @click="saveFlow()">保存</el-button>
      </template>
    </flow-attitude>
  </div>
</template>

<script>
import TableEx from '@/components/TableEx'
import Detailsedit from '@/components/Detailsedit'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import { formatMoney } from '@/utils'

import { GetDepositById, CheckEntertainmentPlan } from '@/api/cwgl/EntertainmentPlan'
export default {
  name: 'EntertainmentPlanDetails',
  components: {
    TableEx,
    Detailsedit,
    FlowDisplay,
    FlowAttitude
  },
  data() {
    return {
      type: 'details', // 审核:approval 详情:details
      size: 'mini',
      capitalType: 1,
      amount: '',
      filter: {
        stateOptions: [ // 状态数组
        ]
      },
      activeNames: ['0', '1', '2'], // 展开的折叠面板
      saveLoading: false,
      payLoading: false,
      myDetails: null, // 详情数据
      billFlowData: null, // 流程信息
      attitudePara: null, // 审批信息
      showPayButton: false,
      entertainmentPlan: {
        id: '',
        orgId: '',
        companyId: '',
        number: '',
        personId: '',
        date: '',
        applicationAmount: '',
        amount: '',
        isBussinessFee: null,
        bussinessInfoid: '',
        summary: '',
        remark: '',
        year: '',
        state: '',
        entertainmentPlanDetails: []
      }, // 招待费计划参数
      entertainmentPlantable: {
        columns: [
          { label: '序号',
            minWidth: '80', // 最小宽度
            type: 'index'
          },
          { label: '姓名',
            minWidth: '100', // 最小宽度
            prop: 'name'
          },
          {
            label: '单位',
            prop: 'unit',
            minWidth: '180'
          },
          {
            label: '职务',
            prop: 'position',
            minWidth: '180'
          },
          {
            align: 'right',
            label: '申请金额',
            prop: 'applicationAmount',
            format: 'money',
            minWidth: '180'
          },
          {
            // label: '金额',
            // prop: 'amount',
            // format: 'money',
            // minWidth: '180'
            render: (h) => {
              return (
                <el-table-column minWidth='120' align='right' label='批准金额' scopedSlots={{ default: ({ row }) => {
                  if (this.entertainmentPlan.state === 1) {
                    return (<el-input
                      vModel={row.amount}
                      onInput={ ($event) => {
                        row.amount = $event.replace(/\d+(\.)\d{3}?/g, '')
                        if (row.amount > row.applicationAmount) {
                          row.amount = ''
                          this.$message('批准金额不能大于申请金额!')
                        }
                      } }
                      size='mini'
                      onBlur={this.calculateAmount}
                      placeholder='输入金额'/>
                    )
                  } else {
                    return formatMoney(row.amount, 2, 0)
                  }
                } }} />
              )
            }
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '180'
          }
        ],
        list: [
          // {
          //   id: 1,
          //   entertainmentPlanId: '', // 详情id
          //   socialResourceId: '', // 社会资源id
          //   name: '', // 姓名
          //   position: '', // 职务
          //   unit: '', // 单位
          //   applicationAmount: '', // 申请金额
          //   amount: '', // 批准金额
          //   remark: '' // 备注
          // }
        ],
        tbLoading: false
      }
    }
  },
  computed: {
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          orgStr,
          stateName,
          data: {
            person,
            number,
            isBussinessFee,
            applicationAmount,
            date,
            remark,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate,
            submitUserName,
            submitDate,
            summary
          }
        }
      } = this

      const m = (val) => this.utils.formatMoney(val, 2, 0)
      const d = (dataStr) => dataStr ? this.$moment(dataStr).format('YYYY-MM-DD') : dataStr
      const info = [
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '提交人', value: submitUserName },
        { label: '提交时间', value: submitDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: stateName }
      ]
      return [
        { label: '编号', value: number },
        { label: '部门', value: orgStr },
        { label: '姓名', value: person.name },
        { label: '日期', value: d(date) },
        { label: '项目运营费用', value: isBussinessFee ? '是' : '否' },
        { label: '金额', value: m(applicationAmount) },
        { label: '事由', value: summary },
        { label: '备注', value: remark },
        ...(this.type === 'details' ? info : [])
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
      const { id, type } = this.$route.query
      this.type = type
      this.myId = id
      this.fetchData()
    },
    async fetchData() {
      if (!this.myId) return
      GetDepositById({ id: this.myId }).then(res => {
        // 给招待费计划信息数据赋值
        const form = this.entertainmentPlan
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            form[key] = res.data[key] || form[key]
          }
        }
        this.entertainmentPlan.isBussinessFee = res.data.isBussinessFee
        this.billFlowData = res.billFlowData
        this.myDetails = res
        this.entertainmentPlantable.list = res.data.entertainmentPlanDetails
        this.attitudePara = { formId: res.billFlowData.formId, billFlowId: res.data.billFlowId, planId: res.data.id }
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      })
    },
    saveFlow() {
      this.$confirm('是否确定保存？', '提示', {
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        this.entertainmentPlan.entertainmentPlanDetails = this.entertainmentPlantable.list
        const attitude = this.$refs.flowAttitude.getPostData()
        if (attitude.attitudeType === 1 || attitude.attitudeType === 2) {
          if (!this.amount) {
            this.saveLoading = false
            return this.$message.error('请填写批准金额')
          }
          if (Number(this.amount) > this.myDetails.data.applicationAmount) {
            this.saveLoading = false
            return this.$message.error('批准金额不能大于申请金额')
          }
        }
        CheckEntertainmentPlan({ attitude, entertainmentPlan: this.entertainmentPlan }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.goBack() // 跳转
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.saveLoading = false
        }).catch(() => {
          this.saveLoading = false
        })
      })
    },
    /**
     * 提交审批意见以后的回调函数
     */
    updateFlow() {
      // 直接返回
      this.goBack()
    },
    /**
     * 计算批准金额是否超出申请金额
     */
    calculateAmount() {
      let allAmount = 0
      this.entertainmentPlantable.list.forEach(e => {
        allAmount += +e.amount
      })
      this.amount = allAmount
      this.entertainmentPlan.amount = allAmount
    },
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style lang="scss" scoped>
.EntertainmentDetail {
 padding-bottom: 70px;
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }
  .dashLine {
    height: 1px;
    border-top: 1px dashed #cecece;
    margin: 20px 0;
  }

}
</style>
