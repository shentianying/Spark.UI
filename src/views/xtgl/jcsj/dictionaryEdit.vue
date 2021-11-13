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
    <el-form-item label="所属公司" prop="companyId">
      <el-select v-model="ruleForm.companyId" size="mini" placeholder="请选择">
        <el-option v-for="(item,index) in userOrg" :key="index" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>

    <el-form-item label="类型" prop="type">
      <el-select v-model="ruleForm.type" filterable size="mini" placeholder="请选择" style="width:280px;" @change="fill">
        <el-option v-for="(item,index) in typeList" :key="index" :label="item.type+'  '+(item.typeName || '')" :value="item.type">
          <span style="float: left">{{ item.type }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.typeName }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="dialogTableVisible = true">添加类型</el-button>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="dialogTableVisible2 = true">修改类型</el-button>
    </el-form-item>
    <el-form-item label="上级目录" prop="pId">
      <treeselect v-model="ruleForm.pId" placeholder="请选择" :multiple="false" :default-expand-level="1" :flat="true" :options="treeList">
        <label slot="option-label" slot-scope="{ node }">
          {{ node.label }}{{ node.raw.remark?'--------['+node.raw.type+']':'' }}
        </label>
      </treeselect>
    </el-form-item>

    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" size="mini" maxlength="40" />
    </el-form-item>
    <el-form-item label="值" prop="value">
      <el-input-number v-model="ruleForm.value" size="mini" :min="-2" :max="999" />
    </el-form-item>

    <el-form-item label="排序" prop="sort">
      <el-input-number v-model="ruleForm.sort" size="mini" :min="1" :max="999" />
    </el-form-item>
    <el-form-item label="是否使用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="ruleForm.remark" size="mini" maxlength="80" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <!-- <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button> -->
    </el-form-item>

    <div v-if="dialogTableVisible">
      <el-dialog
        title="添加类型"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        append-to-body
      >
        <el-form>
          <el-form-item label="类型" label-width="120px">
            <el-input v-model="newType" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label="类型名称" label-width="120px">
            <el-input v-model="newTypeName" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label-width="120px">
            <el-button type="primary" size="mini" @click="addType">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <div v-if="dialogTableVisible2">
      <el-dialog
        title="修改类型"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible2"
        append-to-body
      >
        <el-form>
          <el-form-item label="类型" label-width="120px">
            <el-input v-model="ruleForm.type" size="mini" disabled maxlength="50" />
          </el-form-item>
          <el-form-item label="类型名称" label-width="120px">
            <el-input v-model="ruleForm.typeName" size="mini" maxlength="50" />
          </el-form-item>
          <el-form-item label-width="120px">
            <el-button type="primary" size="mini" @click="updateType">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </el-form>
</template>

<script>
import { initDictionary, putDictionary, putDictionaryTypeName, addDictionary } from '@/api/xtgl/dictionary'
import { getTree } from '@/utils/index'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'DictionaryEdit',
  components: {
    Treeselect
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    postTypeList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      ruleForm: {
        pId: 0,
        sort: 1,
        name: '',
        value: 0,
        type: '',
        typeName: '',
        remark: '',
        companyId: null,
        inUse: true
      },
      // zero: 0,
      userOrg: [],
      treeList: [], // 转化成树形的数据列表
      typeList: [], // 类型下拉数据列表
      sourceData: [], // 没有格式化的数据列表
      newType: '',
      newTypeName: '',
      dialogTableVisible: false,
      dialogTableVisible2: false,
      buttonLoading: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        pId: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {

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
          newObj.companyId = Number(newObj.companyId)
          delete newObj.companyName
          this.buttonLoading = true
          if (this.obj) {
            newObj.id = this.obj.id
            putDictionary(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          } else {
            addDictionary(newObj).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('dialogClose')
            }).catch(() => { this.buttonLoading = false })
          }
        }
      })
    },
    initData() {
      this.typeList = this.postTypeList
      // console.log('this.typeList', this.typeList)
      // console.log('this.obj：', this.obj)
      if (this.obj) {
        var newObj = JSON.parse(JSON.stringify(this.obj))
        newObj.companyId = Number(newObj.companyId)
        this.ruleForm = newObj
      }
    },
    async initTree() {
      this.buttonLoading = true
      await initDictionary().then(response => {
        const { data1, data2 } = response
        data1.forEach(ele => {
          ele.label = ele.name
          ele.pid = ele.pId
          delete ele.pId
        })
        this.sourceData = data1
        this.fill(data1)

        // 绑定公司列表
        var arr2 = []
        arr2.push({ name: '公用', id: 0 })
        data2.forEach(e => {
          arr2.push({ name: e.name, id: e.id })
        })
        this.userOrg = arr2
        this.buttonLoading = false
      })
    },
    fill() {
      const filterData = this.sourceData.filter(f => f.type === this.ruleForm.type)
      if (filterData.length) {
        this.typeName = filterData.typeName
        const result = getTree(0, filterData)
        this.treeList = [{ id: 0, pid: 0, label: '根目录', remark: '', children: result }]
      } else { this.treeList = [{ id: 0, pid: 0, label: '根目录' }] }
    },
    addType() {
      this.typeList.unshift(this.newType) // 添加下拉列表框的类型
      this.ruleForm.type = this.newType //  默认添加的项目被选中
      this.ruleForm.typeName = this.newTypeName
      this.dialogTableVisible = false
      this.fill()
    },
    updateType() {
      this.buttonLoading = true
      putDictionaryTypeName({ type: this.ruleForm.type, typeName: this.ruleForm.typeName }).then(res => {
        this.$message(res.message)
        this.buttonLoading = false

        this.typeList.forEach(e => {
          if (e.type === this.ruleForm.type) {
            e.typeName = this.ruleForm.typeName
          }
        })
        this.sourceData.forEach(e => {
          if (e.type === this.ruleForm.type) {
            e.typeName = this.ruleForm.typeName
          }
        })
        this.dialogTableVisible2 = false
      }).catch(() => { this.buttonLoading = false })
    }
  }
}
</script>
