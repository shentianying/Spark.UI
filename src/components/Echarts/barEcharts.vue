<template>
  <div ref="pie" :style="{height:height,width:width}" />
</template>
<script>
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]
)
export default {
  model: {
    prop: 'selectValue', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    height: { type: String, default: '300px' },
    width: { type: String, default: '350px' },
    title: { type: String, default: '' },
    stitle: { type: String, default: '' },
    titleAlign: { type: String, default: 'left' },
    xdata: { type: Array, default: () => { return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] } },
    data: { type: Array, default: () => { return [120, 200, 150, 80, 70, 110, 130] } }
  },
  data() {
    return {
      list: null,
      modelValue: null,
      chart: null
      // selectStyle: 'width:100%'
    }
  },
  watch: {
    // modelValue(value) {
    //   this.$emit('change', value)
    // }
  },
  mounted() {
    // this.fetchData()
    // this.$nextTick(() => {
    this.initCharts()
    // })
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(this.$refs.pie)
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        title: {
          text: this.title,
          subtext: this.stitle,
          left: this.titleAlign
        },
        xAxis: {
          type: 'category',
          data: this.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.data,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }]
      })
    }
    // fetchData() {
    //   var postData = { companyId: this.$store.state.user.selectOrgId, type: this.dicType }
    //   getDictionaryList(postData).then(response => {
    //     this.list = response.data
    //   })
    // }
  }
}
</script>
