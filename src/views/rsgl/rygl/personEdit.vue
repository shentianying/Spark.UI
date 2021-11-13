<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="工号" prop="number">
            <el-input v-if="this.$route.query.id !== 0" v-model="ruleForm.number" disabled maxlength="20" />
            <el-input v-else v-model="ruleForm.number" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="部门" prop="organizationId">
            <org-select2
              v-model="ruleForm.organizationId"
              size="mini"
              :collapse-tags="false"
              :show-all-levels="true"
              :multiple="false"
              :select-data="ruleForm.organizationId"
              :filterable="true"
              expand-trigger="hover"
              placeholder="请选择"
              :check-strictly="true"
              @change="orgChange"
            />

          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="岗位" prop="postId">
            <!-- <el-input v-model="ruleForm.post.name" maxlength="18" /> -->
            <!-- <el-input v-else placeholder="注：请在人员岗位中添加岗位信息!" maxlength="18" disabled /> -->
            <el-select v-model="ruleForm.postId" filterable clearable placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in postList"
                :key="index"
                :label="item.post.name"
                :value="item.postId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="人员类型" prop="personTypeID">
            <el-select v-model="ruleForm.personTypeID" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in personTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="证件类型" prop="idType">
            <el-select v-model="ruleForm.idType" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in idTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="证件号码" prop="idNumber">
            <el-input v-model="ruleForm.idNumber" maxlength="18" />
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="电话号码" prop="phoneNumber">
            <el-input v-model="ruleForm.phoneNumber" maxlength="11" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="身份证地址" prop="idAddress">
            <el-input v-model="ruleForm.idAddress" maxlength="18" />
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="家庭地址" prop="homeAddres">
            <el-input v-model="ruleForm.homeAddres" maxlength="40" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="ruleForm.gender" placeholder="请选择" style="width:100%">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="民族" prop="nation">
            <el-input v-model="ruleForm.nation" maxlength="10" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="出生日期" prop="birthDate">
            <el-date-picker
              v-model="ruleForm.birthDate"
              type="date"
              placeholder="请选择"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="开户行" prop="awBank">
            <el-select v-model="ruleForm.awBank" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item,index) in bankList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="账号" prop="account">
            <el-input v-model="ruleForm.account" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="账号是否确认" prop="isConfirmAccount">
            <el-switch v-model="ruleForm.isConfirmAccount" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              maxlength="1000"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否可用" prop="inUse">
            <el-switch v-model="ruleForm.inUse" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-form-item label="账号有效期" prop="expirationDate">
            <el-date-picker
              v-model="ruleForm.expirationDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="是否可登录" prop="isUser">
            <el-switch v-model="ruleForm.isUser" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">保存</el-button>
      <el-button type="primary" size="mini" @click="closeThePage">关闭</el-button>
      <el-button v-if="personId>0" v-has="'PERSONPOST_EDIT'" size="mini" type="success" @click="editPersonPost()">编辑岗位信息➜</el-button>
      <el-button v-if="personId>0 && ruleForm.postId !== 0" v-has="'USEREDIT_INDEX'" type="success" size="mini" title="" @click="editRange()">编辑人员审核和数据范围➜</el-button>
    </div>
  </div>
</template>

<script>
import { getPersonById, getPersonEditInit, addPerson, putPerson } from '@/api/rsgl/person'
import { getPostListByOrgId } from '@/api/rsgl/postPool'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import { getTree } from '@/utils/index'

