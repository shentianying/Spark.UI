<template>
  <div>
    <div style="margin-top:10px;">
      <div class="main">
        <div v-for="(item, index) in stateList" :key="index" class="flexwrap">
          <template v-if="item.isCheckup &&item.value !== 0 && item.value !==10000">
            <div v-for="(item1, index1) in item.stateNode" :key="index1" class="flexwrap">
              <div class="flownode" :class="{currentState: item1.length?item1[0].isCurrentState: false}">
                <div v-for="(item2,index2) in item1" :key="index2" style="padding:5px 5px;">

                  <div>
                    <span>{{ item2.person.name }} </span>
                    <i v-show="item2.isChecked" class="el-icon-success" />
                    <!--是新增节点，并且创建人是自己，才能删除-->
                    <el-link v-if="item2.nodeType === 1&&item2.createUserId ===getUid" type="danger" :underline="false" @click="delBillFlowNode(item1,item2)"><i class="el-icon-delete" /></el-link>
                  </div>
                </div>

                <div style="text-align:center;">
                  <el-link :underline="false" @click="addChecker(item1, index, index1)"><i class="el-icon-circle-plus-outline" /></el-link>
                </div>
              </div>
              <div v-if="item.stateNode.length!==(index1+1)">
                <el-tooltip content="增加节点" effect="light" placement="top-start">
                  <el-link :underline="false" @click="addBillFlowNode(item.stateNode,index1)"><i class="el-icon-right" /></el-link>
                </el-tooltip>

              </div>
            </div>
          </template>
          <div v-else class="flownode">{{ item.name }}</div>

          <div v-if="item.value===0 || (item.stateNode || []).length>0">

            <el-tooltip content="增加节点" effect="light" placement="top-start">
              <el-link type="info" :underline="false" @click="addBillFlowNode2(item,index)"><i class="el-icon-right" /></el-link>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div style="text-align:right;"><el-button type="primary" size="mini" :loading="loading" @click="save()">保存</el-button></div>
    <div>
      <select-person ref="personRef" :multiple="false" @getPersons="getPersons" />
    </div>
  </div>
