<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class=""
    size="mini"
  >
    <el-form-item label="所属上级菜单" prop="pid">
      <!-- {{ ruleForm.pid }} -->
      <!-- <org-select2
        v-if="isLoad"
        v-model="ruleForm.id"
        size="mini"
        :collapse-tags="false"
        :show-all-levels="true"
        :multiple="false"
        placeholder="请选择菜单(不选择，就是根目录)"
        props-label="routerTitle"
        :options="treeList"
        :select-data="ruleForm.id"
        :check-strictly="true"
      /> -->
      <treeselect v-model="ruleForm.pid" placeholder="请选择" :multiple="false" :default-expand-level="1" :flat="true" :options="treeList" />
    </el-form-item>
    <el-form-item label="路由标题" prop="routerTitle">
      <el-input v-model="ruleForm.routerTitle" :clearable="true" size="mini" placeholder="左边菜单名称" maxlength="25" />
    </el-form-item>
    <el-form-item label="路由名称" prop="routerName">
      <el-input v-model="ruleForm.routerName" :clearable="true" placeholder="例：”Organization“。 这个名称一定要和页面中name属性一致，否则不缓存" size="mini" maxlength="50" />
    </el-form-item>
    <el-form-item label="路由路径地址" prop="routerPath">
      <el-input v-model="ruleForm.routerPath" :clearable="true" placeholder="浏览器地址栏显示的地址如显示：/organization/index" size="mini" maxlength="100" />
    </el-form-item>
    <el-form-item label="路由组件名" prop="routerComponent">
      <el-input v-model="ruleForm.routerComponent" :clearable="true" style="width:330px" placeholder="物理地址：/organization/index 父节点填：Layout" size="mini" maxlength="100" />
      <el-link @click="ruleForm.routerComponent = 'Layout'">点击输入Layout</el-link>
    </el-form-item>
    <el-form-item label="路由重定向地址" prop="routerRedirect">
      <el-input v-model="ruleForm.routerRedirect" :clearable="true" style="width:330px" placeholder="根目录默认值noRedirect, 没有为空" size="mini" maxlength="100" />
      <el-link @click="ruleForm.routerRedirect = 'noRedirect'">点击输入noRedirect</el-link>
    </el-form-item>
    <el-form-item label="路由图标" prop="routerIcon">
      <svg-icon :icon-class="ruleForm.routerIcon" />
      <el-select v-model="ruleForm.routerIcon" size="mini" placeholder="请选择" style="width:220px;">
        <el-option v-for="item in svgIcons" :key="item" :label="item" :value="item">
          <span style="float: left">
            <svg-icon :icon-class="item" />
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="排序号" prop="sort">
      <el-input-number v-model="ruleForm.sort" size="mini" :min="1" :max="1000" />
      <!-- <el-input v-model.number="ruleForm.sort" :clearable="true" size="mini" maxlength="5" /> -->
    </el-form-item>
    <el-form-item label="是否显示" prop="routerHidden">
      <el-switch
        v-model="ruleForm.routerHidden"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-value="false"
        inactive-value="true"
      />
      <el-tooltip class="item" effect="dark" content="能通过地址栏进入，不能在左边菜单栏点击（隐藏了）" placement="top-start">
        <i class="el-icon-question" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="是否页面">
      <el-switch
        v-model="ruleForm.isPage"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
      <el-tooltip class="item" effect="dark" content="如果是页面，就加载该路由，菜单栏末级子菜单，就是页面" placement="top-start">
        <i class="el-icon-question" />
      </el-tooltip>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { GetAllList, add, update } from '@/api/xtgl/page'
import { getTree } from '@/utils/index'
// import OrgSelect2 from '@/components/OrgSelect/index2'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import svgIcons from '@/utils/svg-icons'
export default {
  name: 'AddPage',
  components: {
    // OrgSelect2
    Treeselect
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
        sort: 1,
        routerName: '',
        routerRedirect: 'noRedirect',
        routerPath: '',
        routerComponent: 'Layout',
        routerIcon: '',
        routerTitle: '',
        routerHidden: 'false', // 默认显示
        isPage: true
      },
      svgIcons,
      treeList: null,
      buttonLoading: false,
      isLoad: false,
      rules: {
        routerTitle: [{ required: true, message: '必填', trigger: 'blur' }]
        // routerName: [{ required: true, message: '必填', trigger: 'blur' }],
        // routerPath: [{ required: true, message: '必填', trigger: 'blur' }],
        // routerComponent: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // getPid() {
    //   return this.ruleForm.pid
    // }
  },
  watch: {
    'ruleForm.pid'(newValue, oldValue) {
      // 如果是添加有页面，就监控
      if (!this.obj) {
        if (newValue === 0) {
          this.ruleForm.routerRedirect = 'noRedirect'
          this.ruleForm.routerComponent = 'Layout'
        } else {
          this.ruleForm.routerRedirect = ''
          this.ruleForm.routerComponent = ''
        }
      }
    }
  },
  mounted() {
    this.initData()
    this.initTree()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newObj = JSON.parse(JSON.stringify(this.ruleForm))
          newObj.routerHidden = newObj.routerHidden === 'true'
          // newObj.isPage = newObj.isPage === 'true'
          this.buttonLoading = true
          if (this.obj) {
            newObj.id = this.obj.id
            update(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = true
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            add(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = true
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    initData() {
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        newObj.routerHidden = newObj.routerHidden ? 'true' : 'false'
        this.ruleForm = newObj
        // console.log('传过来的数据：', newObj)
      }
    },
    initTree() {
      this.listLoading = true
      GetAllList().then(response => {
        response.data.forEach(ele => {
          ele.label = ele.routerTitle
        })
        // this.treeList = response.data
        this.isLoad = true
        // console.log('树形结构：', this.treeList)
        const result = getTree(0, response.data)
        this.treeList = [{ id: 0, pid: 0, label: '一级根目录', children: result }]
        this.listLoading = false
      })
    }
  }
}
</script>
