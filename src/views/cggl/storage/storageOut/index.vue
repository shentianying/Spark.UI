<template>
  <div class="app-container">
    <search-form :show-toggle="true">
      <template #row1>
        <el-input v-model="search.number" placeholder="出库单号" size="mini" clearable maxlength="20" style="width:150px;" />
        <org-select2
          v-model="search.orgIds"
          :data-mode="0"
          size="mini"
          :collapse-tags="true"
          :show-all-levels="false"
          :multiple="true"
          expand-trigger="hover"
          placeholder="选择项目"
          :check-strictly="false"
          select-style="width:150px;"
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
          <!-- <el-option :disabled="true" label="全部" :value="999" /> -->
          <el-option v-for="(item,index) in formState" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </template>
      <template #row2>
        <el-select v-model="search.outTypes" multiple collapse-tags style="width:150px" size="mini" placeholder="出库类型">
          <el-option v-for="(item,index) in outTypeList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-select
          v-model="search.personIds"
          size="mini"
          filterable
          remote
          reserve-keyword
          multiple
          clearable
          :remote-method="(query)=>{getRemotePerson(query)}"
          placeholder="经办人"
          :loading="loading"
          style="width:150px;"
        >
          <el-option
            v-for="(item,index) in personList"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
            <span>{{ getOrgList.find(f=>f.id===item.organizationId).name }}-{{ item.name }}</span>
          </el-option>
        </el-select>
        <el-input v-model="search.categoryName" placeholder="材料名" size="mini" clearable maxlength="20" style="width:150px;" />
        <el-date-picker
          v-model="search.outDateRange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="出库开始日期"
          end-placeholder="出库结束日期"
          style="width:240px;"
          size="mini"
        />
      </template>
      <template #search>
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="searchData(1)">搜索</el-button>
      </template>
      <!-- <template #other>

      </template> -->
    </search-form>
    <div style="text-align:right;margin-bottom:5px;">
      <el-button :loading="listLoading" type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
        <el-radio-button :label="0">我发起的</el-radio-button>
        <el-radio-button :label="1">待审批</el-radio-button>
        <el-radio-button :label="2">已审批</el-radio-button>
        <el-radio-button :label="3">列表</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <el-form
      ref="ruleForm"
      :model="search"
      :rules="rules"
      size="mini"
      :inline="true"
    >
      <el-col style="text-align:left;">
        <el-form-item label="出库单号" prop="number">
          <el-input v-model="search.number" placeholder="出库单号" size="mini" clearable maxlength="20" style="width:150px;" />
        </el-form-item>
        <el-form-item label="项目" prop="orgIds">
          <org-select2
            v-model="search.orgIds"
            :data-mode="0"
            size="mini"
            :collapse-tags="true"
            :show-all-levels="false"
            :multiple="true"
            expand-trigger="hover"
            placeholder="选择项目"
            :check-strictly="false"
            select-style="width:150px;"
          />
        </el-form-item>
        <el-form-item v-if="(formState||[]).length" label="状态" prop="states">
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
        </el-form-item>
        <el-form-item label="出库时间">
          <el-date-picker
            v-model="search.outDateRange"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:240px;"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="出库类型">
          <el-select v-model="search.outTypes" multiple collapse-tags style="width:150px" size="mini" placeholder="请选择">
            <el-option v-for="(item,index) in outTypeList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经办人" prop="person">
          <el-select
            v-model="search.personIds"
            size="mini"
            filterable
            remote
            reserve-keyword
            multiple
            clearable
            :remote-method="(query)=>{getRemotePerson(query)}"
            placeholder="经办人"
            :loading="loading"
            style="width:150px;"
          >
            <el-option
              v-for="(item,index) in personList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
              <span>{{ getOrgList.find(f=>f.id===item.organizationId).name }}-{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材料名" prop="categoryName">
          <el-input v-model="search.categoryName" placeholder="请输入" size="mini" clearable maxlength="20" style="width:150px;" />
        </el-form-item>
        <el-button type="primary" :loading="listLoading" icon="el-icon-search" size="mini" @click="fetchData">搜索</el-button>
        <el-button :loading="listLoading" type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col style="text-align:right;">
        <el-radio-group v-model="tabPosition" size="mini" @change="radioChange">
          <el-radio-button :label="0">我发起的</el-radio-button>
          <el-radio-button :label="1">待审批</el-radio-button>
          <el-radio-button :label="2">已审批</el-radio-button>
          <el-radio-button :label="3">列表</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-form> -->

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      size="mini"
    >
      <el-table-column label="出库单号" header-align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.organization.name }}
        </template>
      </el-table-column>
      <el-table-column label="出库时间" header-align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.outDate | dateFormat }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="出库类别" align="center" width="130">
        <template slot-scope="scope">
          {{ getTypeName(scope.row.type) }}
        </template>
      </el-table-column> -->
      <el-table-column label="用途" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.useSpace }}
        </template>
      </el-table-column>
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
            <el-button v-if="scope.row.state===0" v-has="'CONTRACT_EDIT'" size="mini" class="el-icon-edit" plain circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip content="审查" effect="light" placement="left-start" :enterable="false">
            <el-button v-if="scope.row.state>0" size="mini" class="el-icon-edit-outline" plain circle @click="attitude(scope.row)" />
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
  </div>
