import request from '@/utils/request'

export function getInvoicePaging(data) {
  return request({
    url: '/api/cggl/invoice/getInvoicePaging',
    method: 'post',
    data
  })
}
export function addInvoice(data) {
  return request({
    url: '/api/cggl/invoice/addInvoice',
    method: 'post',
    data
  })
}

export function getInvoiceById(params) {
  return request({
    url: '/api/cggl/invoice/getInvoiceById',
    method: 'get',
    params
  })
}

export function initiInvoiceEdit(params) {
  return request({
    url: '/api/cggl/invoice/initiInvoiceEdit',
    method: 'get',
    params
  })
}

export function getStorageInDetailListByContractId(params) {
  return request({
    url: '/api/cggl/invoice/getStorageInDetailListByContractId',
    method: 'get',
    params
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/cggl/invoice/getBillFlow',
    method: 'post',
    data
  })
}
export function putInvoice(data) {
  return request({
    url: '/api/cggl/invoice/putInvoice',
    method: 'put',
    data
  })
}
export function putStorageDetailInvoiceId(data) {
  return request({
    url: '/api/cggl/invoice/putStorageDetailInvoiceId',
    method: 'put',
    data
  })
}
export function deleteInvoice(params) {
  return request({
    url: '/api/cggl/invoice/deleteInvoice',
    method: 'delete',
    params
  })
}
export function getContractListByOrgId(params) {
  return request({
    url: '/api/cggl/invoice/getContractListByOrgId',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/invoice/addAttitude',
    method: 'post',
    data
  })
}
