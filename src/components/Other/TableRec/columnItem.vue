<template>
  <el-table-column
    :prop="col.prop"
    :label="col.label"
    :align="col.align"
    width="auto"
    :min-width="col.width"
    :fixed="col.isFixed"
  >
    <template v-if="col.children">
      <column-item
        v-for="(item, index) in col.children"
        :key="index"
        :col="item"
        :attend-options="attendOptions"
      />
    </template>
    <template #default="scope">
      <label v-if="col.dateType==='label'">{{ scope.row[col.value] }}</label>
      <el-input
        v-if="col.dateType==='input'"
        v-model="scope.row[col.value]"
        size="mini"
      />
      <el-select
        v-if="col.dateType==='select'"
        v-model="scope.row[col.value]"
        size="mini"
        style="width:100%"
      >
        <el-option
          v-for="(option_item, option_index) in attendOptions"
          :key="option_index"
          :label="option_item.name"
          :value="option_item.value"
        />
      </el-select>
    </template>
    <!-- <template v-if="col.isHeader===true" slot="header" slot-scope="scope">
      <el-select
        v-if="col.dateType==='select'"
        v-model="scope.row[col.value]"
        :size="size"
        :placeholder="col.placeholder"
        style="width:100%"
      >
        <el-option
          v-for="(option_item, option_index) in attendOptions"
          :key="option_index"
          :label="option_item.name"
          :value="option_item.value"
        />
      </el-select>
    </template>
    <template slot-scope="scope">
      <el-input
        v-if="col.dateType==='input'"
        v-model="scope.row[col.value]"
        :placeholder="col.placeholder"
        :size="size"
        :maxlength="col.maxlength"
      />
      <el-select
        v-if="col.dateType==='select'"
        v-model="scope.row[col.value]"
        :size="size"
        :placeholder="col.placeholder"
        style="width:100%"
      >
        <el-option
          v-for="(option_item, option_index) in attendOptions"
          :key="option_index"
          :label="option_item.name"
          :value="option_item.value"
        />
      </el-select>
      <label v-if="col.dateType==='label'">{{ scope.row[col.value] }}</label>
    </template> -->
  </el-table-column>
</template>
<script>
import ColumnItem from './columnItem'
export default {
  name: 'ColumnItem',
  components: {
    ColumnItem
  },
  props: {
    col: {
      type: Object,
      default: () => {}
    },
    attendOptions: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
  }
}
</script>
