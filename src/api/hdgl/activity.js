import request from '@/utils/request'

export function getActivityPaging(data) {
  return request({
    url: '/api/hdgl/Activity/getActivityPaging',
    method: 'post',
    data
  })
}
export function initActivity(params) {
  return request({
    url: '/api/hdgl/Activity/initActivity',
    method: 'get',
    params
  })
}
export function getActivityById(params) {
  return request({
    url: '/api/hdgl/Activity/getActivityById',
    method: 'get',
    params
  })
}
export function addActivity(data) {
  return request({
    url: '/api/hdgl/Activity/addActivity',
    method: 'post',
    data
  })
}
export function putActivity(data) {
  return request({
    url: '/api/hdgl/Activity/putActivity',
    method: 'put',
    data
  })
}
export function deleteActivity(params) {
  return request({
    url: '/api/hdgl/Activity/deleteActivity',
    method: 'delete',
    params
  })
}
