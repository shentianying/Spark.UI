import './index.scss'

export default {
  model: { event: 'change', prop: 'value' },
  props: {
    value: {
      type: [Array, String, Number, Object, Date],
      default: ''
    },
    props: {
      type: Object,
      default() { return {} }
    }
  },
  methods: {
    label2Hump(label) {
      let hump = label
      if (typeof label === 'string') {
        hump = label.split('-')
          .map(str => str.replace(/(\s|^)[a-z]/g, char => char.toUpperCase()))
          .join('')
      }
      return hump
    }
  },
  render(h) {
    const self = this
    const { width } = this.props
    // const name = this.label2Hump(this.props.component)
    let component = this.props.component
    if (typeof component === 'string') {
      try {
        component = require('../form/' + component).default
      } catch (e) {
        component = this.$options.components[component] || component
        if (typeof component === 'string') {
          console.warn(`找不到<${component}>组件，当前使用<${component}>标签`)
        }
      }
    } else if (typeof component === 'function') {
      throw new Error('SearchBar不支持懒加载')
    }
    const { event, prop } = component.model || { event: /input/i.test(component) ? 'input' : 'change', prop: 'value' }
    return h(
      component,
      {
        style: {
          width
        },
        class: {
          'my-input': true
        },
        attrs: self.props,
        props: {
          ...self.props,
          [prop]: self.value
        },
        on: {
          [event](e) {
            self.$emit('change', component ? e : e.target.value)
          }
        }
      }
    )
  }
}
