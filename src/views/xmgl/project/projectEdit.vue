<template>
  <div class="app-container">
    <div v-show="active===0">
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
        class=""
        size="mini"
      >

        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="info">
            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="编号：" prop="number">
                  <el-input v-model="ruleForm.number" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="项目名称：" prop="name">
                  <el-input v-model="ruleForm.name" maxlength="50" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="关联合同评审：" prop="contractNumber">
                  <el-input v-model="contractNumber" readonly="readonly" placeholder="请选择">
                    <el-button slot="append" icon="el-icon-search" @click="selectContract()" />
                  </el-input>
                  <select-contract ref="contractRef" :multiple="false" @getContract="getContract" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="关联业务信息" prop="bussinessInfoNumber">
                  <el-input v-model="bussinessInfoNumber" readonly="readonly" placeholder="请选择">
                    <el-button slot="append" icon="el-icon-search" @click="selectBussinessInfo()" />
                  </el-input>
                  <select-bussiness-info ref="bussinessInfoRef" :multiple="false" @getBussinessInfo="getBussinessInfo" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="地区：" prop="orgId">
                  <org-select :key="keyOrg" v-model="ruleForm.orgId" :select-data="ruleForm.orgId" :data-mode="0" @change="orgChange($event)" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="工程性质：" prop="engPropertiesID">
                  <el-select v-model="ruleForm.engPropertiesID" clearable placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="(item,index) in engPropertiesOptions"
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
                <el-form-item label="账套：" prop="accountId">
                  <el-select v-model="ruleForm.accountId" clearable placeholder="请选择" style="width:100%" :disabled="disabled">
                    <el-option
                      v-for="item in accountList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="合作模式：" prop="managementiState">
                  <el-select v-model="ruleForm.managementiState" clearable placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="(item,index) in managementiStateOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="结构：" prop="structureID" style="width:100%">
                  <el-select v-model="ruleForm.structureID" clearable placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="(item,index) in structureTypeOptions"
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
                <el-form-item label="信息来源：" prop="informationSourceID">
                  <org-select2
                    :key="keyInformationSource"
                    v-model="ruleForm.informationSourceID"
                    size="mini"
                    :collapse-tags="false"
                    :show-all-levels="false"
                    :check-strictly="false"
                    :options="informationSourceOptions"
                    :select-data="ruleForm.informationSourceID"
                  />
                </el-form-item>
              </el-col>

              <el-col :sm="12" :xs="24" prop="taxType">
                <el-form-item label="计税方式：">
                  <el-select v-model="ruleForm.taxType" clearable placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="(item,index) in taxTypeOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24" prop="projectPropertyID">
                <el-form-item label="项目性质：">
                  <org-select2
                    :key="keyProjectProperty"
                    v-model="ruleForm.projectPropertyID"
                    :data-mode="0"
                    size="mini"
                    :collapse-tags="false"
                    :show-all-levels="false"
                    :multiple="false"
                    :options="projectPropertyOptions"
                    :select-data="ruleForm.projectPropertyID"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24" prop="taxRate">
                <el-form-item label="税率：">
                  <el-input v-model="ruleForm.taxRate" type="number" :precision="2" :min="0" maxlength="50">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="甲方名称：" prop="firstPartyName">
                  <el-input v-model="ruleForm.firstPartyName" maxlength="50" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="地址：" prop="address">
                  <el-input v-model="ruleForm.address" maxlength="50" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="合同签订日期：" prop="signDate2">
                  <el-date-picker
                    v-model="ruleForm.signDate2"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="合同上报日期：" prop="signDate">
                  <el-date-picker
                    v-model="ruleForm.signDate"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="幢数：" prop="buildNum">
                  <el-input v-model="ruleForm.buildNum" type="number" :min="0" maxlength="50" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="层数：" prop="levelNum">
                  <el-input v-model="ruleForm.levelNum" maxlength="50" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="建筑面积：" prop="area">
                  <el-input v-model="ruleForm.area" type="number" :precision="2" :min="0" maxlength="50">
                    <template slot="append">平方米</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="合同工期：" prop="contractDuration">
                  <el-input v-model="ruleForm.contractDuration" type="number" :min="0" maxlength="50">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="合同开工日期：" prop="contractStartDate">
                  <el-date-picker
                    v-model="ruleForm.contractStartDate"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="合同竣工日期：" prop="contractFinishDate">
                  <el-date-picker
                    v-model="ruleForm.contractFinishDate"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="合同金额：" prop="planAmount">
                  <el-input v-model="ruleForm.planAmount" type="number" :min="0" :precision="2" maxlength="50">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="预计总产值：" prop="realAmount">
                  <el-input v-model="ruleForm.realAmount" type="number" :min="0" :precision="2" maxlength="50">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="项目状态：" prop="stateID">
                  <el-select v-model="ruleForm.stateID" clearable placeholder="请选择" style="width:100%" disabled>
                    <el-option
                      v-for="(item,index) in stateTypeOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="竣工日期：" prop="finishDate">
                  <el-date-picker
                    v-model="ruleForm.finishDate"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="结算日期：" prop="settleDate">
                  <el-date-picker
                    v-model="ruleForm.settleDate"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="项目特性：" prop="proProperties">
                  <el-select v-model="ruleForm.proProperties" clearable placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="(item,index) in proPropertiesOptions"
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
                <el-form-item label="项目类别：" prop="categoryId">
                  <el-select v-model="ruleForm.categoryId" clearable placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="(item,index) in projectCategoryOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="计划利润：" prop="planProfit">
                  <el-input v-model="ruleForm.planProfit" type="number" :precision="2" :min="0" maxlength="50">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="是否使用：" prop="inUse">
                  <el-switch
                    v-model="ruleForm.inUse"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="虚拟项目：" prop="isFictitious">
                  <el-switch
                    v-model="ruleForm.isFictitious"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="fictitiousChange($event)"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="付款方式：" prop="payState">
                  <el-input v-model="ruleForm.payState" type="textarea" :rows="4" maxlength="500" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="甲供材：" prop="materialsFirst">
                  <el-input v-model="ruleForm.materialsFirst" type="textarea" :rows="4" maxlength="500" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="其他描述：" prop="othDescribe">
                  <el-input v-model="ruleForm.othDescribe" type="textarea" :rows="4" maxlength="500" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="ruleForm.remark" type="textarea" :rows="4" maxlength="500" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="质保期/质保金" name="warranty">
            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="一阶段：" prop="warrantyDays1">
                  <el-input v-model="ruleForm.warrantyDays1" type="number" :min="0" maxlength="50">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="一阶段比例：" prop="warrantyRate1">
                  <el-input v-model="ruleForm.warrantyRate1" type="number" :min="0" :precision="2" maxlength="50">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="二阶段：" prop="warrantyDays2">
                  <el-input v-model="ruleForm.warrantyDays2" type="number" :min="0" maxlength="50">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="二阶段比例：" prop="warrantyRate2">
                  <el-input v-model="ruleForm.warrantyRate2" type="number" :precision="2" :min="0" maxlength="50">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="三阶段：" prop="warrantyDays3">
                  <el-input v-model="ruleForm.warrantyDays3" type="number" :min="0" maxlength="50">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="三阶段比例：" prop="warrantyRate3">
                  <el-input v-model="ruleForm.warrantyRate3" type="number" :precision="2" :min="0" maxlength="50">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="四阶段：" prop="warrantyDays4">
                  <el-input v-model="ruleForm.warrantyDays4" type="number" :min="0" maxlength="50">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="四阶段比例：" prop="warrantyRate4">
                  <el-input v-model="ruleForm.warrantyRate4" type="number" :precision="2" :min="0" maxlength="50">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="附件管理" name="file">
            <el-row :gutter="10">
              <el-col :sm="12" :xs="24">
                <el-form-item label="招标文件：">
                  <up-file
                    v-model="ruleForm.zbFileList"
                    :size="50"
                    :is-upfile="true"
                    :is-preview="true"
                    :is-download="true"
                    :is-delete="true"
                    :is-rename="true"
                    :file-list="ruleForm.zbFileList"
                  />
                </el-form-item>

                <el-form-item label="投标文件：">
                  <up-file
                    v-model="ruleForm.tbFileList"
                    :size="50"
                    :is-upfile="true"
                    :is-preview="true"
                    :is-download="true"
                    :is-delete="true"
                    :is-rename="true"
                    :file-list="ruleForm.tbFileList"
                  />
                </el-form-item>

                <el-form-item label="施工合同：">
                  <up-file
                    v-model="ruleForm.sghtFileList"
                    :size="50"
                    :is-upfile="true"
                    :is-preview="true"
                    :is-download="true"
                    :is-delete="true"
                    :is-rename="true"
                    :file-list="ruleForm.sghtFileList"
                  />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :xs="24">
                <el-form-item label="补充合同：">
                  <up-file
                    v-model="ruleForm.bchtFileList"
                    :size="50"
                    :is-upfile="true"
                    :is-preview="true"
                    :is-download="true"
                    :is-delete="true"
                    :is-rename="true"
                    :file-list="ruleForm.bchtFileList"
                  />
                </el-form-item>

                <el-form-item label="评审记录：">
                  <up-file
                    v-model="ruleForm.psjlFileList"
                    :size="50"
                    :is-upfile="true"
                    :is-preview="true"
                    :is-download="true"
                    :is-delete="true"
                    :is-rename="true"
                    :file-list="ruleForm.psjlFileList"
                  />
                </el-form-item>

                <el-form-item label="中标通知书：">
                  <up-file
                    v-model="ruleForm.zbtzsFileList"
                    :size="50"
                    :is-upfile="true"
                    :is-preview="true"
                    :is-download="true"
                    :is-delete="true"
                    :is-rename="true"
                    :file-list="ruleForm.zbtzsFileList"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <div style="text-align:center; margin-top:15px;">
          <el-button type="success" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm',0)">更新保存</el-button>
          <el-button v-if="ruleForm.isShow!=1" type="primary" size="mini" :loading="buttonLoading" @click="getDynamicFlow('ruleForm',1)">提交立项申请</el-button>
          <el-button type="info" size="mini" @click="closeThePage">关闭</el-button>
        </div>
      </el-form>
    </div>
    <!--流程显示-->
    <div v-show="active===1">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm',1)">提交</el-button>
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
        <component :is="comName" :select-value="selectValue" :multiple="multiple" :is-preview="true" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getProjectById, addProject, putProject, getBillFlow, addProjectLX } from '@/api/xmgl/project'
