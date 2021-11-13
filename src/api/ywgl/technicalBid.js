import request from '@/utils/request'

export function getTechnicalBidPaging(data) {
  return request({
    url: '/api/ywgl/TechnicalBid/getTechnicalBidPaging',
    method: 'post',
    data
  })
}
export function getTechnicalBidList(params) {
  return request({
    url: '/api/ywgl/TechnicalBid/getTechnicalBidList',
    method: 'get',
    params
  })
}
export function addTechnicalBid(data) {
  return request({
    url: '/api/ywgl/TechnicalBid/addTechnicalBid',
    method: 'post',
    data
  })
}
export function putTechnicalBid(data) {
  return request({
    url: '/api/ywgl/TechnicalBid/putTechnicalBid',
    method: 'put',
    data
  })
}

export function deleteTechnicalBid(params) {
  return request({
    url: '/api/ywgl/TechnicalBid/deleteTechnicalBid',
    method: 'delete',
    params
  })
}

export function getTechnicalBidEditInit(params) {
  return request({
    url: '/api/ywgl/TechnicalBid/getTechnicalBidEditInit',
    method: 'get',
    params
  })
}

export function getTechnicalBidById(params) {
  return request({
    url: '/api/ywgl/TechnicalBid/getTechnicalBidById',
    method: 'get',
    params
  })
}

export function getTechnicalBidAttitudeById(params) {
  return request({
    url: '/api/ywgl/TechnicalBid/getTechnicalBidAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/ywgl/TechnicalBid/getBillFlow',
    method: 'post',
    data
  })
}

export function putTechnicalBidDetail(data) {
  return request({
    url: '/api/ywgl/TechnicalBid/putTechnicalBidDetail',
    method: 'put',
    data
  })
}
