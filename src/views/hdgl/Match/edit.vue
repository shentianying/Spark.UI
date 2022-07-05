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
          <el-button :size="size" @click="cancel()">取消</el-button>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import MyForm from '@/components/MyForm'
import { getMatchById, initMatch, addMatch, putMatch, deleteMatch } from '@/api/hdgl/match.js'
export default {
  name: 'MatchEdit',
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
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        type: '', // 类型
        remark: '' // 备注
      },
      firstRules: {
        title: [
          { required: true, message: '请输入主题', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        activityType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ]
      },
      filter: {
        matchTypeList: []
      }
    }
  },
  computed: {
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '赛事安排'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder,
        filter: { matchTypeList }
      } = this

      return [
        { label: '主题:', keyword: 'title', props: { placeholder: inputPlaceholder }},
        { label: '类型:', keyword: 'type', component: 'Select', props: { propsLabel: 'name', placeholder: selectPlaceholder, options: matchTypeList }},
        { label: '开始时间:', keyword: 'startDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '结束时间:', keyword: 'endDate', component: 'el-date-picker', props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }},
        { label: '内容:', keyword: 'content', props: { placeholder: inputPlaceholder, type: 'textarea' }},
        { label: '备注:', keyword: 'remark', props: { placeholder: inputPlaceholder, type: 'textarea' }}
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
      initMatch().then(res => {
        this.filter.matchTypeList = res.matchTypeList
      })
    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      getMatchById({ id }).then(res => {
        console.log(res.data)
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
        return deleteMatch({ id: this.firstForm.id })
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
        putMatch(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        addMatch(req).then(() => {
          // 添加
          this.$message.success('提交成功')
          this.back()
        })
      }
    },
    cancel() {
      this.back()
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

