<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class=""
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="编号：" prop="number">
            <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item
            label="组织机构："
            prop="orgId"
          >
            <org-select2
              v-if="orgList"
              :key="keyOrg"
              v-model="ruleForm.orgId"
              :data-mode="0"
              size="mini"
              :collapse-tags="false"
              :show-all-levels="true"
              :multiple="false"
              :filterable="true"
              :check-strictly="true"
              :options="orgList"
              :select-data="ruleForm.orgId"
              select-style="width:100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="专业类型：" prop="professionalType">
            <el-select v-model="ruleForm.professionalType" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in professionalTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="信息来源：" prop="informationSource">
            <el-cascader
              v-model="ruleForm.informationSource"
              :options="informationSourceList"
              :show-all-levels="false"
              clearable
              style="width:100%"
              :props="{
                checkStrictly : true ,
                emitPath : false ,
              }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="所属区域：" prop="area">
            <el-select v-model="ruleForm.area" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,id) in areaList"
                :key="id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="进展情况：" prop="progress">
            <el-select v-model="ruleForm.progress" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in progressList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="市场类别：" prop="marketCategory">
            <el-select v-model="ruleForm.marketCategory" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in marketCategoryList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="合作模式：" prop="cooperationMode">
            <el-select v-model="ruleForm.cooperationMode" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in cooperationModeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程名称：" prop="projectName">
            <el-input v-model="ruleForm.projectName" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程造价：" prop="cost">
            <el-input v-model="ruleForm.cost" type="number" maxlength="18">
              <i slot="suffix" style="margin-right: 10px;">万元</i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="总包单位：" prop="generalContractor">
            <el-input v-model="ruleForm.generalContractor" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="建设单位：" prop="builder">
            <el-input v-model="ruleForm.builder" maxlength="18" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="发包单位：" prop="developer">
            <!-- <el-select v-model="ruleForm.developer" placeholder="请选择" filterable style="width:100%" @change="getLinkMan">
              <el-option
                v-for="(item,id) in developerList"
                :key="id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-input v-model="developer" readonly="readonly" placeholder="请选择">
              <el-button slot="append" icon="el-icon-search" @click="selectCustomer()" />
            </el-input>
            <select-customer ref="customerRef" :multiple="false" @getCustomer="getCustomer" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="联系人：" prop="linkMan">
            <el-input v-model="ruleForm.linkMan" maxlength="18" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="居间人：" prop="intermediary">
            <el-input v-model="ruleForm.intermediary" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="居间人电话：" prop="intermediaryTel">
            <el-input v-model="ruleForm.intermediaryTel" maxlength="18" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程地址：" prop="address">
            <el-input v-model="ruleForm.address" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="房屋性质：" prop="houseProperty">
            <el-cascader
              v-model="ruleForm.houseProperty"
              :options="housePropertyList"
              :show-all-levels="false"
              clearable
              style="width:100%"
              :props="{
                checkStrictly : true ,
                emitPath : false ,
              }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="幢数层数：" prop="floors">
            <el-input v-model="ruleForm.floors" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="结构类型：" prop="buildingStructure">
            <el-input v-model="ruleForm.buildingStructure" maxlength="18" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="装饰面积：" prop="decorationArea">
            <el-input v-model="ruleForm.decorationArea" type="number" maxlength="18">
              <i slot="suffix" style="margin-right: 10px;">平方米</i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="总建筑面积：" prop="totalArea">
            <el-input v-model="ruleForm.totalArea" type="number" maxlength="18">
              <i slot="suffix" style="margin-right: 10px;">平方米</i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="项目调研分析" prop="projectSurvey">
            <el-input v-model="ruleForm.projectSurvey" type="textarea" :rows="2" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="付款条件：" prop="paymentTerms">
            <el-input v-model="ruleForm.paymentTerms" type="textarea" :rows="2" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="招标形式：" prop="tenderMode">
            <el-select v-model="ruleForm.tenderMode" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in tenderModeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="投标截止时间：" prop="tenderEndDate">
            <el-date-picker
              v-model="ruleForm.tenderEndDate"
              type="date"
              placeholder="请选择"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="暂定开工日期：" prop="startDate">
            <el-date-picker
              v-model="ruleForm.startDate"
              type="date"
              placeholder="请选择"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="暂定竣工日期：" prop="finishDate">
            <el-date-picker
              v-model="ruleForm.finishDate"
              type="date"
              placeholder="请选择"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="目前现场情况：" prop="currentStatus">
            <el-input v-model="ruleForm.currentStatus" type="textarea" :rows="2" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="现场情况日期：" prop="currentStatusDate">
            <el-date-picker
              v-model="ruleForm.currentStatusDate"
              type="date"
              placeholder="请选择"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="对接人员：" prop="dockPerson">
            <el-select v-model="ruleForm.dockPerson" multiple placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in dockPersonList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <!-- <el-checkbox-group v-model="ruleForm.dockPerson" style="width:100%;display: inline-block">
              <el-checkbox
                v-for="person in dockPersonList"
                :key="person.name"
                :label="person.value"
                style="width:60px;"
              >
                {{ person.name }}
              </el-checkbox>
            </el-checkbox-group> -->
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟进深度：" prop="trackDepth">
            <el-select v-model="ruleForm.trackDepth" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in trackDepthList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="营销经理部经理：" prop="marketingManager">
            <!-- <el-select v-model="ruleForm.marketingManager" placeholder="请选择" filterable style="width:100%" clearable>
              <el-option
                v-for="(item,id) in personList"
                :key="id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-input v-model="managerName" readonly="readonly" placeholder="请选择">
              <el-button slot="append" icon="el-icon-search" @click="selectManager()" />
            </el-input>
            <select-person ref="managerRef" :multiple="false" @getPersons="getManager" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="营销经理部成员：" prop="marketingMemberNames">
            <!-- <el-select v-model="ruleForm.marketingMember" placeholder="请选择" filterable style="width:100%" clearable multiple>
              <el-option
                v-for="(item,id) in personList"
                :key="id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-input v-model="ruleForm.marketingMemberNames" readonly="readonly" placeholder="请选择">
              <el-button slot="append" icon="el-icon-search" @click="selectMember()" />
            </el-input>
            <select-person ref="memberRef" :multiple="true" @getPersons="getMember" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="跟踪负责人：" prop="trackPerson">
            <el-input v-model="trackPersonName" readonly="readonly" placeholder="请选择">
              <el-button slot="append" icon="el-icon-search" @click="selectTrackPerson()" />
            </el-input>
            <select-person ref="trackPersonRef" :multiple="false" @getPersons="getTrackPerson" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="标段划分情况：" prop="tenderSections">
            <el-input v-model="ruleForm.tenderSections" type="textarea" :rows="4" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="其他说明：" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="4" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="主要竞争对手：" prop="competitors">
            <el-input v-model="ruleForm.competitors" type="textarea" :rows="4" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="24" :xs="24">
          <el-form-item label="发包单位资信调查表：">
            <up-file
              v-model="ruleForm.zxdcbFileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="ruleForm.zxdcbFileList"
            >
              提示：上传发包单位资信调查表附件
            </up-file>
          </el-form-item>

          <el-form-item label="定标流程：">
            <up-file
              v-model="ruleForm.dblcFileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="ruleForm.dblcFileList"
            >
              提示：上传定标流程附件
            </up-file>
          </el-form-item>

          <el-form-item label="营销经理部责任书:">
            <up-file
              v-model="ruleForm.zrsFileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="ruleForm.zrsFileList"
            >
              提示：上传营销经理部责任书(扫描件)
            </up-file>
          </el-form-item>

          <el-form-item label="营销策划书：">
            <up-file
              v-model="ruleForm.chsFileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="ruleForm.chsFileList"
            >
              提示：上传营销策划书附件
            </up-file>
          </el-form-item>

          <el-form-item label="业主组织机构图：">
            <up-file
              v-model="ruleForm.zzjgFileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="ruleForm.zzjgFileList"
            >
              提示：上传业主组织机构图附件
            </up-file>
          </el-form-item>

          <el-form-item label="其他：">
            <up-file
              v-model="ruleForm.qtFileList"
              :size="50"
              :is-upfile="true"
              :is-preview="true"
              :is-download="true"
              :is-delete="true"
              :is-rename="true"
              :file-list="ruleForm.qtFileList"
            >
              提示：上传其他相关附件
            </up-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="text-align:center;margin-top:20px;">
        <el-button v-if="ruleForm.id>0" size="mini" type="warning" :loading="buttonLoading" @click="cancel()">作废</el-button>
        <el-button size="mini" type="success" :loading="buttonLoading" @click="submitForm()">保存</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import { getCustomerById } from '@/api/ywgl/customer'
