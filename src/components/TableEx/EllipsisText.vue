<template>
  <div
    ref="content"
    class="ellipsis-text"
    :style="{'-webkit-line-clamp':lineClamp}"
    v-html="content"
  />
</template>

<script>
export default {
  props: {
    content: {
      type: [String, Number],
      default: ''
    },
    lineClamp: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      timer: null
    }
  },
  mounted() {
    // 判断详情是否溢出
    window.addEventListener('resize', this.test)

    this.test()
  },
  methods: {
    /**
       * 判断文本是否溢出
       * 特殊：如果文字长度刚好达到某个临界值，会出现不及时刷新出现按钮的情况，解决方案：使用this.$nextTick强制刷新
       */
    test() {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$nextTick(() => {
          const content = this.$refs.content
          // console.log('执行了')
          this.timer = null
          this.$emit('ellipsis', content.clientHeight >= content.scrollHeight)
        })
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.column-wrapper{
    overflow: hidden;
    text-overflow: ellipsis;
    display:-webkit-box; //作为弹性伸缩盒子模型显示。
    -webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
    //-webkit-line-clamp:2; //显示的行
    height: 100%;
    width: 100%;
  }
</style>
