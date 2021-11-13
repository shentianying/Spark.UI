import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

console.info(process.env.ENV)
// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/test' : process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 判断是不是返回的流数据
    if (response.headers['content-type'] === 'application/octet-stream') {
      return res
    }

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      // 页面没有权限跳转处理
      if (res.code === 404) {
        router.replace({ path: '/404' })
        return false
      }
      // jwt 过期
      if (res.code === 401) {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        router.replace({ path: '/login' })
      }

      // if (response.request.responseType === 'blob') {
      //   var reader = new FileReader()
      //   reader.readAsText(res, 'utf-8')
      //   reader.onload = function() {
      //     var jsonRes = JSON.parse(reader.result)
      //     Message({
      //       message: jsonRes.message || 'Error',
      //       type: 'error',
      //       duration: 5 * 1000
      //     })
      //   }
      // } else {
      Message({
        message: res.message || res.errorMsg,
        type: 'error',
        duration: 5 * 1000
      })
      // }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
