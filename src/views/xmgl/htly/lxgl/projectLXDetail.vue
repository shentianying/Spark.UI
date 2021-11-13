<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      label-width="200px"
      class=""
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="编号：">
            {{ projectForm.number }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="项目名称：">
            {{ ruleForm.name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="地区：">
            {{ ruleForm.organization.name }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程性质：">
            {{ engPropertiesName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="合作模式：">
            {{ managementiStateName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="结构：">
            {{ structureName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="信息来源：">
            {{ informationSourceName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="计税方式：">
            {{ taxTypeName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="项目性质：">
            {{ projectPropertyName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="税率：">
            {{ ruleForm.taxRate }}%
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="甲方名称：">
            {{ ruleForm.firstPartyName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="地址：">
            {{ ruleForm.address }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="合同签订日期：">
            {{ ruleForm.signDate2 | dateTimeFormat }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="合同上报日期：">
            {{ ruleForm.signDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="幢数：">
            {{ ruleForm.buildNum }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="层数：">
            {{ ruleForm.levelNum }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="建筑面积：">
            {{ ruleForm.area }}㎡
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="合同工期：">
            {{ ruleForm.contractDuration }}天
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="合同开工日期：">
            {{ ruleForm.contractStartDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="合同竣工日期：">
            {{ ruleForm.contractFinishDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="合同金额：">
            {{ ruleForm.planAmount }}元
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="预计总产值：">
            {{ ruleForm.planAmount }}元
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="质保期/质保金一阶段：">
            {{ ruleForm.warrantyDays1 }}天
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="一阶段比例：">
            {{ ruleForm.warrantyRate1 }}%
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="质保期/质保金二阶段：">
            {{ ruleForm.warrantyDays2 }}天
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="二阶段比例：">
            {{ ruleForm.warrantyRate2 }}%
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="质保期/质保金三阶段：">
            {{ ruleForm.warrantyDays3 }}天
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="三阶段比例：">
            {{ ruleForm.warrantyRate3 }}%
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="质保期/质保金四阶段：">
            {{ ruleForm.warrantyDays4 }}天
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="四阶段比例：">
            {{ ruleForm.warrantyRate4 }}%
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="项目状态：">
            {{ stateName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="竣工日期：">
            {{ ruleForm.finishDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="结算日期：">
            {{ ruleForm.settleDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="项目特性：">
            {{ proPropertiesName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否使用：" prop="inUse">
            <el-switch
              v-model="ruleForm.inUse"
              disabled
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="计划利润：">
            {{ ruleForm.planProfit }}元
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="付款方式：">
            {{ ruleForm.payState }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="甲供材：">
            {{ ruleForm.materialsFirst }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="其他描述：">
            {{ ruleForm.othDescribe }}
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

      <!-- <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="上传附件">
            <up-file
              v-model="fileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="fileList"
            >

            </up-file>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :para="attitudePara"
      @update="updateFlow"
    />
  </div>
</template>

<script>
import { getProjectAttitudeById } from '@/api/xmgl/project'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
// import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'ProjectLXDetail',
  components: {
    FlowAttitude,
    FlowDisplay
    // UpFile
  },
  data() {
    return {
      ruleForm: {
        orgId: 0,
        managementiState: 0,
        inUse: true,
        organization: {
          name: ''
        }
      },
      projectForm: {
        companyId: this.$store.state.user.selectOrgId,
        number: '',
        projectId: 0,
        state: 0,
        billFlowId: 0
      },
      fileList: [],
      engPropertiesName: '',
      managementiStateName: '',
      structureName: '',
      informationSourceName: '',
      taxTypeName: '',
      projectPropertyName: '',
      proPropertiesName: '',
      stateName: '',
      projectId: null,

      isLoad: false,
      attitudePara: null,
      billFlow: null
    }
  },
  created() {
  },
  mounted() {
    this.initData()
  },
  activated() {
  },
  methods: {
    initData() {
      this.projectId = this.$route.query.id
      if (this.projectId) {
        getProjectAttitudeById({ id: this.projectId }).then((response) => {
          const { data, files, dictionaries, billFlowData } = response
          // const { data } = response
          this.ruleForm = data.project
          this.projectForm = data
          this.fileList = files
          dictionaries.forEach(element => {
            if (element.type === 'engProperties') {
              this.engPropertiesName = element.name
            }
            if (element.type === 'managementiState') {
              this.managementiStateName = element.name
            }
            if (element.type === 'structureType') {
              this.structureName = element.name
            }
            if (element.type === 'informationSource') {
              this.informationSourceName = element.name
            }
            if (element.type === 'taxType') {
              this.taxTypeName = element.name
            }
            if (element.type === 'projectProperty') {
              this.projectPropertyName = element.name
            }
            if (element.type === 'proProperties') {
              this.proPropertiesName = element.name
            }
            if (element.type === 'projectState') {
              this.stateName = element.name
            }
          })
          this.billFlow = billFlowData
          this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
          this.isLoad = true // 加载审批组件
        })
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    updateFlow() {
      this.closeThePage()
    }
  }
}
</script>
