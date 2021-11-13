<template>
  <div>
    <el-card class="flowCard">
      <div slot="header">
        流程信息
      </div>
      <!--IsChecked 是否审批 IsCurrentState 单前审批-->
      <div class="main">
        <div v-for="(item,index) in stateList" :key="index" class="flexwrap">
          <template v-if="item.isCheckup &&item.value !== 0 && item.value !==10000">
            <div v-for="(item1,index1) in item.stateNode" :key="index1" class="flexwrap">
              <div v-if="item.stateNode.length" class="flownode">
                <div v-for="(item2,index2) in item1" :key="index2" style="flex-direction:colum;padding:5px 5px;">
                  <!--类型：角色-->
                  <div v-if="(item2.personList || []).length >1&&item2.roleType ===1">
                    <span>{{ item2.role.name }}：</span>
                    <el-select v-model="item2.personId" style="width:100px;" size="mini">
                      <el-option v-for="(personItem,personIndex) in item2.personList" :key="personIndex" :label="personItem.name" :value="personItem.id" />
                    </el-select>
                  </div>
                  <!--无匹配角色-->
                  <div v-if="(item2.personList || []).length ===0&&item2.roleType ===1"> {{ item2.role.name }}：【空】</div>
                  <span v-if="(item2.personList || []).length===1&& item2.roleType ===1">{{ item2.role.name }}：{{ item2.personList[0].name }}</span>
                  <!--类型：审核人-->
                  <div v-if="item2.roleType ===3">
                    <span>审核人：</span>
                    <el-select
                      v-model="item2.personId"
                      size="mini"
                      placeholder="请选择"
                      :loading="loading"
                      style="width:120px;"
                      @click.native="selectPerson(item2)"
                    >
                      <el-option
                        v-for="(item4,index4) in item2.personList"
                        :key="index4"
                        :label="item4.name"
                        :value="item4.id"
                      >
                        <span>{{ item4.name }}</span>
                        <!-- <span>{{ getOrgList.find(f=>f.id===item4.organizationId).name }}-{{ item4.name }}</span> -->
                      </el-option>
                    </el-select>
                    <!--新增节点显示-->
                    <el-link v-if="item2.nodeType === 1" type="danger" :underline="false" @click="addFlowNode(item1)"><i class="el-icon-plus" /></el-link>
                    <el-link v-if="item2.nodeType === 1" type="danger" :underline="false" @click="delFlowNode(item.stateNode,index1,item1,index2)"><i class="el-icon-delete" /></el-link>
                  </div>
                  <!--类型：制单人-->
                  <span v-if="item2.roleType ===2">制单人：{{ item2.personList[0].name }}</span>
                </div>
              </div>
              <div v-if="item.stateNode.length!==(index1+1)">
                <el-tooltip content="增加节点" effect="light" placement="top-start">
                  <el-link type="info" :underline="false" @click="addNode2(item.stateNode,index1+1)"><i class="el-icon-right" /></el-link>
                </el-tooltip>
              </div>
            </div>
          </template>

          <div v-else class="flownode">{{ item.name }}</div>
          <div v-if="stateList.length!==(index+1)">
            <el-tooltip content="增加节点" effect="light" placement="top-start">
              <el-link type="info" :underline="false" @click="addNode(item,index)"><i class="el-icon-right" /></el-link>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-card>
    <!--选择用户-->
    <div>
      <select-person ref="personRef" :multiple="false" @getPersons="getPersons" />
    </div>
  </div>
