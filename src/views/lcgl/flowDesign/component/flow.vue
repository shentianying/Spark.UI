<template>
  <!-- 显示流程 -->
  <div class="main">
    <div v-for="(item,index) in stateList" :key="index" class="flexwrap">
      <!-- <div> -->
      <template v-if="item.isCheckup && item.stateNode.length">
        <div v-for="(item1,index1) in item.stateNode" :key="index1" class="flexwrap">
          <div class="flownode" :class="{'flownodemode2':item1[0].mode===2}">
            <div v-for="(item2,index2) in item1" :key="index2">
              <i :class="item2.roleType ===1?'el-icon-s-custom':'el-icon-s-flag'" />
              {{ item2.roleId ===0 ? dropDownData.roleTypeList.find(f => f.value === item2.roleType).name : dropDownData.roleList.find(f => f.id === item2.roleId).name }}
              <el-tooltip :content="findformFlowOptionList(item2.option)" effect="light"><i v-if="item2.option" class="el-icon-info" style="color:red" /></el-tooltip>
              <!-- <span v-if="item2.maxDays" style="color:red">「{{ item2.maxDays }}」</span> -->
              <el-tooltip :content="'最长审批时间'+item2.maxDays+'天'" effect="light"><el-tag v-if="item2.maxDays" type="danger" size="mini">{{ item2.maxDays }}</el-tag></el-tooltip>
            </div>
          </div>
          <div v-if="item.stateNode.length!==(index1+1)"><i class="fontSize15 el-icon-right" /></div>
        </div>
      </template>
      <div v-else class="flownode" :class="item.isCheckup?'none':'state'">{{ item.name }}</div>
      <!-- </div> -->
      <div v-if="stateList.length!==(index+1)"><i class="fontSize15 el-icon-right" /></div>
    </div>
    <!-- <div v-for="(item1,index1) in flow" :key="index1" class="flexwrap">
      <div class="flownode" :class="{'flownodemode2':item1[0].mode===2}">
        <div v-for="(item2,index2) in item1" :key="index2">
          <i :class="item2.roleType ===1?'el-icon-s-custom':'el-icon-s-flag'" />
          {{ item2.roleId ===0 ? dropDownData.roleTypeList.find(f => f.value === item2.roleType).name : dropDownData.roleList.find(f => f.id === item2.roleId).name }}
          <span v-if="item2.option"><el-tooltip :content="findformFlowOptionList(item2.option)" effect="light"><i class="el-icon-info" style="color:red" /></el-tooltip></span>
        </div>
      </div>
      <div><i class="fontSize20 el-icon-right" /></div>
    </div> -->

    <!-- <div class="flexwrap">
      <div class="flownode end">
        <div>结束</div>
      </div>
    </div> -->
  </div>
</template>
<script>

export default {
  name: 'Flow',
  components: {
  },
  // model: {
  //   prop: 'selectValue', // 指向props的参数名
  //   event: 'change'// 事件名称
  // },
  props: {
    flowNodeList: { type: Array, default: null },
    dropDownData: { type: Object, default: null }
  },
  data() {
    return {
      stateList: []
    }
  },
  created() {
  },
  mounted() {
    this.dropDownData.formStateList.sort((a, b) => a.value - b.value).forEach((e, i) => {
      if (e.isFlowNode) {
        var tmp = { ...e }
        if (tmp.isCheckup) {
          tmp.stateNode = this.groupBy(this.flowNodeList.filter(f => f.state === e.value), function(item) { return [item.group] })
        }
        this.stateList.push(tmp)
      }
    })
  },
  methods: {
    fetchData() {
    },
    findformFlowOptionList(option) {
      var r = ''
      var o = this.dropDownData.options.find(f => f.value === option)
      if (o) { r = o.name }
      return r
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
    display:flex;flex-wrap:wrap;align-items:center ;
}
.flexwrap{
    display:flex;align-items:center;margin: 2px 0;
}
.flownode {
  box-sizing:border-box;border:1px solid green;padding:2px 10px;text-align: left;border-radius:3px;
}
.flownode.state {
  border-color: red;
}
.flownode.none {
  border-color: darkgray;
  border-style: dashed;
  color:darkgray;
}
.flownodemode2 {
  border-style: dashed;
}

.fontSize15{
    font-size:15px
}
</style>
