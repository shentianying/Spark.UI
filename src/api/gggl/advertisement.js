import request from '@/utils/request'

export function getAdvertisementPaging(data) {
  return request({
    url: '/api/gggl/Advertisement/getAdvertisementPaging',
    method: 'post',
    data
  })
}
export function initAdvertisement(params) {
  return request({
    url: '/api/gggl/Advertisement/initAdvertisement',
    method: 'get',
    params
  })
}
export function getAdvertisementById(params) {
  return request({
    url: '/api/gggl/Advertisement/getAdvertisementById',
    method: 'get',
    params
  })
}
export function addAdvertisement(data) {
  return request({
    url: '/api/gggl/Advertisement/addAdvertisement',
    method: 'post',
    data
  })
}
export function putAdvertisement(data) {
  return request({
    url: '/api/gggl/Advertisement/putAdvertisement',
    method: 'put',
    data
  })
}
export function deleteAdvertisement(params) {
  return request({
    url: '/api/gggl/Advertisement/deleteAdvertisement',
    method: 'delete',
    params
  })
}
