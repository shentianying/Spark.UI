import request from '@/utils/request'

export function getCityList(params) {
  return request({
    url: '/api/xtgl/City/getCityList',
    method: 'get',
    params
  })
}
export function initCity(params) {
  return request({
    url: '/api/xtgl/City/initCity',
    method: 'get',
    params
  })
}

export function getCityPaging(params) {
  return request({
    url: '/api/xtgl/City/getCityPaging',
    method: 'get',
    params
  })
}
export function addCity(data) {
  return request({
    url: '/api/xtgl/City/addCity',
    method: 'post',
    data
  })
}
export function putCity(data) {
  return request({
    url: '/api/xtgl/City/putCity',
    method: 'put',
    data
  })
}
export function deleteCity(params) {
  return request({
    url: '/api/xtgl/City/deleteCity',
    method: 'delete',
    params
  })
}
