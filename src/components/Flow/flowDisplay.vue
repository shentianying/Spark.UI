<template>

  <div style="margin-top:10px;">
    <el-collapse v-model="activeName">
      <el-collapse-item title="" name="1">
        <template slot="title">
          <div class="title"><i class="el-icon-s-marketing" />流程信息</div>
        </template>

        <div class="main">
          <div v-for="(item,index) in stateList" :key="index" class="flexwrap">
            <template v-if="item.isCheckup && item.value !== 0 && item.value !==10000">
              <div v-for="(item1,index1) in item.stateNode" :key="index1" class="flexwrap">
                <div class="flownode" :class="{currentState: item1.length?item1[0].isCurrentState: false}">
                  <div v-for="(item2,index2) in item1" :key="index2" style="padding:5px 5px;">
                    <!--类型：角色-->
                    <div v-if="item2.roleType ===1">
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">
                          <div><b>{{ item2.role.name }}</b></div>
                          <div v-if="item2.option>0">*操作*：{{ formStateOption.find(f=>f.value === item2.option).name }}</div>
                          <div>姓名：{{ item2.person.name }}</div>
                          <div>电话：{{ item2.person.phoneNumber }}</div>
                        </div>
                        <div>{{ item2.option>0 ?"*":'' }} {{ item2.person.name }}
                          <i v-show="item2.isChecked" class="el-icon-success isChecked" />
                        </div>
                      </el-tooltip>
                    </div>
                    <!--类型：审核人-->
                    <div v-if="item2.roleType ===3">
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">
                          <div><b>审核人</b></div>
                          <div v-if="item2.option>0">*操作*：{{ formStateOption.find(f=>f.value === item2.option).name }}</div>
                          <div>姓名：{{ item2.person.name }}</div>
                          <div>电话：{{ item2.person.phoneNumber }}</div>
                        </div>
                        <div>{{ item2.option>0 ?"*":'' }} {{ item2.person.name }}
                          <i v-show="item2.isChecked" class="el-icon-success isChecked" />
                        </div>
                      </el-tooltip>
                    </div>
                    <!--类型：制单人-->
                    <div v-if="item2.roleType ===2">
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">
                          <div><b>制单人</b></div>
                          <div v-if="item2.option>0">*操作*：{{ formStateOption.find(f=>f.value === item2.option).name }}</div>
                          <div>姓名：{{ item2.person.name }}</div>
                          <div>电话：{{ item2.person.phoneNumber }}</div>
                        </div>
                        <div>{{ item2.option>0 ?"*":'' }} {{ item2.person.name }}
                          <i v-show="item2.isChecked" class="el-icon-success isChecked" />
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
                <div v-if="item.stateNode.length!==(index1+1)"><i class="fontSize15 el-icon-right" /></div>
              </div>
            </template>
            <div v-else class="flownode">{{ item.name }}</div>
            <div v-if="item.value===0 || (item.stateNode || []).length>0"><i class="fontSize15 el-icon-right" /></div>
          </div>
        </div>

        <div style="text-align:right;"><el-button v-if="isEdit&&allowEdit" type="primary" size="mini" @click="addChecker()">编辑流程</el-button></div>
        <el-dialog
          :title="dialogTitle"
          :destroy-on-close="true"
          :visible.sync="dialogTableVisible"
          :width="dialogWidth"
          :append-to-body="false"
        >
          <component :is="comName" :bill-flow="billFlowData" @dialogClose="dialogClose" />
        </el-dialog>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
// 查看流程进度
import FlowDisplayAdd from './flowDisplayAdd'
export default {
  name: 'FlowDisplay',
  components: {
    FlowDisplayAdd
  },
  props: {
    billFlow: { type: Object, default: null },
    isEdit: { type: Boolean, default: false } // 是否启用编辑
  },
  data() {
    return {
      stateList: [],
      loading: false,
      activeName: ['1'],
      createUserName: '',
      billFlowData: null,
      dialogTableVisible: false,
      dialogTitle: '编辑流程',
      dialogWidth: '70%',
      comName: 'FlowDisplayAdd',
      formStateOption: []
    }
  },
  computed: {
    // 是否允许编辑
    allowEdit() {
      // 只有制单人 或者 当前审批人才能显示编辑流程的按钮 并且流程状态state>1<10000 审批中
      if (this.billFlow.state < 1 || this.billFlow.state >= 10000) { return false }
      if (this.billFlow.createUserId === this.$store.state.user.uid) { return true }
      const arr = this.billFlow?.billFlowNode?.filter(f => f.isCurrentState && !f.isChecked) || []
      if (arr.find(v => v.personId === this.$store.state.user.uid)) { return true }
      return false
    }
  },
  watch: {
    /**
     * 写这个是为了使得页面没有关闭从新打开另一个单子详情的时候审批组件的内容会刷新
     */
    billFlow() {
      this.fetchData()
    }

  },
  created() {
  },
  mounted() {
    this.billFlowData = JSON.parse(JSON.stringify(this.billFlow))
    this.fetchData()
  },
  methods: {
    /**
     * 这个方法要重写,
     * 因为原来那个不符合现在的页面逻辑,
     * 在已有页面不关闭的情况下,再次进入会在原来基础上增加
     * 所以现在采用每次都新拼接一个再反向覆盖的方式
     */
    fetchData() {
      const { form: { formState }, billFlowNode } = this.utils.easyDeepClone(this.billFlowData)
      this.billFlowData.billFlowNode.forEach(fe => {
        fe.personId = fe.personId || null
      })
      const newList = []
      formState.forEach((e, i) => {
        if (e.isFlowNode) {
          if (e.isCheckup) {
            e.stateNode = this.groupBy(billFlowNode.filter(f => f.state === e.value), item => [item.group])
          }
          newList.push(e)
        }
        if ((e.formStateOption || []).length > 0) {
          // console.log('e.formStateOption:', e.formStateOption)
          e.formStateOption.forEach(e0 => {
            this.formStateOption.push({ ...e0 })
          })
        }
      })
      this.stateList = newList
    },
    groupBy(array, f) {
      const groups = {}
      array.forEach(function(o) {
        const group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      return Object.keys(groups).map(function(group) { return groups[group] })
    },
    addChecker() {
      this.dialogTitle = '编辑流程'
      this.dialogTableVisible = true
    },
    dialogClose(bf) {
      // 刷新流程数据
      this.billFlowData = bf
      this.stateList = []
      this.dialogTableVisible = false
      this.fetchData()
      this.$parent.$refs.flowAttitude.fetchData() // 刷新 审批列表信息
    }
  }
}
</script>
<style lang="scss" scoped>
.flowCard {
    margin-top: 10px;
}
.title {
  padding: 0 32px 12px 32px;
  color: #101010;
  font-size: 16px;
  font-weight: bold;
}
.main{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  justify-content:center;
  margin-top: 10px;
  .flexwrap{
    display:flex;
    align-items:center;
  }
}
.flownode {
  box-sizing:border-box;
  border:1px solid#d3d4d6;
  padding:5px 10px;
  margin: 0 6px;
  border-radius:3px;
  color:#101010;
  $active-color: #1890FF;
  // $active-color: rgb(83, 168, 255);
  .el-icon-success {
    color: $active-color;
  }
  &.currentState{
    background-color: $active-color;
    border-color: $active-color;
    color:white;
  }
}

.fontSize15{
  font-size:15px
}
.isChecked{
color:#0c0c0c !important;
}
</style>
