import request from '@/utils/request'

export function getEnterprisePaging(data) {
  return request({
    url: '/api/zsgl/Enterprise/getEnterprisePaging',
    method: 'post',
    data
  })
}
export function getEnterpriseList(params) {
  return request({
    url: '/api/zsgl/Enterprise/getEnterpriseList',
    method: 'get',
    params
  })
}
export function initEnterprise(params) {
  return request({
    url: '/api/zsgl/Enterprise/initEnterprise',
    method: 'get',
    params
  })
}
export function getEnterpriseById(params) {
  return request({
    url: '/api/zsgl/Enterprise/getEnterpriseById',
    method: 'get',
    params
  })
}
export function addEnterprise(data) {
  return request({
    url: '/api/zsgl/Enterprise/addEnterprise',
    method: 'post',
    data
  })
}
export function putEnterprise(data) {
  return request({
    url: '/api/zsgl/Enterprise/putEnterprise',
    method: 'put',
    data
  })
}
export function deleteEnterprise(params) {
  return request({
    url: '/api/zsgl/Enterprise/deleteEnterprise',
    method: 'delete',
    params
  })
}
