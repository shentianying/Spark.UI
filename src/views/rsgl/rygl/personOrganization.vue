<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px;">
      <el-col :span="16" style="text-align:left;">
        <div class="flexDiv">
          <org-select2
            v-model="orgValue"
            :data-mode="0"
            size="mini"
            :collapse-tags="false"
            :show-all-levels="true"
            :multiple="true"
            placeholder="组织机构"
            :check-strictly="true"
            select-style="width:180px;margin-right:10px;"
          />
          <el-select
            v-model="postId"
            placeholder="岗位"
            collapse-tags
            clearable
            filterable
            style="width:180px;margin-right:10px;"
            size="mini"
          >
            <el-option
              v-for="(item,index) in postList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-input v-model="searchText" size="mini" clearable maxlength="11" placeholder="姓名或工号" style="width:120px;" />&nbsp;&nbsp;

          <el-button type="primary" size="mini" @click="goSearch">搜索</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="组织机构" width="200px" />
      <el-table-column align="center">
        <template slot="header">
          <!-- <el-table
            id="headerTable"
            size="mini"
            style="width: 100%"
            empty-text=" "
          >
            <el-table-column label="岗位名称" align="center" />
            <el-table-column label="工号" align="center" />
            <el-table-column label="姓名" align="center" />
          </el-table> -->
          <table style="width:100%;font-size:14px">
            <thead>
              <tr>
                <th style="width:40%;margin:0" align="center">岗位名称</th>
                <th style="width:30%;margin:0" align="center">工号</th>
                <th style="width:40%;margin:0" align="center">姓名</th>
              </tr>
            </thead>
          </table>
        </template>
        <template slot-scope="props">
          <!-- <div class="my_table">
            <el-table
              v-if="props.row.personList.length>0"
              size="mini"
              :data="props.row.personList"
              style="width: 100%"
            >
              <el-table-column prop="post.name" align="center" />
              <el-table-column prop="person.number" align="center" />
              <el-table-column prop="person.name" align="center">
                <template slot-scope="scope">
                  {{ scope.row.person.name }}<span v-if="!scope.row.isMain" style="color:red">(兼)</span>
                </template>
              </el-table-column>
            </el-table>
          </div> -->
          <div id="personTable">
            <table v-if="props.row.personList.length>0" style="width:100%;font-size:12px">
              <tbody>
                <tr v-for="(person, id) in props.row.personList" :key="id">
                  <td style="width:40%;margin:0;border-bottom:0;padding:6px 0px" align="center">
                    {{ person.post.name }}
                  </td>
                  <td style="width:30%;margin:0;border-bottom:0;padding:6px 0px" align="center">
                    <el-link style="font-size: 12px" @click="handleDetail(person)">{{ person.person.number }}</el-link>
                  </td>
                  <td style="width:40%;margin:0;border-bottom:0;padding:6px 0px" align="center">
                    {{ person.person.name }}<span v-if="!person.isMain" style="color:red">(兼)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="岗位名称" align="center">
        <template slot-scope="props">
          <div class="my_table">
          <el-table
            v-if="props.row.personList.length>0"
            size="mini"
            :data="props.row.personList"
            style="width: 100%"
          >
            <el-table-column prop="post.name" align="center" />
          </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="工号" align="center">
        <template slot-scope="props">
          <div class="my_table">
          <el-table
            v-if="props.row.personList.length>0"
            size="mini"
            :data="props.row.personList"
            style="width: 100%"
          >
            <el-table-column prop="person.number" align="center" />
          </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="props">
          <div class="my_table">
          <el-table
            v-if="props.row.personList.length>0"
            size="mini"
            :data="props.row.personList"
            style="width: 100%"
          >
              <el-table-column prop="person.name" align="center">
                <template slot-scope="scope">
                  {{ scope.row.person.name }}<span v-if="!scope.row.isMain" style="color:red">(兼)</span>
                </template>
              </el-table-column>
          </el-table>
          </div>
        </template>
      </el-table-column> -->
    </el-table>

  </div>
</template>
<script>
import OrgSelect2 from '@/components/OrgSelect/index2'
import { getTree } from '@/utils/index'
import { getComOrganizationAndPersonList } from '@/api/xtgl/organization'
export default {
  name: 'PersonOrganization',
  components: {
    OrgSelect2
  },
  data() {
    return {
      list: [],
      postList: [],
      listLoading: false,
      searchText: '',
      orgValue: [],
      postId: null
    }
  },
  mounted() {
    this.fetchData()
  },
  activated() {
    if (this.$route.params.refresh) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var postData = {}
      postData.orgIds = this.orgValue
      if (this.postId === null || this.postId === '') {
        postData.postId = 0
      } else {
        postData.postId = this.postId
      }

      postData.name = this.searchText

      getComOrganizationAndPersonList(postData).then(response => {
        response.data.forEach(ele => {
          ele.label = ele.name
        })
        this.list = getTree(0, response.data)
        this.postList = response.data1
        this.listLoading = false
      })
    },
    handleDetail(row) {
      this.$router.push({ name: 'PersonDetail', query: { id: row.personId, refreshRouterName: this.$route.name }, params: { id: row.personId }})
    },
    goSearch() {
      this.fetchData()
    }
  }
}
</script>

