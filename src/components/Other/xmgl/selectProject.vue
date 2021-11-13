<template>
  <!--选择项目信息（项目管理）-->
  <div>
    <el-dialog
      title="选择项目"
      :destroy-on-close="true"
      :width="dialogWidth"
      :visible.sync="open"
    >
      <el-row style="margin-bottom:10px;">
        <el-col :span="24">
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
      </el-row>
      <el-row style="margin-bottom:10px;">
        <el-col :span="24" style="text-align:right;">
          <org-select2
            v-if="orgList && orgList.length"
            :key="keyOrg"
            v-model="searchOrg"
            :select-data="searchOrg"
            :data-mode="0"
            size="mini"
            :collapse-tags="false"
            :show-all-levels="true"
            :multiple="false"
            :filterable="true"
            :check-strictly="true"
            :options="orgList"
            select-style="width:200px;"
          />
          <el-input
            v-model="searchText"
            style=" width:120px;"
            size="mini"
            maxlength="12"
            :clearable="true"
            placeholder="名称"
          />
          <el-button type="primary" icon="el-icon-search" :loading="buttonLoading" size="mini" @click="search">搜索</el-button>
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
            <el-table-column align="center" label="编号" min-width="50">
              <template slot-scope="scope">
                {{ scope.row.number }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="组织机构" min-width="50">
              <template slot-scope="scope">
                {{ scope.row.orgStr }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="工程名称" min-width="50">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="项目状态" min-width="50">
              <template slot-scope="scope">
                <span v-if="projectStateList && scope.row.projectState != null">{{ projectStateList.find(f => f.value == scope.row.projectState).name }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="scope">
                <el-tag v-if="selectionItem.find(f => f.id === scope.row.id)" type="info">已选择</el-tag>
                <el-button v-else type="primary" plain size="mini" @click="add(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:20px;text-align:center">
            <el-button type="danger" :loading="buttonLoading" style="width:100%" @click="save">保存</el-button>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
import { getOrgWithProject } from '@/api/xtgl/organization'
import { getProjectList } from '@/api/xmgl/project'
import OrgSelect2 from '@/components/OrgSelect/index2'

export default {
  name: 'SelectProject',
  components: {
    OrgSelect2
  },
  props: {
    dialogWidth: { type: String, default: '70%' }, // 弹出层的宽度
    multiple: { type: Boolean, default: true }, // 默认多选
    maxItem: { type: Number, default: 3 }, // 多选最大个数
    projectState: { type: [Array, Number], default() { return [] } }, // 项目状态
    isShow: { type: Number, default: 1 }, // 是否立项（1：表示只选已立项，0:只选未立项,null都选择）
    fields: { type: String, default: '' }, // 需要带出的参数 （eg:ContractDuration,Area），不写返回id,name,number,orgid,companyId,projectState,orgStr,仅限返回project里字段
    orgId: { type: Number, default: null }, // 组织机构
    isAuth: { type: Boolean, default: false } // 是否只显示当前用户数据范围内的数据
  },
  data() {
    return {
      open: false,
      tableList: null,
      projectStateList: null,
      tableLoading: null,
      buttonLoading: false,
      selectionItem: [], // 选中的项目数组
      searchText: '',
      searchOrg: 0,
      orgList: [],
      keyOrg: 0,
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
  methods: {
    openDialog() {
      // 清空数据
      // this.tableList = []
      this.searchOrg = this.orgId
      // console.log('1fetchData', this.searchOrg)
      this.searchText = ''
      this.fetchData()
      this.keyOrg += 1
      this.open = true
    },
    fetchData() {
      this.buttonLoading = true
      // console.log('2fetchData', this.searchOrg)
      getOrgWithProject().then(res => {
        const { data } = res
        this.orgList = data
        // console.log('3fetchData', this.searchOrg)
        this.getProjectList()
        this.buttonLoading = false
      }).catch(() => { this.buttonLoading = false })
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
    getProjectList() {
      const postData = {}
      postData.name = this.searchText
      postData.orgId = this.searchOrg
      postData.isShow = this.isShow
      postData.isAuth = this.isAuth
      postData.fields = this.fields
      postData.stateIds = []
      if (typeof this.projectState === 'number') {
        postData.stateIds = [this.projectState]
      } else if (this.projectState instanceof Array) {
        postData.stateIds = this.projectState
      }
      // console.log('这里', postData, this.projectState, this.projectState instanceof Number)
      getProjectList(postData).then(res => {
        this.projectStateList = res.projectStateList
        this.tableList = res.data
        this.buttonLoading = false
      }).catch(() => { this.buttonLoading = false })
    },
    search() {
      this.buttonLoading = true
      setTimeout(() => {
        this.getProjectList()
      }, 700)
    },
    save() {
      this.buttonLoading = true
      // 触发父组件的事件
      setTimeout(() => {
        this.$emit('getProject', this.selectionItem)
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
