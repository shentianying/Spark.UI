<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
      size="mini"
    >
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="50" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" type="textarea" :rows="2" maxlength="1000" />
      </el-form-item>

      <el-form-item label="添加流程">
        <div class="main">
          <!--循环表单状态列表-->
          <div v-for="(item1,index1) in flowStateNode" :key="index1" class="flexwrap">
            <div class="flownode">
              <div style="text-align:center;">{{ item1.name }}</div>
              <!--数据为空 显示 + 符号-->
              <div v-if="item1.isCheckup && !item1.flowNode.length" class="flexwrap" @click="addNode(0,item1,index1)">
                <el-tooltip content="点击增加节点" effect="light" placement="top" :enterable="false">
                  <el-link :underline="false"><i class="fontSize20 el-icon-circle-plus-outline" /></el-link>
                </el-tooltip>
              </div>
              <!--嵌套流程start-->
              <!--子流程首位 + 号-->
              <div v-if="item1.isCheckup && item1.flowNode.length" class="flexwrap">
                <div v-if="item1.flowNode.length" @click="addNode(0,item1,index1)">
                  <el-tooltip content="点击增加节点" effect="light" placement="top" :enterable="false">
                    <el-link :underline="false"><i class="fontSize20 el-icon-circle-plus-outline" /></el-link>
                  </el-tooltip>
                </div>
                <!--流程节点循环体 ruleForm.flowNode-->
                <div v-for="(item2,index2) in item1.flowNode" :key="index2" class="flexwrap">
                  <div class="flownode">
                    <div style="text-align:center;border-bottom: 1px solid #ebeef5;padding:0 5px;">
                      模式：{{ getObjectValue(dropDownData.flowNodeModeList.find(f => f.value === item2[0].mode), 'name') }}
                    </div>
                    <div v-for="(item3,index3) in item2" :key="index3" style="padding:0 10px;">
                      {{ index3+1 }}.{{ item3.roleId ===0 ? getObjectValue(dropDownData.roleTypeList.find(f => f.value === item3.roleType),'name') : getObjectValue(dropDownData.roleList.find(f => f.id === item3.roleId),'name') }}
                      <el-tooltip :content="'紧急程度：'+getObjectValue(dropDownData.gradeList.find(f => f.value === item3.grade),'name')" effect="light" placement="top" :enterable="false">
                        <span v-if="item3.grade === 0"><i class="el-icon-star-off" style="color:#67C23A" /></span>
                        <span v-if="item3.grade === 1"><i class="el-icon-star-off" style="color:#E6A23C" /></span>
                        <span v-if="item3.grade === 2"><i class="el-icon-star-off" style="color:#F56C6C" /></span>
                      </el-tooltip>
                      <el-tooltip v-if="item3.maxDays" :content="'最长审批时间'+item3.maxDays+'天'" effect="light">
                        <el-tag type="danger" size="mini">{{ item3.maxDays }}</el-tag>
                      </el-tooltip>

                      <el-tooltip v-if="item3.option" :content="getObjectValue(dropDownData.options.find(f => f.value === item3.option),'name')" effect="light" placement="top" :enterable="false">
                        <span><i class="el-icon-info" style="color:red" /></span>
                      </el-tooltip>
                    </div>
                    <div style="border-top: 1px solid #ebeef5; text-align:center;">
                      <el-link type="success" :underline="false" @click="editNode(item1,index1,item2,index2)"><i class="el-icon-edit" />编辑</el-link>
                      <el-link type="danger" :underline="false" @click="deleteNode(index1,index2)"><i class="el-icon-delete" />删除</el-link>
                    </div>
                  </div>
                  <div v-if="item1.flowNode.length!==(index2+1)" @click="addNode(index2+1,item1,index1)">
                    <el-tooltip content="点击增加节点" effect="light" placement="top" :enterable="false">
                      <el-link :underline="false"><i class="fontSize20 el-icon-right" /></el-link>
                    </el-tooltip>
                  </div>
                </div>
                <!--子流程末尾 + 号-->
                <div v-if="item1.flowNode.length" @click="addNode(item1.flowNode.length,item1,index1)">
                  <el-tooltip content="点击增加节点" effect="light" placement="top" :enterable="false">
                    <el-link :underline="false"><i class="fontSize20 el-icon-circle-plus-outline" /></el-link>
                  </el-tooltip>
                </div>
              </div>
              <!--嵌套流程end-->
            </div>
            <!--最后一个箭头不显示-->
            <div v-if="flowStateNode.length!==(index1+1)">
              <i class="fontSize20 el-icon-right" />
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="是否使用" prop="inUse">
        <el-switch
          v-model="ruleForm.inUse"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>

      <el-form-item label="" style="text-align:center;">
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
        <add-flow-node
          :obj="currentRow"
          :form-obj="formObj"
          :form-state-id="formStateId"
          :drop-down-data="dropDownData"
          @dialogEditClose="dialogEditClose"
          @dialogAddClose="dialogAddClose"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addFlow, putFlow } from '@/api/xtgl/flow'
