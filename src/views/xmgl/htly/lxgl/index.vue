<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <org-select2
          v-if="orgList"
          v-model="search.orgIds"
          :data-mode="0"
          size="mini"
          :collapse-tags="false"
          :show-all-levels="false"
          :multiple="true"
          :check-strictly="false"
          :options="orgList"
          placeholder="选择组织机构"
          select-style="min-width:100px;margin-bottom:10px;"
        />
        <el-input v-model="search.number" size="mini" clearable maxlength="20" placeholder="编号" style="width:120px;margin-bottom:10px;" />
        <el-input v-model="search.name" placeholder="名称" size="mini" clearable maxlength="11" style="width:120px;" />
        <el-select
          v-if="(formState||[]).length"
          v-model="search.states"
          collapse-tags
          multiple
          clearable
          style="width:150px;;margin-bottom:10px;"
          size="mini"
          placeholder="状态"
        >
          <el-option v-for="(item,index) in formState" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="goSearch">搜索</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">待审批</el-radio-button>
          <el-radio-button :label="1">列表</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        size="mini"
        tooltip-effect="light"
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column align="center" label="编号" :show-overflow-tooltip="true" width="130">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="地区" min-width="10" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.organization.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目名称" min-width="10" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.project.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="10">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="待处理人" min-width="10" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ getPerson(scope.row.billFlow.billFlowNode) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="制单人" min-width="10">
          <template slot-scope="scope">
            <el-tooltip placement="top" :enterable="false" effect="light">
              <div slot="content">
                制单人：{{ scope.row.createUserName }} 制单时间：{{ scope.row.createDate }}<br>
                更新人：{{ scope.row.lastEditUserName }} 更新时间：{{ scope.row.lastEditDate }}
              </div>
              <span>{{ scope.row.createUserName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip content="审批" effect="light" placement="left-start" :enterable="false">
              <el-button v-if="tabPosition === 0" v-has="'PROJECTLX_ATTITUDE'" size="mini" class="el-icon-edit" plain circle @click="attitude(scope.row)" />
            </el-tooltip>
            <el-tooltip content="查看" effect="light" placement="left-start" :enterable="false">
              <el-button v-if="tabPosition === 1" v-has="'PROJECTLX_DETAIL'" size="mini" class="el-icon-view" plain circle @click="handleDetail(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="text-align:center;margin:10px 0;">
      <el-pagination
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="fetchData"
        @size-change="sizeChange"
      />
    </div>

  </div>
</template>

<script>
import { getProjectLXPaging } from '@/api/xmgl/project'
import OrgSelect2 from '@/components/OrgSelect/index2'
export default {
  name: 'ProjectLX',
  components: {
    OrgSelect2
  },
  data() {
    return {
      list: [],
      listLoading: false,

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      search: {
        name: '',
        orgIds: [],
        number: '',
        states: [],
        type: 0
      },
      tabPosition: 0,
      orgList: null,
      formState: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData = this.search
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.name = this.searchText
      getProjectLXPaging(postData).then(response => {
        const { data, count, orgList } = response
        this.orgList = orgList
        this.list = data
        this.total = count
        this.listLoading = false
      })
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    radioChange(value) {
      // 清空和切换条件
      this.search = {
        orgIds: [],
        name: '',
        number: '',
        states: [],
        type: value
      }
      // 填充数据
      this.fetchData()
    },
    getFormState(row) {
      if (!row.billFlow) { return '流程空' }
      const formState = row.billFlow.form.formState
      this.formState = formState
      const state = row.state
      if (state === -1) return '作废'
      const obj = formState.find(f => f.value === state)
      if (obj) { return obj.name } else { return '状态不详' }
    },
    getPerson(bfn) {
      if (bfn) {
        var arr = bfn.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    attitude(row) {
      this.$router.push({ name: 'ProjectLXAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    handleDetail(row) {
      this.$router.push({ name: 'ProjectLXDetail', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    goSearch() {
      this.fetchData()
    }
  }
}
</script>
