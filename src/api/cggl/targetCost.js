import request from '@/utils/request'

export function getTargetCostPaging(data) {
  return request({
    url: '/api/cggl/targetCost/getTargetCostPaging',
    method: 'post',
    data
  })
}
export function addTargetCost(data) {
  return request({
    url: '/api/cggl/targetCost/addTargetCost',
    method: 'post',
    data
  })
}
export function putTargetCost(data) {
  return request({
    url: '/api/cggl/targetCost/putTargetCost',
    method: 'put',
    data
  })
}
export function checkTargetCostDetail(data) {
  return request({
    url: '/api/cggl/targetCost/checkTargetCostDetail',
    method: 'post',
    data
  })
}
export function getTargetCostById(params) {
  return request({
    url: '/api/cggl/targetCost/getTargetCostById',
    method: 'get',
    params
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/cggl/targetCost/getBillFlow',
    method: 'post',
    data
  })
}
export function putTargetCostState(params) {
  return request({
    url: '/api/CGGL/targetCost/putTargetCostState',
    method: 'get',
    params
  })
}
export function getTargetCostBillAttitudeById(params) {
  return request({
    url: '/api/cggl/targetCost/getTargetCostBillAttitudeById',
    method: 'get',
    params
  })
}
export function deleteTargetCost(params) {
  return request({
    url: '/api/cggl/targetCost/deleteTargetCost',
    method: 'delete',
    params
  })
}
export function checkDetailDistinct(data) {
  return request({
    url: '/api/cggl/targetCost/checkDetailDistinct',
    method: 'post',
    data
  })
}
export function getTargetCostDetailAllByOrgId(params) {
  return request({
    url: '/api/cggl/targetCost/getTargetCostDetailAllByOrgId',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/targetCost/addAttitude',
    method: 'post',
    data
  })
}
