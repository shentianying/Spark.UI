import request from '@/utils/request'

export function getSupAssesmentByIdAndType(params) {
  return request({
    url: '/api/cggl/supplierAssesment/getSupAssesmentByIdAndType',
    method: 'get',
    params
  })
}
export function getSupAssesmentById(params) {
  return request({
    url: '/api/cggl/supplierAssesment/getSupAssesmentById',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/supplierAssesment/addAttitude',
    method: 'post',
    data
  })
}
export function saveSupplierAssesment(data) {
  return request({
    url: '/api/cggl/supplierAssesment/saveSupplierAssesment',
    method: 'post',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/supplierAssesment/getBillFlow',
    method: 'post',
    data
  })
}

export function getSupAssesmentPaging(data) {
  return request({
    url: '/api/cggl/supplierAssesment/getSupAssesmentPaging',
    method: 'post',
    data
  })
}
