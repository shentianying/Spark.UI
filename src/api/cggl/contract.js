import request from '@/utils/request'

export function getContractBillAttitudeById(params) {
  return request({
    url: '/api/cggl/contract/getContractBillAttitudeById',
    method: 'get',
    params
  })
}

export function getContractById(params) {
  return request({
    url: '/api/cggl/contract/getContractById',
    method: 'get',
    params
  })
}

export function getContractPaging(data) {
  return request({
    url: '/api/cggl/contract/getContractPaging',
    method: 'post',
    data
  })
}

export function addContract(data) {
  return request({
    url: '/api/cggl/contract/addContract',
    method: 'post',
    data
  })
}

export function putContract(data) {
  return request({
    url: '/api/cggl/contract/putContract',
    method: 'put',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/contract/getBillFlow',
    method: 'post',
    data
  })
}

export function deleteContract(params) {
  return request({
    url: '/api/cggl/contract/deleteContract',
    method: 'delete',
    params
  })
}

export function getContractListByQuotationId(params) {
  return request({
    url: '/api/cggl/contract/getContractListByQuotationId',
    method: 'get',
    params
  })
}
export function getContractDetailsById(params) {
  return request({
    url: '/api/cggl/contract/getContractDetailsById',
    method: 'get',
    params
  })
}
export function getContractAmountPaging(data) {
  return request({
    url: '/api/cggl/contract/getContractAmountPaging',
    method: 'post',
    data
  })
}
export function getContractDetailById(params) {
  return request({
    url: '/api/cggl/contract/getContractDetailById',
    method: 'get',
    params
  })
}

export function addAttitude(data) {
  return request({
    url: '/api/cggl/contract/addAttitude',
    method: 'post',
    data
  })
}
