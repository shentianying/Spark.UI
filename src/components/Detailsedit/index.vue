<template>
  <div class="common-content">
    <!-- 详情 -->
    <template v-if="status === 'checkInfo'">
      <div class="info-box">
        <el-row v-for="(row, index) in detailList" :key="index">
          <el-col v-for="(col,colIndex) in row" :key="colIndex" :span="12">
            <span class="info-text">
              <span class="info-label" :style="`width: ${labelWidth}px`">{{ col.label }}：</span>
              <span v-if="!col.component" :class="col.class" class="info-value" @click="(...args)=>infoItemClick(col,args)">{{ col.value }} {{ col.unit ? col.unit : '' }}</span>
              <component
                :is="col.component"
                v-if="col.component"
                v-model="col.value"
                :is-upfile="false"
                :is-preview="true"
                :is-delete="false"
              />
            </span>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
/**
 * @props
 * status: 控制组件显示详情
 * infoList: 显示详情的数据
 * labelWidth: label的宽度
 */
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'Detailsedit',
  components: {
    UpFile
  },
  props: {
    status: {
      type: String,
      default: ''
    },
    infoList: {
      type: Array,
      default() {
        return []
      }
    },
    labelWidth: {
      type: Number,
      default: 100
    }
  },
  computed: {
    /**
     * 计算表单结构
     */
    detailList() {
      const { infoList } = this
      const newList = []
      for (const value of infoList) {
        const length = newList.length
        const item = {
          ...value,
          component: value.component || ''
        }
        if (length > 0 && newList[ length - 1].length < 2 && !newList[ length - 1][0].monopolize && !value.monopolize) {
          // 往上一行添加一个
          newList[ length - 1].push(item)
        } else {
          newList.push([item])
        }
      }
      return newList
    }
  },
  mounted() {},
  methods: {
    infoItemClick(item, ...args) {
      typeof item.click === 'function' && item.click(...args)
    }
  }
}
</script>

<style lang="scss" scoped>
.common-content {
  // 项目详情的样式修改
  .info-box {
    padding: 0 32px;
    .info-text {
      margin-bottom: 16px;
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      display: flex;
      align-items: top;
      .info-label {
        text-align: right;
        width: 100px;
        display: inline-block;
        flex-shrink: 0; /* 防止label元素被挤压 */
      }
    }
  }
}
</style>
