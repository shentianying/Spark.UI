<template>
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    label-width="160px"
    size="mini"
  >
    <el-form-item label="将属性复制到（目的）">
      <el-tag v-for="(item,index) in nodes" :key="index">{{ item.label }}</el-tag>
    </el-form-item>
    <el-form-item label="复制此物料属性（源）">
      <org-select
        v-if="list"
        v-model="selectId"
        :show-root-node="false"
        :tree-data="list"
        :multiple="false"
      />
    </el-form-item>
    <el-form-item label="将复制以下属性">
      <el-table
        v-if="tableList.length"
        :v-loading="tableListLoading"
        :data="tableList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
      >
        <el-table-column type="index" width="30" />
        <el-table-column align="center" label="属性" width="120">
          <template slot-scope="scope">
            {{ scope.row.property.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="允许手动输入" width="60">
          <template slot-scope="scope">
            <i v-if="scope.row.canInput" class="el-icon-check" />
            <i v-else class="el-icon-close" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否 必输" width="60">
          <template slot-scope="scope">
            <i v-if="scope.row.isRequired" class="el-icon-check" />
            <i v-else class="el-icon-close" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否目标成本必输" width="60">
          <template slot-scope="scope">
            <i v-if="scope.row.isRequired" class="el-icon-check" />
            <i v-else class="el-icon-close" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="可选项">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.mcpItem" :key="index" type="primary">{{ item.name }} </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">复制属性</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllMaterialCategory, copyMaterialCategoryProperty, getMaterialCategoryPropertyByCategoryId } from '@/api/cggl/material'
import { getTree } from '@/utils/index'
import OrgSelect from '@/components/OrgSelect/index'
export default {
  name: 'CopyTo',
  components: {
    OrgSelect
  },
  props: {
    obj: {
      type: Object,
      default: null
    },
    pid: {
      type: Number,
      default: 0
    },
    nodes: {
      type: Array,
      default: null
    }

  },
  data() {
    return {
      ruleForm: {
        pid: 0
      },
      selectId: 0,
      list: null,
      msg: '',
      confirmStyle: '',
      tableData: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableList: [],
      tableListLoading: false,
      buttonLoading: false
      // rules: {
      //   name: [{ required: true, message: '请输入', trigger: 'blur' }],
      //   sort: [{ required: true, message: '请输入', trigger: 'blur' }]
      // }
    }
  },
  watch: {
    selectId(val) {
      if (!val) {
        this.tableList = []
        return
      }
      var selectRow = this.tableData.find(f => f.id === val)
      this.msg = this.getMsg(val)
      // this.currentRow = null
      if (selectRow.level === 3) {
        this.getProperty(val)
      } else {
        this.tableList = []
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 找到 选中分类的 row 数据
          var selectRow = this.tableData.find(f => f.id === this.selectId)
          // 判断是否已选择
          if (!selectRow) {
            this.$message.info('请选择复制源')
            return
          }
          // 判断层级 如果是3级就允许选择
          if (selectRow.level !== 3) {
            this.$message.info('请选择3级目录')
            return
          }

          this.$confirm(this.msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: this.confirmStyle,
            type: 'warning'
          }).then(() => {
            // 要复制到目标分类ids
            var tid = this.nodes.map(m => { return m.id }).join()

            this.buttonLoading = true
            // source id 源, target id
            var postData = { sid: this.selectId, tid: tid }

            copyMaterialCategoryProperty(postData).then(response => {
              this.$message(response.message)
              this.buttonLoading = false
              this.$emit('addItemclose')
            }).catch(() => { this.buttonLoading = false })
          }).catch(() => {
            this.$message.info('已取消')
          })
        }
      })
    },
    getMsg(id) {
      var selectRow = this.tableData.find(f => f.id === id)
      var nodesLabel = this.nodes.map(m => { return m.label }).join('、')
      if (this.nodes.length > 10) { this.confirmStyle = 'confirmStyle' }
      return `确定复制【${selectRow.label}】的属性到 【${nodesLabel}】？`
    },
    getProperty(categoryId) {
      this.tableListLoading = true
      getMaterialCategoryPropertyByCategoryId({ categoryId: categoryId }).then(response => {
        this.tableList = response.data
        this.tableListLoading = false
      }).catch(() => { this.tableListLoading = false })
    },
    initData() {
      getAllMaterialCategory().then(response => {
        const { data } = response
        this.tableData = data
        data.forEach(element => {
          element.pid = element.pId
          element.label = element.number + ' ' + element.name
          delete element.pId
        })
        this.list = getTree(0, response.data)
      })
    }
  }
}
</script>
<style>
.confirmStyle{
  width: 70vw;
}
</style>
