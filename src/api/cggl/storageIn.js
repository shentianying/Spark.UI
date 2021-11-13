import request from '@/utils/request'

export function getStorageInById(params) {
  return request({
    url: '/api/cggl/storageIn/getStorageInById',
    method: 'get',
    params
  })
}

export function getStorageInPaging(data) {
  return request({
    url: '/api/cggl/storageIn/getStorageInPaging',
    method: 'post',
    data
  })
}

export function addStorageIn(data) {
  return request({
    url: '/api/cggl/storageIn/addStorageIn',
    method: 'post',
    data
  })
}

export function putStorageIn(data) {
  return request({
    url: '/api/cggl/storageIn/putStorageIn',
    method: 'put',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/storageIn/getBillFlow',
    method: 'post',
    data
  })
}

export function deleteStorageIn(params) {
  return request({
    url: '/api/cggl/storageIn/deleteStorageIn',
    method: 'delete',
    params
  })
}

export function getStorageInDetailPaging(data) {
  return request({
    url: '/api/cggl/storageIn/getStorageInDetailPaging',
    method: 'post',
    data
  })
}
export function getDefaultInfo(params) {
  return request({
    url: '/api/cggl/storageIn/getDefaultInfo',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/storageIn/addAttitude',
    method: 'post',
    data
  })
}
