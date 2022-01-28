import request from '@/utils/request'

export function getVisitorPaging(data) {
  return request({
    url: '/api/qygl/Visitor/getVisitorPaging',
    method: 'post',
    data
  })
}
export function getVisitorById(params) {
  return request({
    url: '/api/qygl/Visitor/getVisitorById',
    method: 'get',
    params
  })
}
export function addVisitor(data) {
  return request({
    url: '/api/qygl/Visitor/addVisitor',
    method: 'post',
    data
  })
}
export function putVisitor(data) {
  return request({
    url: '/api/qygl/Visitor/putVisitor',
    method: 'put',
    data
  })
}
export function deleteVisitor(params) {
  return request({
    url: '/api/qygl/Visitor/deleteVisitor',
    method: 'delete',
    params
  })
}
