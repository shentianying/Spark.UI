<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="list"
      border
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="票号" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.ticketNumber }}
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'AcceptanceList',
  components: {
  },
  props: {
    obj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  computed: {
  },
  watch: {
  },
  activated() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      this.list = this.obj.list
      this.loading = false
    }
  }
}
</script>

<style scoped>
.flex_div{
  text-align:left; padding-right:20px; margin-bottom:10px; display:flex;justify-content:flex-end;
}
</style>
