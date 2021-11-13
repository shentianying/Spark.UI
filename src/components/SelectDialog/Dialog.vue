<template>
  <div v-if="open" class="SelectDialog">
    <el-dialog
      title="选择分包单位"
      :destroy-on-close="true"
      :width="dialogWidth"
      :visible.sync="open"
      :append-to-body="true"
    >
      <el-row style="margin-bottom:10px;">
        <el-col :span="8">
          <i class="tips">您选择的是({{ multiple?`多选限${maxItem}`:'单选' }})：</i>
          <el-tag
            v-for="(item,index) in selectionItem"
            :key="index"
            size="medium"
            type="success"
            closable
            :disable-transitions="true"
            style="margin-right:2px;"
            @close="tagClose(item.id)"
          >{{ item.name || item }}</el-tag>
          <el-button v-if="selectionItem.length>0" type="danger" size="mini" @click="selectionItem=[]">清空</el-button>
        </el-col>
        <el-col :span="16" style="text-align:right;">
          <component
            :is="component"
            v-for="{name,label,component,props} in request.params"
            :key="name"
            v-model="postData[name]"
            v-bind="getProps(props)"
            class="selectbar__username"
            size="mini"
            maxlength="12"
            :clearable="true"
            :placeholder="label"
          />
          <el-button type="primary" :loading="saveLoading" size="mini" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <el-container>
        <el-aside v-if="showOrg" style="width:200px; height:350px;">
          <el-tree
            ref="tree"
            :data="treeList"
            :show-checkbox="false"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :check-strictly="false"
            :props="treeProps"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </el-aside>
        <el-main style="padding-top:0px;padding-right:0px;">
          <!-- <el-table
            ref="selectTable"
            v-loading="table.loading"
            :data="table.list"
            highlight-current-row
            size="mini"
            tooltip-effect="dark"
          >
            <el-table-column
              v-for="{prop,label,minWidth} in tableColumn"
              :key="prop"
              :prop="prop"
              align="center"
              :label="label"
              :min-width="minWidth"
            />
            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="scope">
                <el-tag v-if="selectionItem.find(f => f.id === scope.row.id)" type="info">已选择</el-tag>
                <el-button v-else type="primary" plain size="mini" @click="add(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <TableEx
            ref="TableEx"
            size="mini"
            :show-pagination="false"
            :show-count="false"
            :columns="tableColumn"
            :table-loading="table.loading"
            :list="table.list"
          >
            <template v-slot:actions="scope">
              <el-tag v-if="selectionItem.find(f => f.id === scope.row.id)" type="info">已选择</el-tag>
              <el-button v-else type="primary" plain size="mini" @click="add(scope.row)">选择</el-button>
            </template>
          </TableEx>
          <div style="margin-top:20px;text-align:center">
            <el-button size="mini" :disabled="(selectionItem || []).length<=0" type="danger" :loading="saveLoading" style="width:100%" @click="save">保存</el-button>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
import TableEx from '@/components/TableEx'
import { getCurrentCompanyOrgList } from '@/api/xtgl/organization'
import { getTree } from '@/utils'
/**
 * @description: 本组件提供双向绑定功能，绑定值为id 或 id数组
 * @event save 保存时触发的事件 参数为选中项(选项中包括但不限于id)
 * @function getSelection 该方法可获取所有选中项(选项中包括但不限于id)
 */
