<template>
  <div class="app-container">
    <div style="padding-bottom:10px;">
      <el-button v-has="'CATEGORY_ADD'" type="primary" size="mini" @click="addCategory">添加类别</el-button>
      <el-button v-has="'PROPERTY_ADD'" type="primary" size="mini" @click="addPro">批量添加属性</el-button>
      <el-button v-has="'MATERIAL_COPY'" type="primary" size="mini" @click="copyTo">批量复制属性</el-button>
    </div>
    <el-container style="height:calc(100vh - 162px);">
      <el-aside width="500px">
        <el-alert
          title="物料类别"
          type="success"
          :closable="false"
        />
        <el-input
          v-model="filterText"
          size="mini"
          placeholder="输入关键字进行查找"
        />
        <el-tree
          ref="tree"
          :data="list"
          show-checkbox
          node-key="id"
          :filter-node-method="filterNode"
          highlight-current
          :expand-on-click-node="false"
          :props="defaultProps"
          :default-expanded-keys="expandIds"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span style="width:200px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis" :title="node.label">{{ data.label }}</span>
            <span v-if="data.level===3" style="width:80px;">{{ data.unit }}</span>
            <span v-if="data.level===3" style="width:14px;"><i v-if="data.isMain" class="el-icon-check" />
              <i v-else class="el-icon-close" /></span>
            <span>
              <el-button-group>
                <el-button v-has="'MATERIAL_EDIT'" type="text" size="mini" icon="el-icon-edit" style="padding:6px;" title="编辑" @click.stop="() => update(data)" />
                <el-button v-has="'CATEGORY_DELETE'" type="text" icon="el-icon-delete" size="mini" style="padding:6px;" title="删除" @click.stop="() => remove(node, data)" />
              </el-button-group>
            </span>
          </span>
        </el-tree>
      </el-aside>

      <el-main style="padding-top:0px;">
        <el-alert
          :title="'物料属性 '+ (currentCategory?currentCategory.label:'')"
          type="success"
          :closable="false"
        />
        <el-table
          :v-loading="tableListLoading"
          :data="tableList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column type="index" width="30" />
          <el-table-column align="center" label="属性" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.property.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="允许手动输入" width="70">
            <template slot-scope="scope">
              <i v-if="scope.row.canInput" class="el-icon-check" />
              <i v-else class="el-icon-close" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否必输" width="70">
            <template slot-scope="scope">
              <i v-if="scope.row.isRequired" class="el-icon-check" />
              <i v-else class="el-icon-close" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否目标成本必输" width="70">
            <template slot-scope="scope">
              <i v-if="scope.row.isTargetRequired" class="el-icon-check" />
              <i v-else class="el-icon-close" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="可选项" min-width="150">
            <template slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.mcpItem" :key="index" type="primary">{{ item.name }} </el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="75">
            <template slot-scope="scope">
              <el-button-group>
                <!-- <el-button type="primary" size="mini" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="handleEdit1(scope.row)" /> -->
                <el-button v-has="'PROPERTYITEM_EDIT'" type="primary" plain size="mini" icon="el-icon-edit" style="padding:6px;" title="编辑" @click="handleEdit(scope.row)" />
                <el-button v-has="'PROPERTY_DELETE'" type="primary" plain icon="el-icon-delete" size="mini" style="padding:6px;" title="删除" :disabled="scope.row.property.isRequired" @click="handleDel(scope.row)" />
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-container>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :visible.sync="dialogTableVisible"
        width="70%"
      >
        <component :is="comName" :obj="currentRow" :nodes="checkedNodes" :pid="pid" @addItemclose="addItemClose" @addCategoryClose="addCategoryClose" @addProClose="addProClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllMaterialCategory, deleteMaterialCategory, getMaterialCategoryPropertyByCategoryId, DeleteMaterialCategoryProperty } from '@/api/cggl/material'
import AddMaterial from './components/addMaterial'
import AddMCPItem from './components/addMCPItem'
import AddRangeMCP from './components/addRangeMCP'
import CopyTo from './components/copyTo'
import AddMaterialCategoryProperty from './components/addMaterialCategoryProperty'
import { getTree } from '@/utils/index'

