import request from '@/utils/request'

export function getMonitorPaging(data) {
  return request({
    url: '/api/jkgl/Monitor/getMonitorPaging',
    method: 'post',
    data
  })
}
export function getMonitorList(params) {
  return request({
    url: '/api/jkgl/Monitor/getMonitorList',
    method: 'get',
    params
  })
}
export function getAllMonitorNode(params) {
  return request({
    url: '/api/jkgl/Monitor/getAllMonitorNode',
    method: 'get',
    params
  })
}
export function addMonitorNode(data) {
  return request({
    url: '/api/jkgl/Monitor/addMonitorNode',
    method: 'post',
    data
  })
}
export function putMonitorNode(data) {
  return request({
    url: '/api/jkgl/Monitor/putMonitorNode',
    method: 'put',
    data
  })
}
export function getMonitorById(params) {
  return request({
    url: '/api/jkgl/Monitor/getMonitorById',
    method: 'get',
    params
  })
}
export function addMonitor(data) {
  return request({
    url: '/api/jkgl/Monitor/addMonitor',
    method: 'post',
    data
  })
}
export function putMonitor(data) {
  return request({
    url: '/api/jkgl/Monitor/putMonitor',
    method: 'put',
    data
  })
}
export function deleteMonitor(params) {
  return request({
    url: '/api/jkgl/Monitor/deleteMonitor',
    method: 'delete',
    params
  })
}
