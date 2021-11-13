<template>
  <el-form
    ref="myForm"
    class="my-form"
    :model="formData"
    :rules="rules"
    :label-width="labelWidth"
    :size="size"
  >
    <el-row v-for="(row,index) in formList" :key="index">
      <el-col v-for="(col,colIndex) in row" :key="colIndex" :span="12">
        <el-form-item :label="col.label" label-suffix=":" :prop="col.keyword">
          <!-- <JSXCompiler v-model="formData[col.keyword]" v-bind="col.props" :style="{width: col.width || inputWidth}" @change="handelChange($event,col.keyword)" /> -->
          <JSXCompiler v-if="col.render" :style="{width: col.width || inputWidth}" :render="col.render" />
          <component :is="col.component" v-else-if="col.value" v-model="col.value" v-bind="{...col.props,size}" :style="{width: col.width || inputWidth}" @change="handelChange($event,col.keyword)" @select="handelSelect($event, col.keyword)" />
          <component :is="col.component" v-else v-model="formData[col.keyword]" v-bind="{...col.props,size}" :style="{width: col.width || inputWidth}" @change="handelChange($event,col.keyword)" @select="handelSelect($event, col.keyword)" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import JSXCompiler from './JSXCompiler'
import UpFile from '@/components/UpLoad/UpFile'
// import MyInput from '@/components/SearchBar/MyInput'
const components = {}
const context = require.context(
  '@/components/SearchBar/form/', // 组件所在目录的相对路径
  false, // 是否查询其子目录
  /[A-Z]\w+\.(vue|js)$/ // 匹配基础组件文件名的正则表达式
)
context.keys().forEach(fileName => {
  // 获取文件名
  var fname = fileName.split('/').pop().replace(/\.\w+$/, '')
  // 获取组件配置
  const componentConfig = context(fileName)
  // 若该组件是通过"export default"导出的，优先使用".default"，否则退回到使用模块的根
  components[fname] = componentConfig.default || componentConfig
})
export default {
  name: 'MyForm',
  components: {
    // MyInput
    ...components,
    JSXCompiler,
    UpFile
  },
  props: {
    type: {// 类型,可选值: Edit:表单,details: 详情
      type: String,
      default: 'Edit'
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    inputWidth: {
      type: String,
      default: '272px'
    },
    rules: {// 表单校验规则
      type: Object,
      default() {
        return {}
      }
    },
    formData: {// 表单数据
      type: Object,
      default() {
        return {}
      }
    },
    formNode: {// 表单结构
      type: Array,
      default() {
        return []
      }
    },
    size: {// 表单组件的尺寸
      type: String,
      default: 'mini'
    }
  },
  computed: {
    /**
     * 计算表单结构
     */
    formList() {
      const { formNode } = this
      const myList = []
      for (const value of formNode) {
        // 增加对 if的支持,如果if为false就直接不显示
        // 这里必须这么写,不能写!value.if 这样的,因为这样的话 不传也会不渲染,我们需要默认渲染
        if (value.if === false) continue
        const length = myList.length
        const me = {
          ...value,
          component: value.component || 'elInput'
        }
        if (length > 0 && myList[ length - 1].length < 2 && !myList[ length - 1][0].monopolize && !value.monopolize) {
          // 往上一行添加一个
          myList[ length - 1].push(me)
        } else {
          myList.push([me])
        }
      }
      return myList
    }
  },
  methods: {
    /**
     * 处理子组件的change事件(如果有的话)
     * @param {*} data 子组件事件传出来的数据
     * @param {String} key 此项的key,可以作为触发的标识
     */
    handelChange(data, key) {
      this.$emit(`${key}Change`, data)
    },
    /**
     * 处理子组件的select事件(如果有的话)
     * @param {*} data 子组件事件传出来的数据
     * @param {String} key 此项的key,可以作为触发的标识
     */
    handelSelect(data, key) {
      this.$emit(`${key}Select`, data)
    },
    /**
     * el-form validate的封装
     * 提前判断是否校验通过,这样就不用在外面每次都写一遍if了
     * 为了更方便的兼容以前的代码还是会把表单校验状态传出去,但已不建议使用
     */
    validate(cb) {
      this.$refs['myForm'].validate((valid, obj) => {
        if (valid) cb(valid, obj)
      })
    },
    resetFields() {
      this.$refs['myForm'].resetFields()
    },
    clearValidate(...params) {
      this.$refs['myForm'].clearValidate(...params)
    }
  }
}
</script>
<style lang="scss" scoped>
  .my-form {
    /deep/ .el-form-item__label{
      font-weight: normal;
      color: #101010;
    }
  }
</style>
