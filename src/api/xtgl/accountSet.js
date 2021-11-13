import request from '@/utils/request'

export function getAccountSet(params) {
  return request({
    url: '/api/xtgl/accountSet/getAccountSet',
    method: 'get',
    params
  })
}
export function addAccountSet(data) {
  return request({
    url: '/api/xtgl/accountSet/addAccountSet',
    method: 'post',
    data
  })
}
export function putAccountSet(data) {
  return request({
    url: '/api/xtgl/accountSet/putAccountSet',
    method: 'put',
    data
  })
}
export function deleteAccountSet(params) {
  return request({
    url: '/api/xtgl/accountSet/deleteAccountSet',
    method: 'delete',
    params
  })
}

export function getAccountSetByOrgId(params) {
  return request({
    url: '/api/xtgl/accountSet/getAccountSetByOrgId',
    method: 'get',
    params
  })
}
