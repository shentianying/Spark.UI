<template>
  <div>
    <el-select
      ref="elSelect"
      :value="value"
      class="my-select"
      :disabled="disabled"
      :size="size"
      :multiple="multiple"
      collapse-tags
      :placeholder="placeholder"
      :loading="loading"
      @focus="selectProject"
    >
      <el-option
        v-for="(item,index) in ProjectList"
        :key="index"
        :label="item.projectName"
        :value="item.id"
      />
    </el-select>
    <selectBussinessInfo
      ref="selectBussinessInfo"
      :multiple="multiple"
      :dialog-width="dialogWidth"
      :max-item="maxItem"
      @getBussinessInfo="getBussinessInfo"
    />
  </div>
</template>

<script>
import selectBussinessInfo from '@/components/Other/ywgl/selectBussinessInfo'
import { getBussinessInfoList } from '@/api/ywgl/bussinessInfo'

/**
 * 对@/components/Other/ywgl/selectBussinessInfo组件的再一层封装
 * 原组件只有一个弹窗选择器,其余的需要额外写
 * 本组件在此基础上加上了输入框,还有根据项目id找到项目名称和组织名称的方法
 * input(v-model)返回项目id或其数组
 * change返回项目全部字段或其数组
 */
export default {
  name: 'BussinessInfoSelect',
  components: {
    selectBussinessInfo
  },
  props: {
    value: {
      type: [Number, String, Array],
      default: ''
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    },
    placeholder: { // 提示语
      type: String,
      default: '请选择项目'
    },
    size: { // 组件尺寸
      type: String,
      default: 'mini'
    },
    /**
     * 下面是原组件参数
     */
    dialogWidth: { type: String, default: '70%' }, // 弹出层的宽度
    multiple: { type: Boolean, default: false }, // 默认单选
    maxItem: { type: Number, default: 3 }, // 多选最大个数
    formState: { type: Number, default: 0 }, // 业务信息状态
    state: { type: Number, default: 10000 } // 立项状态
  },
  data() {
    return {
      loading: false,
      ProjectList: []
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    /**
     * 弹出选择框
     */
    selectProject() {
      this.$refs.elSelect.blur()
      this.$refs['selectBussinessInfo'].openDialog()
    },
    /**
     * 选择完成回调
     */
    getBussinessInfo(list) {
      console.log('输出', list)
      list = list || []
      if (this.multiple) {
        const newList = [...this.value, ...list]
        this.$emit('input', newList.map(v => v.id))
        this.$emit('change', newList)
      } else {
        this.$emit('input', list[0]?.id)
        this.$emit('change', list[0])
      }
    },
    /**
     * 获取所有项目
     */
    getProjectList() {
      const postData = {
        orgId: 0,
        state: this.state,
        formState: this.formState
      }
      getBussinessInfoList(postData).then(res => {
        this.ProjectList = res.data
        this.buttonLoading = false
      }).catch(() => { this.buttonLoading = false })
    }
  }

}
</script>
<style lang="scss" scoped>
.my-select {
  width: 100%;
}
</style>
