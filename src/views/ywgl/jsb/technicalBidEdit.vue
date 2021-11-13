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
            <el-form-item label="编号：" prop="number">
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
            <el-form-item label="业务类型：" prop="bussinessType">
              <el-select v-model="ruleForm.bussinessType" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="(item,index) in bussinessTypeList"
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
            <el-form-item label="装饰面积：">
              <el-input v-model="infoForm.decorationArea" readonly="readonly" maxlength="18">
                <i slot="suffix" style="margin-right: 10px;">平方米</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="质量目标：" prop="qualityTarget">
              <el-input v-model="ruleForm.qualityTarget" size="mini" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="计划开/竣工日期：">
              <el-input v-model="infoForm.startFinishDate" readonly="readonly" maxlength="18" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="技术标形式：" prop="technicalType">
              <el-select v-model="ruleForm.technicalType" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="(item,index) in technicalTypeList"
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
            <el-form-item label="投标截止日期：">
              <el-input v-model="infoForm.tenderEndDate" readonly="readonly" maxlength="18" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="是否参与评分：">
              <el-switch v-model="ruleForm.isRate" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :xs="24">
            <el-form-item label="资信标信息：">
              <el-link v-for="(creditBid,index) in creditBidList" :key="index" @click="handleDetail(creditBid.id)">{{ creditBid.number }}&nbsp;</el-link>
            </el-form-item>

            <el-form-item label="备注：" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="3" size="mini" maxlength="500" />
            </el-form-item>

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
      <!-- 评分细则及估值 -->
      <div>
        <div class="flex_div">
          <el-button :loading="loading" size="mini" @click="add()">+添加评分细则</el-button>
        </div>
        <el-table
          id="detailTable"
          v-loading="loading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column type="index" width="55" align="center" label="序号" />
          <el-table-column label="评分项目" align="center" min-width="50" prop="branchName">
            <template slot-scope="scope">
              {{ scope.row.branchName }}
            </template>
          </el-table-column>
          <el-table-column label="评分明细" align="right" header-align="center" min-width="50" prop="branchDetail">
            <template slot-scope="scope">
              {{ scope.row.branchDetail }}
            </template>
          </el-table-column>
          <el-table-column label="分值" align="center" min-width="50" prop="branchScore">
            <template slot-scope="scope">
              {{ scope.row.branchScore }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="100">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="edit(scope)" />
                <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="del(scope)" />
              </el-button-group>
            </template>
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
import { putTechnicalBid, addTechnicalBid, getTechnicalBidEditInit, getTechnicalBidById, getBillFlow, deleteTechnicalBid } from '@/api/ywgl/technicalBid'
import { getBussinessInfoById } from '@/api/ywgl/bussinessInfo'
import UpFile from '@/components/UpLoad/UpFile'
import FlowSelect from '@/components/Flow/flowSelect'
import TechnicalBidDetailAdd from './technicalBidDetailAdd'
import SelectBussinessInfo from '@/components/Other/ywgl/selectBussinessInfo'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'TechnicalBidEdit',
  components: {
    FlowSelect,
    UpFile,
    OrgSelect2,
    TechnicalBidDetailAdd,
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
        bussinessType: null,
        qualityTarget: '',
        technicalType: null,
        isRate: false,
        remark: '',
        state: 0,
        billFlowId: 0,
        fileList: []
      },
      infoForm: {
        decorationArea: '',
        startFinishDate: null,
        startDate: null,
        finishDate: null,
        tenderEndDate: null
      },
      technicalBidId: null,
      bussinessInfoName: '',

      keyOrg: 0,
      orgList: null,

      technicalTypeList: [],
      bussinessTypeList: [],
      creditBidList: [],

      attitudePara: null,
      loadFlow: false,
      billFlow: null,

      dialogTableVisible: false,
      dialogTitle: '添加评分细则',
      dialogWidth: '70%',
      comName: 'TechnicalBidDetailAdd',
      currentRow: null,
      listIndex: 0,
      list: [],

      active: 0,
      loading: false,
      rules: {
        bussinessInfoId: [{ required: true, message: '请输入', trigger: 'change' }],
        bussinessType: [{ required: true, message: '请输入', trigger: 'change' }],
        technicalType: [{ required: true, message: '请输入', trigger: 'change' }],
        qualityTarget: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
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
          newObj.state = state
          var arr1 = []
          this.list.forEach(e => {
            var item = {}
            item.id = e.id
            item.branchName = e.branchName
            item.branchScore = e.branchScore
            item.branchDetail = e.branchDetail
            arr1.push(item)
          })
          newObj.technicalBidDetails = arr1

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
          this.loading = true

          if (this.technicalBidId) {
            putTechnicalBid(newObj).then(response => {
              if (response.errorMsg) {
              // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
            }).catch(() => {
              this.loading = false
              this.active = 0
            })
          } else {
            addTechnicalBid(newObj).then(response => {
              if (response.errorMsg) {
                // 验证错误
                this.$alert(`${response.errorMsg.replace(/；/g, '；<br />')}`,
                  { dangerouslyUseHTMLString: true })
                return
              }
              this.$message(response.message)
              this.loading = false
              this.closeThePage()
              // this.setData(response)
            }).catch(() => {
              this.loading = false
              this.active = 0
            })
          }
        }
      })
    },
    initData() {
      // 有参数id 就是编辑
      if (this.$route.query.id) {
        this.technicalBidId = this.$route.query.id
      }
      new Promise((resolve, reject) => {
        getTechnicalBidEditInit().then(response => {
          const { orgList, result3, result4 } = response
          this.orgList = orgList
          this.technicalTypeList = result3
          this.bussinessTypeList = result4
          resolve(orgList)
        })
      }).then(orgList => {
        if (this.technicalBidId) {
          getTechnicalBidById({ id: this.technicalBidId }).then(response => {
            const { data, creditBidList } = response
            var pom = []
            data.technicalBidDetails.forEach(e => {
              pom.push({
                id: e.id,
                branchName: e.branchName,
                branchScore: e.branchScore,
                branchDetail: e.branchDetail
              })
            })
            // 填充 明细列表
            this.list = pom
            this.ruleForm = data
            this.keyOrg += 1
            this.ruleForm.fileList = data.upFile
            this.bussinessInfoName = data.bussinessInfo.projectName
            this.infoForm.decorationArea = data.bussinessInfo.decorationArea ? this.utils.formatMoney(data.bussinessInfo.decorationArea, 2, 0) : null
            this.infoForm.tenderEndDate = data.bussinessInfo.tenderEndDate ? (data.bussinessInfo.tenderEndDate || '').split(' ')[0] : '无'
            this.infoForm.startDate = data.bussinessInfo.startDate ? (data.bussinessInfo.startDate || '').split(' ')[0] : '无'
            this.infoForm.finishDate = data.bussinessInfo.finishDate ? (data.bussinessInfo.finishDate || '').split(' ')[0] : '无'
            this.infoForm.startFinishDate = this.infoForm.startDate + '/' + this.infoForm.finishDate
            this.creditBidList = creditBidList
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
            item.id = e.id
            item.branchName = e.branchName
            item.branchScore = e.branchScore
            item.branchDetail = e.branchDetail
            arr1.push(item)
          })
          newObj.technicalBidDetails = arr1

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
        this.loading = true
        deleteTechnicalBid({ id: this.ruleForm.id }).then(response => {
          this.$message(response.message)
          this.loading = false
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
          this.list.push(data)
        } else if (state === 'update') {
          this.list.splice(this.listIndex, 1, data)
        }
      }
    },
    edit(d) {
      this.currentRow = d.row
      this.listIndex = d.$index
      this.dialogTitle = '编辑评分细则'
      this.comName = 'TechnicalBidDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    add() {
      this.currentRow = null
      this.dialogTitle = '添加评分细则'
      this.comName = 'TechnicalBidDetailAdd'
      this.dialogWidth = '70%'
      this.dialogTableVisible = true
    },
    del(d) {
      // 页面删除
      this.list.splice(d.$index, 1)
    },
    handleDetail(id) {
      this.$router.push({ name: 'CreditBidDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    },
    selectBussinessInfo() {
      this.$refs.bussinessInfoRef.openDialog()
    },
    getBussinessInfo(data) {
      if (data.length > 0) {
        this.ruleForm.bussinessInfoId = data[0].id
        this.bussinessInfoName = data[0].projectName
        getBussinessInfoById({ id: this.ruleForm.bussinessInfoId }).then((response) => {
          const { data, creditBidList } = response
          this.ruleForm.orgId = data.orgId
          this.keyOrg += 1
          this.ruleForm.companyId = data.companyId
          this.infoForm.decorationArea = data.decorationArea ? this.utils.formatMoney(data.decorationArea, 2, 0) : null
          this.infoForm.tenderEndDate = data.tenderEndDate ? (data.tenderEndDate || '').split(' ')[0] : ''
          this.infoForm.startDate = data.startDate ? (data.startDate || '').split(' ')[0] : ''
          this.infoForm.finishDate = data.finishDate ? (data.finishDate || '').split(' ')[0] : ''
          this.infoForm.startFinishDate = this.infoForm.startDate + '/' + this.infoForm.finishDate
          this.creditBidList = creditBidList
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
