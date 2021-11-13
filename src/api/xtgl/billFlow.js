import request from '@/utils/request'

export function getBillFlowPaging(params) {
  return request({
    url: '/api/xtgl/billFlow/getBillFlowPaging',
    method: 'get',
    params
  })
}
export function getMyBillFlowShowCount(params) {
  return request({
    url: '/api/xtgl/billFlow/getMyBillFlowShowCount',
    method: 'get',
    params
  })
}
export function initMyBillFlow(params) {
  return request({
    url: '/api/xtgl/billFlow/initMyBillFlow',
    method: 'get',
    params
  })
}
export function isCheckUp(params) {
  return request({
    url: '/api/xtgl/billFlow/isCheckUp',
    method: 'get',
    params
  })
}

export function addBillFlowNodes(data) {
  return request({
    url: '/api/xtgl/billFlow/addBillFlowNodes',
    method: 'post',
    data
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/xtgl/billFlow/addAttitude',
    method: 'post',
    data
  })
}
export function initAttitude(params) {
  return request({
    url: '/api/xtgl/billFlow/initAttitude',
    method: 'get',
    params
  })
}
