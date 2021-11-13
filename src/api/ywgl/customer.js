import request from '@/utils/request'

export function getCustomerPaging(params) {
  return request({
    url: '/api/ywgl/Customer/getCustomerPaging',
    method: 'get',
    params
  })
}
export function getCustomerList(params) {
  return request({
    url: '/api/ywgl/Customer/getCustomerList',
    method: 'get',
    params
  })
}
export function addCustomer(data) {
  return request({
    url: '/api/ywgl/Customer/addCustomer',
    method: 'post',
    data
  })
}
export function putCustomer(data) {
  return request({
    url: '/api/ywgl/Customer/putCustomer',
    method: 'put',
    data
  })
}
export function deleteCustomer(params) {
  return request({
    url: '/api/ywgl/Customer/deleteCustomer',
    method: 'delete',
    params
  })
}

export function getCustomerById(params) {
  return request({
    url: '/api/ywgl/Customer/getCustomerById',
    method: 'get',
    params: params
  })
}

export function addCustomerSurvey(data) {
  return request({
    url: '/api/ywgl/Customer/addCustomerSurvey',
    method: 'post',
    data
  })
}
export function putCustomerSurvey(data) {
  return request({
    url: '/api/ywgl/Customer/putCustomerSurvey',
    method: 'put',
    data
  })
}
export function deleteCustomerSurvey(params) {
  return request({
    url: '/api/ywgl/Customer/deleteCustomerSurvey',
    method: 'delete',
    params
  })
}

export function getCustomerSurveyById(params) {
  return request({
    url: '/api/ywgl/Customer/getCustomerSurveyById',
    method: 'get',
    params: params
  })
}
