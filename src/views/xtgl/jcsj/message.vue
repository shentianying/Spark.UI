<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <el-input v-model="searchStr" size="mini" style="width:350px;" clearable placeholder="请输入标题">
          <el-select slot="prepend" v-model="type" style="width:100px;" placeholder="请选择">
            <el-option label="全部消息" :value="null" />
            <el-option label="系统消息" :value="0" />
            <el-option label="消息2" :value="1" />
            <el-option label="消息3" :value="2" />
          </el-select>
          <el-button slot="append" :loading="listLoading" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <el-button plain size="mini" :loading="listLoading" @click="setBeRead(0)">全部设为已读</el-button>
        <el-radio-group v-model="isRead" size="mini" @change="radioChang">
          <el-radio-button :label="null">全部</el-radio-button>
          <el-radio-button :label="true">已读</el-radio-button>
          <el-radio-button :label="false">未读</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column align="center" width="150" label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <el-link v-if="scope.row.pageId" type="info" :underline="true" @click="goDeal(scope.row)">{{ scope.row.content }}</el-link>
          <span v-else>{{ scope.row.content }}</span>
          <!-- <div v-html="htmlStr">11</div> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布人" width="80">
        <template slot-scope="scope">
          {{ scope.row.sendName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间" width="140">
        <template slot-scope="scope">
          {{ scope.row.sendTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="置顶" width="60">
        <template slot-scope="scope">
          {{ scope.row.isTop ? "是" : "否" }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="110">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isRead" size="mini" @click="setBeRead(scope.row.id)">设为已读</el-button>
          <el-tag v-else type="success">已读</el-tag>
          <!-- <el-button size="mini" class="el-icon-edit" plain>删除</el-button> -->
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
import { getRemindPaging, putIsRead } from '@/api/xtgl/message'
import store from '@/store'
export default {
  name: 'Message',
  components: {
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogTableVisible: false,
      dialogTitle: '保存',

      total: 0,
      currentPage: 1,
      pageSize: this.utils.getPersonalSettings().pageSize,
      searchStr: '',
      type: null,
      isRead: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.currentPage = this.currentPage
      postData.pageSize = this.pageSize
      postData.title = this.searchStr
      postData.type = this.type
      postData.isRead = this.isRead
      getRemindPaging(postData).then(response => {
        const { data, count, noReadCount } = response
        this.list = data
        this.total = count
        this.listLoading = false
        this.$store.commit('user/SET_NOREADCOUNT', noReadCount)
      }).catch(() => { this.listLoading = false })
    },
    sizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    setBeRead(id) {
      this.buttonLoading = true
      const postData = { msgId: id }
      putIsRead(postData).then(response => {
        const { message } = response
        this.$message(message)
        this.buttonLoading = false
        this.fetchData()
      }).catch(() => { this.buttonLoading = false })
    },
    radioChang(value) {
      this.isRead = value
      this.fetchData()
    },
    goDeal(row) {
      if (!row.pageId) return
      const { routerName } = this.getRoute(row)
      this.$router.replace({ name: routerName, query: { id: row.billId, refreshRouterName: this.$route.name }, params: { id: row.billId, type: 1 }})
    },
    getRoute(row) {
      // 获取菜单列表
      const getIsMenu = store.getters.menus
      return getIsMenu.find(f => f.id === row.pageId)
    }
  }
}
</script>
