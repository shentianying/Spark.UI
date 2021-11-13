import request from '@/utils/request'

export function getDefaultOptions(params) {
  return request({
    url: '/api/ggzx/workerOrganization/getDefaultOptions',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: '/api/ggzx/workerOrganization/getList',
    method: 'get',
    params
  })
}

export function getWorkerOrganizationList(data) {
  return request({
    url: '/api/ggzx/workerOrganization/getWorkerOrganizationList',
    method: 'post',
    data
  })
}
export function saveData(data) {
  return request({
    url: '/api/ggzx/workerOrganization/saveData',
    method: 'post',
    data
  })
}
export function getWorkerOrgById(params) {
  return request({
    url: '/api/ggzx/workerOrganization/getWorkerOrgById',
    method: 'get',
    params
  })
}
