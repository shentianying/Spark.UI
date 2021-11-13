import request from '@/utils/request'

export function getProjectOutputPaging(data) {
  return request({
    url: '/api/xmgl/ProjectOutput/getProjectOutputPaging',
    method: 'post',
    data
  })
}

export function addProjectOutput(data) {
  return request({
    url: '/api/xmgl/ProjectOutput/addProjectOutput',
    method: 'post',
    data
  })
}

export function putProjectOutput(data) {
  return request({
    url: '/api/xmgl/ProjectOutput/putProjectOutput',
    method: 'put',
    data
  })
}

export function deleteProjectOutput(params) {
  return request({
    url: '/api/xmgl/ProjectOutput/deleteProjectOutput',
    method: 'delete',
    params
  })
}

export function getProjectOutputById(params) {
  return request({
    url: '/api/xmgl/ProjectOutput/getProjectOutputById',
    method: 'get',
    params
  })
}

export function getProjectOutputAttitudeById(params) {
  return request({
    url: '/api/xmgl/ProjectOutput/getProjectOutputAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/xmgl/ProjectOutput/getBillFlow',
    method: 'post',
    data
  })
}

/**
 * 内外部开累产值获取接口
 * @api {GET} /api/XMGL/ProjectOutput/GetProjectOutputSumById
 */
export const GetProjectOutputSumById = params =>
  request.get('/api/XMGL/ProjectOutput/GetProjectOutputSumById', { params })
