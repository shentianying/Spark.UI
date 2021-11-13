<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="search.name" placeholder="输入名称搜索" clearable size="mini" maxlength="11" style="width:120px;" />
        <el-select
          v-if="(categoryList||[]).length"
          v-model="search.categoryIds"
          collapse-tags
          multiple
          clearable
          style="width:180px;"
          size="mini"
          placeholder="类别"
        >
          <el-option v-for="(item,index) in categoryList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-select
          v-model="search.isProject"
          collapse-tags
          clearable
          style="width:180px;"
          size="mini"
          placeholder="是否项目"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
      </el-col>
      <el-col :span="24" style="text-align:right;">
        <el-button v-has="'ORG_ADD'" type="primary" size="mini" @click="handleAdd">+添加</el-button>
      </el-col>
    </el-row>

    <!-- <el-tree
      :data="list"
      :show-checkbox="false"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span v-if="!data.isProject">
          <el-button
            v-has="'ORG_EDIT'"
            type="text"
            size="mini"
            @click="() => update(data)"
          >
            修改
          </el-button>
        </span>
      </span>
    </el-tree> -->
    <!-- default-expand-all -->
    <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="categoryId" label="类别">
        <template slot-scope="scope">
          <span v-if="scope.row.categoryId">{{ categoryList.find(f=>f.value === scope.row.categoryId).name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isProject" label="是否项目">
        <template slot-scope="scope">
          <i v-if="scope.row.isProject" class="el-icon-check" />
          <i v-else class="el-icon-close" />
        </template>
      </el-table-column>
      <el-table-column prop="isSum" label="是否统计余额">
        <template slot-scope="scope">
          <i v-if="scope.row.isSum" class="el-icon-check" />
          <i v-else class="el-icon-close" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isProject" v-has="'ORG_EDIT'" type="text" size="mini" @click="update(scope.row)">修改</el-button>
          <el-button v-has="'ORG_DETAIL'" type="text" size="mini" @click="details(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="dialogTableVisible">
      <el-dialog
        :title="dialogTitle"
        :destroy-on-close="true"
        :fullscreen="false"
        :visible.sync="dialogTableVisible"
        @close="dialogClose"
      >
        <organization-add :obj="currentRow" :pid="pid" @dialogClose="dialogClose" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import { getCurrentUserOrg } from '@/api/xtgl/role'
import OrganizationAdd from './organizationAdd'
import { getTree } from '@/utils/index'
import { getDictionaryList } from '@/api/xtgl/dictionary'
import { getComOrganizationList } from '@/api/xtgl/organization'
export default {
  name: 'Organization',
  components: {
    OrganizationAdd
  },
  data() {
    return {
      list: [],
      categoryList: [],
      options: [{
        value: false,
        label: '否'
      }, {
        value: true,
        label: '是'
      }],
      listLoading: true,
      dialogTableVisible: false,
      dialogTitle: '保存',

      currentRow: null,
      pid: 0,

      search: {
        name: '',
        categoryIds: [],
        isProject: null
      }
    }
  },
  mounted() {
    getDictionaryList({ type: 'postPoolCategory' }).then(response => {
      const { data } = response
      this.categoryList = data
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.name = this.search.name
      postData.categoryIds = this.search.categoryIds
      postData.isProject = this.search.isProject

      getComOrganizationList(postData).then(response => {
        response.data.forEach(ele => {
          ele.label = ele.name
        })
        // console.log('list:', response.data)
        this.list = getTree(0, response.data)
        this.listLoading = false
      })
    },
    goSearch() {
      this.fetchData()
    },
    dialogClose() {
      this.dialogTableVisible = false
      this.fetchData()
    },
    handleAdd() {
      this.currentRow = null
      this.pid = 0
      this.dialogTableVisible = true
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // append(node, data) {
    //   this.currentRow = null
    //   this.pid = data.id
    //   this.dialogTableVisible = true
    // },
    // remove(node, data) {
    //   if (node.childNodes.length) {
    //     this.$message.warning('请先删除子项目')
    //   } else {
    //     deleteOganization({ id: data.id }).then(response => {
    //       this.fetchData()
    //       this.$message.success('删除成功')
    //     }).catch(() => { this.$message.danger('删除失败') })
    //   }
    // },
    update(data) {
      this.currentRow = data
      this.pid = data.id
      this.dialogTableVisible = true
    },
    details(data) {
      this.$router.push({ name: 'OrganizationDetails', query: { id: data.id, refreshRouterName: this.$route.name }})
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
