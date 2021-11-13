<template>
  <div class="PersonSelect2">
    <selectCostPlan ref="planRef" v-model="inputVal" :multiple="multiple" :max-item="maxItem" @getcostPlan="getcostPlan" />
    <el-select
      ref="elSelect"
      v-model="inputVal"
      :disabled="disabled"
      :size="size"
      :multiple="multiple"
      collapse-tags
      clearable
      :placeholder="placeholder"
      :loading="loading"
      @focus="selectPlan"
    >
      <el-option
        v-for="(item,index) in plantList"
        :key="index"
        :label="item[opLabel]"
        :value="item[opValue]"
      />
    </el-select>
  </div>
</template>

<script>
import { GetCostPlanPaging } from '@/api/cwgl/CostPlan'
import selectCostPlan from '@/components/Other/fpgl/selectCostPlan'
export default {
  name: 'CostPlanSelect',
  components: { selectCostPlan },
  model: { event: 'change', prop: 'value' },
  props: {
    props: {
      type: Object,
      default() {
        return {
          value: 'id',
          label: 'name'
        }
      }
    },
    propsValue: { type: String, default: '' }, // 与props.value作用相同，但优先于其
    propsLabel: { type: String, default: '' }, // 与props.value作用相同，但优先于其

    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '选择'
    },
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: [Array, String, Number],
      default: ''
    },
    maxItem: { type: Number, default: 3 } // 多选最大个数
  },
  data() {
    return {
      plantList: [],
      loading: false
    }
  },
  computed: {
    opLabel() {
      return this.propsLabel || this.props.label
    },
    opValue() {
      return this.propsValue || this.props.value
    },
    inputVal: {
      set(val) {
        this.$emit('change', val)
        let select
        if (this.multiple) {
          select = this.plantList.filter(({ id }) => val.includes(id))
        } else {
          select = this.plantList.filter(({ id }) => id === val)[0]
        }
        this.$emit('select', select)
      },
      get() {
        return this.value
      }
    }
  },
  created() {
    this.getCostPlantList()
  },
  methods: {
    getcostPlan(list) {
      list = list || []
      if (this.multiple) {
        this.inputVal = [...this.inputVal, ...list.map(item => item.id)]
      } else {
        this.inputVal = list[0].id
      }
    },
    selectPlan() {
      this.$refs.elSelect.blur()
      this.$refs.planRef.openDialog()
    },
    async getCostPlantList() {
      try {
        this.loading = true
        const res = await GetCostPlanPaging({ currentPage: 1, pageSize: this.utils.getPersonalSettings().pageSize, states: [10000], type: 3 })
        this.plantList = res.data
      } finally {
        this.loading = false
      }
    }
    // getRemotePerson(query) {
    //   query = query.trim()
    //   if (query !== '') {
    //     this.loading = true
    //     setTimeout(() => {
    //       getPersonList({name:query}).then(response => {
    //         this.personList = response.data
    //         this.loading = false
    //       })
    //     }, 200)
    //   } else {
    //     this.personList = []
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.PersonSelect2{
  width: 100%;
  /deep/.el-select{
    width: 100%;
  }
}
</style>
