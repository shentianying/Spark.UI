<template>
  <div>
    <div style="margin:10px;">

      <div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="8">
            从流程中选择条件
          </el-col>
          <el-col :span="16">
            <el-select v-model="copeFlowId" size="mini" style="width:250px;" placeholder="选择条件" @change="changeFlow">
              <el-option v-for="(item,index) in flowList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
        </el-row>

      </div>

    </div>
    <ConditionItemAdd :cdata="list" :drop-down-data="dropDownData" />
    <el-button v-has="'FLOWCONDITION_ADD'" type="primary" :loading="buttonLoading" size="mini" @click="Save()">保存</el-button>
  </div>
</template>

<script>
import { addFlowCondition, getFlowCondition } from '@/api/xtgl/flow'
import ConditionItemAdd from './component/conditionItemAdd'
// import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ConditionAdd',
  components: {
    ConditionItemAdd
    // OrgSelect2
  },
  props: {
    dropDownData: { type: Object, default: null },
    obj: { type: Object, default: null }
  },
  data() {
    return {
      list: [
        {
          header: { flowId: 0,
            code: 1,
            pCode: 0,
            formFlowFieldId: 0,
            formFlowField: { field: '', fieldName: '', fieldType: '', dicType: '' },
            operator: '&&',
            operatorList: null,
            dicList: null,
            isload: true,
            value: '',
            isLeaf: false },
          item: [
            { flowId: 0,
              code: 2,
              pCode: 1,
              formFlowFieldId: null,
              formFlowField: { field: '', fieldName: '', fieldType: '', dicType: '' },
              operator: '',
              operatorList: null,
              dicList: null,
              isload: true,
              value: '',
              isLeaf: true }
          ],
          children: []
        }
      ],
      buttonLoading: false,
      code: 0,
      dropDownData1: null,
      conditionStr: '',
      orgIds: 8,
      copeFlowId: null,
      flowList: [],
      operArr: { '&&': '并且', '||': '或者' }
    }
  },
  created() {
  },
  mounted() {
    this.dropDownData1 = JSON.parse(JSON.stringify(this.dropDownData))
    // console.log('conditionAdd:', this.dropDownData.dictionary)
    this.flowList = this.dropDownData1.flowList.filter(f => f.id !== this.obj.id)
    this.getFlowConditionList(this.obj.id)
  },
  methods: {
    Save() {
      // console.log('获取流程条件json:', this.list)
      var list0 = JSON.parse(JSON.stringify(this.list))
      this.conditionStr = this.getStrCondition(list0, '')
      var newList = this.toList(list0, 0) // 树形转换成list

      for (const item of newList) {
        if (item.operator === '') {
          this.$message('条件符号不能为空')
          return
        }
        if (item.isLeaf) {
          if (item.formFlowFieldId === 0 || item.formFlowFieldId === null) {
            this.$message('条件字段不能为空')
            return
          }
          if (item.value === '') {
            this.$message('条件值不能为空')
            return
          }
        }
      }
      this.buttonLoading = true
      addFlowCondition({ id: this.obj.id, conditionDescription: this.conditionStr, flowCondition: newList }).then(response => {
        this.$message(response.message)
        this.buttonLoading = false
        this.$emit('dialogClose')
      }).catch(() => { this.buttonLoading = false })
    },
    getFlowConditionList(id) {
      // 初始化
      getFlowCondition({ flowId: id }).then(response => {
        const { data } = response
        if (data.length > 0) {
          data.forEach(e => {
            e.operatorList = null
            e.formFlowField = null
            e.isload = true
            if (e.isLeaf) {
              e.formFlowField = this.dropDownData1.formfieldList.find(f => f.id === e.formFlowFieldId)
              e.operatorList = this.dropDownData1.fieldTypeList.find(f => f.type === e.formFlowField.fieldType).operator
              if (e.formFlowField.fieldType === 'dictionary') {
                e.dicList = this.dropDownData1.dictionary.filter(f => f.type === e.formFlowField.dicType)
                e.dicList.forEach(e => {
                // e.label = e.name
                  e.pid = e.pId
                  e.id = e.value
                })
                e.value = e.value.split(',').map(item => { return +item })
              }
              if (e.formFlowField.fieldType === 'organization') {
                e.dicList = this.dropDownData1.organization
                e.value = e.value.split(',').map(item => { return +item })
              }
            }
          })
          this.list = this.getTree(0, data)
        }
      })
    },
    getTree(pCode, data) {
      var itemArr = []
      for (var i = 0; i < data.length; i++) {
        var node = data[i]
        if (node.pCode === pCode && node.isLeaf === false) {
          var c = this.getTree(node.code, data)
          var newNode = {
            header: node,
            item: data.filter(f => f.pCode === node.code && f.isLeaf),
            children: c
          }
          itemArr.push(newNode)
        }
      }
      return itemArr
    },
    toList(arr, index) {
      var list = []
      for (const a of arr) {
        var header = a.header
        header.flowId = this.obj.id
        var item = a.item
        index = index + 1
        header.code = index

        if (header.isLeaf === false) { this.code = index }
        header.formFlowFieldId = header.formFlowFieldId || 0
        delete header.operatorList
        delete header.formFlowField
        delete header.dicList
        delete header.isload
        delete header.id
        // 子节点循环
        item.forEach((e, i) => {
          e.pCode = this.code
          index = index + 1
          e.code = index
          e.flowId = this.obj.id

          e.formFlowFieldId = e.formFlowFieldId || 0
          if (e.formFlowField.fieldType === 'dictionary' || e.formFlowField.fieldType === 'organization') {
            // 类型是字典或者组织机构就把数组转成字符串
            if (Array.isArray(e.value)) { e.value = e.value.join(',') } // 如果value 是数组，转成字符串
          }
          delete e.operatorList
          delete e.formFlowField
          delete e.dicList
          delete e.isload
          delete e.id
          index = e.code
        })
        list = [...list, header, ...item] // 合并
        if (a.children.length > 0) {
          list = [...list, ...this.toList(a.children, index)]
        }
      }
      return list
    },
    // 拼接查询条件描述
    getStrCondition(arr, operator) {
      var strCondition = ''
      var i = 0
      for (const a of arr) {
        if (i > 0) {
          strCondition += ' ' + this.operArr[operator] + ' '
        }
        i++
        var tmpStr = ''
        var j = 0
        a.item.forEach((e, _) => {
          if (j > 0) {
            tmpStr += ' ' + this.operArr[a.header.operator] + ' '
          }
          var value = e.value
          if (e.formFlowField.fieldType === 'dictionary') {
            value = this.dropDownData1.dictionary.filter(f => f.type === e.formFlowField.dicType && e.value.indexOf(f.value) >= 0).map(m => m.name).join('，')
            value = '（' + value + '）'
          }
          if (e.formFlowField.fieldType === 'organization') {
            value = this.dropDownData1.organization.filter(f => e.value.includes(f.id)).map(m => m.name).join('，')
            value = '（' + value + '）'
          }
          tmpStr += e.formFlowField.fieldName + ' ' + e.operator + ' ' + value
          j++
        })
        if (a.children.length > 0) {
          if (j > 0) {
            tmpStr += ' ' + this.operArr[a.header.operator] + ' '
          }
          tmpStr += this.getStrCondition(a.children, a.header.operator)
        }
        if (operator !== '' && a.item.length + a.children.length > 1) {
          tmpStr = '（' + tmpStr + '）'
        }
        strCondition += tmpStr
      }
      return strCondition
    },
    changeFlow(value) {
      // console.log('value:', value)
      this.copeFlowId = value
      this.getFlowConditionList(value)
    }
  }
}
</script>

<style scoped>
</style>
