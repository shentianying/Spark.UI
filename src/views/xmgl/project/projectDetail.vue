<template>
  <div class="app-container">
    <div v-if="this.$route.query.id"><span>项目编号：</span><span>{{ ruleForm.number }}</span>&nbsp;<span>项目名称：</span><span>{{ ruleForm.name }}</span></div>
    <el-tabs v-model="activeTab" tab-position="top" :lazy="true" @tab-click="setSelected">
      <el-tab-pane :label="tabsInfo[0].label" :name="tabsInfo[0].name">
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
                  <el-form-item label="编号：">
                    {{ ruleForm.number }}
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
                    {{ ruleForm.area }}平方米
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
                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注：">
                    {{ ruleForm.remark }}
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
              <el-row :gutter="10">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="存档人：">
                    {{ ruleForm.saveUserName }}
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="存档日期：">
                    {{ ruleForm.saveDateTime }}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>

            <el-collapse-item title="质保期/质保金" name="warranty">
              <el-row :gutter="10">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="一阶段：">
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
                  <el-form-item label="二阶段：">
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
                  <el-form-item label="三阶段：">
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
                  <el-form-item label="四阶段：">
                    {{ ruleForm.warrantyDays4 }}天
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="四阶段比例：">
                    {{ ruleForm.warrantyRate4 }}%
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
                      :is-preview="true"
                      :is-download="true"
                      :file-list="ruleForm.zbFileList"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="投标文件：">
                    <up-file
                      v-model="ruleForm.tbFileList"
                      :size="50"
                      :is-preview="true"
                      :is-download="true"
                      :file-list="ruleForm.tbFileList"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="施工合同：">
                    <up-file
                      v-model="ruleForm.sghtFileList"
                      :size="50"
                      :is-preview="true"
                      :is-download="true"
                      :file-list="ruleForm.sghtFileList"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="补充合同：">
                    <up-file
                      v-model="ruleForm.bchtFileList"
                      :size="50"
                      :is-preview="true"
                      :is-download="true"
                      :file-list="ruleForm.bchtFileList"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="评审记录：">
                    <up-file
                      v-model="ruleForm.psjlFileList"
                      :size="50"
                      :is-preview="true"
                      :is-download="true"
                      :file-list="ruleForm.psjlFileList"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="中标通知书：">
                    <up-file
                      v-model="ruleForm.zbtzsFileList"
                      :size="50"
                      :is-preview="true"
                      :is-download="true"
                      :file-list="ruleForm.zbtzsFileList"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <el-divider content-position="left">立项申请记录</el-divider>
        <el-table
          ref="projectLXTable"
          v-loading="listLoading"
          :data="projectLXList"
          border
          size="mini"
        >
          <el-table-column align="center" label="编号" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.number }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="地区" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.organization.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目名称" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.project.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="制单人" width="100">
            <template slot-scope="scope">
              <el-tooltip placement="top" :enterable="false" effect="light">
                <div slot="content">
                  制单人：{{ scope.row.createUserName }} 制单时间：{{ scope.row.createDate }}<br>
                  更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate }}
                </div>
                <span>{{ scope.row.createUserName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="160">
            <template slot-scope="scope">
              <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="待处理人" width="160">
            <template slot-scope="scope">
              {{ getPerson(scope.row.billFlow.billFlowNode) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-link @click="viewProjectLX(scope.row.id)">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[1].label" :name="tabsInfo[1].name">
        施工策划
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[2].label" :name="tabsInfo[2].name">
        项目计划
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[3].label" :name="tabsInfo[3].name">
        项目进展
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[4].label" :name="tabsInfo[4].name">
        项目支出
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[5].label" :name="tabsInfo[5].name">
        项目资金
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[6].label" :name="tabsInfo[6].name">
        经营策划
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[7].label" :name="tabsInfo[7].name">
        项目成本
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[8].label" :name="tabsInfo[8].name">
        合同履约
      </el-tab-pane>
      <el-tab-pane v-if="this.$route.query.id" :label="tabsInfo[9].label" :name="tabsInfo[9].name">
        项目人工费统计
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { getProjectWithLXById } from '@/api/xmgl/project'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'ProjectDetail',
  components: {
    UpFile
  },
  data() {
    return {
      ruleForm: {
        orgId: 0,
        managementiState: 0,
        inUse: true,
        organization: {
          name: ''
        },
        zbFileList: [],
        tbFileList: [],
        sghtFileList: [],
        bchtFileList: [],
        psjlFileList: [],
        zbtzsFileList: []
      },
      activeNames: ['info', 'warranty', 'file'],
      engPropertiesName: '',
      managementiStateName: '',
      structureName: '',
      informationSourceName: '',
      taxTypeName: '',
      projectPropertyName: '',
      proPropertiesName: '',
      stateName: '',
      projectId: null,

      projectLXList: [],
      listLoading: false,

      activeTab: 'projectInfo',
      tabsInfo: [
        { name: 'projectInfo', selected: false, label: '项目信息' },
        { name: 'constructionPlan', selected: false, label: '施工策划' },
        { name: 'projectPlan', selected: false, label: '项目计划' },
        { name: 'projectProgress', selected: false, label: '项目进展' },
        { name: 'projectExpenses', selected: false, label: '项目支出' },
        { name: 'projectMoney', selected: false, label: '项目资金' },
        { name: 'managePlan', selected: false, label: '经营策划' },
        { name: 'projectCost', selected: false, label: '项目成本' },
        { name: 'htly', selected: false, label: '合同履约' },
        { name: 'projectLaborCost', selected: false, label: '项目人工费统计' }
      ],

      rules: { }
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
        this.listLoading = true
        getProjectWithLXById({ id: this.projectId }).then((response) => {
          const { data, dictionaries, lxList } = response
          this.ruleForm = data
          this.ruleForm.zbFileList = data.zbUpFile
          this.ruleForm.tbFileList = data.tbUpFile
          this.ruleForm.sghtFileList = data.sghtUpFile
          this.ruleForm.bchtFileList = data.bchtUpFile
          this.ruleForm.psjlFileList = data.psjlUpFile
          this.ruleForm.zbtzsFileList = data.zbtzsUpFile
          this.projectLXList = lxList
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
          this.listLoading = false
        })
      }
      // 其他页面跳转至项目详情页时添加tab名，显示对应页
      if (this.$route.query.tabName) {
        this.activeTab = this.$route.query.tabName
      }
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    // 解决 一次打开 多个选项卡一次性 加载 所有数据的问题
    setSelected(tag) {
      // this.tabsInfo[Number(tag.index)].selected = true  //如果有上面或中间不显示的tab，跳转tab时会不显示，index会重新排序
      this.tabsInfo.find(f => f.name === tag.name).selected = true
    },
    getFormState(row) {
      if (!row.billFlow) { return '流程空' }
      const formState = row.billFlow.form.formState
      this.formState = formState
      const state = row.state
      if (state === -1) return '作废'
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    getPerson(bfn) {
      if (bfn) {
        var arr = bfn.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    viewProjectLX(id) {
      this.$router.push({ name: 'ProjectLXDetail', query: { id: id, refreshRouterName: this.$route.name }, params: { id: id }})
    }
  }
}
</script>
