<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row class="details">
      <el-tabs v-model="activeTab" :lazy="true" @tab-click="setSelected">
        <el-tab-pane :label="tabsInfo[0].label" :name="tabsInfo[0].name">
          <Detailsedit
            v-if="myDetails"
            status="checkInfo"
            :label-width="labelWidth"
            :info-list="infoList"
          />
        </el-tab-pane>
        <el-tab-pane :label="tabsInfo[1].label" :name="tabsInfo[1].name">
          其他信息
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { getAccountSetByOrgId } from '@/api/xtgl/accountSet'
import Detailsedit from '@/components/Detailsedit'
const lineChartData = {
  car: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  device: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  people: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  visitor: {
    expectedData: [30, 40, 41, 42, 45, 50, 60],
    actualData: [20, 2, 11, 54, 62, 40, 30]
  }
}

export default {
  name: 'CompanyInfo',
  components: {
    PanelGroup,
    LineChart,
    Detailsedit
  },
  data() {
    return {
      size: 'mini', // 整体大小 medium / small / mini
      activeTab: 'info',
      tabsInfo: [
        { name: 'info', selected: false, label: '基本信息' },
        { name: 'other', selected: false, label: '其他信息' }
      ],
      lineChartData: lineChartData.car,
      labelWidth: 150,
      myDetails: null // 详情数据
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
            fullName,
            shortName,
            taxNumber,
            bank,
            accountNumber,
            remark
          }

        }
      } = this

      return [
        { label: '公司名称', value: name },
        { label: '曾用名', value: fullName },
        { label: '法定代表人', value: shortName },
        { label: '从业人数', value: taxNumber },
        { label: '企业产值', value: bank },
        { label: '税收', value: accountNumber },
        { label: '备注', monopolize: true, value: remark }
      ]
    }

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.tabsInfo[0].selected = true
      const { selectOrgId } = vm.$store.state.user
      vm.myId = selectOrgId
      vm.initData()
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    /**
     * @description: 初始化数据
     */
    initData() {
      this.fetchData()
    },
    /**
     * 获取详情信息
     */
    async fetchData() {
      if (!this.myId) return
      getAccountSetByOrgId({ id: this.myId }).then(res => {
        this.myDetails = res
      }).catch(e => {
        console.log('fetchData:请求列表数据失败，错误信息:', e)
      })
    },
    // 解决 一次打开 多个选项卡一次性 加载 所有数据的问题
    setSelected(tag) {
      this.tabsInfo[Number(tag.index)].selected = true
      this.search.type = Number(tag.index) + 1
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.details{
  background:#fff;
  padding:16px 16px 0;
  margin-bottom:32px;
  .title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
