import request from '@/utils/request'

export function getClassInfo(params) {
  return request({
    url: '/api/Home/getClassInfo',
    method: 'get',
    params
  })
}
export function exceptionTest(params) {
  return request({
    url: '/ExceptionTest',
    method: 'get',
    params
  })
}

