<template>
  <div class="year-month">
    <el-date-picker
      v-model="year"
      class="date"
      type="year"
      value-format="yyyy"
      :size="size"
      placeholder="年"
    />
    <i class="el-icon-right" />
    <el-select
      v-model="month"
      class="date"
      :size="size"
      placeholder="月"
      clearable
    >
      <el-option
        v-for="item in monthList"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  model: { event: 'change', prop: 'value' },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      monthList: [{
        value: 1,
        name: '1月'
      }, {
        value: 2,
        name: '2月'
      }, {
        value: 3,
        name: '3月'
      }, {
        value: 4,
        name: '4月'
      }, {
        value: 5,
        name: '5月'
      }, {
        value: 6,
        name: '6月'
      }, {
        value: 7,
        name: '7月'
      }, {
        value: 8,
        name: '8月'
      }, {
        value: 9,
        name: '9月'
      }, {
        value: 10,
        name: '10月'
      }, {
        value: 11,
        name: '11月'
      }, {
        value: 12,
        name: '12月'
      }]
    }
  },
  computed: {
    year: {
      get: function() {
        return this.value[0]
      },
      set: function(val) {
        const data = JSON.parse(JSON.stringify(this.value))
        data[0] = val
        this.$emit('change', data)
      }
    },
    month: {
      get: function() {
        return this.value[1]
      },
      set: function(val) {
        const data = JSON.parse(JSON.stringify(this.value))
        data[1] = val
        this.$emit('change', data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.year-month{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .date{
    width:45% !important;
  }
}
</style>
