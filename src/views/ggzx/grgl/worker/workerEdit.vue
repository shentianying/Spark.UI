<template>
  <div class="app-container">
    <el-card class="info-card">
      工人信息
    </el-card>
    <el-card class="form-card">
      <el-form
        ref="ruleForm"
        :label-position="labelPosition"
        status-icon
        :model="workerForm"
        :rules="rules"
        label-width="120px"
        class=""
        size="mini"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :xs="24">
            <el-form-item label="年度">
              {{ workerForm.year }}
            </el-form-item>
            <el-form-item label="工号">
              {{ workerForm.number }}
            </el-form-item>
            <el-form-item label="姓名">
              {{ workerForm.name }}
            </el-form-item>
            <el-form-item label="身份证号">
              {{ workerForm.idNumber }}
            </el-form-item>
            <el-form-item label="性别">
              {{ workerForm.gender }}
            </el-form-item>
            <el-form-item label="民族">
              {{ workerForm.nation }}
            </el-form-item>
            <el-form-item label="家庭地址">
              <el-input v-model="workerForm.homeAddres" :size="size" />
            </el-form-item>
            <el-form-item label="报名状态" prop="signUpState">
              <el-select
                v-model="workerForm.signUpState"
                placeholder="请选择"
                :size="size"
                style="width:100%"
              >
                <el-option
                  v-for="item in searchOptions.signUpStates"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否报到" prop="isBD">
              <!-- <el-checkbox v-model="workerForm.isBD" /> -->
              <el-switch
                v-model="workerForm.isBD"
                disabled
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item label="报到日期" prop="bdDate">
              <el-date-picker
                v-model="workerForm.bdDate"
                disabled
                :size="size"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="工伤保险" prop="isWithInsurance">
              <!-- <el-checkbox v-model="workerForm.isWithInsurance" /> -->
              <el-switch
                v-model="workerForm.isWithInsurance"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item label="工伤保险开始日期" prop="insuranceDate">
              <el-date-picker
                v-model="workerForm.insuranceDate"
                :size="size"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="是否暂退" prop="isPause">
              <!-- <el-checkbox v-model="workerForm.isPause" /> -->
              <el-switch
                v-model="workerForm.isPause"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item label="暂退原因" prop="pauseReason">
              <el-input v-model="workerForm.pauseReason" :size="size" type="textarea" />
            </el-form-item>
            <el-form-item label="是否退场" prop="isExit">
              <!-- <el-checkbox v-model="workerForm.isExit" /> -->
              <el-switch
                v-model="workerForm.isExit"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item label="退场日期" prop="exitDate">
              <el-date-picker
                v-model="workerForm.exitDate"
                :size="size"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="退场原因" prop="exitReason">
              <el-input
                v-model="workerForm.exitReason"
                :size="size"
                type="textarea"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="workerForm.remark" :size="size" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24">
            <el-form-item label="工种" prop="workType">
              <!-- <tree-select
                v-model="workerForm.workType"
                :size="size"
                :collapse-tags="false"
                :show-all-levels="false"
                :multiple="false"
                :filterable="true"
                :options="searchOptions.workTypes"
                props-value="value"
              /> -->
              <!-- <el-cascader
                v-model="workerForm.workTypeList"
                :size="size"
                :options="searchOptions.workTypes"
                style="width:100%"
              /> -->
              <org-select2
                :key="workTypeKey"
                v-model="workerForm.workType"
                :data-mode="1"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="false"
                :select-data="workerForm.workType"
                :options="searchOptions.workTypes"
                select-style="width:100%;"
              />
            </el-form-item>
            <el-form-item label="工人类型" prop="workerType">
              <el-select
                v-model="workerForm.workerType"
                placeholder="请选择"
                :size="size"
                style="width:100%"
              >
                <el-option
                  v-for="item in searchOptions.workerTypes"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="项目" prop="orgId">
              <org-select2
                :key="orgKey"
                v-model="workerForm.orgId"
                :data-mode="1"
                size="mini"
                :collapse-tags="false"
                :show-all-levels="true"
                :multiple="false"
                :filterable="true"
                :check-strictly="true"
                :select-data="workerForm.orgId"
                select-style="width:100%;"
              />
            </el-form-item>
            <el-form-item label="合同号" prop="contractNumber">
              <el-input v-model="workerForm.contractNumber" :size="size" />
            </el-form-item>
            <el-form-item label="开户行" prop="awBank">
              <el-select
                v-model="workerForm.awBank"
                placeholder="请选择"
                :size="size"
                style="width:100%"
              >
                <el-option
                  v-for="item in searchOptions.awBanks"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="银行账号" prop="account">
              <el-input v-model="workerForm.account" :size="size" />
            </el-form-item>
            <el-form-item label="工长" prop="gongZhangId">
              <el-select
                v-model="workerForm.gongZhangId"
                size="mini"
                filterable
                remote
                reserve-keyword
                clearable
                :remote-method="(query)=>{getGongZhangs(query)}"
                placeholder="请选择"
                :loading="loading"
                style="width:100%"
                @click.native="selectGongZhang()"
              >
                <el-option
                  v-for="(item,index) in personList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                  <span>{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报名日期" prop="signUpDate">
              <el-date-picker
                v-model="workerForm.signUpDate"
                :size="size"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="协招人" prop="xiezhaorenId">
              <el-select
                v-model="workerForm.xiezhaorenId"
                size="mini"
                filterable
                remote
                reserve-keyword
                clearable
                :remote-method="(query)=>{getXieZhaoPeople(query)}"
                placeholder="请选择"
                :loading="loading"
                style="width:100%"
                @click.native="selectXieZhaoRen()"
              >
                <el-option
                  v-for="(item,index) in personList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                  <span>{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="workerForm.phoneNumber" :size="size" />
            </el-form-item>
            <el-form-item label="工龄" prop="workingAge">
              <el-input v-model="workerForm.workingAge" :size="size" />
            </el-form-item>
            <el-form-item label="诚信档案" prop="integrity">
              <el-input v-model="workerForm.integrity" :size="size" type="textarea" />
            </el-form-item>
            <el-form-item label="是否已体检" prop="isPhysicalExamination">
              <!-- <el-checkbox v-model="workerForm.isPhysicalExamination" /> -->
              <el-switch
                v-model="workerForm.isPhysicalExamination"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item label="心率" prop="heartRate">
              <el-select
                v-model="workerForm.heartRate"
                placeholder="请选择"
                :size="size"
                style="width:100%"
              >
                <el-option
                  v-for="item in searchOptions.peStates"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="血压（收缩压）" prop="SBP">
              <el-input v-model="workerForm.SBP" :size="size" />
            </el-form-item>
            <el-form-item label="血压（舒张压）" prop="DBP">
              <el-input v-model="workerForm.DBP" :size="size" />
            </el-form-item>
            <el-form-item label="肝功能" prop="liverFunction">
              <el-select
                v-model="workerForm.liverFunction"
                placeholder="请选择"
                :size="size"
                style="width:100%"
              >
                <el-option
                  v-for="item in searchOptions.peStates"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="肺功能" prop="lungFunction">
              <el-select
                v-model="workerForm.lungFunction"
                placeholder="请选择"
                :size="size"
                style="width:100%"
              >
                <el-option
                  v-for="item in searchOptions.peStates"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="附件">
              <up-file key="fileListKey" v-model="workerForm.fileList" :is-preview="true" :is-upfile="true" :is-delete="true" :file-list="workerForm.fileList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center;margin-top:10px;">
        <el-button size="mini" type="success" :loading="loading" @click="submitForm()">保存</el-button>
      </div>
    </el-card>
    <!--弹窗（自定义页面）-->
    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        :width="dialogWidth"
        :append-to-body="false"
      >
        <component :is="comName" :obj="currentRow" :is-preview="true" @dialogClose="dialogClose" />
      </el-dialog>
    </div>

    <!--选择人员-->
    <div>
      <select-person ref="personRef1" :multiple="false" @getPersons="getGongZhangs" />
      <select-person ref="personRef2" :multiple="false" @getPersons="getXieZhaoPeople" />
    </div>
  </div>
