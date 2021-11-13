<template>
  <div class="app-container">
    <div>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写单据" icon="el-icon-edit" />
        <el-step title="确认流程" icon="el-icon-refresh" />
      </el-steps>
    </div>
    <div v-show="active===0 || active===2">
      <el-form
        ref="ruleForm"
        status-icon
        :model="ruleForm"
        :rules="rules"
        label-width="160px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="编号" prop="number">
              <el-input v-model="ruleForm.number" readonly="readonly" placeholder="自动生成" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item v-if="orgList" label="组织机构：" prop="orgId">
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
                :check-strictly="false"
                :options="orgList"
                :disabled="true"
                :select-data="ruleForm.orgId"
                select-style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="工程名称：" prop="bussinessInfoId">
              <el-input v-model="bussinessInfoName" readonly="readonly" size="mini" maxlength="50">
                <el-button slot="append" icon="el-icon-search" @click="selectBussinessInfo()" />
              </el-input>
              <select-bussiness-info ref="bussinessInfoRef" :multiple="false" @getBussinessInfo="getBussinessInfo" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="控制价：" prop="controlPrice">
              <el-input v-model="ruleForm.controlPrice" placeholder="请输入" type="number" size="mini" :precision="2">
                <i slot="suffix" style="margin-right: 10px;">万元</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="招标形式：">
              <el-input v-model="infoForm.tenderMode" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="报价方式：" prop="offerType">
              <el-select v-model="ruleForm.offerType" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="(item,index) in offerTypeList"
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
            <el-form-item label="市场划分类别：" prop="marketSegment">
              <el-select v-model="ruleForm.marketSegment" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="(item,index) in marketSegmentList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="专业类别：" prop="professionalType">
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
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="报价次数：" prop="quotationTimes">
              <el-input v-model="ruleForm.quotationTimes" type="number" size="mini" controls-position="right" :min="1">
                <i slot="prefix" style="margin-left: 10px;">第</i>
                <i slot="suffix" style="margin-right: 10px;">次</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="总次数：" prop="totalTimes">
              <el-input v-model="ruleForm.totalTimes" type="number" size="mini" :min="0">
                <i slot="suffix" style="margin-right: 10px;">次</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="装饰面积：">
              <el-input v-model="infoForm.decorationArea" readonly="readonly" size="mini" maxlength="50">
                <i slot="suffix" style="margin-right: 10px;">平方米</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="信息来源：">
              <el-input v-model="infoForm.informationSource" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="幢数层数：">
              <el-input v-model="infoForm.floors" readonly="readonly" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="主要竞争对手：">
              <el-input v-model="infoForm.competitors" readonly="readonly" type="textarea" :rows="1" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="计划对外报价合计：">
              <el-input v-model="ruleForm.planForeignQuotation" type="number" size="mini" :disabled="true">
                <i slot="suffix" style="margin-right: 10px;">万元</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="预估成本合计：">
              <el-input v-model="ruleForm.estimatedCost" type="number" size="mini" :disabled="true">
                <i slot="suffix" style="margin-right: 10px;">万元</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="预估利润合计率：">
              <el-input v-model="ruleForm.estimatedProfit" type="number" size="mini" :disabled="true">
                <i slot="suffix" style="margin-right: 10px;">%</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="每平米造价：">
              <el-input v-model="ruleForm.costOfFlatMeter" type="number" size="mini" :disabled="true">
                <i slot="suffix" style="margin-right: 10px;">元</i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="报价截止时间：" prop="quotationDeadline">
              <el-date-picker
                v-model="ruleForm.quotationDeadline"
                type="date"
                placeholder="请选择"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="评标办法：">
              <el-input v-model="infoForm.bidEvaluationMethod" readonly="readonly" type="textarea" :rows="3" size="mini" maxlength="500" />
              <span>注：取最后一次招标文件评审结果</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="附件：">
              <up-file
                v-model="ruleForm.fileList"
                :size="50"
                :is-upfile="true"
                :is-preview="true"
                :is-download="true"
                :is-delete="true"
                :is-rename="true"
                :file-list="ruleForm.fileList"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 标段 -->
      <div v-show="ruleForm.bussinessInfoId">
        <div class="flex_div">
          <el-button :loading="loading" size="mini" @click="add()">+添加标段</el-button>
        </div>
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
          <el-table-column label="标段" align="center" min-width="50" fixed="left">
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
            <el-table-column label="报价(万元)" align="center" min-width="70" prop="planQuote">
              <template slot-scope="scope">
                {{ scope.row.planQuote.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="成本(万元)" align="center" min-width="70" prop="estimatedCost">
              <template slot-scope="scope">
                {{ scope.row.estimatedCost.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="利润(%)" align="center" min-width="70">
              <template slot-scope="scope">
                {{ scope.row.estimatedProfitMargin.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="咨询费(%)" align="center" min-width="70">
              <template slot-scope="scope">
                {{ scope.row.estimatedConsultancyFee.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="净利润(%)" align="center" min-width="70">
              <template slot-scope="scope">
                {{ scope.row.estimatedNetProfitMargin.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
                  <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除本次报价" @click="del(scope)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align:center; margin-top:15px;">
        <el-button size="mini" type="success" :loading="loading" @click="getDynamicFlow('ruleForm')">下一步➜</el-button>
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
        <component :is="comName" :obj="currentRow" :is-preview="true" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
    <!--流程显示-->
    <div v-show="active===1 || active===2">
      <flow-select v-if="billFlow" ref="flowSelect" :bill-flow="billFlow" />
      <div style="text-align:center;margin-top:10px;">
        <el-button v-if="ruleForm.id>0 && ruleForm.state === 0" size="mini" type="warning" :loading="loading" @click="cancel()">作废</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="primary" :loading="loading" @click="submitForm('ruleForm',1)">提交</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="submitForm('ruleForm',0)">保存</el-button>
        <el-button v-if="ruleForm.state === 0" size="mini" type="success" :loading="loading" @click="previous()">上一步</el-button>
      </div>
    </div>
    <div><flow-attitude v-if="loadFlow" ref="flowAttitude" :show="false" :para="attitudePara" /></div>
  </div>
</template>

<script>
import { putBussinessBid, addBussinessBid, getBussinessBidEditInit, getBussinessBidById, getBillFlow, deleteBussinessBid, getBussinessInfoById } from '@/api/ywgl/bussinessBid'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import { validate } from '@/utils/validate'
import BussinessBidDetailAdd from './bussinessBidDetailAdd'
import SelectBussinessInfo from '@/components/Other/ywgl/selectBussinessInfo'
export default {
  name: 'BussinessBidEdit',
  components: {
    FlowSelect,
    UpFile,
    OrgSelect2,
    BussinessBidDetailAdd,
    SelectBussinessInfo
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        number: '',
        orgId: null,
        companyId: this.$store.state.user.selectOrgId,
        bussinessInfoId: null,
        controlPrice: 0,
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
        fileList: []
      },
      infoForm: {
        tenderMode: '',
        reliableLevel: '',
        decorationArea: '',
        floors: '',
        professionalType: '',
        competitors: '',
        bidEvaluationMethod: ''
      },
      bussinessBidId: null,
      area: 0, // 用于计算每平米造价 infoForm里的格式化了
      bussinessInfoName: '',

      keyOrg: 0,
      orgList: null,

      marketSegmentList: [],
      professionalTypeList: [],
      offerTypeList: [],

      dialogTableVisible: false,
      dialogTitle: '添加评分细则及估值',
      dialogWidth: '50%',
      comName: 'CreditBidDetailAdd',
      currentRow: null,
      listIndex: 0,
      list: [],
      count: 0,

      attitudePara: null,
      loadFlow: false,
      billFlow: null,

      active: 0,
      loading: false,
      rules: {
        bussinessInfoId: [{ required: true, message: '请输入', trigger: 'change' }],
        offerType: [{ required: true, message: '请输入', trigger: 'blur' }],
        professionalType: [{ required: true, message: '请输入', trigger: 'blur' }],
        marketSegment: [{ required: true, message: '请输入', trigger: 'blur' }],
        quotationDeadline: [{ required: true, message: '请输入', trigger: 'blur' }],
        quotationTimes: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'ruleForm.planForeignQuotation': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue) {
          this.ruleForm.estimatedProfit = ((this.ruleForm.planForeignQuotation - this.ruleForm.estimatedCost) * 100 / this.ruleForm.planForeignQuotation).toFixed(2)
          this.ruleForm.costOfFlatMeter = (this.ruleForm.planForeignQuotation * 10000 / this.area).toFixed(2)
          if (isNaN(this.ruleForm.estimatedProfit)) {
            this.ruleForm.estimatedProfit = 0
          }
          if (isNaN(this.ruleForm.costOfFlatMeter)) {
            this.ruleForm.costOfFlatMeter = 0
          }
        }
      }, deep: true
    },
    'ruleForm.estimatedCost': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue) {
          this.ruleForm.estimatedProfit = ((this.ruleForm.planForeignQuotation - this.ruleForm.estimatedCost) * 100 / this.ruleForm.planForeignQuotation).toFixed(2)
          if (isNaN(this.ruleForm.estimatedProfit)) {
            this.ruleForm.estimatedProfit = 0
          }
        }
      }, deep: true
    },
    'area': {
      handler: function(value, oldvalue) {
        if (value !== oldvalue) {
          this.ruleForm.costOfFlatMeter = (this.ruleForm.planForeignQuotation * 10000 / this.area).toFixed(2)
        }
      }, deep: true
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
    if (!this.$route.params.id) {
      this.initData()
      this.activate = true
    }
  },
  methods: {
    submitForm(formName, state) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.state = state

          let tempIds = []
          if (newObj.fileList.length > 0) {
            tempIds = newObj.fileList.map(m => {
              return { id: m.id, addFlag: m.addFlag }
            })
          } else {
            if (state === 1) {
              this.$message('必须上传附件!')
              return
            }
          }
          newObj.fileList = tempIds

          var arr1 = []
          this.list.forEach(e => {
            var item = {}
            if (e.planQuote !== 0) {
              item.id = e.id
              item.name = e.name
              item.planQuote = e.planQuote
              item.estimatedCost = e.estimatedCost
              item.estimatedProfitMargin = e.estimatedProfitMargin
              item.estimatedConsultancyFee = e.estimatedConsultancyFee
              item.estimatedNetProfitMargin = e.estimatedNetProfitMargin
              arr1.push(item)
            }
          })
          newObj.bussinessBidDetails = arr1
          if (this.billFlow) {
            // 获取流程组件中的数据
            const billFlow = this.$refs.flowSelect.getBillFlow()
            if (!billFlow) {
              return false
            }
            newObj.billFlow = billFlow
          } else {
            this.$message('流程数据不能为空')
            return
          }
          this.buttonLoading = true

          if (this.bussinessBidId) {
            putBussinessBid(newObj).then(response => {
              if (response.errorMsg) {
              // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.buttonLoading = false
              this.closeThePage()
            }).catch(() => {
              this.buttonLoading = false
              this.active = 0
            })
          } else {
            addBussinessBid(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.buttonLoading = false
              this.closeThePage()
              // this.setData(response)
            }).catch(() => {
              this.buttonLoading = false
              this.active = 0
            })
          }
        }
      })
    },
    initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.bussinessBidId = this.$route.query.id
      }
      new Promise((resolve, reject) => {
        getBussinessBidEditInit().then(response => {
          const { orgList, result1, result2, result3, result4, result5, result6 } = response
          this.orgList = orgList
          this.tenderModeList = result1
          this.reliableLevelList = result2
          this.informationSourceList = result3
          this.marketSegmentList = result4
          this.offerTypeList = result5
          this.professionalTypeList = result6
          resolve(orgList)
        })
      }).then(orgList => {
        if (this.bussinessBidId) {
          getBussinessBidById({ id: this.bussinessBidId }).then(response => {
            const { data, detailList, bidEvaluationMethod } = response
            this.area = data.bussinessInfo.decorationArea
            this.ruleForm = data
            this.keyOrg += 1
            this.ruleForm.fileList = data.upFile
            this.bussinessInfoName = data.bussinessInfo.projectName
            this.infoForm.tenderMode = (data.bussinessInfo.tenderMode && this.tenderModeList) ? this.tenderModeList.find(f => f.value === data.bussinessInfo.tenderMode).name : ''
            this.infoForm.decorationArea = data.bussinessInfo.decorationArea ? this.utils.formatMoney(data.bussinessInfo.decorationArea, 2, 0) : null
            this.infoForm.floors = data.bussinessInfo.floors
            this.infoForm.informationSource = (data.bussinessInfo.informationSource && this.informationSourceList) ? this.informationSourceList.find(f => f.value === data.bussinessInfo.informationSource).name : ''
            this.infoForm.competitors = data.bussinessInfo.competitors
            this.infoForm.bidEvaluationMethod = bidEvaluationMethod
            this.list = detailList
            this.count = data.quotationTimes - 1
          })
        }
      }).catch(() => {
        this.$message.error('信息错误')
      })
    },
    getDynamicFlow(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var arr1 = []
          this.list.forEach(e => {
            var item = {}
            if (e.planQuote !== 0) {
              item.id = e.id
              item.name = e.name
              item.planQuote = e.planQuote
              item.estimatedCost = e.estimatedCost
              item.estimatedProfitMargin = e.estimatedProfitMargin
              item.estimatedConsultancyFee = e.estimatedConsultancyFee
              item.estimatedNetProfitMargin = e.estimatedNetProfitMargin
              arr1.push(item)
            }
          })
          if (arr1.length === 0) {
            this.$message.warning('请添加本次报价！')
            return
          }
          newObj.bussinessBidDetails = arr1
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
      this.active--
      this.billFlow = null
    },
    cancel() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        this.active = 2
        this.buttonloading = true
        deleteBussinessBid({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.buttonloading = false
          this.closeThePage()
        })
      }).catch(() => {})
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    dialogClose(data, state) {
      this.addDetail(data, state)
      this.dialogTableVisible = false
    },
    addDetail(data, state) {
      if (data) {
        if (state === 'add') {
          // 在此判断新增标段是否已经存在
          this.list.push(data)
        } else if (state === 'update') {
          this.list.splice(this.listIndex, 1, data)
        }
      }
    },
    edit(d) {
      this.currentRow = d.row
      this.listIndex = d.$index
      this.dialogTitle = '编辑本次报价'
      this.comName = 'BussinessBidDetailAdd'
      this.dialogWidth = '50%'
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.dialogTitle = '添加新标段和报价'
      this.comName = 'BussinessBidDetailAdd'
      this.dialogWidth = '50%'
      this.dialogTableVisible = true
    },
    del(d) {
      // 判断是新增标段还是原有标段(新标段不含原始报价字段)
      if (Object.prototype.hasOwnProperty.call(d.row, 'quotation1')) {
        this.list[d.$index].planQuote = 0
        this.list[d.$index].estimatedCost = 0
        this.list[d.$index].estimatedProfitMargin = 0
        this.list[d.$index].estimatedConsultancyFee = 0
        this.list[d.$index].estimatedNetProfitMargin = 0
      } else {
        this.list.splice(d.$index, 1)
      }
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
          if (arr.length === 1) {
            return Number(item[column.property])
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

        if (column.property === 'planQuote') {
          this.ruleForm.planForeignQuotation = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          // this.ruleForm.planForeignQuotation
        }

        if (column.property === 'estimatedCost') {
          this.ruleForm.estimatedCost = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          // sums[index]
        }
      })

      return sums
    },
    selectBussinessInfo() {
      this.$refs.bussinessInfoRef.openDialog()
    },
    getBussinessInfo(data) {
      if (data.length > 0) {
        this.ruleForm.bussinessInfoId = data[0].id
        this.bussinessInfoName = data[0].projectName
        getBussinessInfoById({ id: this.ruleForm.bussinessInfoId }).then((response) => {
          const { data, detailList, totalTimes, quotationTimes, bidEvaluationMethod } = response
          this.ruleForm.orgId = data.orgId
          this.keyOrg += 1
          this.ruleForm.companyId = data.companyId
          this.ruleForm.professionalType = data.professionalType
          this.infoForm.tenderMode = (data.tenderMode && this.tenderModeList) ? this.tenderModeList.find(f => f.value === data.tenderMode).name : ''
          this.infoForm.decorationArea = data.decorationArea ? this.utils.formatMoney(data.decorationArea, 2, 0) : null
          this.area = data.decorationArea
          this.infoForm.floors = data.floors
          this.infoForm.informationSource = (data.informationSource && this.informationSourceList) ? this.informationSourceList.find(f => f.value === data.informationSource).name : ''
          this.infoForm.competitors = data.competitors
          this.infoForm.bidEvaluationMethod = bidEvaluationMethod
          this.ruleForm.totalTimes = totalTimes
          this.ruleForm.quotationTimes = quotationTimes + 1
          this.list = detailList
          this.count = quotationTimes
        })
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
