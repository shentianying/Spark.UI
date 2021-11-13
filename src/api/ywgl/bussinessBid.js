import request from '@/utils/request'

export function getBussinessBidPaging(data) {
  return request({
    url: '/api/ywgl/BussinessBid/getBussinessBidPaging',
    method: 'post',
    data
  })
}
export function getBussinessBidList(params) {
  return request({
    url: '/api/ywgl/BussinessBid/getBussinessBidList',
    method: 'get',
    params
  })
}
export function addBussinessBid(data) {
  return request({
    url: '/api/ywgl/BussinessBid/addBussinessBid',
    method: 'post',
    data
  })
}
export function putBussinessBid(data) {
  return request({
    url: '/api/ywgl/BussinessBid/putBussinessBid',
    method: 'put',
    data
  })
}

export function deleteBussinessBid(params) {
  return request({
    url: '/api/ywgl/BussinessBid/deleteBussinessBid',
    method: 'delete',
    params
  })
}

export function getBussinessBidEditInit(params) {
  return request({
    url: '/api/ywgl/BussinessBid/getBussinessBidEditInit',
    method: 'get',
    params
  })
}

export function getBussinessBidById(params) {
  return request({
    url: '/api/ywgl/BussinessBid/getBussinessBidById',
    method: 'get',
    params
  })
}

export function getBussinessBidAttitudeById(params) {
  return request({
    url: '/api/ywgl/BussinessBid/getBussinessBidAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/ywgl/BussinessBid/getBillFlow',
    method: 'post',
    data
  })
}

export function getBussinessInfoById(params) {
  return request({
    url: '/api/ywgl/BussinessBid/getBussinessInfoById',
    method: 'get',
    params
  })
}

export function checkBussinessBid(data) {
  return request({
    url: '/api/ywgl/BussinessBid/checkBussinessBid',
    method: 'post',
    data
  })
}

