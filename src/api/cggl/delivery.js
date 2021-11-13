import request from '@/utils/request'

export function getDeliveryById(params) {
  return request({
    url: '/api/cggl/delivery/getDeliveryById',
    method: 'get',
    params
  })
}

export function getDeliveryPaging(data) {
  return request({
    url: '/api/cggl/delivery/getDeliveryPaging',
    method: 'post',
    data
  })
}

export function addDelivery(data) {
  return request({
    url: '/api/cggl/delivery/addDelivery',
    method: 'post',
    data
  })
}

export function putDelivery(data) {
  return request({
    url: '/api/cggl/delivery/putDelivery',
    method: 'put',
    data
  })
}

export function deleteDelivery(params) {
  return request({
    url: '/api/cggl/delivery/deleteDelivery',
    method: 'delete',
    params
  })
}

export function getDeliveryDetailsByOrder(data) {
  return request({
    url: '/api/cggl/delivery/getDeliveryDetailsByOrder',
    method: 'post',
    data
  })
}

export function getDeliveryInStorage(params) {
  return request({
    url: '/api/cggl/delivery/getDeliveryInStorage',
    method: 'get',
    params
  })
}
