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
            {{ ruleForm.number }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="组织机构：">
            {{ infoForm.orgStr }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="工程名称：">
            <el-link @click="viewBussinessInfo(ruleForm.bussinessInfoId)">{{ ruleForm.bussinessInfo.projectName }}</el-link>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="控制价：">
            <span v-if="ruleForm.controlPrice">{{ ruleForm.controlPrice.toFixed(2) }}万元</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="招标形式：">
            {{ infoForm.tenderMode }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="报价方式：">
            <span v-if="offerTypeList && ruleForm.offerType">{{ offerTypeList.find(f => f.value === ruleForm.offerType).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="市场划分类别：">
            <span v-if="marketSegmentList && ruleForm.marketSegment">{{ marketSegmentList.find(f => f.value === ruleForm.marketSegment).name }}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="专业类别：">
            <span v-if="professionalTypeList && ruleForm.professionalType">{{ professionalTypeList.find(f => f.value === ruleForm.professionalType).name }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="报价次数：">
            第{{ ruleForm.quotationTimes }}次
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="总次数：">
            {{ ruleForm.totalTimes }}次
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="装饰面积：">
            {{ infoForm.decorationArea }}平方米
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="信息来源：">
            {{ infoForm.informationSource }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="幢数层数：">
            {{ infoForm.floors }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="主要竞争对手：">
            {{ infoForm.competitors }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="计划对外报价合计：">
            {{ ruleForm.planForeignQuotation.toFixed(2) }}万元
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="预估成本合计：">
            {{ ruleForm.estimatedCost.toFixed(2) }}万元
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="预估利润合计率：">
            {{ ruleForm.estimatedProfit.toFixed(2) }}%
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="每平米造价：">
            {{ ruleForm.costOfFlatMeter.toFixed(2) }}元
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="评标办法：">
            {{ infoForm.bidEvaluationMethod }}
            <span>（注：取最后一次招标文件评审结果）</span>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="报价截止时间：">
            {{ (ruleForm.quotationDeadline || '').split(' ')[0] }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="备注：" prop="remark">
            {{ ruleForm.remark }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="附件：">
            <up-file
              v-model="ruleForm.fileList"
              :size="50"
              :is-preview="true"
              :is-download="true"
              :file-list="ruleForm.fileList"
            />
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
          <el-form-item label="创建日期：">
            {{ ruleForm.createDate }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="提交人：">
            {{ ruleForm.submitUserName }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="提交日期：">
            {{ ruleForm.submitDate }}
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
            {{ ruleForm.lastEditDate }}
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- 标段 -->
    <div v-show="ruleForm.bussinessInfoId">
      <el-table
        v-loading="loading"
        :data="list"
        show-summary
        :summary-method="getSummaries"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column label="标段" align="center" min-width="50">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column v-if="count>0" label="第1次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation1.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation1">{{ scope.row.quotation1.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation1.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation1">{{ scope.row.quotation1.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation1.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation1">{{ scope.row.quotation1.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation1">{{ scope.row.quotation1.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation1">{{ scope.row.quotation1.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>1" label="第2次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation2.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation2">{{ scope.row.quotation2.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation2.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation2">{{ scope.row.quotation2.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation2.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation2">{{ scope.row.quotation2.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation2">{{ scope.row.quotation2.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation2">{{ scope.row.quotation2.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>2" label="第3次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation3.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation3">{{ scope.row.quotation3.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation3.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation3">{{ scope.row.quotation3.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation3.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation3">{{ scope.row.quotation3.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation3">{{ scope.row.quotation3.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation3">{{ scope.row.quotation3.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>3" label="第4次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation4.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation4">{{ scope.row.quotation4.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation4.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation4">{{ scope.row.quotation4.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation4.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation4">{{ scope.row.quotation4.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation4">{{ scope.row.quotation4.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation4">{{ scope.row.quotation4.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>4" label="第5次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation5.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation5">{{ scope.row.quotation5.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation5.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation5">{{ scope.row.quotation5.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation5.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation5">{{ scope.row.quotation5.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation5">{{ scope.row.quotation5.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation5">{{ scope.row.quotation5.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>5" label="第6次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation6.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation6">{{ scope.row.quotation6.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation6.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation6">{{ scope.row.quotation6.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation6.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation6">{{ scope.row.quotation6.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation6">{{ scope.row.quotation6.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation6">{{ scope.row.quotation6.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>6" label="第7次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation7.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation7">{{ scope.row.quotation7.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation7.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation7">{{ scope.row.quotation7.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation7.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation7">{{ scope.row.quotation7.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation7">{{ scope.row.quotation7.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation7">{{ scope.row.quotation7.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>7" label="第8次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation8.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation8">{{ scope.row.quotation8.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation8.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation8">{{ scope.row.quotation8.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation8.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation8">{{ scope.row.quotation8.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation8">{{ scope.row.quotation8.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation8">{{ scope.row.quotation8.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>8" label="第9次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation9.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation9">{{ scope.row.quotation9.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation9.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation9">{{ scope.row.quotation9.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation9.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation9">{{ scope.row.quotation9.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation9">{{ scope.row.quotation9.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation9">{{ scope.row.quotation9.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="count>9" label="第10次" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50" prop="quotation10.planQuote">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation10">{{ scope.row.quotation10.planQuote.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50" prop="quotation10.estimatedCost">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation10">{{ scope.row.quotation10.estimatedCost.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50" prop="quotation10.estimatedProfitMargin">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation10">{{ scope.row.quotation10.estimatedProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation10">{{ scope.row.quotation10.estimatedConsultancyFee.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.quotation10">{{ scope.row.quotation10.estimatedNetProfitMargin.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本次报价" align="center">
          <el-table-column label="报价(万元)" align="center" min-width="50">
            <template slot-scope="scope">
              {{ scope.row.planQuote.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="成本(万元)" align="center" min-width="50">
            <template slot-scope="scope">
              {{ scope.row.estimatedCost.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              {{ scope.row.estimatedProfitMargin.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="咨询费(%)" align="center" min-width="50">
            <template slot-scope="scope">
              {{ scope.row.estimatedConsultancyFee.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="净利润(%)" align="center" min-width="50">
            <template slot-scope="scope">
              {{ scope.row.estimatedNetProfitMargin.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!--流程信息-->
    <flow-display v-if="billFlow" ref="flowSelect" :is-edit="true" :bill-flow="billFlow" />

    <flow-attitude
      v-if="isLoad"
      ref="flowAttitude"
      :show="true"
      :para="attitudePara"
    >
      <template #saveBtn>
        <!--当前审批人拥有支付的操作-->
        <!-- <el-button v-if="showPayButton" size="mini" type="success">特殊操作，支付</el-button> -->
        <!--调用单据中controller操作-->
        <el-button size="mini" type="success" :loading="loading" @click="updateFlow()">保存</el-button>
      </template>
    </flow-attitude>

  </div>
</template>

<script>
import { getBussinessBidAttitudeById, checkBussinessBid } from '@/api/ywgl/bussinessBid'
import FlowDisplay from '@/components/Flow/flowDisplay'
import FlowAttitude from '@/components/Flow/flowAttitude'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'BussinessBidAttitude',
  components: {
    FlowAttitude,
    FlowDisplay,
    UpFile
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        bussinessInfoId: null,
        controlPrice: null,
        offerType: null,
        professionalType: null,
        marketSegment: null,
        planForeignQuotation: 0,
        estimatedCost: 0,
        estimatedProfit: 0,
        costOfFlatMeter: 0,
        quotationDeadline: null,
        quotationTimes: 0,
        totalTimes: 0,
        remark: '',
        state: 0,
        billFlowId: 0,
        bussinessInfo: {
          projectName: ''
        },
        fileList: []
      },
      infoForm: {
        orgStr: '',
        tenderMode: '',
        reliableLevel: '',
        decorationArea: '',
        floors: '',
        professionalType: '',
        competitors: '',
        bidEvaluationMethod: ''
      },
      tenderModeList: [],
      informationSourceList: [],
      marketSegmentList: [],
      professionalTypeList: [],
      offerTypeList: [],

      count: 0,
      list: [],
      loading: false,
      bussinessBidId: null,
      isLoad: false,
      billFlow: null,
      attitudePara: {}
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.ruleForm.orgId = null // 刷新 org 列表
      this.initData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    }
  },
  mounted() {

  },
  methods: {
    async initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.bussinessBidId = this.$route.query.id
      }
      if (this.bussinessBidId) {
        this.loading = true
        await getBussinessBidAttitudeById({ id: this.bussinessBidId }).then(response => this.setData(response))
      }
    },
    setData(response) {
      // 验证
      if (!response.success) {
        this.$alert(response.message, {
          callback: action => {
            this.closeThePage()
          }
        })
      }
      const { data, billFlowData, orgStr, result1, result3, result4, result5, result6, detailList, bidEvaluationMethod } = response
      this.infoForm.orgStr = orgStr
      this.tenderModeList = result1
      this.informationSourceList = result3
      this.marketSegmentList = result4
      this.offerTypeList = result5
      this.professionalTypeList = result6

      this.ruleForm = data
      this.ruleForm.fileList = data.upFile

      this.infoForm.tenderMode = (data.bussinessInfo.tenderMode && this.tenderModeList) ? this.tenderModeList.find(f => f.value === data.bussinessInfo.tenderMode).name : ''
      this.infoForm.decorationArea = data.bussinessInfo.decorationArea ? this.utils.formatMoney(data.bussinessInfo.decorationArea, 2, 0) : null
      this.infoForm.floors = data.bussinessInfo.floors
      this.infoForm.informationSource = (data.bussinessInfo.informationSource && this.informationSourceList) ? this.informationSourceList.find(f => f.value === data.bussinessInfo.informationSource).name : ''
      this.infoForm.competitors = data.bussinessInfo.competitors
      this.infoForm.bidEvaluationMethod = bidEvaluationMethod

      this.list = detailList
      this.count = this.ruleForm.quotationTimes - 1

      this.billFlow = billFlowData
      this.attitudePara = { formId: billFlowData.formId, billFlowId: data.billFlowId, planId: data.id }
      this.loading = false // loading 状态关闭
      this.isLoad = true // 加载审批组件
    },
    updateFlow() {
      this.loading = true
      const data = { 'id': this.bussinessBidId, 'attitude': this.$refs.flowAttitude.getPostData() }
      checkBussinessBid(data).then(response => {
        if (response.success) {
          this.$message.success(response.message)
          this.closeThePage() // 跳转
        } else {
          this.$message.error(response.message)
        }
        this.loading = false
      })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    viewBussinessInfo(bussinessInfoId) {
      this.$router.push({ name: 'BussinessInfoDetail', query: { id: bussinessInfoId, refreshRouterName: this.$route.name }, params: { id: bussinessInfoId }})
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        var columnArr = []
        const values = data.map(item => {
          var arr = []
          if (column.property) {
            arr = column.property.toString().split('.')
          }
          if (arr.length > 1) {
            columnArr.push(column.property)
            if (item[arr[0]]) {
              return Number(item[arr[0]][arr[1]])
            } else {
              return Number(0)
            }
          }
        })

        if (columnArr.includes(column.property)) {
          if (column.property.toString().indexOf('estimatedProfitMargin') > -1) {
            sums[index] = ((sums[index - 2] - sums[index - 1]) * 100 / sums[index - 2]).toFixed(2)
          } else {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0).toFixed(2)
            sums[index]
          }
        }
      })

      return sums
    }
  }

}
</script>
