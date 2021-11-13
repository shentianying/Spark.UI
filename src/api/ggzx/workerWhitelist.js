import request from '@/utils/request'

export function getWhitelistPaging(data) {
  return request({
    url: '/api/ggzx/workerWhitelist/getWhitelistPaging',
    method: 'post',
    data
  })
}

export function getFormById(params) {
  return request({
    url: '/api/ggzx/workerWhitelist/getFormById',
    method: 'get',
    params
  })
}
export function saveData(data) {
  return request({
    url: '/api/ggzx/workerWhitelist/saveData',
    method: 'post',
    data
  })
}
export function deleteData(params) {
  return request({
    url: '/api/ggzx/workerWhitelist/deleteData',
    method: 'delete',
    params
  })
}
