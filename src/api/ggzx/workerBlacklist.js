import request from '@/utils/request'

export function getBlacklistPaging(data) {
  return request({
    url: '/api/ggzx/workerBlacklist/getBlacklistPaging',
    method: 'post',
    data
  })
}

export function getFormById(params) {
  return request({
    url: '/api/ggzx/workerBlacklist/getFormById',
    method: 'get',
    params
  })
}
export function saveData(data) {
  return request({
    url: '/api/ggzx/workerBlacklist/saveData',
    method: 'post',
    data
  })
}
export function deleteData(params) {
  return request({
    url: '/api/ggzx/workerRegister/deleteData',
    method: 'delete',
    params
  })
}
