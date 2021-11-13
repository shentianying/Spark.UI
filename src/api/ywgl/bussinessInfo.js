import request from '@/utils/request'

export function getBussinessInfoPaging(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/getBussinessInfoPaging',
    method: 'post',
    data
  })
}
export function getBussinessInfoList(params) {
  return request({
    url: '/api/ywgl/BussinessInfo/getBussinessInfoList',
    method: 'get',
    params
  })
}
export function addBussinessInfo(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/addBussinessInfo',
    method: 'post',
    data
  })
}
export function putBussinessInfo(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/putBussinessInfo',
    method: 'put',
    data
  })
}

export function deleteBussinessInfo(params) {
  return request({
    url: '/api/ywgl/BussinessInfo/deleteBussinessInfo',
    method: 'delete',
    params
  })
}

export function getBussinessInfoEditInit(params) {
  return request({
    url: '/api/ywgl/BussinessInfo/getBussinessInfoEditInit',
    method: 'get',
    params
  })
}

export function getBussinessInfoById(params) {
  return request({
    url: '/api/ywgl/BussinessInfo/getBussinessInfoById',
    method: 'get',
    params
  })
}

export function getBussinessInfoWithAttitudeById(params) {
  return request({
    url: '/api/ywgl/BussinessInfo/getBussinessInfoWithAttitudeById',
    method: 'get',
    params
  })
}

export function addBussinessInfoReply(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/addBussinessInfoReply',
    method: 'post',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/getBillFlow',
    method: 'post',
    data
  })
}

export function getProjectBillFlow(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/getProjectBillFlow',
    method: 'post',
    data
  })
}

export function addBussinessInfoProject(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/addBussinessInfoProject',
    method: 'post',
    data
  })
}

export function putBussinessInfoFile(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/putBussinessInfoFile',
    method: 'post',
    data
  })
}

export function putBussinessInfoBid(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/putBussinessInfoBid',
    method: 'post',
    data
  })
}

export function putBussinessInfoProgress(data) {
  return request({
    url: '/api/ywgl/BussinessInfo/putBussinessInfoProgress',
    method: 'post',
    data
  })
}

export function putBussinessInfoTraceLevel(params) {
  return request({
    url: '/api/ywgl/BussinessInfo/putBussinessInfoTraceLevel',
    method: 'get',
    params
  })
}
