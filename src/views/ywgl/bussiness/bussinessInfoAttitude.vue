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
          <el-form-item label="编号：" prop="number">
            {{ ruleForm.number }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="组织机构：" prop="orgId">
            {{ orgStr }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="专业类型：" prop="professionalType">
            <span v-if="professionalTypeList && ruleForm.professionalType">{{ professionalTypeList.find(f => f.value === ruleForm.professionalType).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="信息来源：" prop="informationSource">
            <span v-if="informationSourceList && ruleForm.informationSource">{{ informationSourceList.find(f => f.value === ruleForm.informationSource).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="所属区域：" prop="area">
            <span v-if="areaList && ruleForm.area">{{ areaList.find(f => f.id === ruleForm.area).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="合作模式：" prop=" cooperationMode">
            <span v-if="cooperationModeList && ruleForm.cooperationMode">{{ cooperationModeList.find(f => f.value === ruleForm.cooperationMode).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="市场类别：" prop="marketCategory">
            <span v-if="marketCategoryList && ruleForm.marketCategory">{{ marketCategoryList.find(f => f.value === ruleForm.marketCategory).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="进展情况：" prop="progress">
            <span v-if="progressList && ruleForm.progress">{{ progressList.find(f => f.value === ruleForm.progress).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程名称：" prop="projectName">
            {{ ruleForm.projectName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="项目调研分析" prop="projectSurvey">
            {{ ruleForm.projectSurvey }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="总包单位：" prop="generalContractor">
            {{ ruleForm.generalContractor }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="建设单位：" prop="builder">
            {{ ruleForm.builder }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="发包单位：" prop="developer">
            <el-link @click="viewCustomer(ruleForm.developer)"><span v-if="ruleForm.customer">{{ ruleForm.customer.name }}</span></el-link>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人：" prop="linkMan">
            {{ ruleForm.linkMan }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="居间人：" prop="intermediary">
            {{ ruleForm.intermediary }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="居间人电话：" prop="intermediaryTel">
            {{ ruleForm.intermediaryTel }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程地址：" prop="address">
            {{ ruleForm.address }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="房屋性质：" prop="houseProperty">
            <span v-if="housePropertyList && ruleForm.houseProperty">{{ housePropertyList.find(f => f.value === ruleForm.houseProperty).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="幢数层数：" prop="floors">
            {{ ruleForm.floors }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="结构类型：" prop="buildingStructure">
            {{ ruleForm.buildingStructure }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="装饰面积：" prop="decorationArea">
            {{ ruleForm.decorationArea }}平方米
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="总建筑面积：" prop="totalArea">
            {{ ruleForm.totalArea }}平方米
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程造价：" prop="cost">
            {{ ruleForm.cost }}万元
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="付款条件：" prop="paymentTerms">
            {{ ruleForm.paymentTerms }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="招标形式：" prop="tenderMode">
            <span v-if="tenderModeList && ruleForm.tenderMode">{{ tenderModeList.find(f => f.value === ruleForm.tenderMode).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标截止时间：" prop="tenderEndDate">
            {{ ruleForm.tenderEndDate }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="暂定开工日期：" prop="startDate">
            {{ ruleForm.startDate }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="暂定竣工日期：" prop="finishDate">
            {{ ruleForm.finishDate }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="对接人员：" prop="dockPerson">
            {{ getDockPerson(ruleForm.dockPerson) }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟进深度：" prop="trackDepth">
            <span v-if="trackDepthList && ruleForm.trackDepth">{{ trackDepthList.find(f => f.value === ruleForm.trackDepth).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="营销经理部经理：" prop="marketingManager">
            {{ ruleForm.manager.name }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="营销经理部成员：" prop="marketingMember">
            {{ ruleForm.marketingMemberNames }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="标段划分情况：" prop="tenderSections">
            {{ ruleForm.tenderSections }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="其他说明：" prop="remark">
            {{ ruleForm.remark }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="主要竞争对手：" prop="competitors">
            {{ ruleForm.competitors }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="状态：" prop="formState">
            {{ getFormState(ruleForm) }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="发包单位资信调查表：">
            <up-file v-model="ruleForm.zxdcbFileList" :is-preview="true" :file-list="ruleForm.zxdcbFileList" />
          </el-form-item>

          <el-form-item label="定标流程：">
            <up-file v-model="ruleForm.dblcFileList" :is-preview="true" :file-list="ruleForm.dblcFileList" />
          </el-form-item>

          <el-form-item label="营销经理部责任书:">
            <up-file v-model="ruleForm.zrsFileList" :is-preview="true" :file-list="ruleForm.zrsFileList" />
          </el-form-item>

          <el-form-item label="营销策划书：">
            <up-file v-model="ruleForm.chsFileList" :is-preview="true" :file-list="ruleForm.chsFileList" />
          </el-form-item>

          <el-form-item label="业主组织机构图：">
            <up-file v-model="ruleForm.zzjgFileList" :is-preview="true" :file-list="ruleForm.zzjgFileList" />
          </el-form-item>

          <el-form-item label="其他：">
            <up-file v-model="ruleForm.qtFileList" :is-preview="true" :file-list="ruleForm.qtFileList" />
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
          <el-form-item label="创建时间：">
            {{ ruleForm.createDate | dateTimeFormat }}
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
            {{ ruleForm.lastEditDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="立项提交人：">
            {{ ruleForm.submitUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="立项提交日期：">
            {{ ruleForm.submitDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟踪人：" prop="trackPerson">
            {{ ruleForm.person.name }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟踪级别：" prop="traceLevel">
            <span v-if="traceLevelList && ruleForm.traceLevel">{{ traceLevelList.find(f => f.value === ruleForm.traceLevel).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="目前现场情况：" prop="currentStatus">
            {{ ruleForm.currentStatus }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="现场情况日期：" prop="currentStatusDate">
            {{ ruleForm.currentStatusDate }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="进展情况：">
            {{ }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟进要求：">
            <span v-if="trackLevelList && ruleForm.trackLevel">{{ trackLevelList.find(f => f.value === ruleForm.trackLevel).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="可靠程度：">
            <span v-if="reliableLevelList && ruleForm.reliableLevel">{{ reliableLevelList.find(f => f.value === ruleForm.reliableLevel).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="重要程度：">
            <el-switch v-model="ruleForm.isImportant" active-text="重要" inactive-text="一般" disabled />
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
    />

  </div>
</template>

<script>
import { getBussinessInfoEditInit, getBussinessInfoWithAttitudeById, putBussinessInfoTraceLevel } from '@/api/ywgl/bussinessInfo'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'BussinessInfoAttitude',
  components: {
    FlowAttitude,
    FlowDisplay,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        orgId: null,
        companyId: this.$store.state.user.selectOrgId,
        professionalType: null,
        informationSource: null,
        area: null,
        progress: null,
        marketCategory: null,
        cooperationMode: null,
        projectName: '',
        generalContractor: '',
        builder: '',
        projectSurvey: '',
        developer: null,
        linkMan: '',
        intermediary: '',
        intermediaryTel: '',
        address: '',
        houseProperty: null,
        floors: '',
        buildingStructure: '',
        decorationArea: null,
        totalArea: null,
        cost: null,
        paymentTerms: '',
        tenderMode: null,
        tenderEndDate: '',
        startDate: '',
        finishDate: '',
        currentStatus: '',
        currentStatusDate: '',
        dockPerson: '',
        trackDepth: null,
        trackPerson: null,
        marketingMember: null,
        tenderSections: null,
        competitors: '',
        remark: '',
        zxdcbFileList: [],
        dblcFileList: [],
        zrsFileList: [],
        chsFileList: [],
        zzjgFileList: [],
        qtFileList: [],
        person: {
          name: ''
        },
        manager: {
          name: ''
        }
      },
      orgStr: '',
      areaList: null,
      cooperationModeList: [], // 合作模式
      marketCategoryList: [],
      professionalTypeList: [],
      progressList: [],
      tenderModeList: [],
      trackDepthList: [],
      informationSourceList: [],
      housePropertyList: [],
      developerList: [],
      personList: [],
      dockPersonList: [],
      reliableLevelList: [],
      trackLevelList: [],
      traceLevelList: [],
      stateList: [],

      isLoad: false,
      billFlow: null,
      attitudePara: {},

      buttonLoading: false,
      refreshRouterName: ''
    }
  },
  mounted() {
  },
  activated() {
    this.initData()
    if (this.$route.query.id) {
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  methods: {
    initData() {
      new Promise((resolve, reject) => {
        getBussinessInfoEditInit().then(response => {
          const { data, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12, result13, result14, result15, result16 } = response
          this.cooperationModeList = result1
          this.marketCategoryList = result2
          this.professionalTypeList = result3
          this.progressList = result4
          this.tenderModeList = result5
          this.trackDepthList = result6
          this.informationSourceList = result7
          this.housePropertyList = result8
          this.developerList = result9
          this.personList = result10
          this.dockPersonList = result11
          this.importantTypeList = result12
          this.reliableLevelList = result13
          this.trackLevelList = result14
          this.traceLevelList = result15
          this.stateList = result16

          data.forEach(element => {
            element.label = element.name
          })
          resolve(data)
        })
      }).then(treeData => {
        this.bussinessInfoId = this.$route.query.id
        if (this.bussinessInfoId) {
          getBussinessInfoWithAttitudeById({ id: this.bussinessInfoId }).then(response => {
            const { data, orgStr, billFlowData } = response
            this.orgStr = orgStr
            this.areaList = treeData
            this.billFlow = billFlowData
            this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
            this.ruleForm = data
            this.ruleForm.decorationArea = this.utils.formatMoney(data.decorationArea, 2, 0)
            this.ruleForm.totalArea = data.totalArea ? this.utils.formatMoney(data.totalArea, 2, 0) : this.utils.formatMoney(0, 2, 0)
            this.ruleForm.cost = data.cost ? this.utils.formatMoney(data.cost, 2, 0) : this.utils.formatMoney(0, 2, 0)
            this.ruleForm.zxdcbFileList = data.zxdcbUpFile
            this.ruleForm.dblcFileList = data.dblcUpFile
            this.ruleForm.zrsFileList = data.zrsUpFile
            this.ruleForm.chsFileList = data.chsUpFile
            this.ruleForm.zzjgFileList = data.zzjgUpFile
            this.ruleForm.qtFileList = data.qtUpFile
            this.isLoad = true // 加载审批组件
          })
        } else {
          this.areaList = treeData
        }
      }).catch(() => {
        this.$message.error('信息错误')
      })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    viewCustomer(customerId) {
      this.$router.push({ name: 'CustomerDetail', query: { id: customerId, refreshRouterName: this.$route.name }, params: { id: customerId }})
    },
    getDockPerson(ids) {
      if (ids && this.dockPersonList) {
        var idArr = ids.split(',')
        var arr = []
        idArr.forEach(item => {
          arr.push(this.dockPersonList.find(f => f.value === Number(item)))
        })
        return arr.map(m => m.name).join(',')
      }
    },
    getFormState(row) {
      const formState = this.stateList
      const state = row.formState
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    updateFlow() {
      // 如果状态为10000，还需更新跟踪级别字段为D
      putBussinessInfoTraceLevel({ id: this.$route.query.id }).then(response => {
        this.loading = false
        this.closeThePage()
      })
    }
  }
}
</script>

