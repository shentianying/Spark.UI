<template>
  <div class="app-container">
    <el-form
      ref="ruleForm1"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
      size="mini"
    >
      <el-form-item label="模式" prop="mode">
        <el-select v-model="ruleForm.mode" placeholder="请选择">
          <el-option
            v-for="(item,index) in dropDownData.flowNodeModeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="节点角色">
        <div style="text-align:right;margin-bottom:10px;"><el-button type="primary" size="mini" @click="addNodeRole()">添加节点角色</el-button>
        </div>
        <el-table
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column align="center" label="角色类型：" min-width="10">
            <template slot-scope="scope">
              {{ getObjectValue(dropDownData.roleTypeList.find(f => f.value === scope.row.roleType),'name') }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.roleId === 0 ? "-" : getObjectValue(dropDownData.roleList.find(f => f.id === scope.row.roleId),'name') }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="审批天数" width="80">
            <template slot-scope="scope">
              {{ scope.row.maxDays === 0 ? '0（不限）' : scope.row.maxDays }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="紧急程度" width="80">
            <template slot-scope="scope">
              {{ getObjectValue(dropDownData.gradeList.find(f=>f.value === scope.row.grade), 'name', '-') }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作类型" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.option === 0 ? "无" : getObjectValue(dropDownData.options.find(f=>f.value === scope.row.option),'name','-') }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="60">
            <template slot-scope="scope">
              <el-link type="danger" :underline="false" @click="editFlowNode(scope.$index,scope.row)"><i class="el-icon-edit" /></el-link>
              <el-link type="danger" :underline="false" @click="deleteFlowNode(scope.$index)"><i class="el-icon-delete" /></el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm()">保存</el-button>
      </el-form-item>

    </el-form>

    <div v-if="dialogTableVisible">
      <el-dialog
        title="添加节点"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        :append-to-body="true"
      >
        <el-form
          ref="ruleForm"
          status-icon
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class=""
          size="mini"
        >
          <add-flow-node-role
            :drop-down-data="dropDownData"
            :form-state-id="formStateId"
            :obj="flowNodeObj"
            @dialogClose="dialogClose"
          />
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
// import { initFlowNode } from '@/api/xtgl/flow'
import AddFlowNodeRole from './addFlowNodeRole'
import { getObjectValue } from '@/utils/index'
export default {
  name: 'AddFlowNode',
  components: {
    AddFlowNodeRole
  },
  props: {
    obj: {
      type: [Object, Array],
      default: null
    },
    formStateId: { type: Number, default: null },
    dropDownData: { type: Object, default: null }
  },
  data() {
    return {
      ruleForm: {
        group: 0,
        // state: null,
        flowId: 0,
        mode: 1,
        maxDays: 0,
        grade: 0
      },
      list: [],
      flowNodeType: [],
      flowNodeMode: [],
      flowNodeObj: null, // 编辑的对象
      editFlowNodeIndex: 0, // 编辑flowNode当前的index
      buttonLoading: false,
      dialogTableVisible: false,
      rules: {
        group: [{ required: true, message: '必填', trigger: 'blur' }],
        // state: [{ required: true, message: '必填', trigger: 'blur' }],
        mode: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getObjectValue() {
      return getObjectValue
    }
  },
  mounted() {
    // console.log('addFlowNode.vue==>this.obj:', this.obj)
    this.initData()
  },
  created() {
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm1'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var result = []
          this.list.forEach(e => {
            result.push({
              id: e.id,
              group: newObj.group,
              // state: newObj.state,
              maxDays: e.maxDays,
              grade: e.grade,
              option: e.option,
              mode: newObj.mode,
              roleId: e.roleId,
              roleType: e.roleType })
          })
          // console.log('result:', result)
          if (this.obj) {
            this.$emit('dialogEditClose', result) // 编辑
          } else {
            this.$emit('dialogAddClose', result) // 添加
          }
        }
      })
    },
    initData() {
      if (this.obj) {
        var thisObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm =
          {
            flowId: thisObj[0].flowId,
            group: thisObj[0].group,
            // state: thisObj[0].state,
            mode: thisObj[0].mode
          }
        this.list = thisObj
      }
    },
    dialogClose(data, type) {
      if (type === 0) {
        // 修改 角色 判断重复
        if (data.roleId === 0) {
          const _has = this.list.find(f => f.roleType === data.roleType && f.id !== data.id)
          if (_has) {
            const roleType = this.dropDownData.roleTypeList.find(f => f.value === data.roleType).name
            this.$alert(`【${roleType}】重复了`)
            return false
          }
        }
        if (data.roleId > 0) {
          const _has = this.list.find(f => f.roleId === data.roleId && f.id !== data.id)
          if (_has) {
            const roleName = getObjectValue(this.dropDownData.roleList.find(f => f.id === data.roleId), 'name')
            const roleType = getObjectValue(this.dropDownData.roleTypeList.find(f => f.value === data.roleType), 'name')
            this.$alert(`【${roleType}】-【${roleName}】重复了`)
            return false
          }
        }
        this.list.splice(this.editFlowNodeIndex, 1, data)
      }

      if (type === 1) {
        // 添加 角色 判断重复
        if (data.roleId === 0) {
          const _has = this.list.find(f => f.roleType === data.roleType)
          if (_has) {
            const roleType = this.dropDownData.roleTypeList.find(f => f.value === data.roleType).name
            this.$alert(`选的【${roleType}】重复了`)
            return false
          }
        }
        if (data.roleId > 0) {
          const _has = this.list.find(f => f.roleId === data.roleId)
          if (_has) {
            const roleName = getObjectValue(this.dropDownData.roleList.find(f => f.id === data.roleId), 'name')
            const roleType = getObjectValue(this.dropDownData.roleTypeList.find(f => f.value === data.roleType), 'name')
            this.$alert(`选的【${roleType}】-【${roleName}】重复了`)
            return false
          }
        }

        this.list.push(data)
      }

      this.dialogTableVisible = false
    },
    addNodeRole() {
      this.flowNodeObj = null
      this.editFlowNodeIndex = 0
      this.dialogTableVisible = true
    },
    deleteFlowNode(index) {
      this.list.splice(index, 1)
    },
    editFlowNode(index, row) {
      this.editFlowNodeIndex = index
      this.flowNodeObj = row
      this.dialogTableVisible = true
    }
  }
}
</script>
