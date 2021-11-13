<template>
  <div class="search-bar">
    <el-form ref="SearchBar" :inline="true" :model="searchData" :label-width="labelWidth" :size="size">
      <!-- 遍历部分 -->
      <slot name="main">
        <el-form-item
          v-for="(item,key) in searchData.main"
          :key="item.name"
          :rules="item.rules"
          :label="item.label"
          :required="item.required || false"
          :prop="`main.${key}.value`"
        >
          <MyInput v-model="item.value" :props="{...item,width,size}" />
        </el-form-item><!--
          mian后备插槽
         --><slot name="main-other" />
      </slot><!--
        这里解决行内元素因回车换行产生的空白符（水平间隙）
  --><transition-group name="el-fade-in-linear">
        <slot name="auxiliary">
          <el-form-item
          v-for="(item,key) in searchData.auxiliary"
          v-show="showMore"
          :key="item.name"
          :required="item.required || false"
          :rules="item.rules"
          :label="item.label"
          :prop="`auxiliary.${key}.value`"
>
            <MyInput v-model="item.value" :props="{...item,width,size}" />
          </el-form-item><!--
           auxiliary后备插槽
          --><slot name="auxiliary-other" />
        </slot>
      </transition-group>

      <!-- 操作部分 -->
      <el-form-item label="">
        <slot name="action">
          <el-button class="margin-right" :loading="loading && loadingType === 'search'" type="primary" :size="size" @click="handleSearch('search')">查询</el-button>
          <el-button class="margin-right" :loading="loading && loadingType === 'reset'" type="default" :size="size" @click="resetSearchData">重置</el-button>
        </slot>
        <el-link v-if="showToggle" :size="size" :underline="false" class="margin-right" type="primary" @click="toggleState">
          <span v-show="showMore">收起<i class="el-icon-arrow-up" /></span>
          <span v-show="!showMore">展开<i class="el-icon-arrow-down" /></span>
        </el-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import MyInput from './MyInput/index.js'
export default {
  name: 'SearchBar',
  components: {
    MyInput
  },
  model: { event: 'change', prop: 'data' },
  props: {
    data: { type: Array, default() { // 该属性用于遍历表单组件
      return [
        /*  示例
        {
          name:'id',//属性名，当调用handleSearch事件时将返回一个对象该值作为属性名
          value:'1',//属性值，当调用handleSearch事件时将返回一个对象该值作为属性值
          defaultValue: '1', //默认值,当重置时会被设置成该值(废弃)
          component:'Input',//form组件类型,根据该值判断使用什么组件
          isMain:true, //默认显示，否则展开时展示

          //-------------以下当component为Select时有效---------------//
          multiple:false,
          checkStrictly:true,
          options:[ //用于遍历el-option，Option Attributes具体请参考element ui
            {
              label:'',
              value
            }
          ],

          //-------------以下当component为DatePicker时有效---------------//
          dateType:'daterange',  //对应DatePicker的type
          valueFormat: 'yyyy-MM-dd HH:mm:ss', //对应DatePicker的value-format
          //-------------以下为Form-Item Attributes具体请参考element ui-------------//
          label:'',
          placeholder:'',
          labelWidth:0px,
          required：false,
          rules:[]
        }
        */
      ]
    } },
    width: { type: String, default: '14vw' }, // 每个组件的宽度
    size: { type: String, default: 'mini' }, // 所有组件大小
    labelWidth: { type: String, default: '68px' }, // 作用与element ui form组件一致，请参考element ui
    search: { type: Function, default: async() => {} }, // 回调函数
    loading: { type: Boolean, default: false }, // 查询按钮的loading(使用sync绑定时会在回调函数search触发前后修改该值)
    showToggle: { type: Boolean, default: true } // 是否显示“展开”和“收起" 切换按钮
  },
  data() {
    return {
      showMore: false,
      loadingType: 'search'
      // backups: null
    }
  },
  computed: {
    searchData: {
      get() {
        const obj = {}
        const main = []
        const auxiliary = []
        this.data.forEach((item) => {
          const { name, value, isMain } = item
          obj[name] = value
          isMain ? main.push(item) : auxiliary.push(item)
        })
        return { data: this.data, obj, main, auxiliary }
      },
      set(val) {
        this.$emit('change', val.data)
      }
    }
  },
  // created() {
  //   if (this.backups === null) {
  //     this.backups = JSON.parse(JSON.stringify(this.searchData.data))
  //   }
  // },
  methods: {
    /**
     * @description: 重置所有参数并且触发搜索回调
     */
    resetSearchData() {
      this.loadingType = 'reset'
      // const data = this.searchData.data
      // data.forEach((item, index) => {
      //   let val = this.backups[index] ? this.backups[index].value : ''
      //   if (typeof item.defaultValue !== 'undefined') {
      //     val = item.defaultValue
      //   }
      //   this.$set(item, 'value', val)
      // })
      this.$refs['SearchBar'].resetFields()
      this.search('reset', this.getSearchData())
    },
    /**
     * @description: 以对象方式返回所有参数(data数组每一项的label作为key，value作为值)
     * @return {Object} 所有参数
     */
    getSearchData() {
      // const obj = {}
      //   this.data.forEach(({name,value}) => {
      //     obj[name] = value
      //   })

      return this.searchData.obj
    },
    /**
     * @description: 触发search回调，接受promise
     * @return {*}
     */
    async handleSearch(type) {
      this.loadingType = 'search'
      // this.$emit('update:loading', true)

      // this.$emit('update:loading', false)
      this.$refs['SearchBar'].validate((valid) => {
        if (valid) {
          this.search(type, this.getSearchData())
        }
      })
    },
    toggleState() {
      this.showMore = !this.showMore
    },
    /**
     * 设置搜索栏的设置项的某个值
     * @param {String} name searchData的name,用来当作唯一标识找到对应项
     * @param {String} key 想要改变项的键名
     * @param {*} data 想要覆盖的值
     * @param {String} model 设置模式-cover:直接覆盖,init:如果目标为空的话才会覆盖
     */
    setData(name, key, data, model = 'cover') {
      const target = this.data.find(v => v.name === name)
      if (!target) throw new Error(`SearchBar setData: 没有找到对应项,请检查name输入是否正确`)
      if (model === 'cover') {
        target[key] = data
      } else if (model === 'init') {
        if ((!target[key] || !target[key].length)) {
          target[key] = data
        }
      } else {
        throw new Error('SearchBar setData: 没有对应的模式,请检查model输入是否正确')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-bar {
  display: flex;
  flex-wrap: wrap;
  /deep/.el-form{
  .el-form-item__label{
    font-weight: normal;
    }
  }
  .margin-right{
    margin-left: 0;
    margin-right: 10px;
  }
}
</style>
