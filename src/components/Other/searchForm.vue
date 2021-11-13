<template>

  <!-- 简单搜索框 -->
  <div class="marginBottom">
    <!--第一行条件-->
    <el-row class="marginBottom">
      <el-col :span="spans[0]">
        <!--第一行插入的搜索条件-->
        <slot name="row1" />
      </el-col>
      <el-col :span="spans[1]" style="text-align:right">
        <!--search插槽 -->
        <slot name="search" />
        <el-link v-if="showToggle" type="primary" @click="toggleState">{{ showMore?'收起':'展开' }}</el-link>
        <!--other插槽，向搜索按钮其他地方插入内容-->
        <slot name="other" />
      </el-col>
    </el-row>

    <!--搜索展开行-->
    <transition name="el-fade-in-linear">
      <el-row v-show="showMore">
        <el-col :span="spans[0]">
          <!--展开行插入的搜索条件-->
          <slot name="row2" />
        </el-col>
        <el-col :span="spans[1]" />
      </el-row>
    </transition>
  </div>
</template>
<script>

export default {
  name: 'SearchForm',
  components: {
  },
  props: {
    showToggle: { type: Boolean, default: true }, // 是否显示“展开”和“收起" 切换按钮
    spans: { type: Array, default: () => { return [20, 4] } } // 删格 比例。2个长度的数组，2个数加起来必须是24
  },
  data() {
    return {
      showMore: false,
      loading: false
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    fetchData() {
    },
    toggleState() {
      this.showMore = !this.showMore
    }

  }
}
</script>
<style scoped>
.marginBottom {
margin-bottom: 5px;
}
</style>
