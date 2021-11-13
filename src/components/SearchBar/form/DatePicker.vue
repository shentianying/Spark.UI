<template>
  <el-date-picker
    v-model="inputVal"
    :value-format="valueFormat"
    :size="size"
    :type="dateType"
    unlink-panels
    :placeholder="placeholder"
    :start-placeholder="placeholder"
    :end-placeholder="placeholder"
  >
    <template v-slot:range-separator>
      <i class="el-icon-right" />
    </template>
  </el-date-picker>
</template>

<script>
export default {
  model: { event: 'change', prop: 'value' },
  props: {
    placeholder: {
      type: String,
      default: '选择'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    size: {
      type: String,
      default: 'mini'
    },
    dateType: {
      type: String,
      default: 'year'
    },
    value: {
      type: [Array, String, Number, Object, Date],
      default: ''
    }
  },
  computed: {
    inputVal: {
      set: function(val) {
        this.$emit('change', val)
      },
      get: function() {
        return this.value
      }
    }
  }
}
</script>

<style>

</style>