export default {
  name: 'MaterialCategory',
  components: {
    AddMaterial,
    AddMaterialCategoryProperty,
    AddMCPItem,
    AddRangeMCP,
    CopyTo
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',

      tableList: [],
      tableListLoading: false,

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

      currentRow: null,
      // currentCategoryName: '',
      currentCategory: null,
      checkedNodes: [],
      comName: 'AddMaterial',
      pid: 0,
      buttonLoading: false,

      expandIds: [],

      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      companyId: this.$store.state.user.selectOrgId
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      getAllMaterialCategory().then(response => {
        response.data.forEach(element => {
          element.pid = element.pId
          element.label = element.number + ' ' + element.name
          delete element.pId
        })
        this.list = getTree(0, response.data)
      })
    },
    addCategoryClose(pid) {
      this.expandIds = [pid]
      this.dialogTableVisible = false
      this.getCategory()
    },
    addItemClose() {
      this.dialogTableVisible = false
      if (this.currentRow) { this.getProperty(this.currentRow.categoryId) }
      // this.getProperty(this.currentCategory.categoryId)
    },
    addProClose() {
      this.dialogTableVisible = false
      if (this.currentCategory) { this.getProperty(this.currentCategory.id) }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    addCategory() {
      this.dialogTitle = '添加类别'
      this.currentRow = null
      this.pid = 0
      this.comName = 'AddMaterial'
      this.dialogTableVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑属性 - ' + this.currentCategory.label
      this.currentRow = row
      this.comName = 'AddMCPItem'
      this.dialogTableVisible = true
    },
    remove(node, data) {
      // console.log('node:', node)
      // console.log('data:', data)
      if (node.childNodes.length) {
        this.$message.warning('请先删除下级类别')
        return
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMaterialCategory({ id: data.id }).then(response => {
          this.getCategory()
          this.$message(response.message)
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    update(data) {
      this.dialogTitle = '类别名称修改'
      this.comName = 'AddMaterial'
      this.currentRow = data
      this.dialogTableVisible = true
    },
    handleNodeClick(data, node) {
      // console.log('node节点信息:', node)
      this.currentRow = null
      if (node.level === 3) {
        this.currentCategory = data
        this.getProperty(data.id)
        this.currentRow = data
      } else {
        // this.$message('必须是三级目录')
        this.currentCategory = null
        this.tableList = []
      }
    },
    getProperty(categoryId) {
      this.tableListLoading = true
      getMaterialCategoryPropertyByCategoryId({ categoryId: categoryId }).then(response => {
        this.tableList = response.data
        this.tableListLoading = false
      }).catch(() => { this.tableListLoading = false })
    },
    AddPropertyforCategory() {
      if (this.currentRow === null) {
        this.$message.warning('请选中')
        return false
      }
      this.comName = 'AddMaterialCategoryProperty'
      this.dialogTableVisible = true
    },
    handleDel(row) {
      this.$confirm('是否确定删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteMaterialCategoryProperty({ id: row.id }).then(response => {
          this.getProperty(row.categoryId)
          this.$message.success(response.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    addPro() {
      // 获取所有子节点
      var nodes = this.$refs.tree.getCheckedNodes(true, false)
      if (!nodes.length) {
        this.$message.warning('请选择节点，可多选')
        return false
      }
      this.dialogTitle = '批量添加属性'
      this.checkedNodes = nodes
      this.comName = 'AddRangeMCP'
      this.dialogTableVisible = true
    },
    copyTo() {
      // 获取所有子节点
      var nodes = this.$refs.tree.getCheckedNodes(true, false)
      if (!nodes.length) {
        this.$message.warning('请选择要复制的节点，可多选')
        return false
      }
      this.dialogTitle = '批量复制属性'
      this.checkedNodes = nodes
      this.comName = 'CopyTo'
      this.dialogTableVisible = true
    }
  }
}
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
