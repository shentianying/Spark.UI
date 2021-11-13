import request from '@/utils/request'

export function getSupplierPaging(params) {
  return request({
    url: '/api/cggl/supplier/getSupplierPaging',
    method: 'get',
    params
  })
}
export function getSupplierById(params) {
  return request({
    url: '/api/cggl/supplier/getSupplierById',
    method: 'get',
    params
  })
}
export function getSupplierEditInit(params) {
  return request({
    url: '/api/cggl/supplier/getSupplierEditInit',
    method: 'get',
    params
  })
}
export function getSupplierList(params) {
  return request({
    url: '/api/cggl/supplier/getSupplierList',
    method: 'get',
    params
  })
}
export function addSupplier(data) {
  return request({
    url: '/api/cggl/supplier/addSupplier',
    method: 'post',
    data
  })
}
export function putSupplier(data) {
  return request({
    url: '/api/cggl/supplier/putSupplier',
    method: 'put',
    data
  })
}
export function deleteSupplier(params) {
  return request({
    url: '/api/cggl/supplier/deleteSupplier',
    method: 'delete',
    params
  })
}
export function getSupplierInfo(params) {
  return request({
    url: '/api/cggl/supplier/getSupplierInfo',
    method: 'get',
    params
  })
}

