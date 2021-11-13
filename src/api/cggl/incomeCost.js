import request from '@/utils/request'

export function getIncomeCostPaging(data) {
  return request({
    url: '/api/cggl/incomeCost/getIncomeCostPaging',
    method: 'post',
    data
  })
}
export function addIncomeCost(data) {
  return request({
    url: '/api/cggl/incomeCost/addIncomeCost',
    method: 'post',
    data
  })
}
export function putIncomeCost(data) {
  return request({
    url: '/api/cggl/incomeCost/putIncomeCost',
    method: 'put',
    data
  })
}
export function checkIncomeCostDetail(data) {
  return request({
    url: '/api/cggl/incomeCost/checkIncomeCostDetail',
    method: 'post',
    data
  })
}
export function getIncomeCostById(params) {
  return request({
    url: '/api/cggl/incomeCost/getIncomeCostById',
    method: 'get',
    params
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/cggl/incomeCost/getBillFlow',
    method: 'post',
    data
  })
}
export function putIncomeCostState(params) {
  return request({
    url: '/api/CGGL/incomeCost/putIncomeCostState',
    method: 'get',
    params
  })
}
export function getIncomeCostBillAttitudeById(params) {
  return request({
    url: '/api/cggl/incomeCost/getIncomeCostBillAttitudeById',
    method: 'get',
    params
  })
}
export function deleteIncomeCost(params) {
  return request({
    url: '/api/cggl/incomeCost/deleteIncomeCost',
    method: 'delete',
    params
  })
}
export function getIncomeCostDetailsByOrgId(params) {
  return request({
    url: 'api/cggl/incomeCost/getIncomeCostDetailsByOrgId',
    method: 'get',
    params
  })
}
export function getIncomeCostDetailById(params) {
  return request({
    url: 'api/cggl/incomeCost/getIncomeCostDetailById',
    method: 'get',
    params
  })
}

export function addAttitude(data) {
  return request({
    url: '/api/cggl/incomeCost/addAttitude',
    method: 'post',
    data
  })
}
