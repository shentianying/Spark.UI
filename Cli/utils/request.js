const axios = require('axios')

const service = axios.create({
  baseURL: 'http://218.91.205.38/Spark/Api/'
})

service.interceptors.response.use(
  response => {
    const res = response.data
    // 判断是不是返回的流数据
    if (response.headers['content-type'] === 'application/octet-stream') {
      return res
    }
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    return Promise.reject(error)
  }
)

module.exports = service
