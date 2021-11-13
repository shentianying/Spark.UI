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
          <el-form-item label="进展情况：" prop="progress">
            <span v-if="progressList && ruleForm.progress">{{ progressList.find(f => f.value === ruleForm.progress).name }}</span>
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
          <el-form-item label="合作模式：" prop=" cooperationMode">
            <span v-if="cooperationModeList && ruleForm.cooperationMode">{{ cooperationModeList.find(f => f.value === ruleForm.cooperationMode).name }}</span>
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
        <el-col :sm="24" :xs="24">
          <el-form-item label="评标办法：" prop="currentStatus">
            {{ }}
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
          <el-form-item label="营销经理部经理：" prop="trackPerson">
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
          <el-form-item label="最后编辑人：">
            {{ ruleForm.lastEditUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="最后编辑时间：">
            {{ ruleForm.lastEditDate | dateTimeFormat }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟踪负责人：" prop="trackPerson">
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
          <el-form-item label="进展情况：" prop="progress">
            <span v-if="progressList && ruleForm.progress">{{ progressList.find(f => f.value === ruleForm.progress).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟进要求：" prop="trackLevel">
            <span v-if="trackLevelList && ruleForm.trackLevel">{{ trackLevelList.find(f => f.value === ruleForm.trackLevel).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="可靠程度：" prop="reliableLevel">
            <span v-if="reliableLevelList && ruleForm.reliableLevel">{{ reliableLevelList.find(f => f.value === ruleForm.reliableLevel).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="重要程度：" prop="isImportant">
            <span v-if="ruleForm.isImportant">重要</span>
            <span v-else>一般</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item align="center" style="text-align:center;margin-top:20px;">
        <el-button v-if="!isLoadProject" type="primary" size="mini" :loading="buttonLoading" @click="viewBussinessInfoProject(1)">查看立项申请</el-button>
        <el-button v-if="isLoadProject" type="primary" size="mini" :loading="buttonLoading" @click="viewBussinessInfoProject(0)">关闭立项申请</el-button>
        <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="招标文件记录：">
            <el-link v-for="(bidDocument,index) in bidDocumentList" :key="index" @click="bidDocumentDetail(bidDocument.id)">{{ bidDocument.number }}&nbsp;</el-link>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="商务标审批记录：">
            <el-link v-for="(bussinessBid,index) in bussinessBidList" :key="index" @click="bussinessBidDetail(bussinessBid.id)">{{ bussinessBid.number }}&nbsp;</el-link>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="资信标审批记录：">
            <el-link v-for="(creditBid,index) in creditBidList" :key="index" @click="creditBidDetail(creditBid.id)">{{ creditBid.number }}&nbsp;</el-link>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="技术标审批记录：">
            <el-link v-for="(technicalBid,index) in technicalBidList" :key="index" @click="technicalBidDetail(technicalBid.id)">{{ technicalBid.number }}&nbsp;</el-link>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="已发生营销费用：">
            {{ }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="定标日期：">
            {{ ruleForm.bidDate }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="中标单位：">
            {{ ruleForm.bidWinner }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="中标价格：">
            {{ ruleForm.bidWinnerPrice }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标排名：">
            第 {{ ruleForm.bidRank }} 名
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标日期：">
            {{ ruleForm.tenderEndDate }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="总结：">
            <span v-if="ruleForm.isSummaryFinish">已完成</span>
            <span v-else>未完成</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-collapse v-model="activeName">
        <el-collapse-item v-if="isLoadProject" name="projectPanl">
          <template slot="title">
            <i class="header-icon el-icon-s-marketing" />立项情况
          </template>
          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="立项申请提交人：">
                {{ ruleForm.submitUserName }}
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="立项申请提交日期：">
                {{ ruleForm.submitDate | dateTimeFormat }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <el-form-item label="立项申请状态：">
                {{ getProjectState(ruleForm) }}
              </el-form-item>
            </el-col>
          </el-row>
          <!--流程信息-->
          <flow-display v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
          <flow-attitude
            v-if="ruleForm.state!=0"
            ref="flowAttitude"
            :para="attitudePara"
          />

        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-s-comment" />回复记录
          </template>
          <el-table
            v-loading="listLoading"
            :data="replyList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            size="mini"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="left" header-align="center" label="进展情况" :show-overflow-tooltip="true" min-width="130">
              <template slot-scope="scope">
                【{{ scope.row.title }}】：{{ scope.row.content }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="附件" min-width="50">
              <template slot-scope="scope">
                <up-file v-model="scope.row.upFiles" :is-preview="true" :file-list="scope.row.upFiles" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="录入人" width="150">
              <template slot-scope="scope">
                {{ scope.row.createUserName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="录入时间" width="150">
              <template slot-scope="scope">
                {{ scope.row.createDate }}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info" />更新记录
          </template>
          <el-table
            v-loading="listLoading"
            :data="updateList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            size="mini"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="left" header-align="center" label="操作记录" :show-overflow-tooltip="true" min-width="130">
              <template slot-scope="scope">
                {{ scope.row.content }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="150">
              <template slot-scope="scope">
                {{ scope.row.createUserName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作时间" width="150">
              <template slot-scope="scope">
                {{ scope.row.createDate }}
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>

      </el-collapse>

    </el-form>
  </div>
</template>

<script>
import { getBussinessInfoEditInit, getBussinessInfoWithAttitudeById } from '@/api/ywgl/bussinessInfo'
import UpFile from '@/components/UpLoad/UpFile'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
export default {
  name: 'BussinessInfoDetail',
  components: {
    UpFile,
    FlowAttitude,
    FlowDisplay
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
      StatusList: [],

      isLoadProject: false,
      billFlow: null,
      attitudePara: {},
      updateList: [],
      listLoading: false,
      replyList: [],
      bidDocumentList: [],
      creditBidList: [],
      technicalBidList: [],
      bussinessBidList: [],

      activeName: 'projectPanl', // 默认展开name为projectPanl的折叠板
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
            const { data, orgStr, billFlowData, replyList, updateList, bidDocumentList, creditBidList, technicalBidList, bussinessBidList } = response
            this.orgStr = orgStr
            this.areaList = treeData
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
            this.bidDocumentList = bidDocumentList
            this.creditBidList = creditBidList
            this.technicalBidList = technicalBidList
            this.bussinessBidList = bussinessBidList
            this.replyList = replyList
            this.updateList = updateList
            this.billFlow = billFlowData
            this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
            this.listLoading = false
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
    viewBussinessInfoProject(state) {
      if (state === 1) {
        this.isLoadProject = true
      } else if (state === 0) {
        this.isLoadProject = false
      }
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
    getProjectState(row) {
      console.log(row)
      if (!row.billFlow) { return '未立项' }
      const formState = row.billFlow.form.formState
      const state = row.state
      if (state === -1) return '作废'
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    bidDocumentDetail(id) {
      this.$router.push({ name: 'BidDocumentDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    bussinessBidDetail(id) {
      this.$router.push({ name: 'BussinessBidDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    creditBidDetail(id) {
      this.$router.push({ name: 'CreditBidDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    technicalBidDetail(id) {
      this.$router.push({ name: 'TechnicalBidDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    }
  }
}
</script>

