<template>
  <div class="container SocialResourceEdit">
    <template>
      <el-card class="info-card">
        社会资源信息
      </el-card>
      <el-card class="form-card">
        <el-form
          ref="firstForm"
          :inline="true"
          :model="firstForm"
          :rules="firstRules"
          label-width="120px"
          :size="size"
        >
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="firstForm.name" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="firstForm.sex" class="input-width" placeholder="请选择">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>

          <el-form-item label="出生年份:">
            <el-date-picker
              v-model="firstForm.birthYear"
              class="input-width"
              type="year"
              value-format="yyyy"
              :placeholder="selectPlaceholder"
            />
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="firstForm.companyTel" class="input-width" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="工作单位:">
            <el-input v-model="firstForm.company" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="单位性质:">
            <el-input v-model="firstForm.companyType" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="职务:">
            <el-input v-model="firstForm.position" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="单位地址:">
            <el-input v-model="firstForm.companyAddress" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="现居住地:">
            <el-input v-model="firstForm.homeAddress" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="家庭电话:">
            <el-input v-model="firstForm.homeTel" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="Email:">
            <el-input v-model="firstForm.email" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="QQ:">
            <el-input v-model="firstForm.qq" class="input-width" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="个人喜好:">
            <el-input v-model="firstForm.interest" :placeholder="inputPlaceholder" class="input-width" type="textarea" />
          </el-form-item>
          <el-form-item label="学习经历:">
            <el-input v-model="firstForm.study" :placeholder="inputPlaceholder" class="input-width" type="textarea" />
          </el-form-item>
          <el-form-item label="工作经历:">
            <el-input v-model="firstForm.work" :placeholder="inputPlaceholder" class="input-width" type="textarea" />
          </el-form-item>
          <el-form-item label="资源关系:">
            <el-input v-model="firstForm.resources" :placeholder="inputPlaceholder" class="input-width" type="textarea" />
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="firstForm.remark" :placeholder="inputPlaceholder" class="input-width" type="textarea" />
          </el-form-item>
          <el-form-item label="是否可用:">
            <el-switch v-model="firstForm.inUse" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>

          <el-form-item label="附件">
            <up-file
              v-model="firstForm.fileList"
              :file-size="100"
              :is-preview="true"
              :is-upfile="true"
              :is-delete="true"
            />
          </el-form-item>
        </el-form>
        <div class="actions">
          <el-button :size="size" type="primary" @click="submitForm()">保存</el-button>
          <el-button :size="size" type="info" @click="back()">取消</el-button>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
import UpFile from '@/components/UpLoad/UpFile'
// import { validate } from '@/utils/validate'
import { getSocialResourceById, addSocialResource, putSocialResource } from '@/api/ywgl/socialResource.js'

export default {
  name: 'SocialResourceEdit',
  components: {
    UpFile
  },
  data() {
    return {
      size: 'mini',
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      firstForm: {
        companyId: this.$store.state.user.selectOrgId,
        orgId: this.$store.state.user.selectOrgId, // 添加人员的orgId
        id: 0, // 新增为0
        name: '', // 姓名
        sex: '',
        birthYear: null,
        companyTel: '',
        company: '',
        companyType: '',
        position: '',
        companyAddress: '',
        homeAddress: '',
        homeTel: '',
        email: '',
        qq: '',
        interest: '',
        study: '',
        work: '',
        resources: '',
        inUse: true,
        remark: '', // 备注
        fileList: [] // 附件
      },
      firstRules: {
        name: [
          { required: true, message: '请输入姓名' }
        ]
      }
    }
  },
  watch: {
    'firstForm.birthYear'(val) {
      this.firstForm.birthYear = '' + val
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const newId = vm.$route.query.id
      const oldId = vm.firstForm.id
      if (newId && newId !== oldId) {
      // 说明是打开另一个单子的编辑页面
        vm.firstForm.id = newId
        vm.initDataById(newId)
      } else if (!newId && oldId) {
        // 说明是打开一个新建页面
        // 将data数据初始成定义时的状态
        Object.assign(vm.$data, vm.$options.data())
        vm.$nextTick(() => {
          vm.$refs.firstForm.resetFields()
        })
      }
    })
  },
  methods: {
    /**
     * @description: 根据id获取数据
     */
    initDataById(id) {
      getSocialResourceById({ id }).then(({ data }) => {
        Object.keys(this.firstForm).forEach(key => {
          this.firstForm[key] = data[key] || this.firstForm[key]
        })
        Object.assign(this.firstForm, {
          fileList: data.upFile
        })
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
        putSocialResource(req).then(res => {
          this.$message.success('保存成功')
          this.back()
        })
      } else {
        addSocialResource(req).then(() => {
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
.SocialResourceEdit{
  // 修改的样式
/deep/.el-form {
  .el-form-item{
    width:45%
  }
  .input-width {
    width: 272px;
  }
  .el-form-item__label{
    font-weight: normal;
    color: #101010;
    }

  }
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
