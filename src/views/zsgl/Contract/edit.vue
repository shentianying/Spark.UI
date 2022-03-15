<template>
  <div class="container editPage">
    <template v-if="active === 1">
      <el-card class="info-card">
        {{ title }}
      </el-card>
      <el-card class="form-card">
        <MyForm
          ref="firstForm"
          label-width="140px"
          :form-data="firstForm"
          :rules="firstRules"
          :form-node="formNodeData"
          :size="size"
        />
        <div class="actions">
          <el-button :size="size" @click="submitForm()">保存</el-button>
          <el-button :size="size" @click="back()">取消</el-button>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import MyForm from '@/components/MyForm'
// import { validate } from '@/utils/validate'
import { getContractById, addContract, putContract, deleteContract } from '@/api/zsgl/contract.js'
export default {
  name: 'ContractEdit',
  components: {
    MyForm
  },
  data() {
    return {
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      active: 1, // 提交进度 1: 编辑信息 2: 编辑审批流程
      firstForm: {
        id: 0, // 新增为0
        companyId: '', // 公司id
        number: '', // 编号
        enterpriseId: '', // 签订公司Id
        regionId: '', // 签订区域Id
        startDate: '', // 合同开始时间
        endDate: '', // 合同结束时间
        isForever: 0, // 是否永久
        fileList: [] // 附件
      },
      firstRules: {
        enterpriseId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        regionId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      filter: {
        isForeverList: [{ name: '是', value: 1 }, { name: '否', value: 0 }]
      }
    }
  },
  computed: {
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '合同签订'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        filter: { isForeverList }
      } = this

      return [
        { label: '公司名称:', keyword: 'enterpriseId', component: 'EnterpriseSelect', props: { placeholder: '输入检索', propsLabel: 'companyName' }},
        { label: '签订区域:', keyword: 'regionId', props: { placeholder: inputPlaceholder }},
        { label: '开始日期:', keyword: 'startDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '结束日期:', keyword: 'endDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '是否永久合同:', keyword: 'isForever', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: isForeverList }},
        { label: '合同附件:', monopolize: true, keyword: 'fileList', component: 'UpFile', width: '100%', props: { isUpfile: true, isDelete: true, fileSize: 100, isPreview: true }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initSelect()
      const newId = vm.$route.query.id
      const oldId = vm.firstForm.id
      const type = vm.$route.query.type
      if (type === 'edit' && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.firstForm.id = newId
        vm.initForm()
        vm.initDataById(newId)
        vm.active = 1
      } else {
        if (type === 'add' && oldId) {
          vm.initForm()
          vm.active = 1
        }
        const form = vm.firstForm
        const { info: { uid, userName, name }, selectOrgId } = vm.$store.state.user
        vm.user = {
          id: uid,
          number: userName,
          name: name
        }
        form.companyId = selectOrgId
        form.personId = uid
      }
    })
  },
  methods: {
    initForm() {
      Object.assign(this.$data.firstForm, this.$options.data().firstForm)
      this.$nextTick(() => {
        this.$refs.firstForm.clearValidate()
      })
    },
    /**
     * @description: 初始化选项框数据
     */
    initSelect() {
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      getContractById({ id }).then(res => {
        console.log(res.data)
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            if (key === 'isForever') {
              form[key] = typeof res.data[key] === 'boolean' ? Number(res.data[key]) : form[key]
            } else {
              form[key] = res.data[key] || form[key]
            }
          }
        }
        this.parseServeDate(form, res.data)
      })
    },
    /* 处理多选数据 和 文件列表数据 */
    parseServeDate(form, data) {
      form.fileList = data.upFile
    },
    /**
     * 修改填报进度
     */
    setActive(active) {
      this.active = active
    },
    // 作废
    invalidForm() {
      this.$confirm('作废以后将无法编辑，是否确定作废？', '提示', {
        type: 'warning'
      }).then(() => {
        return deleteContract({ id: this.firstForm.id })
      }).then(() => {
        this.$message.success('操作成功')
        this.back()
      })
    },
    /**
     * 提交表单
     */
    submitForm() {
      const req = {
        ...this.firstForm
      }
      if (req.id) {
        putContract(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        addContract(req).then(() => {
          // 添加
          this.$message.success('提交成功')
          this.back()
        })
      }
    },
    /**
     * 返回上一页，并关闭当前页
     */
    back() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    }
  }
}
</script>

<style scoped lang="scss">
.editPage{
  // 修改的样式
// /deep/.el-form {
//   .el-form-item{
//     width:45%
//   }
//   .input-width {
//     width: 272px;
//   }
//   .el-form-item__label{
//     font-weight: normal;
//     color: #101010;
//     }

//   }
  .actions{
    margin-left: 100px;
  }
  .info-card {
    margin: 16px 24px 0 24px;
    height: 48px;
    line-height: 12px;
    font-size: 16px;
    font-weight: 600;
  }
  .form-card {
    margin: 0 24px;
  }

  .botton-box {
    margin-top: 40px;
    text-align: center;
  }
}

</style>

