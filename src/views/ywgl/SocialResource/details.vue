<template>
  <div class="app-container details">
    <el-collapse v-if="myDetails" v-model="activeNames">
      <el-collapse-item name="0" disabled>
        <template v-slot:title>
          <div class="title">社会资源信息</div>
        </template>
        <Detailsedit
          status="checkInfo"
          :info-list="infoList"
        />
        <div class="title"><i class="el-icon-info" />关系记录<el-button v-if="type==2" :size="size" type="text" @click="handleGraph(myId)">关系图谱</el-button></div>
        <TableEx
          class="padding-50"
          :show-count="false"
          :show-pagination="false"
          :show-actions="tag"
          :size="size"
          :columns="relationTable.columns"
          :table-loading="relationTable.loading"
          :list="relationTable.list"
        >
          <template #actions="{row}">
            <el-button :size="size" type="text" @click="handleDel(row)">删除</el-button>
          </template>
        </TableEx>
        <div v-if="type == 1" class="addTableBtn">
          <el-button type="text" :loading="loading" @click="addTable">添加</el-button>
          <el-button type="text" :loading="loading" @click="saveTable(myId)">保存</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { getSocialResourceById, SaveRelationship } from '@/api/ywgl/socialResource.js'
import SocialResourceSelect from '@/components/SearchBar/form/SocialResourceSelect'
import Detailsedit from '@/components/Detailsedit'
import TableEx from '@/components/TableEx'
export default {
  name: 'SocialResourceDetails',
  components: {
    Detailsedit,
    TableEx
    // UpFile
  },
  data() {
    return {
      size: 'mini',
      activeNames: ['0', '1', '2'], // 展开的折叠面板
      loading: false, // 请求未完成
      myDetails: null, // 详情数据
      /* 列表数据相关 */
      relationTable: { // 关系列表
        columns: [
          {
            label: '序号', // 表头
            minWidth: '80', // 最小宽度
            format: (val, format, row, column, scoped) => scoped.$index + 1
          },
          {
            render: (h) => {
              return (
                <el-table-column minWidth='120' align='center' label='姓名' scopedSlots={{ default: ({ row }) => {
                  if (this.type === 1) {
                    return (<SocialResourceSelect
                      value={row.toId}
                      vModel={row.toId}
                      onSelect={
                        (val) => {
                          row.socialResource.company = val[0].company
                          row.socialResource.position = val[0].position
                          row.socialResource.name = val[0].name
                          console.log(row)
                        }
                      }
                      onChange={
                        (val) => {
                          if (val === '') {
                            row.socialResource.company = ''
                            row.socialResource.position = ''
                            row.socialResource.name = ''
                          }
                        }
                      } size='mini'
                      placeholder='输入关键字搜索'/>
                    )
                  } else {
                    return row.socialResource.name
                  }
                } }} />
              )
            }
          },
          {
            label: '所在单位',
            prop: 'socialResource.company',
            minWidth: '120'
          },
          {
            label: '职务',
            prop: 'socialResource.position',
            minWidth: '120'
          },
          {
            render: (h) => {
              return (
                <el-table-column minWidth='120' align='center' label='与本人关系' scopedSlots={{ default: ({ row }) => {
                  if (this.type === 1) {
                    return (<el-input
                      vModel={row.relationship}
                      size='mini'
                      placeholder='输入关系'/>
                    )
                  } else {
                    return row.relationship
                  }
                } }} />
              )
            }
          },
          {
            render: (h) => {
              return (
                <el-table-column minWidth='120' align='center' label='备注' scopedSlots={{ default: ({ row }) => {
                  if (this.type === 1) {
                    return (<el-input
                      vModel={row.remark}
                      size='mini'
                      placeholder='输入备注'/>
                    )
                  } else {
                    return row.remark
                  }
                } }} />
              )
            }
          }
        ],
        list: [
          {
            id: 0,
            fromId: this.myId,
            toId: '',
            socialResource: {
              name: '', // 姓名
              position: '', // 职务
              company: '' // 单位
            },
            relationship: '', // 与本人关系
            remark: '' // 备注
          }
        ],
        loading: false
      }
    }
  },
  computed: {
    /**
     * 详情各字段计算
     */
    infoList() {
      const {
        myDetails: {
          data: {
            name,
            sex,
            birthYear,
            companyTel,
            company,
            companyType,
            position,
            companyAddress,
            homeAddress,
            homeTel,
            email,
            qq,
            interest,
            study,
            work,
            resources,
            inUse,
            remark,
            upFile,
            createUserName,
            createDate,
            lastEditUserName,
            lastEditDate
          }
        }
      } = this

      return [
        { label: '姓名', value: name },
        { label: '性别', value: sex },
        { label: '出生年份', value: birthYear },
        { label: '电话', value: companyTel },
        { label: '工作单位', value: company },
        { label: '单位性质', value: companyType },
        { label: '职务', value: position },
        { label: '单位地址', value: companyAddress },
        { label: '现居住地', value: homeAddress },
        { label: '家庭电话', value: homeTel },
        { label: 'Email', value: email },
        { label: 'QQ', value: qq },
        { label: '个人喜好', value: interest, monopolize: true },
        { label: '学习经历', value: study, monopolize: true },
        { label: '工作经历', value: work, monopolize: true },
        { label: '资源关系', value: resources, monopolize: true },
        { label: '备注', value: remark, monopolize: true },
        { label: '附件', value: upFile || [], component: 'UpFile', monopolize: true },
        { label: '制单人', value: createUserName },
        { label: '制单时间', value: createDate },
        { label: '更新人', value: lastEditUserName },
        { label: '更新时间', value: lastEditDate },
        { label: '状态', value: inUse ? '正常' : '禁用' }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initDat()
    })
  },
  methods: {
    /**
     * @description: 初始化数据
     */
    initDat() {
      const { id, type } = this.$route.query
      this.myId = id
      this.type = type
      if (this.type === 1) {
        this.tag = true
      } else {
        this.tag = false
      }
      this.fetchData()
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      this.loading = true
      getSocialResourceById({ id: this.myId }).then(res => {
        this.myDetails = res
        this.relationTable.list = res.linkList
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息：', e)
      }).finally(() => {
        this.loading = false
      })
    },
    goBack() {
      this.utils.closeAndRefresh(this.$route.query.refreshRouterName)
    },
    handleGraph(id) {
      this.$router.push({ name: 'Relation', query: { id: id, refreshRouterName: this.$route.name }})
    },
    saveTable(id) {
      const req = {
        relationTable: this.relationTable.list,
        id: id
      }

      let flage = true
      let same = false
      this.relationTable.list.forEach(e => {
        if (e.toId === '' || e.relationship === '') { flage = false }
        if (e.fromId === e.toId) { same = true }
      })
      if (!flage) {
        this.$message('请将关系信息填写完整!')
        return false
      }
      if (same) {
        this.$message('请不要选择其本人!')
        return false
      }
      this.loading = true
      SaveRelationship(req).then(res => {
        // 更新
        this.$message.success('保存成功')
        this.loading = false
        this.goBack()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 添加关系
     */
    addTable() {
      // 最后一条数据不能删掉 所以新增的一条数据的id 只能取list的最后一条数据的id+1; 直接取list.length会有问题
      // const length = this.relationTable.list.length - 1
      // const id = length < 0 ? 0 : this.relationTable.list[length].id + 1
      this.relationTable.list.push({
        id: 0,
        fromId: this.myId,
        toId: '',
        socialResource: {
          name: '', // 姓名
          position: '', // 职务
          company: '' // 单位
        },
        relationship: '', // 与本人关系
        remark: '' // 备注
      })
    },
    /**
     * 删除关系信息
     */
    handleDel(row) {
      // 删除选中的信息
      if (this.relationTable.list.length > 1) {
        // this.relationTable.list = this.relationTable.list.filter(e => {
        //   return e.id !== row.id
        // })
        this.relationTable.list.splice(row.$index + 1, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  padding-bottom: 70px;
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }
  .affirm{
    padding:16px 0 16px 56px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 64px;
    background-color: white;
  }
  .addTableBtn {
    width: 100%;
    margin: 20px 0;
    .el-button {
      width: 40%;
      border: 1px dashed #cecece;
      border-radius: 4px;
      color: #000;
      text-align: center;
     }
  }
  .dashLine {
    height: 1px;
    border-top: 1px dashed #cecece;
    // margin-bottom: 20px;
  }
}
</style>