</template>

<script>
import { getStorageOutPaging } from '@/api/cggl/storageOut'
import OrgSelect2 from '@/components/OrgSelect/index2'
import { getPersonList } from '@/api/rsgl/person'
import { getDictionarysByTypes } from '@/api/xtgl/dictionary'
import SearchForm from '@/components/Other/searchForm'
export default {
  name: 'StorageOut',
  components: {
    OrgSelect2,
    SearchForm
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
        orgIds: [],
        states: [],
        // outDateStartDate: null,
        // outDateEndDate: null,
        outDateRange: [],
        outTypes: [],
        personIds: [],
        categoryName: ''
      },
      entryTypeOptions: [],
      tabPosition: 3, // 0:我发起，1：待审批 2:已审批
      rules: {},
      personList: [],
      loading: false,
      outTypeList: []
    }
  },
  computed: {
    getOrgList() {
      return this.$store.state.user.info.orgList
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
      postData.orgIds = this.search.orgIds
      postData.states = this.search.states
      // postData.outDateStartDate = this.search.outDateStartDate
      // postData.outDateEndDate = this.search.outDateEndDate
      postData.outDateRange = this.search.outDateRange
      postData.outTypes = this.search.outTypes
      postData.personIds = this.search.personIds
      postData.categoryName = this.search.categoryName
      getStorageOutPaging(postData).then(response => {
        const { data, count } = response
        this.list = data
        this.total = count
        this.listLoading = false
      })
      // getDictionarysByTypes({ types: 'entryType' })
      //   .then((response) => {
      //     const { data } = response
      //     data.forEach(element => {
      //       element.pid = element.pId
      //       this.entryTypeOptions.push(element)
      //     })
      //   })
      getDictionarysByTypes({ types: 'outType' })
        .then((response) => {
          const { data } = response
          var pom = []
          data.forEach(element => {
            element.pid = element.pId
            pom.push(element)
          })
          this.outTypeList = pom
        })
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.$router.push({ name: 'StorageOutEdit', query: { refreshRouterName: this.$route.name }, params: { type: 3 }})
    },
    handleEdit(row) {
      this.$router.push({ name: 'StorageOutEdit', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
    },
    attitude(row) {
      this.$router.push({ name: 'StorageOutAttitude', query: { id: row.id, refreshRouterName: this.$route.name }, params: { id: row.id }})
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
        states: [],
        // outDateStartDate: null,
        // outDateEndDate: null,
        outDateRange: [],
        outTypes: [],
        personIds: [],
        categoryName: ''
      }
      // 填充数据
      this.fetchData()
    },
    getPerson(bf) {
      if (bf) {
        var arr = bf.billFlowNode.filter(f => f.isCurrentState && !f.isChecked)
        return arr.map(m => m.person.name).join('、')
      }
    },
    getTypeName(type) {
      return this.entryTypeOptions.find(f => f.id === type).name
    },
    getRemotePerson(query) {
      query = query.trim()
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          getPersonList().then(response => {
            this.personList = response.data
            this.loading = false
          })
        }, 200)
      } else {
        this.personList = []
      }
    }
  }
}
</script>
