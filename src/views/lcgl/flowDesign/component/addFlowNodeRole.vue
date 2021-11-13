<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
      class=""
      size="mini"
    >
      <el-form-item label="角色类型" prop="roleType">
        <el-select v-model="ruleForm.roleType" placeholder="请选择" @change="roleTypeChange">
          <el-option
            v-for="item in dropDownData.roleTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.roleType === 1" label="角色" prop="roleId">
        <el-select v-model="ruleForm.roleId" placeholder="请选择">
          <el-option
            v-for="item in dropDownData.roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="特殊操作">
        <el-select v-model="ruleForm.option" placeholder="操作类型">
          <el-option label="无" :value="0" />
          <el-option
            v-for="(item,index) in dropDownData.options.filter(f=>f.formStateId === formStateId)"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="最长审批天数" prop="maxDays">
        <el-input-number v-model="ruleForm.maxDays" :min="0" :max="99" :controls="false" />天（默认0，不限时）
      </el-form-item>

      <el-form-item label="紧急程度" prop="grade">
        <el-select v-model="ruleForm.grade" placeholder="请选择">
          <el-option
            v-for="(item,index) in dropDownData.gradeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" size="mini" @click="submitForm()">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddFlowNodeRole',
  components: {
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    formStateId: { type: Number, default: null },
    dropDownData: { type: Object, default: null }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        roleId: null, // 角色
        maxDays: 0,
        roleType: null, // 角色类型
        option: 0,
        grade: 0
      },
      roleList: [],
      flowRoleType: [],
      rules: {
        roleId: [{ required: true, message: '必填', trigger: 'blur' }],
        roleType: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {

  },
  watch: {
    obj: {
      handler(newValue, oldValue) {
        this.initData()
      },
      deep: true
    }
  },
  mounted() {
  },
  created() {
    this.initData()
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          var result = {}
          result.id = newObj.id
          result.roleType = newObj.roleType
          result.option = newObj.option
          result.maxDays = newObj.maxDays
          result.grade = newObj.grade
          result.roleId = newObj.roleId || 0

          if (this.obj) {
            // 修改
            this.$emit('dialogClose', result, 0)
          } else {
            // 添加
            this.$emit('dialogClose', result, 1)
          }
        }
      })
    },
    initData() {
      if (this.obj) {
        const { id, roleId, maxDays, roleType, option, grade } = this.obj
        this.ruleForm = {
          id: id,
          roleId: roleId || null,
          maxDays: maxDays,
          roleType: roleType,
          option: option,
          grade: grade
        }
      }
    },
    roleTypeChange(roleType) {
      if (roleType !== 1) {
        this.ruleForm.roleId = null
      }
    }
  }
}
</script>

