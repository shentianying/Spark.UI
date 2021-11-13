/**
 * 本组件用于实现对jsx的支持,使得在vue templete中可以使用jsx
 */
export default {
  name: 'JSX',
  props: {
    render: {
      type: Function,
      default() {
        return h => (<div />)
      }
    }
  },
  render(h) {
    return this.render(h)
  }
}
