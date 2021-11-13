import request from '@/utils/request'

export function getAllocationById(params) {
  return request({
    url: '/api/cggl/allocation/getAllocationById',
    method: 'get',
    params
  })
}

export function getAllocationPaging(data) {
  return request({
    url: '/api/cggl/allocation/getAllocationPaging',
    method: 'post',
    data
  })
}

export function addAllocation(data) {
  return request({
    url: '/api/cggl/allocation/addAllocation',
    method: 'post',
    data
  })
}

export function putAllocation(data) {
  return request({
    url: '/api/cggl/allocation/putAllocation',
    method: 'put',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/allocation/getBillFlow',
    method: 'post',
    data
  })
}

export function deleteAllocation(params) {
  return request({
    url: '/api/cggl/allocation/deleteAllocation',
    method: 'delete',
    params
  })
}

export function storageAllot(params) {
  return request({
    url: '/api/cggl/allocation/storageAllot',
    method: 'get',
    params
  })
}
export function getDefaultInfo(params) {
  return request({
    url: '/api/cggl/allocation/getDefaultInfo',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/allocation/addAttitude',
    method: 'post',
    data
  })
}
