<template>
  <!--选择客户（业务管理）-->
  <div v-if="open">
    <el-dialog
      title="选择客户信息"
      :destroy-on-close="true"
      :width="dialogWidth"
      :visible.sync="open"
    >
      <el-row style="margin-bottom:10px;">
        <el-col :span="18">
          <i class="tips">您选择的是({{ getStr }})：</i>
          <el-tag
            v-for="(item,index) in selectionItem"
            :key="index"
            size="medium"
            type="success"
            closable
            :disable-transitions="true"
            style="margin-right:2px;"
            @close="tagClose(item.id)"
          >{{ item.name }}</el-tag>
          <el-button v-if="selectionItem.length>0" type="danger" size="mini" @click="selectionItem=[]">清空</el-button>
        </el-col>
        <el-col :span="24" style="text-align:right;">
          <el-input
            v-model="searchText"
            style=" width:120px;"
            size="mini"
            maxlength="12"
            :clearable="true"
            placeholder="名称"
          />
          <el-button type="primary" :loading="buttonLoading" size="mini" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <el-container>
        <el-main style="padding-top:0px;padding-right:0px;">
          <el-table
            ref="selectTable"
            v-loading="tableLoading"
            :data="tableList"
            highlight-current-row
            size="mini"
            tooltip-effect="dark"
          >
            <el-table-column align="center" label="编号" width="50">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="客户名称" min-width="50">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="法定代表人" min-width="50">
              <template slot-scope="scope">
                {{ scope.row.legalPerson }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="联系人" min-width="50">
              <template slot-scope="scope">
                {{ scope.row.linkMan }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="scope">
                <el-tag v-if="selectionItem.find(f => f.id === scope.row.id)" type="info">已选择</el-tag>
                <el-button v-else type="primary" plain size="mini" @click="add(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="text-align:center;margin:10px 0;">
            <el-pagination
              background
              :hide-on-single-page="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              @current-change="fetchData"
              @size-change="sizeChange"
            />
          </div>
          <div style="margin-top:20px;text-align:center">
            <el-button type="danger" :loading="buttonLoading" style="width:100%" @click="save">保存</el-button>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomerPaging } from '@/api/ywgl/customer'

export default {
  name: 'SelectCustomer',
  components: {
  },
  props: {
    dialogWidth: { type: String, default: '70%' }, // 弹出层的宽度
    multiple: { type: Boolean, default: true }, // 默认多选
    maxItem: { type: Number, default: 3 } // 多选最大个数
  },
  data() {
    return {
      open: false,
      tableList: null,
      tableLoading: null,
      buttonLoading: false,
      selectionItem: [], // 选中的人员数组
      searchText: '',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    getStr() {
      if (this.multiple) {
        return '多选限' + this.maxItem
      } else { return '单选' }
    }
  },
  created() {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    openDialog() {
      // 清空数据
      this.selectionItem = []
      // this.tableList = []
      this.searchText = ''
      this.open = true
    },
    fetchData() {
      const postData = {}
      postData.name = this.searchText
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      getCustomerPaging(postData).then(res => {
        this.tableList = res.data
        this.total = res.count
        this.buttonLoading = false
      }).catch(() => { this.buttonLoading = false })
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    add(row) {
      if (!this.selectionItem) {
        this.selectionItem.push(row)
      } else {
        // 单选模式，判断提示不能 多选
        if (!this.multiple) {
          if (this.selectionItem.length > 0) {
            this.$alert('单选只能选一个哦')
            return
          }
        } else {
          if (this.maxItem < 2) {
            this.$alert(`多选模式，maxItem参数必须大于2`)
            return
          }
          if (this.selectionItem.length >= this.maxItem) {
            this.$alert(`多选最多只能选${this.maxItem}个哦`)
            return
          }
        }
        const isRepeat = this.selectionItem.find(f => f.id === row.id)
        if (isRepeat) {
          this.$alert('不能重复添加！')
        } else { this.selectionItem.push(row) }
      }
    },
    tagClose(uid) {
      this.selectionItem = this.selectionItem.filter(f => f.id !== uid)
    },
    search() {
      this.fetchData()
    },
    save() {
      this.buttonLoading = true
      // 触发父组件的事件
      setTimeout(() => {
        this.$emit('getCustomer', this.selectionItem)
        this.buttonLoading = false
        this.open = false
      }, 700)
    }
  }
}
</script>
<style scoped>
.tips{
  font-size: 12px;
}
</style>