import AddFlowNode from './component/addFlowNode'
import { getObjectValue } from '@/utils/index'
export default {
  name: 'AddFlow',
  components: {
    AddFlowNode
  },
  props: {
    obj: { type: Object, default: null },
    formObj: { type: Object, default: null },
    dropDownData: { type: Object, default: null },
    isCopy: { type: Boolean, default: false }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        name: '',
        formId: null,
        // formName: '',
        remark: '',
        inUse: true,
        flowNode: []
      },
      list: [],
      flowStateNode: [],
      buttonLoading: false,
      dialogTableVisible: false,
      currentRow: null,
      state: 0, // 当前状态
      index: 0,
      formStateIndex: 0,
      formStateId: null, // 查找 特殊操作 option用的
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getObjectValue() {
      return getObjectValue
    }
  },
  mounted() {
    // console.log('formObj:', this.formObj)
    this.initData()
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // console.log('newObj:', newObj)
          let flag = [false, '']
          const flowNode = []
          var group1 = 0
          for (const s of this.flowStateNode) { // 表单状态循环
            if (s.isCheckup && s.isFlowNode) {
              s.flowNode.forEach((e, i) => { // 状态下的节点循环
                group1 += 100
                e.forEach((e2, i2) => { // 节点下的 审批人 循环
                  if (i2 === e.length - 1 && i === s.flowNode.length - 1 && e2.maxDays > 0) {
                    flag = [true, `${s.name}-最后一个节点最大审批时间必须等于0，当前是：${e2.maxDays}`]
                  }
                  flowNode.push({
                    id: e2.id,
                    flowId: newObj.id || 0,
                    group: group1,
                    mode: e2.mode,
                    option: e2.option,
                    roleType: e2.roleType,
                    state: e2.state,
                    maxDays: e2.maxDays,
                    roleId: e2.roleId,
                    grade: e2.grade
                  })
                })
              })
            }
          }
          if (flag[0]) {
            this.$alert(flag[1])
            return
          }
          newObj.flowNode = flowNode
          // console.log('newObj:', newObj)
          // 复制 操作
          if (this.obj && this.isCopy) {
            this.buttonLoading = true
            delete newObj.id
            delete newObj.lastEditDate
            delete newObj.lastEditUserId
            delete newObj.lastEditUserName
            delete newObj.createUserName
            delete newObj.createUserId
            delete newObj.createUserName
            newObj.flowNode.forEach(e => {
              delete e.flowId
              delete e.id
            })
            newObj.conditionDescription = ''
            addFlow(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
          // console.log('编辑流程请求对象：', newObj)
          // return
          if (this.obj && !this.isCopy) {
            // 修改
            this.buttonLoading = true
            putFlow(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else if (!this.obj && !this.isCopy) {
            // 添加
            this.buttonLoading = true
            addFlow(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    initData() {
      const formStateList = [...this.dropDownData.formStateList]
      if (this.obj) {
        const thisObj = JSON.parse(JSON.stringify(this.obj))
        // const formStateList = [...this.dropDownData.formStateList]
        formStateList.forEach(e => {
          if (e.isFlowNode) {
            const fn = thisObj.flowNode.filter(f => f.state === e.value)
            e.flowNode = this.groupBy(fn, function(item) { return [item.group] })
            this.flowStateNode.push(e)
          }
        })
        this.ruleForm = thisObj

        // 清空
        if (this.isCopy) {
          this.ruleForm.name = ''
          this.ruleForm.remark = ''
        }
      } else {
        this.ruleForm.formId = this.formObj.id
        formStateList.forEach(e => {
          if (e.isFlowNode) {
            e.flowNode = []
            this.flowStateNode.push(e)
          }
        })
      }
    },
    addNode(index2, item1, index1) {
      this.currentRow = null
      this.index = index2
      this.state = item1.value
      this.formStateId = item1.id
      this.formStateIndex = index1
      this.dialogTableVisible = true
    },
    editNode(item1, index1, item2, index2) {
      this.currentRow = item2
      this.index = index2
      this.state = item1.value
      this.formStateId = item1.id
      this.formStateIndex = index1
      this.dialogTableVisible = true
    },
    deleteNode(index1, index2) {
      this.$confirm('确定删除?', '提示', {
        type: 'warning'
      }).then(() => {
        this.flowStateNode[index1].flowNode.splice(index2, 1)
      }).catch(() => {})
    },
    dialogAddClose(data) {
      this.dialogTableVisible = false
      if (data) {
        data.forEach(e => {
          e.state = this.state
        })
        this.flowStateNode[this.formStateIndex].flowNode.splice(this.index, 0, data)
      }
    },
    dialogEditClose(data) {
      this.dialogTableVisible = false
      if (data) {
        data.forEach(e => {
          e.state = this.state
        })
        // var a = this.flowStateNode[this.formStateIndex].flowNode
        if (data.length === 0) {
          // 为空就删除
          this.flowStateNode[this.formStateIndex].flowNode.splice(this.index, 1)
        } else {
          // 否则 就替换
          this.flowStateNode[this.formStateIndex].flowNode.splice(this.index, 1, data)
        }
      }
    },
    groupBy(array, f) {
      const groups = {}
      array.forEach(function(o) {
        const group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      return Object.keys(groups).map(function(group) { return groups[group] })
    }
  }
}
</script>

<style scoped>
.main{
    display:flex;
    /* flex-flow:row wrap;
    align-items:center ; */
}
.flexwrap{
    display:flex;align-items:center;justify-content: center;
}
.flownode {
  box-sizing:border-box;border:1px solid #ebeef5;border-radius: 4px; padding:10 0; min-width: 60px;
}
.fontSize20{
    font-size:20px
}
</style>
