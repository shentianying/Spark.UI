<template>
  <el-input
    v-model="inputVal"
    clearable
    :size="size"
    :disabled="disabled"
    :placeholder="placeholder"
  >
    <span v-if="unit" slot="suffix" class="unit">{{ unit }}</span>
  </el-input>
</template>

<script>
export default {
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '输入检索'
    },
    size: {
      type: String,
      default: 'mini'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    unit: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  }
}
</script>

<style></style>
