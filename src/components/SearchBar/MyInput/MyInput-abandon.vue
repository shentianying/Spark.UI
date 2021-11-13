<template>
  <div class="my-input" :style="{width:width}">
    <!-- 快捷使用部分 -->
    <OrgSelect
      v-if="component==='OrgSelect'"
      v-model="inputVal"
      :check-strictly="checkStrictly"
      :data-mode="0"
      :size="size"
      :collapse-tags="true"
      :show-all-levels="false"
      :multiple="multiple"
      expand-trigger="hover"
      :placeholder="placeholder"
    />
    <CapitalSelect
      v-if="component==='CapitalSelect'"
      v-model="inputVal"
      :check-strictly="checkStrictly"
      :data-mode="0"
      :size="size"
      :collapse-tags="true"
      :show-all-levels="false"
      :multiple="multiple"
      expand-trigger="hover"
      :placeholder="placeholder"
    />
    <PersonSelect
      v-if="component==='PersonSelect'"
      v-model="inputVal"
      :check-strictly="checkStrictly"
      filterable
      clearable
      :size="size"
      :placeholder="placeholder"
      :multiple="multiple"
      :options="options"
    />
    <!-- 选择器类组件 -->
    <TreeSelect
      v-if="component==='TreeSelect'"
      v-model="inputVal"
      :check-strictly="checkStrictly"
      :options="options"
      :data-mode="0"
      :size="size"
      :collapse-tags="true"
      :show-all-levels="false"
      :multiple="multiple"
      expand-trigger="hover"
      :placeholder="placeholder"
    />
    <Select
      v-if="component==='Select'"
      v-model="inputVal"
      filterable
      clearable
      :size="size"
      :placeholder="placeholder"
      :multiple="multiple"
      :options="options"
    />

    <!-- 输入类组件 -->
    <InputRange v-if="component==='InputRange'" v-model="inputVal" clearable :size="size" :placeholder="placeholder" />
    <el-input v-if="component==='Input'" v-model="inputVal" clearable :size="size" :placeholder="placeholder" />
    <!-- <el-select  v-model="inputVal" filterable clearable :size="size" :placeholder="placeholder" :multiple="multiple">
      <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value">
        {{ option.value }}.{{ option.label }}
      </el-option>
    </el-select> -->

    <!-- 日期类组件 -->
    <template v-if="component === 'DatePicker'">
      <MyYearMonth
        v-if="'yearmonth'==dateType"
        v-model="inputVal"
        clearable
        :value-format="valueFormat"
        :size="size"
        :start-placeholder="placeholder"
        :end-placeholder="placeholder"
      />
      <MyDateRang
        v-else-if="'daterange'==dateType"
        v-model="inputVal"
        clearable
        :value-format="valueFormat"
        :size="size"
        :type="dateType"
        :start-placeholder="placeholder"
        :end-placeholder="placeholder"
      />
      <el-date-picker
        v-else
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

  </div>
</template>

<script>

import MyDateRang from './form/MyDateRang'
import InputRange from './form/InputRange'
import MyYearMonth from './form/MyYearMonth'
import OrgSelect from './form/OrgSelect'
import TreeSelect from './form/TreeSelect'
import CapitalSelect from './form/CapitalSelect'
// import PersonSelect from './PersonSelect'
import PersonSelect from './form/PersonSelect'
import Select from './form/Select'
export default {
  components: { InputRange, TreeSelect, OrgSelect, CapitalSelect, Select, MyDateRang, PersonSelect, MyYearMonth },
  model: { event: 'change', prop: 'value' },
  props: {
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    component: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '300px'
    },
    size: {
      type: String,
      default: 'small'
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    dateType: {
      type: String,
      default: 'daterange'
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: [Array, String, Number, Object, Date],
      default: ''
    }
  },
  computed: {
    inputVal: {
      set: function(val) {
        // console.log('期间设置', val[0], val[1])
        // if (this.component === 'DatePicker') {
        //   if (Array.isArray(val)) {
        //     val = val.map(t => {
        //       return t instanceof Date ? this.utils.parseTime(t) : t
        //     })
        //   } else {
        //     val = val instanceof Date ? this.utils.parseTime(val) : val
        //   }
        // }

        this.$emit('change', val)
      },
      get: function() {
        // console.log('获取', this.value)
        return this.value
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.my-input{
  display: inline-block;
  /deep/.el-select{
    .el-input__inner{
      padding-right:15px;
    }
  }
  /deep/.el-select, /deep/.el-date-editor{
    width: 100%;
  }
  /* /deep/.input-range{
    .el-input{
      width: 46%;
    }
  } */

}

</style>
