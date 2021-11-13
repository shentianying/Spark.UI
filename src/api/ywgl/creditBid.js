import request from '@/utils/request'

export function getCreditBidPaging(data) {
  return request({
    url: '/api/ywgl/CreditBid/getCreditBidPaging',
    method: 'post',
    data
  })
}
export function getCreditBidList(params) {
  return request({
    url: '/api/ywgl/CreditBid/getCreditBidList',
    method: 'get',
    params
  })
}
export function addCreditBid(data) {
  return request({
    url: '/api/ywgl/CreditBid/addCreditBid',
    method: 'post',
    data
  })
}
export function putCreditBid(data) {
  return request({
    url: '/api/ywgl/CreditBid/putCreditBid',
    method: 'put',
    data
  })
}

export function deleteCreditBid(params) {
  return request({
    url: '/api/ywgl/CreditBid/deleteCreditBid',
    method: 'delete',
    params
  })
}

export function getCreditBidEditInit(params) {
  return request({
    url: '/api/ywgl/CreditBid/getCreditBidEditInit',
    method: 'get',
    params
  })
}

export function getCreditBidById(params) {
  return request({
    url: '/api/ywgl/CreditBid/getCreditBidById',
    method: 'get',
    params
  })
}

export function getCreditBidAttitudeById(params) {
  return request({
    url: '/api/ywgl/CreditBid/getCreditBidAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/ywgl/CreditBid/getBillFlow',
    method: 'post',
    data
  })
}

export function checkCreditBid(data) {
  return request({
    url: '/api/ywgl/CreditBid/checkCreditBid',
    method: 'post',
    data
  })
}
