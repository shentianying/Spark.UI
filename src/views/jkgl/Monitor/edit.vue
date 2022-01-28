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
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import MyForm from '@/components/MyForm'

import { GetMonitorById, addMonitor, putMonitor, deleteMonitor } from '@/api/jkgl/monitor.js'
export default {
  name: 'MonitorEdit',
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
        companyId: this.$store.state.user.selectOrgId, // 公司id
        number: '', // 编号
        name: '', // 名称
        ipAddress: '', // IP地址
        loginName: '', // 登录名
        loginPassword: '', // 登录密码
        isMonitor: 1, // 是否是监控
        inUse: 1, // 是否使用
        remark: '' // 备注
      },
      firstRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入编号', trigger: 'change' }
        ],
        inUse: [
          { required: true, message: '请选择是否使用', trigger: 'change' }
        ],
        ipAddress: [
          { required: true, message: '请输入IP地址', trigger: 'change' }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'change' }
        ],
        loginPassword: [
          { required: true, message: '请输入登录密码', trigger: 'change' }
        ]
      },
      filter: {
        inUseList: [{ name: '是', value: 1 }, { name: '否', value: 0 }]
      }
    }
  },
  computed: {
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '监控信息'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        filter: { inUseList }
      } = this

      return [
        { label: '编号:', keyword: 'number', props: { placeholder: inputPlaceholder }},
        { label: '名称:', keyword: 'name', props: { placeholder: inputPlaceholder }},
        { label: 'IP地址:', keyword: 'ipAddress', props: { placeholder: inputPlaceholder }},
        { label: '是否使用:', keyword: 'inUse', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: inUseList }},
        { label: '登录名:', keyword: 'loginName', props: { placeholder: inputPlaceholder }},
        { label: '登录密码:', keyword: 'loginPassword', props: { placeholder: inputPlaceholder }},
        { label: '备注:', monopolize: true, keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }}
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
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
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      GetMonitorById({ id }).then(res => {
        const form = this.firstForm
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            if (key === 'inUse') {
              form[key] = typeof res.data[key] === 'boolean' ? Number(res.data[key]) : form[key]
            } else {
              form[key] = res.data[key] || form[key]
            }
          }
        }
      })
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
        return deleteMonitor({ id: this.firstForm.id })
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
        putMonitor(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        addMonitor(req).then(() => {
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