</template>
<script>
import { getFormById, getDefaultOptions, saveData } from '@/api/ggzx/worker'
import OrgSelect2 from '@/components/OrgSelect/index2'
import UpFile from '@/components/UpLoad/UpFile'
import { getPersonList } from '@/api/rsgl/person'
import SelectPerson from '@/components/Other/selectPerson'
import TreeSelect from '@/components/SearchBar/form/TreeSelect.vue'
export default {
  name: 'WorkerEdit',
  components: {
    OrgSelect2,
    UpFile,
    SelectPerson,
    TreeSelect
  },
  data() {
    return {
      size: 'mini', // 整体大小
      labelPosition: 'right', // 对齐方式
      loading: false,
      workerForm: {
        id: null,
        orgId: null,
        year: null,
        number: '',
        name: '',
        contractNumber: '',
        idNumber: '',
        homeAddress: '',
        gender: '',
        nation: '',
        age: 0,
        workType: null,
        workTypeList: [],
        workerType: null,
        idCardExpireStart: null,
        idCardExpireEnd: null,
        awBank: null,
        account: '',
        gongZhangId: null,
        xiezhaorenId: null,
        phoneNumber: '',
        signUpDate: null,
        workingAge: '',
        signUpState: null,
        isBD: false,
        bdDate: null,
        isWithInsurance: false,
        insuranceDate: null,
        isPause: false,
        pauseReason: '',
        isExit: false,
        exitDate: null,
        exitReason: '',
        integrity: '',
        isPhysicalExamination: false,
        heartRate: '',
        SBP: '',
        DBP: '',
        liverFunction: null,
        lungFunction: null,
        remark: '',
        fileList: []
      },
      searchOptions: {
        workTypes: [],
        workerTypes: [],
        awBanks: [],
        signUpStates: [],
        peStates: []
      },
      dialogTableVisible: false,
      dialogTitle: '保存',
      dialogWidth: '70%',
      comName: 'ContractDetailCheck',
      currentRow: null,
      // 验证规则
      rules: {
        // orgId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        // gatheringType: [
        //   { required: true, message: '请选择收款类型', trigger: 'change' }
        // ],
        // capitalType: [
        //   { required: true, message: '请选择资金类型', trigger: 'change' }
        // ],
        // gatheringDate: [
        //   { required: true, message: '请选择日期', trigger: 'change' }
        // ],
        // personId: [
        //   { required: true, message: '请选择经手人', trigger: 'change' }
        // ],
        // amount: [
        //   { required: true, message: '请输入金额', trigger: 'change' },
        //   { validator: validate.money, message: '金额格式不正确' },
        //   { validator: validate.max_amount, message: '超过所能存储的最大金额' }
        // ]
      },
      personList: [],
      workTypeKey: 0,
      orgKey: 0 // 项目
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
    }
  },
  watch: {
    // 'ruleForm.orgId': {
    //   handler: function(value, oldvalue) {
    //     if (value !== oldvalue && oldvalue !== null) {
    //       this.list = []
    //     }
    //   }, deep: true
    // }
  },
  activated() {
    this.initData()
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 提交数据
    submitForm() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const data = { ...this.workerForm }
          const res = await saveData(data)

          this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
          this.$message.success(res.message)
        }
      })
    },
    // 初始化
    async initData() {
      const { id } = this.$route.query
      this.workerForm.id = id
      this.getForm()
      this.getOptions()
    },
    /**
     * 获取下拉选项
     */
    async getOptions() {
      const {
        workOptions2,
        workerOptions,
        bankOptions,
        signUpStateOptions,
        peStateOptions
      } = await getDefaultOptions()
      this.searchOptions.workTypes = workOptions2
      this.searchOptions.workerTypes = workerOptions
      this.searchOptions.awBanks = bankOptions
      this.searchOptions.signUpStates = signUpStateOptions
      this.searchOptions.peStates = peStateOptions
      this.searchOptions.workTypes.forEach(element => {
        element.pid = element.pId
      })
      getPersonList().then(response => {
        this.personList = response.data
      })
      // 组件重载
      this.workTypeKey += 1
      this.orgKey += 1
    },
    /**
     * 获取表单数据
     */
    getForm() {
      getFormById({ id: this.workerForm.id })
        .then(res => {
          const { code, data } = res
          if (code === 200) {
            for (const key in this.workerForm) {
              if (Object.hasOwnProperty.call(this.workerForm, key)) {
                this.workerForm[key] = data[key]
              }
            }
            this.workerForm.fileList = data.upFile
          }
        })
        .catch(err => {
          console.log(err)
          // this.$message.error(err.errorMsg)
        })
    },
    getRemotePerson(query) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          getPersonList().then(response => {
            this.personList = response.data
            this.loading = false
          })
        }, 200)
      } else {
        this.personList = []
      }
    },
    getPersons(personList) {
      if ((personList || []).length > 0) {
        this.personList = personList.map(m => { return { id: m.id, name: m.name } })
        this.$nextTick(() => {
          this.ruleForm.personId = personList[0].id
          this.ruleForm.personName = personList[0].name
        })
      }
    },
    selectPerson() {
      // this.tempItem2 = item2
      this.$refs.personRef1.openDialog()
    },
    selectGongZhang() {
      // this.tempItem2 = item2
      this.$refs.personRef1.openDialog()
    },
    getGongZhangs(personList) {
      if ((personList || []).length > 0) {
        this.personList = personList.map(m => { return { id: m.id, name: m.name } })
        this.$nextTick(() => {
          this.workerForm.gongZhangId = personList[0].id
        })
      }
    },
    selectXieZhaoRen() {
      // this.tempItem2 = item2
      this.$refs.personRef2.openDialog()
    },
    getXieZhaoPeople(personList) {
      if ((personList || []).length > 0) {
        this.personList = personList.map(m => { return { id: m.id, name: m.name } })
        this.$nextTick(() => {
          this.workerForm.xiezhaorenId = personList[0].id
        })
      }
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-top:10px; margin-bottom:10px; display:flex;justify-content:flex-end
}
</style>
