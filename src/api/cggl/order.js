import request from '@/utils/request'

export function getOrderById(params) {
  return request({
    url: '/api/cggl/order/getOrderById',
    method: 'get',
    params
  })
}

export function getOrderPaging(data) {
  return request({
    url: '/api/cggl/order/getOrderPaging',
    method: 'post',
    data
  })
}

export function addOrder(data) {
  return request({
    url: '/api/cggl/order/addOrder',
    method: 'post',
    data
  })
}

export function putOrder(data) {
  return request({
    url: '/api/cggl/order/putOrder',
    method: 'put',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/order/getBillFlow',
    method: 'post',
    data
  })
}

export function deleteOrder(params) {
  return request({
    url: '/api/cggl/order/deleteOrder',
    method: 'delete',
    params
  })
}

export function getOrderPagingWithDetail(data) {
  return request({
    url: '/api/cggl/order/getOrderPagingWithDetail',
    method: 'post',
    data
  })
}

export function addAttitude(data) {
  return request({
    url: '/api/cggl/order/addAttitude',
    method: 'post',
    data
  })
}
