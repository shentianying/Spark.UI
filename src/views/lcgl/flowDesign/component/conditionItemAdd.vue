<template>
  <div>
    <el-card v-for="(item,index) in cdata" :key="index" class="box-card" style="margin-bottom:10px;">
      <div slot="header">
        <el-select v-model="item.header.operator" size="mini" style="width:100px;" placeholder="请选择">
          <el-option label="或者" value="||" />
          <el-option label="并且" value="&&" />
        </el-select>
        <el-button size="mini" style="float: right;" type="primary" @click="addGroup(item)">添加分组</el-button>
        <el-button v-if="item.header.pCode!=0" size="mini" style="float: right;margin-right:10px;" type="danger" @click="delGroup(cdata,index)">删除分组</el-button>
        <el-button size="mini" style="float: right;margin-right:10px;" type="primary" @click="addItem(item.item)"><i class="el-icon-plus" /></el-button>
      </div>
      <div>
        <!--选择字段-->
        <div v-for="(item2,index2) in item.item" :key="index2" style="margin-top:10px;">
          <table>
            <tr>
              <td>
                <el-select v-model="item2.formFlowFieldId" size="mini" placeholder="请选择" @change="((value)=>{loadOperator(value, item2)})">
                  <el-option v-for="(item3,index3) in dropDownData.formfieldList" :key="index3" :label="item3.fieldName" :value="item3.id" />
                </el-select>
              </td>
              <td>
                <!--选择逻辑符号-->
                <el-select v-model="item2.operator" size="mini" style="width:120px;" placeholder="请选择">
                  <el-option v-for="(item4,index4) in item2.operatorList" :key="index4" :label="item4.key" :value="item4.value" />
                </el-select>
              </td>
              <td>
                <!--动态的控件-->
                <el-input v-if="item2.formFlowField.fieldType === 'string' || item2.formFlowField.fieldType===''" v-model="item2.value" size="mini" style="width:250px;" placeholder="请输入字符串" />
                <el-input v-if="item2.formFlowField.fieldType === 'int'" v-model="item2.value" size="mini" style="width:250px;" placeholder="请输入数字" />
                <el-date-picker
                  v-if="item2.formFlowField.fieldType === 'datetime'"
                  v-model="item2.value"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择"
                  style="width:250px;"
                />
                <el-select v-if="item2.formFlowField.fieldType === 'bool'" v-model="item2.value" size="mini" style="width:250px;" placeholder="请选择">
                  <el-option label="是" value="true" />
                  <el-option label="否" value="false" />
                </el-select>

                <org-select2
                  v-if="item2.formFlowField.fieldType === 'dictionary' && item2.isload"
                  v-model="item2.value"
                  :data-mode="0"
                  size="mini"
                  :collapse-tags="false"
                  :show-all-levels="false"
                  :multiple="true"
                  :check-strictly="true"
                  :options="item2.dicList"
                  :select-data="item2.value"
                  select-style="width:250px;"
                />
                <!-- value:{{ item2.value }} -->
                <org-select2
                  v-if="item2.formFlowField.fieldType === 'organization' && item2.isload"
                  v-model="item2.value"
                  :data-mode="0"
                  size="mini"
                  :collapse-tags="false"
                  :show-all-levels="false"
                  :multiple="true"
                  :check-strictly="true"
                  :options="item2.dicList"
                  :select-data="item2.value"
                  select-style="width:250px;"
                />
              </td>
              <td>
                <el-button size="mini" type="danger" @click="delItem(item.item, index2)">-</el-button>
              </td>
            </tr>
          </table>

        </div>
        <div v-if="item.children.length" style="margin-top:10px;">
          <ConditionItemAdd :cdata="item.children" :drop-down-data="dropDownData" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// import OrgSelect from '@/components/OrgSelect/index'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ConditionItemAdd',
  components: {
    // OrgSelect,
    OrgSelect2
  },
  props: {
    cdata: { type: Array, default: null },
    dropDownData: { type: Object, default: null }
  },
  data() {
    return {
      buttonLoading: false,
      modelValue: null,
      data: [],
      rules: {
      }
    }
  },
  mounted() {
  },
  methods: {
    loadOperator(value, item) {
      item.isload = false
      // 查找类型 'int'||'string || dictionary' ...
      var formfield = this.dropDownData.formfieldList.find(f => f.id === value)
      // 根据类型 找到 运算符号 下拉列表
      item.operatorList = this.dropDownData.fieldTypeList.find(f => f.type === formfield.fieldType).operator
      item.formFlowField = formfield
      item.operator = null
      item.value = null
      item.dicList = null
      if (formfield.fieldType === 'dictionary') {
        const dicList = this.dropDownData.dictionary.filter(f => f.type === formfield.dicType)
        dicList.forEach(e => {
          e.label = e.name
          e.pid = e.pId
          e.id = e.value
        })
        item.dicList = dicList
      }
      if (formfield.fieldType === 'organization') {
        const dicList = this.dropDownData.organization
        item.dicList = dicList
      }
      this.$nextTick(() => {
        item.isload = true
      })
    },
    addGroup(item) {
      item.children.push(
        {
          header: { flowId: 0,
            code: item.header.code + 1,
            pCode: item.header.code,
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
              code: item.header.code + 2,
              pCode: item.header.code + 1,
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
      )
    },
    delGroup(cdata, index) {
      cdata.splice(index, 1)
    },
    addItem(items) {
      items.push(
        { flowId: 0,
          // code: item.code + 1,
          // pCode: item.code,
          code: 0,
          pCode: 0,
          formFlowFieldId: null,
          formFlowField: { field: '', fieldName: '', fieldType: '', dicType: '' },
          operator: '',
          operatorList: null,
          isload: true,
          value: '',
          isLeaf: true })
    },
    delItem(items, index) {
      items.splice(index, 1)
    }

  }
}
</script>

<style scoped>
</style>
