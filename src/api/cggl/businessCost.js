import request from '@/utils/request'

export function getBusinessCostPaging(data) {
  return request({
    url: '/api/cggl/businessCost/getBusinessCostPaging',
    method: 'post',
    data
  })
}
export function addBusinessCost(data) {
  return request({
    url: '/api/cggl/businessCost/addBusinessCost',
    method: 'post',
    data
  })
}
export function putBusinessCost(data) {
  return request({
    url: '/api/cggl/businessCost/putBusinessCost',
    method: 'put',
    data
  })
}
export function checkBusinessCostDetail(data) {
  return request({
    url: '/api/cggl/businessCost/checkBusinessCostDetail',
    method: 'post',
    data
  })
}
export function getBusinessCostById(params) {
  return request({
    url: '/api/cggl/businessCost/getBusinessCostById',
    method: 'get',
    params
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/cggl/businessCost/getBillFlow',
    method: 'post',
    data
  })
}
export function putBusinessCostState(params) {
  return request({
    url: '/api/CGGL/businessCost/putBusinessCostState',
    method: 'get',
    params
  })
}
export function getBusinessCostBillAttitudeById(params) {
  return request({
    url: '/api/cggl/businessCost/getBusinessCostBillAttitudeById',
    method: 'get',
    params
  })
}
export function deleteBusinessCost(params) {
  return request({
    url: '/api/cggl/businessCost/deleteBusinessCost',
    method: 'delete',
    params
  })
}
export function getBusinessCostDetailsByOrgId(params) {
  return request({
    url: 'api/cggl/businessCost/GetBusinessCostDetailsByOrgId',
    method: 'get',
    params
  })
}
export function getBusinessCostDetailById(params) {
  return request({
    url: 'api/cggl/businessCost/getBusinessCostDetailById',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/businessCost/addAttitude',
    method: 'post',
    data
  })
}
