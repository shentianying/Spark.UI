import request from '@/utils/request'

export function getProjectInvoicePaging(data) {
  return request({
    url: '/api/xmgl/ProjectInvoice/getProjectInvoicePaging',
    method: 'post',
    data
  })
}

export function addProjectInvoice(data) {
  return request({
    url: '/api/xmgl/ProjectInvoice/addProjectInvoice',
    method: 'post',
    data
  })
}

export function putProjectInvoice(data) {
  return request({
    url: '/api/xmgl/ProjectInvoice/putProjectInvoice',
    method: 'put',
    data
  })
}

export function deleteProjectInvoice(params) {
  return request({
    url: '/api/xmgl/ProjectInvoice/deleteProjectInvoice',
    method: 'delete',
    params
  })
}

export function getProjectInvoiceById(params) {
  return request({
    url: '/api/xmgl/ProjectInvoice/getProjectInvoiceById',
    method: 'get',
    params
  })
}

