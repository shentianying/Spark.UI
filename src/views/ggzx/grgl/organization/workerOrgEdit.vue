<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      status-icon
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class=""
      size="mini"
    >
      <el-form-item label="所属上级" prop="pid">
        <treeselect
          v-model="ruleForm.pid"
          placeholder="请选择"
          :multiple="false"
          :default-expand-level="1"
          :flat="true"
          :options="treeList"
          :normalizer="my_normalizer"
        />
      </el-form-item>
      <el-form-item
        v-if="activate"
        label="所属项目"
        prop="orgId"
      >
        <org-select2
          v-model="ruleForm.orgId"
          :data-mode="0"
          size="mini"
          :collapse-tags="false"
          :show-all-levels="true"
          :multiple="false"
          :filterable="true"
          :check-strictly="false"
          :select-data="ruleForm.orgId"
          select-style="width:100%;"
        />
      </el-form-item>
      <el-form-item label="员工性质" prop="personType">
        <el-select
          v-model="ruleForm.personType"
          class="input"
          clearable
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in personTypeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职务" prop="postTypeId">
        <el-select
          v-model="ruleForm.postTypeId"
          class="input"
          clearable
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in postTypeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="personId">
        <!-- <person-select-2
          v-if="ruleForm.type!==2"
          v-model="ruleForm.personId"
          class="input"
          :size="size"
          :multiple="false"
          :type="ruleForm.type"
        /> -->
        <el-input
          v-if="ruleForm.personType!==2"
          v-model="ruleForm.name"
          :disabled="true"
          placeholder="请选择"
          size="mini"
          style="width: 272px;"
        >
          <el-button slot="append" :disabled="disabled" icon="el-icon-search" @click="checkPerson()" />
        </el-input>
        <el-input
          v-if="ruleForm.personType===2"
          v-model="ruleForm.name"
          :disabled="true"
          placeholder="请选择"
          size="mini"
          style="width: 272px;"
        >
          <el-button slot="append" :disabled="disabled" icon="el-icon-search" @click="checkWorker()" />
        </el-input>
      </el-form-item>
      <el-form-item label="工号">
        {{ ruleForm.number }}
      </el-form-item>
      <el-form-item label="岗位">
        {{ ruleForm.post.name }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
        <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <select-worker
      ref="workerRef"
      :bd-state="true"
      :isexit="false"
      :ispause="false"
      :worker="worker"
      @getPersons="getWorkers"
    />
    <select-person ref="personRef" :multiple="false" @getPersons="getPersons" />
  </div>
</template>

<script>
import { saveData, getList, getDefaultOptions } from '@/api/ggzx/workerOrg'
import { getTree } from '@/utils/index'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import SelectPerson from '@/components/Other/selectPerson'
import SelectWorker from '@/components/Other/ggzx/selectWorker'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'WorkerOrgEdit',
  components: {
    // OrgSelect2
    Treeselect,
    SelectPerson,
    SelectWorker,
    OrgSelect2
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
        pid: 0,
        id: 0,
        orgId: 0,
        personType: null,
        personId: null,
        postTypeId: null,
        name: '',
        number: '',
        personPostId: null,
        post: {},
        person: {},
        worker: {}
      },
      activate: true,
      treeList: null,
      worker: {},
      buttonLoading: false,
      isLoad: false,
      postTypeOptions: [],
      personTypeOptions: [],
      disabled: false,
      rules: {
        orgId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
        personType: [{ required: true, message: '请选择', trigger: 'change' }],
        postTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
        personPostId: [{ required: true, message: '请选择', trigger: 'change' }],
        // parentPersonId: [
        //   { required: true, message: '请选择', trigger: 'change' }
        // ],
        personId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      personList: [],
      // workerList: [],
      loading: false
    }
  },
  wathch: {
  },
  mounted() {
    this.getOptions()
    this.initData()
    this.initTree()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          this.buttonLoading = true
          if (this.obj) {
            newObj.id = this.obj.id
          }
          saveData(newObj).then(response => {
            this.$message(response.message)
            this.buttonLoading = true
            this.$emit('dialogClose')
          }).catch(() => { this.buttonLoading = false })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    initData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        // newObj.inUse = newObj.inUse ? 'true' : 'false'
        this.ruleForm = newObj
        console.log('传过来的数据：', newObj)
      }
    },
    initTree() {
      this.listLoading = true
      this.activate = false // 销毁部门组件
      getList().then(response => {
        response.data.forEach(ele => {
          ele.label = ele.name
          ele.personPostName = ele.post.name
        })
        // this.treeList = response.data
        this.isLoad = true
        // console.log('树形结构：', this.treeList)
        const result = getTree(0, response.data)
        this.treeList = [{ id: 0, pid: 0, label: '一级根目录', children: result }]
        this.listLoading = false
        this.activate = true // 加载部门组件
      })
    },
    async getOptions() {
      const {
        personTypeOptions,
        postTypeOptions
      } = await getDefaultOptions()
      this.personTypeOptions = personTypeOptions
      this.postTypeOptions = postTypeOptions
    },
    /**
     * 设置禁用
     */
    my_normalizer(node) {
      if (node.postTypeId === 1) {
        node.isDisabled = true
      } else {
        node.isDisabled = false
      }
      console.log(node)
      return node
    },
    getPersons(personList) {
      if ((personList || []).length > 0) {
        // this.personList = [...this.personList, ...personList.map(m => { return { id: m.id, name: m.name } })]
        this.$nextTick(() => {
          console.log(personList[0])
          this.ruleForm.person = personList[0]
          this.ruleForm.personId = personList[0].id
          this.ruleForm.name = personList[0].name
          this.ruleForm.number = personList[0].number
          this.ruleForm.post = personList[0].post
          this.ruleForm.personPostId = personList[0].post.id
        })
      }
    },
    checkPerson() {
      this.$refs.personRef.openDialog()
    },
    getWorkers(worker) {
      this.ruleForm.worker = worker
      this.worker = worker
      this.ruleForm.personId = worker.personId
      this.ruleForm.name = worker.name
      this.ruleForm.number = worker.number
      this.ruleForm.post = worker.person.post
      this.ruleForm.personPostId = worker.person.postId
    },
    checkWorker() {
      this.$refs.workerRef.openDialog()
    }
  }
}
</script>