import { getBussinessInfoEditInit, getBussinessInfoWithAttitudeById, putBussinessInfo, addBussinessInfo } from '@/api/ywgl/bussinessInfo'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SelectPerson from '@/components/Other/selectPerson'
// import { validate } from '@/utils/validate'
import UpFile from '@/components/UpLoad/UpFile'
import SelectCustomer from '@/components/Other/ywgl/selectCustomer'
import { getTree } from '@/utils'
export default {
  name: 'BussinessInfoEdit',
  components: {
    OrgSelect2,
    UpFile,
    SelectPerson,
    SelectCustomer
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
        isDirectEntrust: false,
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
        dockPerson: null,
        trackDepth: null,
        marketingManager: null,
        marketingMemberNames: '',
        marketingMember: null,
        trackPerson: this.$store.state.user.uid,
        tenderSections: null,
        competitors: '',
        remark: '',
        isComplete: false,
        state: 0,
        formState: 0,
        billFlowId: 0,
        organization: null,
        zxdcbFileList: [],
        dblcFileList: [],
        zrsFileList: [],
        chsFileList: [],
        zzjgFileList: [],
        qtFileList: []
      },
      keyOrg: 0,
      orgList: null,
      areaList: [],
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

      bussinessInfoId: null,
      keyInformationSource: 0,
      keyHouseProperty: 0,

      trackPersonName: this.$store.state.user.name,
      managerName: '',
      developer: '',

      buttonLoading: false,
      refreshRouterName: '',
      rules: {
        projectName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        generalContractor: [{ required: true, message: '不能为空', trigger: 'blur' }],
        developer: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        orgId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        tenderMode: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        progress: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        trackDepth: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        informationSource: [{ required: true, message: '不能为空', trigger: 'blur' }],
        houseProperty: [{ required: true, message: '不能为空', trigger: 'blur' }],
        cooperationMode: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        currentStatusDate: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        linkMan: [{ required: true, message: '不能为空', trigger: 'blur' }],
        floors: [{ required: true, message: '不能为空', trigger: 'blur' }],
        buildingStructure: [{ required: true, message: '不能为空', trigger: 'blur' }],
        marketingManager: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        trackPerson: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
        // decorationArea: [{ validator: validate.dbl, required: true, message: '可为空或数字类型', trigger: 'blur' }],
        // totalArea: [{ validator: validate.dbl, required: false, message: '可为空或数字类型', trigger: 'blur' }],
        // cost: [{ validator: validate.dbl, required: false, message: '可为空或数字类型', trigger: 'blur' }],
        // intermediaryTel: [{ validator: validate.phone, required: false, message: '电话或手机号不正确', trigger: 'blur' }]
      }
    }
  },
  mounted() {
  },
  activated() {
    if (this.$route.query.id) {
      this.bussinessInfoId = this.$route.query.id
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
    console.log()
    this.initData()
  },
  methods: {
    submitForm(state) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          var postData = JSON.parse(JSON.stringify(this.ruleForm))
          postData.dockPerson = postData.dockPerson ? postData.dockPerson.join() : ''
          let tempIds = []
          if (postData.zxdcbFileList.length > 0) {
            tempIds = postData.zxdcbFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.zxdcbFileList = tempIds
          tempIds = []
          if (postData.dblcFileList.length > 0) {
            tempIds = postData.dblcFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.dblcFileList = tempIds
          tempIds = []
          if (postData.zrsFileList.length > 0) {
            tempIds = postData.zrsFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.zrsFileList = tempIds
          tempIds = []
          if (postData.chsFileList.length > 0) {
            tempIds = postData.chsFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.chsFileList = tempIds
          tempIds = []
          if (postData.zzjgFileList.length > 0) {
            tempIds = postData.zzjgFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.zzjgFileList = tempIds
          tempIds = []
          if (postData.qtFileList.length > 0) {
            tempIds = postData.qtFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          postData.qtFileList = tempIds
          console.log(postData)
          if (this.bussinessInfoId) {
            this.buttonLoading = true
            putBussinessInfo(postData)
              .then((response) => {
                if (response.errorMsg) {
                // 验证错误
                  this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                    { dangerouslyUseHTMLString: true })
                  return
                }
                this.$message(response.message)
                this.buttonLoading = false
                this.closeThePage()
              }).catch(() => { this.buttonLoading = false })
          } else {
            this.buttonLoading = true
            addBussinessInfo(postData)
              .then((response) => {
                if (response.errorMsg) {
                // 验证错误
                  this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                    { dangerouslyUseHTMLString: true })
                  return
                }
                this.$message(response.message)
                this.buttonLoading = false
                this.closeThePage()
              })
              .catch(() => {
                this.buttonLoading = false
              })
          }
        }
      })
    },
    initData() {
      new Promise((resolve, reject) => {
        getBussinessInfoEditInit().then(response => {
          const { data, orgList, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11 } = response
          this.orgList = orgList
          this.cooperationModeList = result1
          this.marketCategoryList = result2
          this.professionalTypeList = result3
          this.progressList = result4
          this.tenderModeList = result5
          this.trackDepthList = result6
          result7.forEach(element => {
            element.pid = element.pId
            element.label = element.name
          })
          this.informationSourceList = getTree(0, result7)
          result8.forEach(element => {
            element.pid = element.pId
            element.label = element.name
          })
          this.housePropertyList = getTree(0, result8)
          this.developerList = result9
          this.personList = result10
          this.dockPersonList = result11

          data.forEach(element => {
            element.label = element.name
          })
          resolve(data)
        })
      }).then(treeData => {
        if (this.bussinessInfoId) {
          getBussinessInfoWithAttitudeById({ id: this.bussinessInfoId }).then(response => {
            const { data } = response
            data.dockPerson = data.dockPerson !== '' ? data.dockPerson.split(',').map(item => Number(item)) : null
            // data.marketingMember = data.marketingMember.split(',').map(item => Number(item))
            this.areaList = treeData
            this.ruleForm = data
            this.trackPersonName = data.person.name
            this.managerName = data.manager.name
            this.developer = data.customer.name
            this.keyOrg += 1
            this.ruleForm.zxdcbFileList = data.zxdcbUpFile
            this.ruleForm.dblcFileList = data.dblcUpFile
            this.ruleForm.zrsFileList = data.zrsUpFile
            this.ruleForm.chsFileList = data.chsUpFile
            this.ruleForm.zzjgFileList = data.zzjgUpFile
            this.ruleForm.qtFileList = data.qtUpFile
          })
        } else {
          this.areaList = treeData
        }
      }).catch(() => {
        this.$message.error('信息错误')
      })
    },
    cancel() {},
    closeThePage() {
      if (this.$route.query.refreshRouterName === 'BussinessInfoReply') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ name: 'BussinessInfoReply', query: { id: this.bussinessInfoId, refreshRouterName: 'BussinessInfo' }, params: { id: this.bussinessInfoId }})
      } else {
        this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
      }
    },
    getLinkMan() {
      getCustomerById({ id: this.ruleForm.developer }).then((response) => {
        const { data } = response
        this.ruleForm.linkMan = data.linkMan
      })
    },
    selectTrackPerson() {
      this.$refs.trackPersonRef.openDialog()
    },
    getTrackPerson(persons) {
      if (persons.length > 0) {
        this.ruleForm.trackPerson = persons[0].id
        this.trackPersonName = persons[0].name
      }
    },
    selectMember() {
      this.$refs.memberRef.openDialog()
    },
    getMember(persons) {
      if (persons.length > 0) {
        this.ruleForm.marketingMember = persons.map(m => m.id).join(',')
        this.ruleForm.marketingMemberNames = persons.map(m => m.name).join(',')
      }
    },
    selectManager() {
      this.$refs.managerRef.openDialog()
    },
    getManager(persons) {
      if (persons.length > 0) {
        this.ruleForm.marketingManager = persons[0].id
        this.managerName = persons[0].name
      }
    },
    selectCustomer() {
      this.$refs.customerRef.openDialog()
    },
    getCustomer(data) {
      if (data.length > 0) {
        this.ruleForm.developer = data[0].id
        this.developer = data[0].name
        this.ruleForm.linkMan = data[0].linkMan
      }
    }
  }
}
</script>

