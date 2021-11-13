<template>
  <div>
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
      size="mini"
    >
      <el-form-item label="表单名称" prop="name">
        <el-input v-model="ruleForm.name" size="mini" maxlength="50" style="width:200px" />
      </el-form-item>
      <el-form-item label="表单值" prop="value">
        <el-input v-model="ruleForm.value" size="mini" placeholder="cgglPlan" maxlength="50" style="width:200px" />
        <el-button type="primary" :loading="buttonLoading" @click="loadTableField">加载表单字段数据</el-button>
      </el-form-item>
      <el-form-item label="是否需要审批" prop="needCheckup">
        <el-switch
          v-model="ruleForm.needCheckup"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="是否使用" prop="inUse">
        <el-switch
          v-model="ruleForm.inUse"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="跳转关联页面" prop="pageId">
        <org-select2
          v-if="treeList"
          v-model="ruleForm.pageId"
          size="mini"
          :collapse-tags="false"
          :show-all-levels="true"
          :multiple="false"
          :filterable="true"
          :check-strictly="false"
          :options="treeList"
          props-label="routerTitle"
          :select-data="ruleForm.pageId"
          select-style="width:100%;"
        />
      </el-form-item>
      <!--表单字段-->
      <el-form-item label="表单字段">
        <div style="text-align:right;margin-bottom:5px;">
          <el-button size="mini" @click="addFormFlowField()">+添加</el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :data="ruleForm.formFlowField"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column align="center" label="表字段" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.field }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="表字段名称" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.fieldName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="表字段类型" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.fieldType }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="字典类型" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.dicType }}
            </template>
          </el-table-column>
          <el-table-column label="是否使用" align="center" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.inUse"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="editFormFlowField(scope)" />
                <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="delFormFlowField(scope)" />
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!--表单状态-->
      <el-form-item label="表单状态">
        <div style="text-align:right;margin-bottom:5px;">
          <el-button size="mini" @click="addFormState()">+添加</el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :data="ruleForm.formState"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column align="center" label="状态名称" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="值" min-width="10">
            <template slot-scope="scope">
              {{ scope.row.value }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="可选操作" min-width="10">
            <template slot-scope="scope">
              <el-tag
                v-for="(item1, index1) in scope.row.formStateOption"
                :key="index1"
                closable
                @click="editFormStateOption(scope.$index,item1,index1)"
                @close="delFormStateOption(scope.row.formStateOption,index1)"
              >{{ item1.name }}</el-tag>
              <el-button v-if="scope.row.isCheckup" class="button-new-tag" size="small" @click="addFormStateOption(scope.$index)">+</el-button>
            </template>
          </el-table-column>

          <el-table-column label="是否审核" align="center" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isCheckup"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="显示在流程" align="center" width="90">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isFlowNode"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="是否使用" align="center" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.inUse"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" plain size="small" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="editFormState(scope)" />
                <el-button type="primary" plain size="small" icon="el-icon-delete" style="padding:6px;" title="删除" @click="delFormState(scope)" />
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item style="text-align:right;">
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      </el-form-item>
    </el-form>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :append-to-body="true"
      >
        <component
          :is="comName"
          :property="property"
          :obj="currentRow"
          @dialogCloseFormFlowField="dialogCloseFormFlowField"
          @dialogCloseFormState="dialogCloseFormState"
          @dialogCloseFormStateOption="dialogCloseFormStateOption"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { putForm, addForm } from '@/api/xtgl/form'
import { getClassInfo } from '@/api/index'
import FormFlowFieldAdd from './formFlowFieldAdd'
import FormStateAdd from './formStateAdd'
import FormStateOptionAdd from './formStateOptionAdd'
import OrgSelect2 from '@/components/OrgSelect/index2'
import { GetAllList } from '@/api/xtgl/page'
export default {
  name: 'AddPost',
  components: {
    FormFlowFieldAdd,
    OrgSelect2,
    FormStateOptionAdd,
    FormStateAdd
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        value: '',
        needCheckup: true,
        inUse: true,
        pageId: 0,
        formFlowField: [],
        formState: []
      },
      dialogTableVisible: false,
      dialogTitle: '保存',
      comName: '',
      currentRow: null,
      listLoading: false,
      buttonLoading: false,
      treeList: null,
      editRowIndex: 0,
      rowOptionIndex: 0,
      // selectTable: '',
      property: null,
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        value: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getFormValue() {
      return this.formValue1 + '.' + this.formValue2
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
          this.buttonLoading = true
          if (this.obj) {
            putForm(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            addForm(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    // 表单字段
    addFormFlowField() {
      this.comName = 'FormFlowFieldAdd'
      this.currentRow = null
      this.dialogTableVisible = true
    },
    editFormFlowField(scope) {
      this.comName = 'FormFlowFieldAdd'
      this.currentRow = scope.row
      this.editRowIndex = scope.$index
      this.dialogTableVisible = true
    },
    delFormFlowField(scope) {
      this.ruleForm.formFlowField.splice(scope.$index, 1)
    },
    dialogCloseFormFlowField(data, state) {
      if (state === 'add') {
        this.ruleForm.formFlowField.push(data)
      } else if (state === 'update') {
        this.ruleForm.formFlowField.splice(this.editRowIndex, 1, data)
      }
      this.dialogTableVisible = false
    },
    // 表单状态
    addFormState() {
      this.comName = 'FormStateAdd'
      this.currentRow = null
      this.dialogTableVisible = true
    },
    editFormState(scope) {
      this.comName = 'FormStateAdd'
      this.currentRow = scope.row
      this.editRowIndex = scope.$index
      this.dialogTableVisible = true
    },
    delFormState(scope) {
      this.ruleForm.formState.splice(scope.$index, 1)
    },
    dialogCloseFormState(data, state) {
      if (state === 'add') {
        this.ruleForm.formState.push(data)
      } else if (state === 'update') {
        this.ruleForm.formState.splice(this.editRowIndex, 1, data)
      }
      this.dialogTableVisible = false
    },
    addFormStateOption(itemIndex) {
      this.comName = 'FormStateOptionAdd'
      this.currentRow = null
      this.editRowIndex = itemIndex
      this.dialogTableVisible = true
    },
    editFormStateOption(itemIndex, item, optionIndex) {
      this.comName = 'FormStateOptionAdd'
      this.currentRow = item
      this.editRowIndex = itemIndex
      this.rowOptionIndex = optionIndex
      this.dialogTableVisible = true
    },
    delFormStateOption(items, index) {
      items.splice(index, 1)
      // this.ruleForm.formState[this.editRowIndex].formStateOption.splice(index, 1)
    },
    dialogCloseFormStateOption(data, state) {
      if (state === 'add') {
        this.ruleForm.formState[this.editRowIndex].formStateOption.push(data)
      } else if (state === 'update') {
        this.ruleForm.formState[this.editRowIndex].formStateOption.splice(this.rowOptionIndex, 1, data)
      }
      this.dialogTableVisible = false
    },
    initData() {
      this.listLoading = true
      GetAllList().then(response => {
        this.treeList = response.data
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        if (newObj.formState.length) {
          newObj.formState = newObj.formState.sort((a, b) => a.value - b.value)
        }
        this.ruleForm = newObj
      } else {
        this.ruleForm.formState = [{ formId: 0, name: '制单', value: 0, formStateOption: [], isCheckup: false, isFlowNode: true, inUse: true },
          { formId: 0, name: '审核', value: 1, formStateOption: [], isCheckup: true, isFlowNode: true, inUse: true },
          { formId: 0, name: '完成', value: 10000, formStateOption: [], isCheckup: false, isFlowNode: true, inUse: true }]
      }
    },
    loadTableField() {
      const _value = this.ruleForm.value.trim()
      if (_value === '') {
        this.$alert('表单值不能为空！')
        return
      }
      var reg = /^[A-Z]+$/
      let strIndex = -1 // 获取第一个大写字母位置
      for (var i = 0; i < _value.length; i++) {
        if (reg.test(_value.charAt(i)) && strIndex === -1) {
          strIndex = i
        }
      }
      if (strIndex === -1) {
        this.$alert('必须有一个大写字母：表单值格式：cgglPlan')
        return
      }
      // 拼接 后台类的 命名空间: cgglPlan => cggl.Plan
      var cnstr = _value.substring(0, strIndex).toUpperCase() + '.' + _value.substring(strIndex)
      this.buttonLoading = true
      setTimeout(() => {
        getClassInfo({ cn: cnstr }).then(response => {
          const { data } = response
          if (data) {
            this.$message('加载成功')
            this.property = data.property
          } else {
            this.property = null
            this.$message('加载失败')
          }
          this.buttonLoading = false
        }).catch(() => { this.buttonLoading = false })
      }, 1000)
    }
  }

}
</script>
