<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class=""
    size="mini"
  >
    <el-form-item label="选择或输入字段" prop="field">
      <el-select v-model="ruleForm.field" clearable filterable allow-create @change="selectFieldChange">
        <el-option v-for=" (pItem,pIndex) in property" :key="pIndex" :label="pItem.item1+' '+pItem.item2" :value="pItem.item2" />
        <!-- <el-option label="目标成本" value="CGGL.TargetCost" /> -->
      </el-select>
    </el-form-item>
    <el-form-item label="表字段中文名" prop="fieldName">
      <el-input v-model="ruleForm.fieldName" size="mini" maxlength="50" />
    </el-form-item>
    <!-- <el-form-item label="表字段名" prop="field">
      <el-input v-model="ruleForm.field" size="mini" maxlength="50" />
    </el-form-item> -->
    <el-form-item label="表字段类型" prop="fieldType">
      <el-select v-model="ruleForm.fieldType" @change="changeFieldType">
        <el-option v-for="(item1,index1) in fieldTypeList" :key="index1" :label="item1.type" :value="item1.type" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="showDicType" label="字典类型" prop="dicType">
      <el-select v-model="ruleForm.dicType" clearable filterable>
        <el-option v-for="(item,index) in typeList" :key="index" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否使用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>

    <el-form-item style=" text-align:right;">
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getDictionaryGroupType } from '@/api/xtgl/dictionary'
import { getFieldTypeList } from '@/api/xtgl/flow'
export default {
  name: 'AddFlowField',
  props: {
    obj: {
      type: Object,
      default: null
    },
    property: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        formId: 0,
        field: '',
        fieldName: '',
        fieldType: '',
        dicType: '',
        inUse: true
      },
      buttonLoading: false,
      selectField: null,
      typeList: null,
      fieldTypeList: null,
      showDicType: false,
      rules: {
        field: [{ required: true, message: '请输入', trigger: 'blur' }],
        fieldName: [{ required: true, message: '请输入', trigger: 'blur' }],
        fieldType: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          if (this.obj) {
            this.$emit('dialogCloseFormFlowField', newObj, 'update')
          } else {
            this.$emit('dialogCloseFormFlowField', newObj, 'add')
          }
        }
      })
    },
    initData() {
      getDictionaryGroupType().then((result) => {
        this.typeList = result.data
      }).catch(() => { })

      getFieldTypeList().then(response => {
        this.fieldTypeList = response.data
      })
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm = newObj
        this.changeFieldType(this.ruleForm.fieldType)
      }
    },
    changeFieldType(value) {
      // 字段类型为dictionary，就显示 字典类型项
      if (value === 'dictionary') { this.showDicType = true } else this.showDicType = false
    },
    selectFieldChange(value) {
      if (value) {
        const obj = this.property.find(f => f.item2 === value)
        this.ruleForm.fieldName = obj.item1 || ''
        this.ruleForm.field = obj.item2
        if (this.fieldTypeList.find(f => f.type === obj.item3)) {
          this.ruleForm.fieldType = obj.item3
        }
      }
    }
  }
}
</script>