</template>
<script>
import { addBillFlowNodes } from '@/api/xtgl/billFlow'
import { uuid } from '@/utils/index'
import SelectPerson from '@/components/Other/selectPerson'
export default {
  name: 'FlowDisplayAdd1',
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
      createUserName: '',
      billFlowData: null,
      state: null,
      group: null,
      mode: null,
      isCurrentState: false,
      temp: {
        keyId: null, // 添加流程节点，页面上的唯一标识
        billFlowId: 0,
        // checkupDate: null,
        // checkupPersonId: null,
        //   createDate: null,
        createUserId: null,
        //   createUserName: null,
        group: 100,
        id: 0,
        isAutoChecked: false,
        isChecked: false,
        isCurrentState: false,
        isFixedNode: true,
        maxDays: 0,
        mode: 1,
        nodeType: 1, // 1 新增节点
        option: 0,
        orgId: 0, // ?
        person: null,
        personId: null,
        personList: null,
        receiveDate: null,
        remark: null,
        //   role: null,
        roleId: 0,
        roleType: 3,
        state: 1
        //  userList: []
      }
    }
  },
  computed: {
    getUid() {
      return this.$store.state.user.info.uid
    }
  },
  created() {
  },
  mounted() {
    // console.log('flowDisplayAdd mounted:this.billFlow:', this.billFlow)
    this.billFlowData = JSON.parse(JSON.stringify(this.billFlow))
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.createUserName = this.billFlowData.createUserName
      this.billFlowData.billFlowNode.forEach(fe => {
        fe.personId = fe.personId || null
      })
      this.billFlowData.form.formState.forEach((e, i) => {
        if (e.isFlowNode) {
          if (e.isCheckup) {
            e.stateNode = this.groupBy(this.billFlowData.billFlowNode.filter(f => f.state === e.value), function(item) { return [item.group] })
          }
          this.stateList.push(e)
        }
      })
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
    addChecker(item1, index, index1) {
      this.group = item1[0].group
      this.state = item1[0].state
      this.isCurrentState = item1[0].isCurrentState
      this.mode = item1[0].mode

      this.$refs.personRef.openDialog()
    },
    // 添加完成关闭后执行的
    getPersons(personList) {
      const temp = JSON.parse(JSON.stringify(this.temp))
      // 设置group
      temp.keyId = uuid
      temp.createUserId = this.getUid
      temp.group = this.group
      temp.state = this.state
      temp.personId = personList[0].id
      temp.person = personList[0]
      temp.mode = this.mode
      temp.billFlowId = this.billFlow.id
      temp.isCurrentState = this.isCurrentState

      var sameGroup = this.billFlowData.billFlowNode.filter(f => f.state === temp.state && f.group === temp.group)
      if (sameGroup) {
        var haveSameGroupNode = sameGroup.map(m => m.personId).includes(temp.personId)
        if (haveSameGroupNode) {
          this.$message('同一个组中，不能添加相同的审核人')
          return
        }
      }
      this.billFlowData.billFlowNode.push(temp)
      this.billFlowData.billFlowNode.sort(function(a, b) { return a.group - b.group })
      this.stateList = []
      this.fetchData()
    },
    addBillFlowNode(item, index1) {
      // console.log('addBillFlowNode')
      const group1 = item[index1][0].group // 小 例如：group:200
      const group2 = item[index1 + 1][0].group // 大 例如：group:210

      this.group = Math.round((group2 + group1) / 2) // 四舍五入中间值：205
      this.state = item[index1 + 1][0].state
      this.mode = item[index1 + 1][0].mode
      this.isCurrentState = false

      this.$refs.personRef.openDialog()
    },
    addBillFlowNode2(item, index) {
      if (index === 0) {
        this.$alert('此位置不允许添加节点')
        return
      }
      // 获取是审核表单状态的 formState
      const filterFormState = this.stateList.filter(f => f.inUse && f.isCheckup && f.isFlowNode && f.stateNode.length > 0)
      // 当前审批节点
      const currentFormState = this.billFlowData.billFlowNode.filter(f => f.isCurrentState)
      if (!currentFormState) {
        this.$alert('数据异常，流程中没有当前审批节点')
        return
      }

      if (index < filterFormState.length) {
        // 点击2个审核节点之间的箭头
        const formState_A = [...filterFormState[index - 1].stateNode].reverse()[0][0]
        const formState_B = filterFormState[index].stateNode[0][0]
        const smallGroup = formState_A.group // 200
        const largeGroup = formState_B.group // 300
        var calGroup = (largeGroup + smallGroup) / 2 // 250

        if (currentFormState[0] > calGroup) {
          this.$alert('当前审批节点前面不允许添加审批人')
          return
        }
        this.group = Math.round(calGroup)
        this.state = formState_B.state
        this.mode = formState_B.mode
      } else if (index === filterFormState.length) {
        // 点击的是最后一个箭头
        if (item.stateNode.length > 0) {
          const lastFormState = [...filterFormState[index - 1].stateNode].reverse()[0][0]
          this.group = lastFormState.group + 100
          this.state = lastFormState.state
          this.mode = lastFormState.mode
        }
      }

      this.isCurrentState = false
      if (item.stateNode.length > 0) {
        this.$refs.personRef.openDialog()
      }
    },
    save() {
      const bfn = JSON.parse(JSON.stringify(this.billFlowData.billFlowNode))
      // const arr = bfn.filter(f => f.id === 0)
      // if (arr) {
      bfn.forEach(e => {
        delete e.person
        delete e.personList
        delete e.keyId
        e.remark = '编辑时添加'
      })
      this.$confirm('是否确定修改该流程', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        addBillFlowNodes(bfn).then(res => {
          const { data, message } = res
          this.loading = false
          this.$emit('dialogClose', data)
          // this.billFlowData = JSON.parse(JSON.stringify(data))
          // this.fetchData()
          this.$message.success(message)
        }).catch(() => { this.loading = false })
      }).catch(() => {})
      // }
    },
    delBillFlowNode(item1, item2) {
      if (item2.isChecked) {
        this.$message('审批过的不能删除哦！')
        return
      }
      if (item2.nodeType === 0) {
        this.$message('只有手动创建的才能删除')
        return
      }
      if (item2.createUserId !== this.getUid) {
        this.$message('不是创建人，无法删除哦')
        return
      }
      let flag = false
      if (item2.isCurrentState) {
        const noCheckedCount = item1.filter(f => f.isCurrentState && !f.isChecked)
        if (noCheckedCount.length === 1) {
          if (noCheckedCount[0].personId === item2.personId) {
            flag = true
          }
        }
      }
      if (flag) {
        // 审批节点最后一个审批人不能被删除，删除就数据错误，不能审批了。
        this.$message('审批节点最后一个审批人不能被删除')
        return
      }

      if (item2.id > 0) { // 从数据库获取的数据
        const findIndex = this.billFlowData.billFlowNode.findIndex(f => f.id === item2.id)
        this.billFlowData.billFlowNode.splice(findIndex, 1)
      } else {
        this.billFlowData.billFlowNode.splice(this.billFlowData.billFlowNode.findIndex(f => f.keyId === item2.keyId), 1)
      }

      this.billFlowData.billFlowNode.sort(function(a, b) { return a.group - b.group })
      this.stateList = []
      this.fetchData()
      // console.log('删除后的对象stateList：', this.stateList)
    }
  }
}
</script>
<style scoped>
.flowCard {
    margin-top: 10px;
}
.main{
    display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
    margin-top: 10px; ;
}
.flexwrap{
    display:flex;align-items:center;
}
.flownode {
  box-sizing:border-box;
  border:1px solid#d3d4d6;
  padding:5px 10px;
  text-align: left;
  border-radius:3px;
  color:#909399;
  flex-direction:colum;
}
.currentState{
    /* background-color: #f56c6c; */
    border-color: #f56c6c;
    /* color: #fff; */
  color:#909399;
}

.flownodemode2 {
  border-style: dashed;
}

.fontSize15{
    font-size:15px
}
</style>
