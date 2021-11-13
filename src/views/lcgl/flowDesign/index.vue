<template>
  <el-container>
    <el-aside width="200px" class="asideClass">
      <el-alert
        title="选择表单"
        type="info"
        :closable="false"
      />
      <div class="div-formitem">
        <div
          v-for="(item,index) in formList"
          :key="index"
          :class="{'div-formitem-active':index === currentIndex}"
          @click="formClick(item,index)"
        >{{ item.name }}</div>
      </div>
    </el-aside>
    <el-main>
      <div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="24" style="text-align:right;">
            <el-button v-if="currentForm" v-has="'FLOW_ADD'" type="primary" size="mini" @click="handleAdd()">添加</el-button>
          </el-col>
        </el-row>

        <el-table
          :key="Math.random()"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column align="center" label="流程模板名称" :show-overflow-tooltip="true" width="120">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="流程" min-width="80">
            <template slot-scope="scope">
              <div style="display:flex">
                <flow :flow-node-list="scope.row.flowNode" :drop-down-data="dropDownData" />
                <el-link icon="el-icon-edit" title="修改流程" style="margin-left:5px;" @click="updateFlow(scope.row)" />
              </div>
            </template>
          </el-table-column>

          <el-table-column header-align="center" align="left" label="条件" min-width="40">
            <template slot-scope="scope">
              <div style="display:flex;">
                <div>
                  <span v-for="(item,index) in formateCondition(scope.row.conditionDescription)" :key="index" style="display:block;">
                    {{ item }}
                  </span>
                </div>
                <el-link icon="el-icon-edit" title="修改条件" style="margin-left:5px;" @click="addFlowCondition(scope.row)" />
              </div>
              <!-- {{ formateCondition(scope.row.conditionDescription) }} -->
            </template>
          </el-table-column>

          <el-table-column align="center" label="顺序" width="90">
            <template slot-scope="scope">
              <el-link icon="el-icon-top" title="上移" @click="prev(scope.row)" /> <!--上一个-->
              <el-link icon="el-icon-bottom" title="下移" @click="next(scope.row)" /> <!--下一个-->
              <el-link title="置顶" @click="top(scope.row)"> <!--置顶-->
                <svg-icon icon-class="top" />
              </el-link>
              <el-link title="置底" @click="bottom(scope.row)"> <!--置底-->
                <svg-icon icon-class="bottom" />
              </el-link>
            </template>
          </el-table-column>

          <el-table-column align="center" label="制单人" width="70">
            <template slot-scope="scope">
              <el-tooltip placement="top" :enterable="false" effect="light">
                <div slot="content">
                  制单人：{{ scope.row.createUserName }} 制单时间：{{ scope.row.createDate | dateTimeFormat }}<br>
                  更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate | dateTimeFormat }}</div>
                <div>{{ scope.row.createUserName }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-dropdown v-has="'FLOW_EDIT'" split-button size="mini" @click="updateFlow(scope.row)">
                <el-tooltip content="修改流程" effect="light" placement="left-start" :enterable="false">
                  <i class="el-icon-edit" />
                </el-tooltip>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-tooltip class="item" effect="dark" content="编辑条件" placement="left">
                      <span v-has="'FLOWCONDITION_INDEX'" @click="addFlowCondition(scope.row)">编辑条件</span>
                    </el-tooltip>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-tooltip class="item" effect="dark" content="复制流程" placement="left">
                      <span v-has="'FLOW_ADD'" @click="copyFlow(scope.row)">复制流程</span>
                    </el-tooltip>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

        </el-table>

        <div v-if="dialogTableVisible">
          <el-dialog
            :title="dialogTitle"
            :destroy-on-close="true"
            width="70%"
            :visible.sync="dialogTableVisible"
          >
            <component
              :is="comName"
              :is-copy="isCopy"
              :obj="currentRow"
              :form-obj="currentForm"
              :drop-down-data="dropDownData"
              @dialogClose="dialogClose"
            />
          </el-dialog>
        </div>
      </div>
    </el-main>
  </el-container>

</template>
<script>
import { getFlowList, putFlowPrev, putFlowNext, putFlowBottom, putFlowTop } from '@/api/xtgl/flow'
import { getFormList } from '@/api/xtgl/form'
import FlowAdd from './flowAdd'
import AddFlowNode from './component/addFlowNode'
import ConditionAdd from './conditionAdd'
import Flow from './component/flow'
export default {
  name: 'FlowDesign',
  components: {
    FlowAdd,
    AddFlowNode,
    Flow,
    ConditionAdd
  },
  data() {
    return {
      formList: null,
      list: [],
      dropDownData: {}, // 所有的下拉初始化数据
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '流程信息',
      comName: 'flowAdd',
      isCopy: false,

      currentRow: null,
      currentForm: null, // 当前选中表单的对象
      buttonLoading: false,
      searchText: '',

      currentIndex: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getFormList({ needCheckup: true }).then(response => {
        const { data } = response
        this.formList = data
      }).catch(() => { })
    },
    getFlow() {
      var postData = {}
      postData.name = this.searchText
      postData.formId = this.currentForm.id
      this.listLoading = true
      getFlowList(postData).then(response => {
        const { data, roleList, roleType, options, flowNodeMode, formfield, fieldType, dictionary, organization, formState, grade } = response
        this.dropDownData.flowList = data
        this.dropDownData.roleList = roleList
        this.dropDownData.roleTypeList = roleType
        // this.dropDownData.flowNodeTypeList = flowNodeType
        this.dropDownData.options = options // 操作类型
        this.dropDownData.flowNodeModeList = flowNodeMode
        this.dropDownData.formfieldList = formfield
        this.dropDownData.fieldTypeList = fieldType
        this.dropDownData.dictionary = dictionary
        this.dropDownData.organization = organization
        this.dropDownData.formStateList = formState
        this.dropDownData.gradeList = grade
        this.list = data
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    handleAdd() {
      this.currentRow = null
      this.comName = 'FlowAdd'
      this.dialogTableVisible = true
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.getFlow()
    },
    updateFlow(row) {
      this.currentRow = row
      this.isCopy = false
      this.comName = 'FlowAdd'
      this.dialogTableVisible = true
    },
    formClick(item, index) {
      this.currentForm = item
      this.currentIndex = index // 记录当前选中项的index
      this.getFlow()
    },
    prev(row) {
      putFlowPrev(row).then(response => {
        this.$message(response.message)
        this.getFlow()
      }).catch(() => {})
    },
    next(row) {
      putFlowNext(row).then(response => {
        this.$message(response.message)
        this.getFlow()
      }).catch(() => {})
    },
    top(row) {
      putFlowTop(row).then(response => {
        this.$message(response.message)
        this.getFlow()
      }).catch(() => {})
    },
    bottom(row) {
      putFlowBottom(row).then(response => {
        this.$message(response.message)
        this.getFlow()
      }).catch(() => {})
    },
    addFlowCondition(row) {
      this.dialogTitle = '添加条件 - ' + row.name
      this.currentRow = row
      this.comName = 'conditionAdd'
      this.dialogTableVisible = true
    },
    copyFlow(row) {
      this.dialogTitle = '复制流程'
      this.currentRow = row
      this.comName = 'FlowAdd'
      this.isCopy = true
      this.dialogTableVisible = true
      // this.$confirm('是否确定复制', '提示', {
      //   type: 'warning'
      // }).then(() => {
      //   copyFlow({ id: row.id }).then(response => {
      //     const { message } = response
      //     this.$message(message)
      //     this.getFlow()
      //   })
      // }).catch(() => {})
    },
    formateCondition(condition) {
      if (condition) { return condition.replace(/(并且|或者)/g, '<br>$1').split('<br>') } else { return [] }
    }
  }

}
</script>
<style scoped>
.el-menu-item.is-active {
    color: #FFF;
    background-color: #409EFF;
}
.div-formitem{
  display:flex;flex-flow:column nowrap;justify-content:center;align-items:center;
}
.div-formitem div{
  display:flex;height:40px;width:100%; justify-content:center;align-items:center;cursor:pointer;
}
.div-formitem-active{
  background-color: #409EFF;color:white;
}
.asideClass{
    padding:0 20px; margin-top:20px; max-height:460px;
}
</style>
