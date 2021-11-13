import request from '@/utils/request'

export function getBidDocumentPaging(data) {
  return request({
    url: '/api/ywgl/BidDocument/getBidDocumentPaging',
    method: 'post',
    data
  })
}

export function getBidDocumentList(params) {
  return request({
    url: '/api/ywgl/BidDocument/getBidDocumentList',
    method: 'get',
    params
  })
}
export function addBidDocument(data) {
  return request({
    url: '/api/ywgl/BidDocument/addBidDocument',
    method: 'post',
    data
  })
}
export function putBidDocument(data) {
  return request({
    url: '/api/ywgl/BidDocument/putBidDocument',
    method: 'put',
    data
  })
}

export function deleteBidDocument(params) {
  return request({
    url: '/api/ywgl/BidDocument/deleteBidDocument',
    method: 'delete',
    params
  })
}

export function getBidDocumentEditInit(params) {
  return request({
    url: '/api/ywgl/BidDocument/getBidDocumentEditInit',
    method: 'get',
    params
  })
}

export function getBidDocumentById(params) {
  return request({
    url: '/api/ywgl/BidDocument/getBidDocumentById',
    method: 'get',
    params
  })
}

export function getBidDocumentAttitudeById(params) {
  return request({
    url: '/api/ywgl/BidDocument/getBidDocumentAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/ywgl/BidDocument/getBillFlow',
    method: 'post',
    data
  })
}

export function checkBidDocument(data) {
  return request({
    url: '/api/ywgl/BidDocument/checkBidDocument',
    method: 'post',
    data
  })
}
