import request from '@/utils/request'

export function getCoordinationFeePaging(data) {
  return request({
    url: '/api/xmgl/CoordinationFee/getCoordinationFeePaging',
    method: 'post',
    data
  })
}

export function addCoordinationFee(data) {
  return request({
    url: '/api/xmgl/CoordinationFee/addCoordinationFee',
    method: 'post',
    data
  })
}

export function putCoordinationFee(data) {
  return request({
    url: '/api/xmgl/CoordinationFee/putCoordinationFee',
    method: 'put',
    data
  })
}

export function deleteCoordinationFee(params) {
  return request({
    url: '/api/xmgl/CoordinationFee/deleteCoordinationFee',
    method: 'delete',
    params
  })
}

export function getCoordinationFeeById(params) {
  return request({
    url: '/api/xmgl/CoordinationFee/getCoordinationFeeById',
    method: 'get',
    params
  })
}

export function getCoordinationFeeAttitudeById(params) {
  return request({
    url: '/api/xmgl/CoordinationFee/getCoordinationFeeAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/xmgl/CoordinationFee/getBillFlow',
    method: 'post',
    data
  })
}

