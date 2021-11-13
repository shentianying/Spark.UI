import request from '@/utils/request'

export function getStorageOutById(params) {
  return request({
    url: '/api/cggl/storageOut/getStorageOutById',
    method: 'get',
    params
  })
}

export function getStorageOutPaging(data) {
  return request({
    url: '/api/cggl/storageOut/getStorageOutPaging',
    method: 'post',
    data
  })
}

export function addStorageOut(data) {
  return request({
    url: '/api/cggl/storageOut/addStorageOut',
    method: 'post',
    data
  })
}

export function putStorageOut(data) {
  return request({
    url: '/api/cggl/storageOut/putStorageOut',
    method: 'put',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/storageOut/getBillFlow',
    method: 'post',
    data
  })
}

export function deleteStorageOut(params) {
  return request({
    url: '/api/cggl/storageOut/deleteStorageOut',
    method: 'delete',
    params
  })
}
export function getDefaultInfo(params) {
  return request({
    url: '/api/cggl/storageOut/getDefaultInfo',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/storageOut/addAttitude',
    method: 'post',
    data
  })
}
