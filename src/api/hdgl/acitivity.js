import request from '@/utils/request'

export function getAcitivityPaging(data) {
  return request({
    url: '/api/hdgl/Acitivity/getAcitivityPaging',
    method: 'post',
    data
  })
}
export function initAcitivity(params) {
  return request({
    url: '/api/hdgl/Acitivity/initAcitivity',
    method: 'get',
    params
  })
}
export function getAcitivityById(params) {
  return request({
    url: '/api/hdgl/Acitivity/getAcitivityById',
    method: 'get',
    params
  })
}
export function addAcitivity(data) {
  return request({
    url: '/api/hdgl/Acitivity/addAcitivity',
    method: 'post',
    data
  })
}
export function putAcitivity(data) {
  return request({
    url: '/api/hdgl/Acitivity/putAcitivity',
    method: 'put',
    data
  })
}
export function deleteAcitivity(params) {
  return request({
    url: '/api/hdgl/Acitivity/deleteAcitivity',
    method: 'delete',
    params
  })
}
