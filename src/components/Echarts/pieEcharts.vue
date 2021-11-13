<template>
  <div ref="pie" :style="{height:height,width:width}" />
</template>
<script>
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use(
  [TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]
)
// var echarts = require('echarts')
export default {
  model: {
    prop: 'selectValue', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    height: { type: String, default: '200px' },
    width: { type: String, default: '300px' },
    title: { type: String, default: '' },
    stitle: { type: String, default: '' },
    titleAlign: { type: String, default: 'left' },
    isEvent: { type: Boolean, default: false },
    eventType: { type: String, default: 'click' }, // 'click'、'dblclick'、'mousedown'、'mousemove'、'mouseup'、'mouseover'、'mouseout'、'globalout'、'contextmenu'
    data: { type: Array, default: () => { return [{ value: 1000, name: '测试1' }, { value: 2000, name: '测试2' }] } }
  },
  data() {
    return {
      list: null,
      modelValue: null,
      chart: null
    }
  },
  watch: {
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      const _that = this
      this.chart = echarts.init(this.$refs.pie)
      this.setOptions()
      if (this.isEvent) {
        this.chart.on(this.eventType, function(params) {
          if (params.componentType === 'series') {
            _that.$emit('callMethod', params.data)
          }
        })
      }
    },
    setOptions() {
      this.chart.setOption({
        title: {
          text: this.title,
          subtext: this.stitle,
          left: this.titleAlign
        },
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          name: '数据',
          type: 'pie',
          data: this.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      })
    }
  }
}
</script>
