import request from '@/utils/request'

export function getIncomeContractPaging(data) {
  return request({
    url: '/api/ywgl/IncomeContract/getIncomeContractPaging',
    method: 'post',
    data
  })
}
export function getIncomeContractList(params) {
  return request({
    url: '/api/ywgl/IncomeContract/getIncomeContractList',
    method: 'get',
    params
  })
}
export function addIncomeContract(data) {
  return request({
    url: '/api/ywgl/IncomeContract/addIncomeContract',
    method: 'post',
    data
  })
}
export function putIncomeContract(data) {
  return request({
    url: '/api/ywgl/IncomeContract/putIncomeContract',
    method: 'put',
    data
  })
}

export function deleteIncomeContract(params) {
  return request({
    url: '/api/ywgl/IncomeContract/deleteIncomeContract',
    method: 'delete',
    params
  })
}

export function getIncomeContractEditInit(params) {
  return request({
    url: '/api/ywgl/IncomeContract/getIncomeContractEditInit',
    method: 'get',
    params
  })
}

export function getIncomeContractById(params) {
  return request({
    url: '/api/ywgl/IncomeContract/getIncomeContractById',
    method: 'get',
    params
  })
}

export function getIncomeContractAttitudeById(params) {
  return request({
    url: '/api/ywgl/IncomeContract/getIncomeContractAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/ywgl/IncomeContract/getBillFlow',
    method: 'post',
    data
  })
}

export function CheckIncomeContract(data) {
  return request({
    url: '/api/ywgl/IncomeContract/CheckIncomeContract',
    method: 'post',
    data
  })
}

export function getBussinessInfoById(params) {
  return request({
    url: '/api/ywgl/IncomeContract/getBussinessInfoById',
    method: 'get',
    params
  })
}

export function SignIncomeContract(data) {
  return request({
    url: '/api/ywgl/IncomeContract/SignIncomeContract',
    method: 'post',
    data
  })
}

export function RecordIncomeContract(data) {
  return request({
    url: '/api/ywgl/IncomeContract/RecordIncomeContract',
    method: 'post',
    data
  })
}

export function getContractList(params) {
  return request({
    url: '/api/ywgl/IncomeContract/getContractList',
    method: 'get',
    params
  })
}
