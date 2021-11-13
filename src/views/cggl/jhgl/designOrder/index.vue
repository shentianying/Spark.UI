<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.number" placeholder="编号" size="mini" clearable maxlength="20" style="width:150px;" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="1"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="true"
          expand-trigger="hover"
          placeholder="选择部门"
          :check-strictly="true"
          select-style="min-width:110px;"
        />
        <el-select
          v-if="(formState||[]).length"
          v-model="search.states"
          collapse-tags
          multiple
          clearable
          style="width:150px;"
          size="mini"
          placeholder="状态"
        >

          <el-option v-for="(item,index) in formState" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-button :loading="listLoading" type="primary" size="mini" @click="searchData(1)">搜索</el-button>
        <el-button v-has="'DESIGNORDER_ADD'" :loading="listLoading" type="primary" size="mini" @click="handleAdd">+添加</el-button>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">我发起的</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button>
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="3">列表</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      size="mini"
    >
      <!-- <el-table-column type="index" width="55" align="center" /> -->
      <el-table-column label="编号" header-align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>

      <!-- <el-table-column label="计划类型" align="center" min-width="10">
        <template slot-scope="scope">
          {{ planTypeList.find(f=>f.value === scope.row.planType).name }}
        </template>
      </el-table-column> -->
      <el-table-column label="部门" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="实际计划单号" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.realNumber }}
        </template>
      </el-table-column> -->
      <el-table-column label="状态" align="center" min-width="10">
        <template slot-scope="scope">
          <el-tag type="primary" size="mini" effect="plain">{{ getFormState(scope.row) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="待审批人" min-width="10" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ getPerson(scope.row.billFlow) }}
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" min-width="10">
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

      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state===0" v-has="'DESIGNORDER_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <!-- <el-tooltip content="设计下单" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state === 10000" size="mini" @click="goDesignOrder(scope.row.id)">设计下单</el-button>
          </el-tooltip> -->
          <el-tooltip content="审查" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state>0" v-has="'DESIGNORDERATTITUDE_INDEX'" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
          </el-tooltip>
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

    <!-- <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        width="70%"
        :modal-append-to-body="false"
        @close="dialogClose"
      >
        <component :is="comName" :obj="currentRow" @dialogClose="dialogClose" />
      </el-dialog>
    </div> -->
  </div>
</template>

<script>
import { getPlanDesignOrderPaging } from '@/api/cggl/designOrder'
import OrgSelect2 from '@/components/OrgSelect/index2'
// import { getOrganizationList } from '@/api/xtgl/organization'
export default {
  name: 'Plan',
  components: {
    OrgSelect2
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogTableVisible: false,
      dialogTitle: '保存',
      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,

      formState: null,
      currentRow: null,
      orgList: null,
      search: {
        number: '',
        orgIds: 0,
        projectId: null,
        states: []
      },
      tabPosition: 3 // 0:我发起，1：待审批 2:已审批
    }
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    searchData(currentPage) {
      this.currentPage = currentPage
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.type = this.tabPosition
      postData.number = this.search.number
      if (this.search.orgIds) {
        postData.orgIds = this.search.orgIds || []
      }
      postData.states = this.search.states
      // postData.companyId = this.$store.state.user.selectOrgId

      getPlanDesignOrderPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd(row) {
      this.$router.push({ name: 'DesignOrderEdit', query: { refreshRouterName: this.$route.name }, params: { type: 3 }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'DesignOrderEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    attitude(row) {
      this.$router.push({ name: 'DesignOrderAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
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
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    radioChange(value) {
      // 清空条件
      this.search = {
        number: '',
        orgIds: [],
        states: []
      }
      // 填充数据
      this.fetchData()
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    }
    // goDesignOrder(id) {
    //   this.$router.replace(
    //     { name: 'DesignOrder',
    //       query: { id: id, refreshRouterName: this.$route.name },
    //       params: { id: id }})
    // }
  }
}
</script>
