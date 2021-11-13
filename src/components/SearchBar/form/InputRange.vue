<template>
  <div class="input-range">
    <el-input v-model="min" clearable class="input" :size="size" :placeholder="placeholder" />
    <i class="el-icon-right" />
    <el-input v-model="max" clearable class="input" :size="size" :placeholder="placeholder" />
  </div>
</template>

<script>
export default {
  model: { event: 'change', prop: 'value' },
  props: {
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '输入'
    },
    size: {
      type: String,
      default: 'mini'
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    min: {
      get: function() {
        return this.value[0]
      },
      set: function(val) {
        const data = JSON.parse(JSON.stringify(this.value))
        data[0] = val.replace(/[^\d.]/g, '')
        this.$emit('change', data)
      }
    },
    max: {
      get: function() {
        return this.value[1]
      },
      set: function(val) {
        const data = JSON.parse(JSON.stringify(this.value))
        data[1] = val.replace(/[^\d.]/g, '')
        this.$emit('change', data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-range{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .input{
    width:45%;
  }
}
</style>
