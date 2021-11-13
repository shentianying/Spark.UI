import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as Utils from '@/utils/index'
// import vueConfig from 'vue.config'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}
// 默认配置
ElementUI.Dialog.props.closeOnClickModal.default = false
ElementUI.Dialog.props.top.default = '10vh'
// 小屏幕弹窗全屏显示
if (document.body.clientWidth < 768) {
  ElementUI.Dialog.props.fullscreen = { type: Boolean, default: true }
}
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.directive('has', function(el, binding) {
  // 我的角色权限中查找对应的权限码
  // 加上可选链式操作符,因为不加的话,退出登录的时候会报错,估计是因为会清除用户数据的缘故
  const hasButton = store?.getters?.info?.rolePermitList?.filter(f => f.permit.code.toLowerCase() === binding.value.toLowerCase())
  // 找不到就删除 按钮
  if (!hasButton.length) { el.remove() }
})

Vue.filter('dateTimeFormat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr) { return moment(dataStr).format(pattern) } else { return dataStr }
})
Vue.filter('dateFormat', function(dataStr, pattern = 'YYYY-MM-DD') {
  if (dataStr) { return moment(dataStr).format(pattern) } else { return dataStr }
})
Vue.filter('fileSize', function(size) {
  return Utils.getFileSize(size)
  // if (dataStr) { return moment(dataStr).format(pattern) } else { return dataStr }
})
Vue.prototype.utils = Utils
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

