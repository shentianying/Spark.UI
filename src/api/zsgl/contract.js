import request from '@/utils/request'

export function getContractPaging(data) {
  return request({
    url: '/api/zsgl/Contract/getContractPaging',
    method: 'post',
    data
  })
}
export function initContract(params) {
  return request({
    url: '/api/zsgl/Contract/initContract',
    method: 'get',
    params
  })
}
export function getContractById(params) {
  return request({
    url: '/api/zsgl/Contract/getContractById',
    method: 'get',
    params
  })
}
export function getContractDetailById(params) {
  return request({
    url: '/api/zsgl/Contract/getContractDetailById',
    method: 'get',
    params
  })
}
export function addContract(data) {
  return request({
    url: '/api/zsgl/Contract/addContract',
    method: 'post',
    data
  })
}
export function putContract(data) {
  return request({
    url: '/api/zsgl/Contract/putContract',
    method: 'put',
    data
  })
}
export function deleteContract(params) {
  return request({
    url: '/api/zsgl/Contract/deleteContract',
    method: 'delete',
    params
  })
}
