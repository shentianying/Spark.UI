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
          <el-form-item label="选择材料" prop="categoryId">
            <el-cascader
              v-model="ruleForm.categoryId"
              :options="options"
              filterable
              clearable
              :show-all-levels="true"
              style="width:100%"
              @change="getCategoryInfo"
            />
          </el-form-item>
          <el-form-item label="主单位">
            <span v-if="ruleForm.category">{{ ruleForm.category.unit }}</span>
          </el-form-item>

          <el-form-item
            v-for="(item2,index2) in categoryPropertyList"
            v-show="ruleForm.categoryId!=null"
            :key="index2"
            :label="item2.property.name"
            :prop="item2.property.materialField"
            :rules="{ required: item2.isTargetRequired, message: '不可为空', trigger: 'change' }"
          >
            <el-select
              v-model="ruleForm[item2.property.materialField]"
              :allow-create="item2.canInput"
              filterable
              :clearable="true"
              :placeholder="item2.canInput?'请选择或者输入':'请选择'"
              style="width:100%"
            >
              <el-option v-for="(item3,index3) in item2.mcpItem" :key="index3" :label="item3.name" :value="item3.name" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="目标成本数量" prop="targetCostQuantity">
            <el-input v-model="ruleForm.targetCostQuantity" size="mini" />
          </el-form-item>
          <el-form-item label="目标成本单价" prop="targetCostPrice">
            <el-input v-model="ruleForm.targetCostPrice" size="mini" />
          </el-form-item>
          <el-form-item label="目标成本总金额" prop="targetCostAmount">
            {{ ruleForm.targetCostAmount }}
          </el-form-item>
          <!-- <el-form-item label="关联商务成本" prop="businessCostDetailId">
            <el-select
              v-model="ruleForm.businessCostDetailId"
              collapse-tags
              clearable
              style="width:150px;"
              size="mini"
              placeholder="请选择"
              @change="getBusinessCostInfo"
            >
              <el-option v-for="(item,index) in swcbDetails" :key="index" :label="item.materialCategory.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <div v-if="ruleForm.businessCostDetail">
            <el-form-item label="商务成本数量" prop="businessCostQuantity">
              {{ ruleForm.businessCostDetail.quantity }}
            </el-form-item>
            <el-form-item label="商务成本单价" prop="businessCostPrice">
              {{ ruleForm.businessCostDetail.price }}
            </el-form-item>
            <el-form-item label="商务成本总金额" prop="businessCostAmount">
              {{ ruleForm.businessCostDetail.amount }}
            </el-form-item>
          </div> -->

          <!-- <el-form-item label="主数量" prop="quantity">
            <el-input v-model.number="ruleForm.quantity" size="mini" maxlength="10" />
          </el-form-item>

          <el-form-item label="辅数量" prop="quantity2">
            <el-input v-model.number="ruleForm.quantity2" size="mini" maxlength="10" />
          </el-form-item> -->

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
import { getAllMaterialCategory, getMaterialCategoryPropertyByCategoryId } from '@/api/cggl/material'
import { getTree } from '@/utils/index'
import { validate } from '@/utils/validate'
export default {
  name: 'TargetCostDetailAdd',
  components: {
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
    // swcbDetails: {
    //   type: Array,
    //   default: null
    // }
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

        targetCostQuantity: null,
        targetCostPrice: null,
        targetCostAmount: null,
        // businessCostDetailId: null,
        remark: '',
        businessCostDetail: null

        // confirmTime: null,
        // processOrgId: null,
        // processUser: null,
        // enteredQuantity: null
      },
      buttonLoading: false,
      comName: '',
      list: null,
      categoryList: null,
      categoryPropertyList: null,
      oldrProperty: {},
      options: null,
      rules: {
        categoryId: [{ required: true, message: '请选择', trigger: 'change' }],
        targetCostQuantity: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
        targetCostPrice: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
        targetCostAmount: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }]
      }
    }
  },
  computed: {
    getEndCategoryId() { // 获取categoryId数 组中最后一个 id
      return this.ruleForm.categoryId[this.ruleForm.categoryId.length - 1]
    }
  },
  watch: {
    'ruleForm.targetCostPrice': {
      handler: function(value) {
        this.ruleForm.targetCostAmount = this.ruleForm.targetCostQuantity * value
      },
      immediate: true
    },
    'ruleForm.targetCostQuantity': {
      handler: function(value) {
        this.ruleForm.targetCostAmount = this.ruleForm.targetCostPrice * value
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
          var newObj = this.ruleForm
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
          this.getCategoryInfo()
        })
      }
    },
    getCategoryInfo() {
      // 材料级联，最后一个id 才是选中的id
      var computerCategoryId = this.ruleForm.categoryId[this.ruleForm.categoryId.length - 1]
      getMaterialCategoryPropertyByCategoryId({ categoryId: computerCategoryId }).then(response => {
        const { data } = response
        // categoryId v-model 改变了，还要改变的category对象
        var categoryObject = this.categoryList.find(f => f.id === computerCategoryId)
        this.ruleForm.category = { id: categoryObject.id,
          name: categoryObject.name,
          unit: categoryObject.unit,
          isMain: categoryObject.isMain }
        // 上次选择的数据
        this.oldrProperty.unit = this.ruleForm.unit
        this.oldrProperty.unit2 = this.ruleForm.unit2
        this.oldrProperty.brand = this.ruleForm.brand
        this.oldrProperty.model = this.ruleForm.model
        this.oldrProperty.spec = this.ruleForm.spec
        this.oldrProperty.thickness = this.ruleForm.thickness
        this.oldrProperty.texture = this.ruleForm.texture
        this.oldrProperty.surfaceTreatment = this.ruleForm.surfaceTreatment
        this.oldrProperty.designNumber = this.ruleForm.designNumber
        // 清空数据
        this.empty()
        // 遍历获得选中分类的分类属性
        for (var row of data) {
          var oldvalue = this.oldrProperty[row.property.materialField]
          // 分类属性中的选项的名称 是否等于 上次选择的分类属性的名称
          this.ruleForm[row.property.materialField] = oldvalue

          if (row.mcpItem.length === 1) {
            this.ruleForm[row.property.materialField] = row.mcpItem[0].name
          }
        }
        // 绑定属性
        this.categoryPropertyList = data
      }).catch(() => { })
    },
    empty() {
      this.ruleForm.unit = ''
      this.ruleForm.unit2 = ''
      this.ruleForm.brand = ''
      this.ruleForm.model = ''
      this.ruleForm.spec = ''
      this.ruleForm.thickness = ''
      this.ruleForm.texture = ''
      this.ruleForm.surfaceTreatment = ''
      this.ruleForm.designNumber = ''
    },
    getCategory(query) {
      const pro1 = new Promise((resolve, reject) => {
        getAllMaterialCategory({ name: query }).then(response => {
          const { data } = response
          data.forEach(e => {
            e.pid = e.pId
            e.label = e.name
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
    // getBusinessCostInfo() {
    //   // 商务成本明细对应的材料ID
    //   if (this.ruleForm.businessCostDetailId) {
    //     var newObj = this.swcbDetails.find(s => s.id === this.ruleForm.businessCostDetailId)
    //     this.ruleForm.categoryId = newObj.materialCategoryId
    //     this.ruleForm.businessCostDetail = newObj
    //     // 拼接id成三级数组，来匹配 选材料 级联菜单
    //     var categoryIdArray = []
    //     var secondCategoryId = this.categoryList.find(f => f.id === this.ruleForm.categoryId).pid
    //     var firstCategoryId = this.categoryList.find(f => f.id === secondCategoryId).pid
    //     categoryIdArray.push(firstCategoryId)
    //     categoryIdArray.push(secondCategoryId)
    //     categoryIdArray.push(this.ruleForm.categoryId)
    //     this.ruleForm.categoryId = categoryIdArray
    //     this.getCategoryInfo()
    //   }
    // }

  }
}
</script>
