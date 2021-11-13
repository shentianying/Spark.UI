import request from '@/utils/request'

export function getQuotationPaging(data) {
  return request({
    url: '/api/cggl/quotation/getQuotationPaging',
    method: 'post',
    data
  })
}
export function getQuotationById(params) {
  return request({
    url: '/api/cggl/quotation/getQuotationById',
    method: 'get',
    params
  })
}
export function generateQuotation(data) {
  return request({
    url: '/api/cggl/quotation/generateQuotation',
    method: 'post',
    data
  })
}
export function fillQuotationSupplier(data) {
  return request({
    url: '/api/cggl/quotation/fillQuotationSupplier',
    method: 'post',
    data
  })
}
export function getPriceListInfo(params) {
  return request({
    url: '/api/cggl/quotation/getPriceListInfo',
    method: 'get',
    params
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/cggl/quotation/getBillFlow',
    method: 'post',
    data
  })
}
export function getQuotationAttitudeById(params) {
  return request({
    url: '/api/cggl/quotation/getQuotationAttitudeById',
    method: 'get',
    params
  })
}
export function quotationAttitude(data) {
  return request({
    url: '/api/cggl/quotation/quotationAttitude',
    method: 'post',
    data
  })
}
export function putQuotationState(data) {
  return request({
    url: '/api/cggl/quotation/putQuotationState',
    method: 'put',
    data
  })
}
export function sendQuotationSupplier(data) {
  return request({
    url: '/api/cggl/quotation/sendQuotationSupplier',
    method: 'post',
    data
  })
}
export function getQuotationSupplierInfo(params) {
  return request({
    url: '/api/cggl/quotation/getQuotationSupplierInfo',
    method: 'get',
    params
  })
}
export function getBillFlowById(params) {
  return request({
    url: '/api/cggl/quotation/getBillFlowById',
    method: 'get',
    params
  })
}
export function getQuotationSupplierById(params) {
  return request({
    url: '/api/cggl/quotation/getQuotationSupplierById',
    method: 'get',
    params
  })
}
export function getQuotatitonSuppliers(data) {
  return request({
    url: '/api/cggl/quotation/getQuotatitonSuppliers',
    method: 'post',
    data
  })
}
export function addQuotationSupplier(data) {
  return request({
    url: '/api/cggl/quotation/addQuotationSupplier',
    method: 'post',
    data
  })
}
export function deleteQuotationSupplier(data) {
  return request({
    url: '/api/cggl/quotation/deleteQuotationSupplier',
    method: 'post',
    data
  })
}
export function getQuotationByFId(params) {
  return request({
    url: '/api/cggl/quotation/getQuotationByFId',
    method: 'get',
    params
  })
}
export function checkSupplierAttitude(params) {
  return request({
    url: '/api/cggl/quotation/checkSupplierAttitude',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/quotation/addAttitude',
    method: 'post',
    data
  })
}