export default {
  name: 'UserInfo',
  components: {
    OrgSelect2
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        number: '',
        companyId: this.$store.state.user.selectOrgId,
        organizationId: null,
        postId: null,
        personTypeID: null,
        inUse: true,
        isUser: true,
        isConfirmAccount: false,
        idType: '',
        idNumber: '',
        phoneNumber: '',
        idAddress: '',
        homeAddres: '',
        gender: '',
        nation: '',
        birthDate: null,
        expirationDate: '2099-12-31',
        remark: ''
      },
      postForm: {
        personId: null,
        postId: 0,
        orgId: null,
        postPoolDetailId: null,
        roleId: null,
        positionId: null,
        isMain: true,
        inUse: true
      },
      personId: 0,
      orgList: [], // 所有的组织机构数据
      companyList: [], // 过滤出的公司信息数据
      postList: [],
      idTypeList: [], // 证件类型列表
      personTypeList: [], // 员工类型列表
      bankList: [], // 开户行列表
      changeFlag: false,
      buttonLoading: false,
      refreshRouterName: '',
      loadOrg: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '不能为空', trigger: 'blur' }],
        companyId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        idType: [{ required: true, message: '不能为空', trigger: 'change' }],
        personTypeID: [{ required: true, message: '不能为空', trigger: 'change' }],
        organizationId: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        postId: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
        expirationDate: [{ required: true, type: 'string', message: '不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted() {
    // this.fetchData()
    this.initData()
    if (this.$route.query.id) {
      this.personId = this.$route.query.id
      this.fetchData()
      this.refreshRouterName = this.$route.params.refreshRouterName
    } else {
      this.$refs['ruleForm'].resetFields()
      this.loadOrg = true
    }
  },
  activated() {
    // this.initData()
    // if (this.$route.query.id) {
    //   this.personId = this.$route.query.id
    //   this.fetchData()
    //   this.refreshRouterName = this.$route.params.refreshRouterName
    // } else {
    //   this.$refs['ruleForm'].resetFields()
    //   this.loadOrg = true
    //   // this.userOrg = []
    // }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var postData = JSON.parse(JSON.stringify(this.ruleForm))
          postData.personTypeID = Number(postData.personTypeID)
          postData.idType = postData.idType + ''
          // const uo = []
          // this.userOrg.forEach(ele => {
          //   const pNodes = findPNode(this.orgList, ele)
          //   // 取最大父节点
          //   const pNode = pNodes.find(f => f.pid === 0)
          //   uo.push({ userId: this.$route.query.id, companyId: pNode.id, organizationId: ele })
          // })
          // postData.userOrgList = uo
          if (this.$route.query.id !== 0) {
            this.buttonLoading = true
            putPerson(postData)
            // putPerson({ person: postData, userOrgList: uo })
              .then((response) => {
                this.$message(response.message)
                this.buttonLoading = false
                this.$emit('dialogClose')
              }).catch(() => { this.buttonLoading = false })
          }

          if (this.$route.query.id === 0) {
            this.buttonLoading = true
            console.log(postData)
            // postData.passWord = this.ruleForm.passWord
            addPerson(postData)
              .then((response) => {
                this.$message(response.message)
                this.personId = response.data
                this.buttonLoading = false
                this.$emit('dialogClose')
              })
              .catch(() => {
                this.buttonLoading = false
              })
          }
        }
      })
      // this.$refs.child.submitForm()
    },
    async fetchData() {
      if (this.$route.query.id !== 0) {
        await getPersonById({ id: this.$route.query.id }).then((response) => {
          const { data, data1, data6 } = response
          this.postList = data6
          this.ruleForm = data
          this.userOrg = data1
          this.ruleForm.idType = Number(this.ruleForm.idType)
        })
      }
    },
    async initData() {
      await getPersonEditInit({ companyId: this.ruleForm.companyId }).then(response => {
        const { data3, data4, data5 } = response
        // 1.岗位数据列表
        // this.postList = data1
        // 2.组织机构列表
        // data2.forEach((ele) => {
        //   ele.label = ele.name
        //   // ele.isDisabled = !ele.optional
        // })
        // this.orgList = data2

        // const treedata1 = getTree(0, this.orgList)
        // this.treeList = treedata1.filter(f => f.id === this.ruleForm.companyId)
        // 3.员工类型下拉数据
        this.personTypeList = data3
        // 4.证件类型下拉数据
        this.idTypeList = data4
        this.bankList = data5
        this.loadOrg = true
      })
    },
    closeThePage() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    getPostList(setVal) {
      getPostListByOrgId({ id: setVal }).then(response => {
        const { data } = response
        this.postList = data
      })
    },
    orgChange(val) {
      if (this.changeFlag) {
        if (val) {
          this.ruleForm.postId = null
          this.getPostList(val)
        }
      } else {
        this.changeFlag = true
      }
    },
    editPersonPost() {
      this.$router.push({ name: 'PersonPostEdit', query: { id: this.personId, refreshRouterName: 'PersonPost' }, params: { id: this.personId }})
    },
    editRange() {
      this.$router.push({ name: 'UserFrame', query: { id: this.personId, refreshRouterName: 'Person', tab: 'userOrg', showTag: 0 }, params: { id: this.personId }})
    }
  }
}
</script>