</template>
<script>
// 制单选择流程
import { getPersonList } from '@/api/rsgl/person'
import SelectPerson from '@/components/Other/selectPerson'
export default {
  name: 'FlowSelect',
  components: {
    SelectPerson
  },
  props: {
    billFlow: { type: Object, default: null }
  },
  data() {
    return {
      stateList: [],
      loading: false,
      orgList: null,
      billFlowData: null,
      // tempItem1: [], // 添加人员, 选中的临时对象
      tempItem2: [], // 添加人员，当前对象
      temp: [ // 添加节点的模板
        {
          billFlowId: 0,
          checkupDate: null,
          checkupPersonId: null,
          //   createDate: null,
          //   createUserId: null,
          //   createUserName: null,
          group: 100,
          id: 0,
          grade: 0, // 普通等级
          isAutoChecked: false,
          isChecked: false,
          isCurrentState: false,
          isFixedNode: true,
          maxDays: 0,
          mode: 1,
          nodeType: 1, // 1 新增节点
          option: 0,
          orgId: 0, // ?
          // person: null,
          personId: null,
          personList: null,
          receiveDate: null,
          remark: null,
          //   role: null,
          roleId: 0,
          roleType: 3,
          state: 1
        //  userList: []
        }]
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
    }
  },
  watch: {
    billFlow() {
      this.fetchData()
    }
  },
  created() {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    checkBillFlow() {
      let isSuccess = true
      this.stateList.forEach(e => {
        if (e.isCheckup && e.isFlowNode && e.stateNode.length) {
          e.stateNode.forEach(e1 => {
            e1.forEach(g => {
              if (!g.personId) {
                isSuccess = false
              }
            })
          })
        }
      })
      return isSuccess
    },
    getBillFlow() {
      // 1.验证 流程 中 是否选择
      // 2.stateList 数据转换城 list 并 返回
      const billFlow = {}
      const billFlowNodes = []
      this.stateList.forEach(e => {
        if (e.isCheckup && e.isFlowNode && e.stateNode.length) {
          e.stateNode.forEach(e1 => {
            e1.forEach(g => {
              billFlowNodes.push({
                id: g.id,
                billFlowId: this.billFlow.id,
                group: g.group,
                grade: g.grade,
                mode: g.mode,
                roleType: g.roleType,
                roleId: g.roleId,
                state: g.state,
                option: g.option,
                maxDays: g.maxDays,
                orgId: g.orgId,
                personId: g.personId || 0,
                receiveDate: g.receiveDate,
                isCurrentState: g.isCurrentState,
                isChecked: g.isChecked,
                isAutoChecked: g.isAutoChecked,
                checkupPersonId: g.checkupPersonId,
                checkupDate: g.checkupDate,
                remark: g.remark,
                nodeType: g.nodeType
              })
              // if (!g.personId) {
              //   isError = true
              // }
            })
          })
        }
      })

      // if (isError) {
      //   this.$alert('请选择流程中的下拉选项')
      //   return false
      // } else {
      billFlow.flowId = this.billFlow.flowId
      billFlow.formId = this.billFlow.formId
      billFlow.billId = this.billFlow.billId
      billFlow.billNumber = this.billFlow.billNumber
      billFlow.summary = this.billFlow.summary
      billFlow.amount = this.billFlow.amount
      billFlow.state = this.billFlow.state
      billFlow.id = this.billFlow.id
      billFlow.companyId = this.billFlow.companyId
      billFlow.billFlowNode = billFlowNodes
      return billFlow
      // }
    },
    /**
     * 把格式化函数放在这里,在初始化还有流程对象改变时都需要调用一次,以刷新内容
     */
    fetchData() {
      // 虽然不是很清楚这个this.billFlowData是干什么用的,不过我看原来写着,就也写了一遍,但它好像没有用处....
      const { form: { formState }, billFlowNode } = this.billFlowData = this.utils.easyDeepClone(this.billFlow)
      const newList = []
      formState.sort((a, b) => a.value - b.value)
      billFlowNode.forEach(fe => {
        fe.personId = fe.personId || null
      })
      formState.forEach((e, i) => {
        if (e.isFlowNode) {
          if (e.isCheckup) {
            const gs = this.groupBy(billFlowNode.filter(f => f.state === e.value), item => [item.group])
            e.stateNode = gs
          }
          // 问题出在这里,这里需要解构一下才行,目的是把被绑定的get和set都去掉
          newList.push({ ...e })
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
    getRemotePerson(query, item2) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          getPersonList({ name: query }).then(response => {
            item2.personList = response.data
            this.loading = false
          })
        }, 200)
      } else {
        item2.personList = []
      }
    },
    addNode(item, index) {
      // console.log('item:', item, 'index:', index)
      // console.log('addNode:', index)
      // 获取是审核表单状态的 formState
      const filterFormState = this.stateList.filter(f => f.inUse && f.isCheckup && f.isFlowNode)
      const temp = JSON.parse(JSON.stringify(this.temp))
      // 第一个箭头节点,审核节点的左边
      let newGroup = 100
      if (index === 0) {
        // 找出第一个元素的group的值
        if (this.stateList[1].stateNode.length > 0) {
          newGroup = this.stateList[1].stateNode[0][0].group - 10
        }
        temp[0].group = newGroup
        // console.log('第一个箭头节点,审核节点的左边newGroup:', newGroup)
        this.stateList[1].stateNode.splice(0, 0, temp)
      } else if (index < filterFormState.length) {
        // 点击2个审核节点之间的箭头
        const preGroups0 = filterFormState[index - 1].stateNode // 获取前一个状态节点对象
        const smallGroup = preGroups0[preGroups0.length - 1][0].group // 前一个状态节点的 最后一个 group的值
        const largeGroup = filterFormState[index].stateNode[0][0].group // 当前节点 第一个group 的值
        var calGroup = (largeGroup + smallGroup) / 2
        temp[0].group = calGroup
        // console.log('点击2个审核节点之间的箭头calGroup:', calGroup)
        // this.stateList[index].stateNode.push(temp)
        item.stateNode.push(temp)
        // console.log('添加后的节点对象：', item.stateNode)
      } else if (index === filterFormState.length) {
        // 点击的是最后一个箭头
        if (item.stateNode.length > 0) {
          const preGroups1 = filterFormState[index - 1].stateNode // 获取前一个状态节点对象
          newGroup = preGroups1[preGroups1.length - 1][0].group + 10
        }
        temp[0].group = newGroup
        // console.log('点击的是最后一个箭头calGroup:', newGroup)
        item.stateNode.push(temp)
      }
    },
    addFlowNode(item1) {
      item1.push({
        id: 0,
        billFlowId: 0,
        checkupDate: null,
        checkupPersonId: null,
        //   createDate: null,
        //   createUserId: null,
        //   createUserName: null,
        group: item1[0].group,
        grade: 0, // 普通等级
        isAutoChecked: false,
        isChecked: false,
        isCurrentState: false,
        isFixedNode: true,
        maxDays: 0,
        mode: 1,
        nodeType: 1, // 1 新增节点
        option: 0,
        orgId: 0, // ?
        // person: null,
        personId: null,
        personList: null,
        receiveDate: null,
        remark: null,
        //   role: null,
        roleId: 0,
        roleType: 3,
        state: 1
        //  userList: []
      })
    },
    delFlowNode(stateNode, index1, item1, index2) {
      if (item1.length > 1) {
        item1.splice(index2, 1)
      } else {
        stateNode.splice(index1, 1)
      }
    },
    addNode2(item, index1) {
      // 点击中间箭头的添加节点操作
      this.$message('addNode2')
      const group1 = item[index1 - 1][0].group // 小 例如：group:200
      const group2 = item[index1][0].group // 大 例如：group:210
      const temp = JSON.parse(JSON.stringify(this.temp))
      // 设置group
      temp[0].group = group1 + (group2 - group1) / 2 // 中间值：205
      // console.log('addNode2.group点击中间箭头的添加节点操作:', temp[0].group)
      item.splice(index1, 0, temp)
    },
    getPersons(personList) {
      if ((personList || []).length > 0) {
        this.tempItem2.personList = personList.map(m => { return { id: m.id, name: m.name } })
        this.$nextTick(() => {
          this.tempItem2.personId = personList[0].id
        })
      }
    },
    selectPerson(item2) {
      this.tempItem2 = item2
      this.$refs.personRef.openDialog()
    }
  }
}
</script>
<style scoped>
.flowCard {
    margin-top: 10px;
}
.main{
    display:flex;flex-wrap:wrap;align-items:center;justify-content:center;font-size: 14px;
}
.flexwrap{
    display:flex;align-items:center;
}
.flownode {
  box-sizing:border-box;
  border:1px solid #e9e9eb;
  padding:5px 10px;
  text-align: left;
  border-radius:3px;
  background-color: #f4f4f5;
  color: #909399;
}
.flownodemode2 {
  border-style: dashed;
}

.fontSize15{
    font-size:15px
}
</style>
