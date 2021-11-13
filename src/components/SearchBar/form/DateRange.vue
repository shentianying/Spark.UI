<template>
  <div class="date-range">
    <el-date-picker
      v-model="start"
      class="date"
      type="date"
      :size="size"
      :placeholder="startPlaceholder"
    />
    <i class="el-icon-right" />
    <el-date-picker
      v-model="end"
      class="date"
      type="date"
      :size="size"
      :placeholder="endpPlaceholder"
    />
  </div>
</template>

<script>
export default {
  model: { event: 'change', prop: 'value' },
  props: {
    endpPlaceholder: {
      type: String,
      default: '选择'
    },
    startPlaceholder: {
      type: String,
      default: '选择'
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'daterange'
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    start: {
      get: function() {
        return this.value[0]
      },
      set: function(val) {
        // const range = ['datetimerange', 'daterange', 'monthrange']
        // if (this.component === 'DatePicker' && range.includes(this.dateType)) {
        //   val = val || []
        //   const hour_24 = 24 * 60 * 60 * 1000
        //   val[0] = val[0] ? this.utils.parseTime(new Date(val[0])) : val[0]
        //   val[1] = val[1] ? this.utils.parseTime(new Date(val[1].getTime() + hour_24 - 1)) : val[1]
        // }
        this.setDate([val, this.end])
        // this.$emit('change', this.sortTime([val, this.end]))
      }
    },
    end: {
      get: function() {
        return this.value[1]
      },
      set: function(val) {
        this.setDate([this.start, val])
        // this.$emit('change', this.sortTime([this.start, val]))
      }
    }
  },
  methods: {
    setDate(tiemArr) {
      const [t1, t2] = tiemArr
      const time1 = new Date(t1)
      const time2 = new Date(t2)
      // console.log('time1 instanceof Date && time2 instanceof Date', time1, time2, time1 instanceof Date && time2 instanceof Date)
      if ((t1 && time1 instanceof Date) && (t2 && time2 instanceof Date)) {
        if (time1 > time2) {
          tiemArr = [time2, time1]
        }
      }
      if (tiemArr[0] instanceof Date) {
        tiemArr[0] = tiemArr[0].toLocaleDateString().replaceAll('/', '-')
        tiemArr[0] = `${tiemArr[0]} 00:00:00`
      }
      if (tiemArr[1] instanceof Date) {
        tiemArr[1] = tiemArr[1].toLocaleDateString().replaceAll('/', '-')
        tiemArr[1] = `${tiemArr[1]} 23:59:59`
      }
      this.$emit('change', tiemArr)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-range{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .date{
    width:45% !important;
  }
}
</style>
