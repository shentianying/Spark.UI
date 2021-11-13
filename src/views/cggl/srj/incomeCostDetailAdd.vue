<template>
  <div>
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="160px"
      class=""
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="材料名称" prop="materialName">
            <el-input v-model="ruleForm.materialName" size="mini" />
          </el-form-item>
          <el-form-item label="计量单位" prop="materialUnit">
            <el-input v-model="ruleForm.materialUnit" size="mini" />
          </el-form-item>
          <el-form-item label="所属材料类别" prop="categoryId">
            <el-cascader
              v-model="ruleForm.categoryId"
              :options="options"
              filterable
              clearable
              :show-all-levels="true"
              style="width:100%"
            />
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="ruleForm.quantity" size="mini" />
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input v-model="ruleForm.price" size="mini" />
          </el-form-item>
          <el-form-item label="总金额" prop="amount">
            {{ ruleForm.amount }}
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark" size="mini" maxlength="400" />
          </el-form-item>

        </el-col>
      </el-row>
      <!-- <el-form-item label="附件">
        <up-file v-if="ruleForm.fileList" v-model="ruleForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="ruleForm.fileList" />
      </el-form-item> -->
      <el-form-item align="center">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAllMaterialCategory } from '@/api/cggl/material'
import { getTree } from '@/utils/index'
import { validate } from '@/utils/validate'
export default {
  name: 'BusinessCostDetailAdd',
  components: {
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
        categoryId: null,
        category: null,
        unit: '',
        unit2: '',
        brand: '',
        model: '',
        spec: '',
        thickness: '',
        texture: '',
        surfaceTreatment: '',
        designNumber: '',
        // fileList: [],
        quantity: null,
        price: null,
        amount: null,
        remark: ''

        // confirmTime: null,
        // processOrgId: null,
        // processUser: null,
        // enteredQuantity: null
      },
      buttonLoading: false,
      comName: '',
      list: null,
      categoryList: null,
      oldrProperty: {},
      options: null,
      rules: {
        categoryId: [{ required: true, message: '请选择', trigger: 'change' }],
        materialName: [{ required: true, message: '请输入', trigger: 'change' }],
        quantity: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
        price: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
        amount: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }]
      }
    }
  },
  computed: {
    getEndCategoryId() { // 获取categoryId数 组中最后一个 id
      return this.ruleForm.categoryId[this.ruleForm.categoryId.length - 1]
    }
  },
  watch: {
    'ruleForm.quantity': {
      handler: function(value) {
        this.ruleForm.amount = this.ruleForm.price * value
      },
      immediate: true
    },
    'ruleForm.price': {
      handler: function(value) {
        this.ruleForm.amount = this.ruleForm.quantity * value
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          // 获取级联数组中的最后一个id,就是当前选中的最末级的分类id
          var computerCategoryId = newObj.categoryId[newObj.categoryId.length - 1]
          newObj.category = this.categoryList.find(f => f.id === computerCategoryId)
          newObj.categoryId = computerCategoryId
          if (newObj.category.level !== 3) {
            this.$message.error('选择的材料必须是三级分类')
            return false
          }
          // console.log('提交的数据：', newObj)
          if (this.obj) {
            this.$emit('dialogClose', newObj, 'update')
          } else {
            this.$emit('dialogClose', newObj, 'add')
          }
        }
      })
    },
    initData() {
      const promise = this.getCategory()
      if (this.obj) {
        promise.then(() => {
          var newObj = JSON.parse(JSON.stringify(this.obj))
          // console.log('newObj:', newObj)
          this.ruleForm = newObj
          // 拼接id成三级数组，来匹配 选材料 级联菜单
          var categoryIdArray = []
          var secondCategoryId = this.categoryList.find(f => f.id === this.ruleForm.categoryId).pid
          var firstCategoryId = this.categoryList.find(f => f.id === secondCategoryId).pid
          categoryIdArray.push(firstCategoryId)
          categoryIdArray.push(secondCategoryId)
          categoryIdArray.push(this.ruleForm.categoryId)
          this.ruleForm.categoryId = categoryIdArray
        })
      }
    },
    getCategory(query) {
      const pro1 = new Promise((resolve, reject) => {
        getAllMaterialCategory({ name: query }).then(response => {
          const { data } = response
          data.forEach(e => {
            e.pid = e.pId
            if (e.unit) {
              e.label = e.name + '(' + e.unit + ')'
            } else {
              e.label = e.name
            }
            e.value = e.id
            delete e.pId
          })
          this.categoryList = data
          this.options = getTree(0, data)
          resolve()
        }).catch(() => { reject() })
      })
      return pro1
      // }
    }

  }
}
</script>