export default {
  name: 'SelectDialog',
  components: {
    TableEx
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    showOrg: { type: Boolean, default: true },
    value: { type: [Array, String, Number], default() { return [] } },
    dialogWidth: { type: String, default: '70%' }, // 弹出层的宽度
    multiple: { type: Boolean, default: false }, // 默认多选
    maxItem: { type: Number, default: 3 }, // 多选最大个数
    tableColumn: { // 表格渲染的列
      type: Array,
      default() {
        return [
          // { prop: 'number', label: '编号', minWidth: '130' },
          // { prop: 'name', label: '单位名称', minWidth: '90' },
          // { prop: 'corporation', label: '法定代表人', minWidth: '120' }
        ]
      }
    },
    // selectRules: { // multiple为true时调用multiple验证,反之single,回调参数为this
    //   type: Object,
    //   default: null
    // },
    request: { // 请求对象
      type: Object,
      default() {
        return {
          // fn: GetSubcontractorList,
          // params: [
          //   { name: 'type', label: '分包类型', component: Select, props: { propsLabel: 'name', options: (res) => res.subcontractorTypeList }},
          //   { name: 'name', label: '名称或编号', component: 'ElInput' }
          // ]
        }
      }
    }
  },
  data() {
    return {
      open: false,
      treeList: null,
      table: { // 表格数据
        list: [],
        loading: false,
        isInit: false
      },
      res: null,
      saveLoading: false,
      seleArr: [], // 选中的人员数组
      postData: {},
      treeProps: { // el-tree  props属性
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    selectionItem: {
      set(val) {
        this.seleArr = val.map(({ id }) => id)
        const data = this.multiple ? this.seleArr : this.seleArr[0]
        this.$emit('change', data)
      },
      get() {
        let data = this.seleArr
        if (!Array.isArray(this.seleArr)) {
          if (typeof this.seleArr !== 'number' && !this.seleArr) {
            data = []
          } else {
            data = [this.seleArr]
          }
        }
        data = data.map(id => this.table.list.find(f => f.id.toString() === id.toString()) || id)
        return data
      }
    }
  },
  watch: {
    'request.params': {
      handler(val) {
        val.forEach(({ name }) => {
          this.$set(this.postData, name, '')
        })
      },
      deep: true,
      immediate: true
    },
    'value': {
      immediate: true,
      deep: true,
      handler(val) {
        this.seleArr = val
      }
    }
  },
  created() {
    this.getTreeList()
    this.fetchData()
  },
  methods: {
    getProps(props) {
      const data = {}
      for (const key in props) {
        if (Object.hasOwnProperty.call(props, key)) {
          if (typeof props[key] === 'function') {
            data[key] = props[key](this.res)
          } else {
            data[key] = props[key]
          }
        }
      }
      return data
    },
    getSelection() {
      return this.selectionItem
    },
    openDialog() {
      // 清空数据
      this.table.isInit = false
      // this.selectionItem = []
      // this.table.list = []
      // this.searchText = ''
      this.fetchData()
      this.open = true
    },
    getTreeList() {
      this.saveLoading = true
      getCurrentCompanyOrgList().then(res => {
        const { data } = res
        this.treeList = getTree(0, data)
      }).finally(() => { this.saveLoading = false })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    test() { // 增加选项前检验
      const allRules = {
        single: [
          { validator: ({ selectionItem }) => selectionItem.length > 0, message: '单选只能选一个哦' }
        ],
        multiple: [
          { validator: ({ maxItem }) => maxItem < 2, message: '多选模式，maxItem参数必须大于2' },
          {
            validator: ({ selectionItem, maxItem }) => selectionItem.length >= maxItem,
            message: '多选模式，maxItem参数必须大于2'
          }
        ]
      }
      const rules = this.multiple ? allRules.multiple : allRules.single
      const errItem = rules.find(({ validator }) => validator(this))
      if (errItem) {
        this.$alert(errItem.message)
        return false
      }
      return true
    },
    add(row) {
      if (!this.test()) {
        return
      }
      this.selectionItem = [...this.selectionItem, row]
      if (this.maxItem >= this.selectionItem.length || this.multiple === false) {
        this.save()
      }
    },
    handleNodeClick(data, node) {
      this.fetchData({ orgId: data.id })
      // // 如果是叶子节点，就查找信息
      // if (node.isLeaf) {
      //   this.fetchData({ orgId: data.id })
      // } else {
      //   // this.$alert('选中的必须是最后的节点')
      // }
    },
    tagClose(uid) {
      this.selectionItem = this.selectionItem.filter(f => f.id !== uid)
    },
    fetchData(postData = {}) {
      this.request.fn(postData).then(res => {
        this.res = res
        // if (!this.table.isInit) {
        //   this.table.isInit = true
        //   this.$emit('getAllOptions', res.data)
        // }
        this.table.list = res.data
        this.saveLoading = false
      }).catch(() => { this.saveLoading = false })
    },
    search() {
      this.saveLoading = true
      setTimeout(() => {
        this.fetchData(this.postData)
      }, 700)
    },
    save() {
      this.saveLoading = true
      // 触发父组件的事件
      setTimeout(() => {
        this.$emit('save', this.multiple ? this.selectionItem : this.selectionItem[0])
        this.saveLoading = false
        this.open = false
      }, 300)
    }
  }
}
</script>
<style lang="scss" scoped>
.SelectDialog{

  /deep/.table-header {
    background-color: #fff;
    color: #909399;
  }
}
.tips{
  font-size: 12px;
}
.selectbar__username {
  width:120px;
  /deep/ .el-input__validateIcon {
    display: none;
  }
}
</style>
