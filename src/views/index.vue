<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :md="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>我的待办信息</span>
            <el-button
              :loading="loading"
              style="float: right; padding: 3px 0"
              type="text"
              @click="goRefresh"
            ><i
              class="el-icon-refresh"
            /></el-button>
          </div>
          <el-row>
            <el-col :span="8">
              <el-table :data="data1" :show-header="false">
                <el-table-column prop="name" />
                <el-table-column>
                  <template slot-scope="scope">
                    <el-link
                      :underline="false"
                      @click="goMyBillFlow1(scope.row.grade)"
                    >
                      <h2>
                        <countTo
                          :start-val="0"
                          :end-val="scope.row.value"
                          :duration="1000"
                        />
                      </h2>
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <!-- <el-col :span="3" style="text-align:center;">
              <p>{{ text1 }}</p>
              <div><el-link :underline="false" @click="goMyBillFlow1(0)">
                <h1>
                  <countTo :start-val="0" :end-val="normalCount" :duration="1000" />
                </h1>
              </el-link></div>
            </el-col>
            <el-col :span="3" style="text-align:center;">
              <p>{{ text2 }}</p>
              <div><el-link :underline="false" @click="goMyBillFlow1(1)">
                <h1>
                  <countTo :start-val="0" :end-val="importantCount" :duration="1000" />
                </h1>
              </el-link></div>
            </el-col>
            <el-col :span="3" style="text-align:center;">
              <p>{{ text3 }}</p>
              <div><el-link :underline="false" @click="goMyBillFlow1(-1)">
                <h1>
                  <countTo :start-val="0" :end-val="unImportantCount" :duration="1000" />
                </h1>
              </el-link></div>
            </el-col> -->
            <el-col :span="16">
              <div style="margin: auto; width:360px">
                <pie-echarts
                  v-if="data1.length"
                  height="250px"
                  width="360px"
                  :is-event="true"
                  :data="data1"
                  @callMethod="callMethod"
                />
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>意见与信息动态</span>

          </div>
        </el-card>
      </el-col> -->

      <!-- <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>我的流程3</span>
            <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
          </div>
          <div>我的总流程：<el-link type="danger" @click="goBillFlow">1000</el-link></div>
          <div>待审批的流程：100</div>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import { getMyBillFlowShowCount, isCheckUp } from '@/api/xtgl/billFlow'
import PieEcharts from '@/components/Echarts/pieEcharts'
import CountTo from 'vue-count-to'
export default {
  name: 'Dashboard',
  components: {
    PieEcharts,
    CountTo
  },
  data() {
    return {
      data1: [],
      text1: '',
      text2: '',
      text3: '',
      loading: false,
      normalCount: 0,
      importantCount: 0,
      unImportantCount: 0
    }
  },
  mounted() {
    this.fetchData()
  },
  created() {
    // 审批消息 直接跳转页面
    if (
      this.$route.params.pageId &&
      this.$route.params.billId &&
      this.$route.params.billFlowId
    ) {
      // 隐藏掉左边菜单栏
      this.$store.dispatch('app/isShowSideBar', false)
      isCheckUp({ billFlowId: this.$route.params.billFlowId }).then(
        response => {
          const { data } = response
          if (data) {
            // 跳转页面
            this.goDeal(this.$route.params.pageId, this.$route.params.billId)
          } else {
            this.$router.replace({
              path: '/Transfer',
              query: { msg: response.message }
            })
          }
        }
      )
    }
  },
  methods: {
    goDeal(pageId, billId) {
      if (!pageId) return
      const { routerName } = this.getRoute(pageId)
      // console.log('获取的路由名称：', routerName)
      this.$router.replace({
        name: routerName,
        query: { id: billId, refreshRouterName: this.$route.name },
        params: { id: billId, type: 1 }
      })
    },
    getRoute(pageId) {
      // 获取菜单列表
      const getIsMenu = this.$store.getters.menus
      // console.log('获取菜单列表的数量：', getIsMenu.length)
      return getIsMenu.find(f => f.id === pageId)
    },
    goRefresh() {
      this.data1 = []
      this.normalCount = 0
      this.importantCount = 0
      this.unImportantCount = 0
      setTimeout(() => {
        this.fetchData()
      }, 1000)
    },
    fetchData() {
      getMyBillFlowShowCount().then(response => {
        const { data0, data_1, data1, gradeList } = response
        this.normalCount = data0
        this.importantCount = data1
        this.unImportantCount = data_1
        gradeList.forEach(e => {
          if (e.value === 0) {
            this.text1 = e.name
            this.data1.push({
              value: data0,
              name: e.name,
              grade: e.value,
              itemStyle: { color: '#2b821d' }
            })
          }
          if (e.value === 1) {
            this.text2 = e.name
            this.data1.push({
              value: data1,
              name: e.name,
              grade: e.value,
              itemStyle: { color: '#c12e34' }
            })
          }
          if (e.value === -1) {
            this.text3 = e.name
            this.data1.push({
              value: data_1,
              name: e.name,
              grade: e.value,
              itemStyle: { color: '#aaaaaa' }
            })
          }
        })
      })
    },
    goMyBillFlow() {
      this.$router.replace({ name: 'MyBillFlow' })
    },
    goMyBillFlow1(grade) {
      this.$router.replace({
        name: 'MyBillFlow',
        params: { tab: 1, grade: grade }
      }) // 不重要
    },
    callMethod(data) {
      this.goMyBillFlow1(data.grade)
    }
  }
}
</script>

<style></style>
