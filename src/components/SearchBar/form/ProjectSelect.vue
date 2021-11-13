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
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <select-project
      ref="projectRef"
      :multiple="multiple"
      :dialog-width="dialogWidth"
      :max-item="maxItem"
      :project-state="projectState"
      :is-show="isShow"
      :org-id="orgId"
      :is-auth="isAuth"
      @getProject="getProjectId"
    />
  </div>
</template>

<script>
import SelectProject from '@/components/Other/xmgl/selectProject'
import { getProjectList } from '@/api/xmgl/project'

/**
 * 对@/components/Other/xmgl/selectProject组件的再一层封装
 * 原组件只有一个弹窗选择器,其余的需要额外写
 * 本组件在此基础上加上了输入框,还有根据项目id找到项目名称和组织名称的方法
 * input(v-model)返回项目id或其数组
 * change返回项目全部字段或其数组
 */
export default {
  name: 'ProjectSelect',
  components: {
    SelectProject
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
    multiple: { // 多选
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
    maxItem: { type: Number, default: 3 }, // 多选最大个数
    projectState: { type: [Array, Number], default: () => [] }, // 项目状态,接受数组或数字
    isShow: { type: Number, default: 1 }, // 是否立项（1：表示只选已立项，0:只选未立项,null都选择）
    fields: { type: String, default: '' }, // 需要带出的参数 （eg:ContractDuration,Area），不写返回id,name,number,orgid,companyId,projectState,orgStr,仅限返回project里字段
    orgId: { type: Number, default: null }, // 组织机构
    isAuth: { type: Boolean, default: false } // 是否只显示当前用户数据范围内的数据
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
      this.$refs['projectRef'].openDialog()
    },
    /**
     * 选择完成回调
     */
    getProjectId(list) {
      list = list || []

      if (this.multiple) {
        const newList = [...this.value, ...list]
        this.$emit('input', newList.map(v => v.id))
        this.$emit('change', newList)
        this.$emit('select', newList)
      } else {
        this.$emit('input', list[0]?.id)
        this.$emit('change', list[0])
        this.$emit('select', list[0])
      }
    },
    /**
     * 获取所有项目
     */
    getProjectList() {
      getProjectList({
        fields: '',
        isAuth: false,
        isShow: null,
        name: '',
        orgId: 0,
        stateIds: []
      }).then(res => {
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
