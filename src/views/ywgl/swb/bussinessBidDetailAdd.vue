<template>
  <div class="app-container">
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
        <el-form-item label="范围名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入" size="mini" maxlength="50" :disabled="diasabledInput" />
        </el-form-item>

        <el-form-item label="报价" prop="planQuote">
          <!-- <el-input-number v-model="ruleForm.planQuote" size="mini" :controls="false" :precision="2" style="width:100%" @change="calProfit" /> -->
          <el-input v-model="ruleForm.planQuote" type="number" size="mini" :precision="2" @change="calProfit">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="成本" prop="estimatedCost">
          <!-- <el-input-number v-model="ruleForm.estimatedCost" size="mini" :controls="false" :precision="2" @change="calProfit" /> -->
          <el-input v-model="ruleForm.estimatedCost" type="number" size="mini" :precision="2" @change="calProfit">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="利润" prop="estimatedProfitMargin">
          <!-- <el-input-number v-model="ruleForm.estimatedProfitMargin" size="mini" :controls="false" :precision="2" :disabled="true" @change="calNetProfit" /> -->
          <el-input v-model="ruleForm.estimatedProfitMargin" type="number" size="mini" :precision="2" :disabled="true" @change="calNetProfit">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="咨询费" prop="estimatedConsultancyFee">
          <!-- <el-input-number v-model="ruleForm.estimatedConsultancyFee" size="mini" :controls="false" :precision="2" @change="calNetProfit" /> -->
          <el-input v-model="ruleForm.estimatedConsultancyFee" type="number" size="mini" :precision="2" @change="calNetProfit">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="净利润" prop="estimatedNetProfitMargin">
          <!-- <el-input-number v-model="ruleForm.estimatedNetProfitMargin" size="mini" :controls="false" :precision="2" :disabled="true" /> -->
          <el-input v-model="ruleForm.estimatedNetProfitMargin" type="number" size="mini" :disabled="true" :precision="2">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-form-item align="center">
          <el-button type="primary" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" :loading="buttonLoading" @click="$emit('dialogClose')">关闭</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { validate } from '@/utils/validate'
export default {
  name: 'BussinessBidDetailAdd',
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
        id: 0,
        bussinessBid: 0,
        name: '',
        planQuote: 0.00,
        estimatedCost: 0.00,
        estimatedProfitMargin: 0.00,
        estimatedConsultancyFee: 0.00,
        estimatedNetProfitMargin: 0.00
      },
      buttonLoading: false,
      comName: '',
      diasabledInput: false,
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        planQuote: [{ validator: validate.logic, logic: value => value > 0, required: true, trigger: 'blur' }],
        estimatedCost: [{ required: true, message: '请输入', trigger: 'blur' }],
        estimatedProfitMargin: [{ required: true, message: '请输入', trigger: 'blur' }],
        estimatedConsultancyFee: [{ required: true, message: '请输入', trigger: 'blur' }],
        estimatedNetProfitMargin: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {

  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.planQuote = Number(newObj.planQuote)
          newObj.estimatedConsultancyFee = Number(newObj.estimatedConsultancyFee)
          newObj.estimatedCost = Number(newObj.estimatedCost)
          console.log('修改后返回的值:', newObj)
          if (this.obj) {
            this.$emit('dialogClose', newObj, 'update')
          } else {
            this.$emit('dialogClose', newObj, 'add')
          }
        }
      })
    },
    initData() {
      if (this.obj) {
        this.diasabledInput = true
        var newObj = JSON.parse(JSON.stringify(this.obj))
        this.ruleForm = newObj
      }
    },
    calProfit() {
      // this.ruleForm.estimatedProfitMargin = this.utils.NumberDiv(this.utils.NumberSub(this.ruleForm.planQuote, this.ruleForm.estimatedCost), this.ruleForm.planQuote, 2)
      this.ruleForm.estimatedProfitMargin = (this.ruleForm.planQuote - this.ruleForm.estimatedCost) * 100 / this.ruleForm.planQuote
      this.ruleForm.estimatedNetProfitMargin = this.ruleForm.estimatedProfitMargin - this.ruleForm.estimatedConsultancyFee
    },
    calNetProfit() {
      // this.ruleForm.estimatedNetProfitMargin = this.utils.NumberSub(this.ruleForm.estimatedProfitMargin, this.ruleForm.estimatedConsultancyFee)
      this.ruleForm.estimatedNetProfitMargin = this.ruleForm.estimatedProfitMargin - this.ruleForm.estimatedConsultancyFee
    }
  }
}
</script>
