<template>
  <div class="PersonSelect2">
    <select-person ref="personRef" :multiple="multiple" @getPersons="getPersons" />
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
      @focus="selectPerson"
    >
      <el-option
        v-for="(item,index) in personList"
        :key="index"
        :label="item[opLabel]"
        :value="item[opValue]"
      />
    </el-select>
  </div>
</template>

<script>
import { getPersonList } from '@/api/rsgl/person'
import SelectPerson from '@/components/Other/selectPerson'
export default {
  name: 'PersonSelect2',
  components: { SelectPerson },
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
      default: 'mini'
    },
    value: {
      type: [Array, String, Number],
      default: ''
    }
  },
  data() {
    return {
      personList: [],
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
          select = this.personList.filter(({ id }) => val.includes(id))
        } else {
          select = this.personList.filter(({ id }) => id === val)[0]
        }

        this.$emit('select', select)
      },
      get() {
        return this.value
      }
    }
  },
  created() {
    this.getPersonList()
  },
  methods: {
    getPersons(personList) {
      if ((personList || []).length > 0) {
        // this.personList = [...this.personList, ...personList.map(m => { return { id: m.id, name: m.name } })]
        this.$nextTick(() => {
          if (this.multiple) {
            this.inputVal = [...this.inputVal, ...personList.map(item => item.id)]
          } else {
            this.inputVal = personList[0].id
          }
        })
      }
    },
    selectPerson() {
      this.$refs.elSelect.blur()
      this.$refs.personRef.openDialog()
    },
    async getPersonList() {
      try {
        this.loading = true
        const res = await getPersonList()
        this.personList = res.data
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
