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
import { getVisitorById, addVisitor, putVisitor, deleteVisitor } from '@/api/qygl/visitor.js'
export default {
  name: 'VisitorEdit',
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
        name: '', // 访客姓名
        telphone: '', // 访客电话
        orderTime: '', // 预约时间
        orderSuccessTime: '', // 预约成功时间
        visitTime: '', // 到访时间
        leaveTime: '', // 离开时间
        orgId: '', // 拜访部门
        regionId: '', // 拜访区域
        receivePerson: '', // 接待人
        receiveTel: '', // 接待人联系方式
        carNum: '', // 车牌号
        peerNum: '', // 同行人数
        visitReason: '' // 拜访事由
      },
      firstRules: {
        name: [
          { required: true, message: '请输入访客姓名', trigger: 'change' }
        ],
        telphone: [
          { required: true, message: '请输入访客电话', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择预约时间', trigger: 'change' }
        ],
        receiveTel: [
          { required: true, message: '请输入接待人联系方式', trigger: 'change' }
        ],
        visitReason: [
          { required: true, message: '请输入拜访事由', trigger: 'change' }
        ]
      },
      filter: {

      }
    }
  },
  computed: {
    title() {
      const { active } = this
      return active === 2 ? '审批流程' : '意向企业信息'
    },
    formNodeData() {
      const {
        inputPlaceholder,
        selectPlaceholder
      } = this

      return [
        { label: '访客姓名:', keyword: 'name', props: { placeholder: inputPlaceholder }},
        { label: '访客电话:', keyword: 'telphone', props: { placeholder: inputPlaceholder }},
        { label: '预约时间:', keyword: 'orderTime', component: 'el-date-picker', props: { type: 'date', placeholder: '选择时间', valueFormat: 'yyyy-MM-dd' }},
        { label: '预约成功时间:', keyword: 'orderSuccessTime', component: 'el-date-picker', props: { type: 'date', placeholder: '选择时间', valueFormat: 'yyyy-MM-dd' }},
        { label: '到访时间:', keyword: 'visitTime', component: 'el-date-picker', props: { type: 'date', placeholder: '选择时间', valueFormat: 'yyyy-MM-dd' }},
        { label: '离开时间:', keyword: 'leaveTime', component: 'el-date-picker', props: { type: 'date', placeholder: '选择时间', valueFormat: 'yyyy-MM-dd' }},
        { label: '拜访部门:', keyword: 'orgId', props: { placeholder: selectPlaceholder }},
        { label: '拜访区域:', keyword: 'regionId', props: { placeholder: selectPlaceholder }},
        { label: '接待人:', keyword: 'receivePerson', props: { placeholder: inputPlaceholder }},
        { label: '接待人联系方式:', keyword: 'receiveTel', props: { placeholder: inputPlaceholder }},
        { label: '车牌号:', keyword: 'carNum', props: { placeholder: inputPlaceholder }},
        { label: '同行人数:', keyword: 'peerNum', props: { placeholder: inputPlaceholder }},
        { label: '拜访事由:', monopolize: true, keyword: 'visitReason', props: { placeholder: inputPlaceholder, type: 'textarea' }}
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
        const { selectOrgId } = vm.$store.state.user

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

    },
    /**
     * @description: 根据id获取数据并且初始化选项框数据
     */
    initDataById(id) {
      getVisitorById({ id }).then(res => {
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
        return deleteVisitor({ id: this.firstForm.id })
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
        putVisitor(req).then(res => {
          // 更新
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        addVisitor(req).then(() => {
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

