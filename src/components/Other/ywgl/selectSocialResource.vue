<template>

  <!--选择社会资源-->
  <div v-if="open">
    <el-dialog
      title="选择人员"
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
          <el-input
            v-for="{name,label} in request.params"
            :key="name"
            v-model="postData[name]"
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
        <!-- <el-aside style="width:200px; height:350px;">
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
        </el-aside> -->
        <el-main style="padding-top:0px;padding-right:0px;">
          <el-table
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
          </el-table>
          <div style="margin-top:20px;text-align:center">
            <el-button size="mini" :disabled="(selectionItem || []).length<=0" type="danger" :loading="saveLoading" style="width:100%" @click="save">保存</el-button>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
// import { getCurrentCompanyOrgList } from '@/api/xtgl/organization'
import { GetSocialResourceList } from '@/api/ywgl/socialResource'
// import { getTree } from '@/utils'

/**
 * @description: 本组件提供双向绑定功能，绑定值为id 或 id数组
 * @event getCheckedItem 保存时触发的事件 参数为选中项(选项中包括但不限于id)
 * @event getAllOptions  初始化列表时触发,获取所有选项(选项中包括但不限于id)
 * @function getSelection 该方法可获取所有选中项(选项中包括但不限于id)
 */
export default {
  name: 'SelectSocialResource',
  components: {
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    value: { type: [Array, String, Number], default() { return [] } },
    dialogWidth: { type: String, default: '70%' }, // 弹出层的宽度
    multiple: { type: Boolean, default: true }, // 默认多选
    maxItem: { type: Number, default: 3 }, // 多选最大个数
    tableColumn: { // 表格渲染的列
      type: Array,
      default() {
        return [
          { prop: 'name', label: '姓名', minWidth: '90' },
          { prop: 'company', label: '所在单位', minWidth: '120' },
          { prop: 'position', label: '职位', minWidth: '90' }
        ]
      }
    },
    selectRules: { // multiple为true时调用multiple验证,反之single,回调参数为this
      type: Object,
      default() {
        return {
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
      }
    },
    request: { // 请求对象
      type: Object,
      default() {
        return {
          fn: GetSocialResourceList,
          params: [
            { name: 'name', label: '姓名', component: 'ElInput' },
            { name: 'company', label: '所在单位', component: 'ElInput' },
            { name: 'position', label: '职位', component: 'ElInput' }
          ]
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
    this.fetchData()
  },
  methods: {
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
    // getTreeList() {
    //   this.saveLoading = true
    //   getCurrentCompanyOrgList().then(res => {
    //     const { data } = res
    //     this.treeList = getTree(0, data)
    //   }).finally(() => { this.saveLoading = false })
    // },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    test() { // 增加选项前检验
      const rules = this.multiple ? this.selectRules.multiple : this.selectRules.single
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
      this.save()
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
        if (!this.table.isInit) {
          this.table.isInit = true
          this.$emit('getAllOptions', res.data)
        }
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
        this.$emit('getCheckedItem', this.selectionItem)
        this.saveLoading = false
        this.open = false
      }, 300)
    }
  }
}
</script>
<style lang="scss" scoped>
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