import UpFile from '@/components/UpLoad/UpFile'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import { getAccountSetByOrgId } from '@/api/xtgl/accountSet'
import OrgSelect from '@/components/OrgSelect/index'
import OrgSelect2 from '@/components/OrgSelect/index2'
import SelectBussinessInfo from '@/components/Other/ywgl/selectBussinessInfo'
import SelectContract from '@/components/Other/ywgl/selectContract'
import FlowSelect from '@/components/Flow/flowSelect'
import { validate } from '@/utils/validate'
export default {
  name: 'ProjectEdit',
  components: {
    OrgSelect,
    OrgSelect2,
    SelectBussinessInfo,
    SelectContract,
    FlowSelect,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        orgId: 0,
        name: '',
        accountId: null,
        managementiState: null,
        stateID: 0,
        inUse: true,
        isFictitious: false,
        contractId: null,
        bussinessInfoId: null,
        warrantyDays1: 0,
        warrantyRate1: 0,
        warrantyDays2: 0,
        warrantyRate2: 0,
        warrantyDays3: 0,
        warrantyRate3: 0,
        warrantyDays4: 0,
        warrantyRate4: 0,
        zbFileList: [],
        tbFileList: [],
        sghtFileList: [],
        bchtFileList: [],
        psjlFileList: [],
        zbtzsFileList: []
      },
      projectForm: {
        companyId: this.$store.state.user.selectOrgId,
        number: '',
        projectId: 0,
        state: 0,
        billFlowId: 0
      },
      activeNames: ['info', 'warranty', 'file'],
      type: 0, // 0:保存；1：提交审批
      fileList: [],
      accountList: [],
      engPropertiesOptions: [],
      managementiStateOptions: [],
      structureTypeOptions: [],
      informationSourceOptions: [],
      taxTypeOptions: [],
      projectPropertyOptions: [],
      proPropertiesOptions: [],
      stateTypeOptions: [],
      projectCategoryOptions: [],
      projectId: null,
      buttonLoading: false,
      isLoadFinish: false,
      keyEngProperties: 0,
      keyManagementiState: 0,
      keyStructure: 0,
      keyInformationSource: 0,
      keyTaxType: 0,
      keyProjectProperty: 0,
      keyProProperties: 0,
      keyState: 0,
      keyOrg: 0,
      disabled: true,

      dialogTableVisible: false,
      dialogTitle: '选择',
      dialogWidth: '70%',
      comName: 'SelectBussinessInfo',
      selectValue: [],
      multiple: false,

      contractNumber: '',
      bussinessInfoNumber: '',

      billFlow: null,
      active: 0,
      loading: false,

      rules: {
        number: [{ required: true, message: '必填', trigger: 'blur' }],
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        orgId: [{ required: true, message: '必填', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择', trigger: 'blur' }],
        accountId: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        proProperties: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        contractDuration: [
          { required: true, message: '请输入项目合同工期', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请输入建筑面积', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyDays1: [
          { required: true, message: '请输入一阶段质保期', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyRate1: [
          { required: true, message: '请输入一阶段质保金比例', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyDays2: [
          { required: true, message: '请输入二阶段质保期', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyRate2: [
          { required: true, message: '请输入二阶段质保金比例', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyDays3: [
          { required: true, message: '请输入三阶段质保期', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyRate3: [
          { required: true, message: '请输入三阶段质保金比例', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyDays4: [
          { required: true, message: '请输入四阶段质保期', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ],
        warrantyRate4: [
          { required: true, message: '请输入四阶段质保金比例', trigger: 'change' },
          { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
          { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'ruleForm.orgId': {
      handler: function(value) {
        // this.ruleForm.accountId = null
        if (value && value !== 0) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      },
      immediate: true
    },
    'ruleForm.proProperties': {
      handler(val) {
        const changeRules = {
          area: [],
          planAmount: [],
          taxType: [],
          taxRate: []
        }
        if (val === 1) {
          changeRules.area = [
            { required: true, message: '请输入', trigger: 'change' },
            { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
            { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
          ]
          changeRules.planAmount = [
            { required: true, message: '请输入', trigger: 'change' },
            { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
            { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
          ]
          changeRules.taxRate = [
            { required: true, message: '请输入', trigger: 'change' },
            { validator: validate.dbl, message: '必须为数字格式', trigger: 'change' },
            { validator: validate.logic, logic: value => value >= 0, message: '必须大于0', trigger: 'change' }
          ]
          changeRules.taxType = [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        }
        Object.assign(this.rules, changeRules)
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.optionInit()
    this.initData()
  },
  activated() {
  },
  methods: {
    submitForm(formName, state) {
      this.type = state
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          let tempIds = []
          if (newObj.zbFileList.length > 0) {
            tempIds = newObj.zbFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.zbFileList = tempIds
          tempIds = []
          if (newObj.tbFileList.length > 0) {
            tempIds = newObj.tbFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.tbFileList = tempIds
          tempIds = []
          if (newObj.sghtFileList.length > 0) {
            tempIds = newObj.sghtFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.sghtFileList = tempIds
          tempIds = []
          if (newObj.bchtFileList.length > 0) {
            tempIds = newObj.bchtFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.bchtFileList = tempIds
          tempIds = []
          if (newObj.psjlFileList.length > 0) {
            tempIds = newObj.psjlFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.psjlFileList = tempIds
          tempIds = []
          if (newObj.zbtzsFileList.length > 0) {
            tempIds = newObj.zbtzsFileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          }
          newObj.zbtzsFileList = tempIds
          console.log(newObj)
          if (state === 1) {
            var projectObj = JSON.parse(JSON.stringify(this.projectForm))
            projectObj.orgId = newObj.orgId
            projectObj.projectId = newObj.id
            projectObj.state = state
            console.log(projectObj)
            if (this.billFlow) {
            // 获取流程组件中的数据
              const billFlow = this.$refs.flowSelect.getBillFlow()
              if (!billFlow) {
                return false
              }
              projectObj.billFlow = billFlow
            } else {
              this.$message('流程数据不能为空')
              return
            }
          }
          // var postData = { project: newObj, fileList: tempIds }
          if (this.projectId) {
            // 修改
            this.buttonLoading = true
            putProject(newObj)
              .then((response) => {
                this.$message(response.message)
                if (state === 1) {
                  addProjectLX(projectObj).then((response) => {
                    this.$message(response.message)
                  })
                }
                this.buttonLoading = false
                this.closeThePage()
                // this.$emit('dialogClose')
              })
              .catch(() => {
                this.buttonLoading = false
              })
          } else {
            // 添加
            this.buttonLoading = true
            addProject(newObj)
              .then((response) => {
                this.$message(response.message)
                if (response.code === 200) {
                  if (state === 1) {
                    projectObj.projectId = this.response.data.id
                    addProjectLX(projectObj).then((response) => {
                      this.$message(response.message)
                    })
                  }
                }
                this.buttonLoading = false
                this.closeThePage()
                // this.$emit('dialogClose')
              })
              .catch(() => {
                this.buttonLoading = false
              })
          }
        }
      })
    },
    getDynamicFlow(formName, state) {
      this.type = state
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.projectForm))
          newObj.orgId = this.ruleForm.orgId
          if (!this.ruleForm.contractId) {
            this.$message.error('提交立项申请必须关联合同!')
            return
          }
          getBillFlow(newObj).then(response => {
            if (response.success) {
              this.billFlow = response.data.billFlow
              this.active = 1
            } else {
              this.$message(response.message)
            }
          })
        }
      })
    },
    previous() {
      // 上一步
      this.active = 0
      this.billFlow = null
    },
    initData() {
      this.projectId = this.$route.query.id
      if (this.projectId) {
        getProjectById({ id: this.projectId }).then((response) => {
          const { data, incomeContract, bussinessInfo } = response
          // const { data } = response
          this.orgChange(data.orgId)
          this.ruleForm = data
          this.ruleForm.zbFileList = data.zbUpFile
          this.ruleForm.tbFileList = data.tbUpFile
          this.ruleForm.sghtFileList = data.sghtUpFile
          this.ruleForm.bchtFileList = data.bchtUpFile
          this.ruleForm.psjlFileList = data.psjlUpFile
          this.ruleForm.zbtzsFileList = data.zbtzsUpFile
          if (incomeContract.length > 0) {
            this.contractNumber = incomeContract[0].number
          }
          if (bussinessInfo.length > 0) {
            this.bussinessInfoNumber = bussinessInfo[0].number
          }
          // this.fileList = files
          // this.keyEngProperties += 1
          // this.keyManagementiState += 1
          // this.keyStructureType += 1
          this.keyInformationSource += 1
          // this.keyTaxType += 1
          this.keyProjectProperty += 1
          // this.keyProProperties += 1
          // this.keyStateType += 1
          this.keyOrg += 1
        })
      } else {
        this.orgChange(0)
      }
    },
    optionInit() {
      getDictionarysByTypes({ types: 'engProperties,managementiState,structureType,informationSource,taxType,projectProperty,proProperties,projectState,postPoolCategory' })
        .then((response) => {
          const { data } = response
          data.forEach(element => {
            element.pid = element.pId
            if (element.type === 'engProperties') {
              this.engPropertiesOptions.push(element)
            }
            if (element.type === 'managementiState') {
              this.managementiStateOptions.push(element)
            }
            if (element.type === 'structureType') {
              this.structureTypeOptions.push(element)
            }
            if (element.type === 'informationSource') {
              this.informationSourceOptions.push(element)
            }
            if (element.type === 'taxType') {
              this.taxTypeOptions.push(element)
            }
            if (element.type === 'projectProperty') {
              this.projectPropertyOptions.push(element)
            }
            if (element.type === 'proProperties') {
              this.proPropertiesOptions.push(element)
            }
            if (element.type === 'projectState') {
              this.stateTypeOptions.push(element)
            }
            if (element.type === 'postPoolCategory' && element.value > 3) {
              this.projectCategoryOptions.push(element)
            }
          })
          // this.keyEngProperties += 1
          // this.keyManagementiState += 1
          // this.keyStructureType += 1
          this.keyInformationSource += 1
          // this.keyTaxType += 1
          this.keyProjectProperty += 1
          // this.keyProProperties += 1
          // this.keyStateType += 1
        })
    },
    orgChange(data) {
      getAccountSetByOrgId({ orgId: data }).then(response => {
        this.accountList = response.data
      })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    fictitiousChange(data) {
      if (data) {
        this.ruleForm.name = '【虚拟】' + this.ruleForm.name
      } else {
        this.ruleForm.name = this.ruleForm.name.split('【虚拟】').join('')
      }
    },
    selectBussinessInfo() {
      this.$refs.bussinessInfoRef.openDialog()
    },
    getBussinessInfo(data) {
      if (data.length > 0) {
        this.ruleForm.bussinessInfoId = data[0].id
        this.bussinessInfoNumber = data[0].number
      }
    },
    selectContract() {
      this.$refs.contractRef.openDialog()
    },
    getContract(data) {
      if (data.length > 0) {
        this.ruleForm.contractId = data[0].id
        this.contractNumber = data[0].number
      }
    }
  }
}
</script>
