import request from '@/utils/request'

export function getOrganizationPaging(params) {
  return request({
    url: '/api/xtgl/organization/getOrganizationPaging',
    method: 'get',
    params
  })
}

export function getCurrentCompanyOrgList(params) {
  return request({
    url: '/api/xtgl/organization/getCurrentCompanyOrgList',
    method: 'get',
    params
  })
}

export function getOrganizationList(params) {
  return request({
    url: '/api/xtgl/organization/getOrganizationList',
    method: 'get',
    params
  })
}
export function addOrganization(data) {
  return request({
    url: '/api/xtgl/organization/addOrganization',
    method: 'post',
    data
  })
}
export function putOrganization(data) {
  return request({
    url: '/api/xtgl/organization/putOrganization',
    method: 'put',
    data
  })
}
export function deleteOrganization(params) {
  return request({
    url: '/api/xtgl/organization/deleteOrganization',
    method: 'delete',
    params
  })
}

export function getComOrganizationList(data) {
  return request({
    url: '/api/xtgl/organization/getComOrganizationList',
    method: 'post',
    data
  })
}

export function getComOrganizationAndPersonList(data) {
  return request({
    url: '/api/xtgl/organization/getComOrganizationAndPersonList',
    method: 'post',
    data
  })
}

export function getOrgWithProject(params) {
  return request({
    url: '/api/xtgl/organization/getOrgWithProject',
    method: 'get',
    params
  })
}
