import request from '@/utils/request'

export function getRole(params) {
  return request({
    url: '/api/xtgl/role/getRole',
    method: 'get',
    params
  })
}
export function getRolePaging(params) {
  return request({
    url: '/api/xtgl/role/getRolePaging',
    method: 'get',
    params
  })
}
export function getRoleById(params) {
  return request({
    url: '/api/xtgl/role/getRoleById',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/api/xtgl/role/addRole',
    method: 'post',
    data
  })
}
export function putRole(data) {
  return request({
    url: '/api/xtgl/role/putRole',
    method: 'put',
    data
  })
}
export function getUserRole(params) {
  return request({
    url: '/api/xtgl/role/getUserRole',
    method: 'get',
    params
  })
}
export function addUserRole(data) {
  return request({
    url: '/api/xtgl/role/addUserRole',
    method: 'post',
    data
  })
}
export function putUserRole(data) {
  return request({
    url: '/api/xtgl/role/putUserRole',
    method: 'put',
    data
  })
}
export function deleteUserRole(params) {
  return request({
    url: '/api/xtgl/role/deleteUserRole',
    method: 'delete',
    params: params
  })
}

export function addRolePermit(data) {
  return request({
    url: '/api/xtgl/role/addRolePermit',
    method: 'post',
    data
  })
}
export function getRolePermitByRoleId(params) {
  return request({
    url: '/api/xtgl/role/getRolePermitByRoleId',
    method: 'get',
    params
  })
}
/**
 * 用户 数据权限
 */
export function putUserOrganizationSelected(data) {
  return request({
    url: '/api/xtgl/role/putUserOrganizationSelected',
    method: 'put',
    data
  })
}
export function getUserDataRange(params) {
  return request({
    url: '/api/xtgl/role/getUserDataRange',
    method: 'get',
    params
  })
}
export function getCurrentUserOrg(params) {
  return request({
    url: '/api/xtgl/role/getCurrentUserOrg',
    method: 'get',
    params
  })
}

export function addUserOrg(data) {
  return request({
    url: '/api/xtgl/role/addUserOrg',
    method: 'post',
    data
  })
}

/**
 *  用户审查权限设置
 */
// 初始化用户审查权限
export function initUserCheckupOrganization(params) {
  return request({
    url: '/api/xtgl/role/initUserCheckupOrganization',
    method: 'get',
    params: params
  })
}
export function getUserCheckupOrganization(params) {
  return request({
    url: '/api/xtgl/role/getUserCheckupOrganization',
    method: 'get',
    params: params
  })
}
export function addUserCheckupOrganization(data) {
  return request({
    url: '/api/xtgl/role/addUserCheckupOrganization',
    method: 'post',
    data
  })
}

export function deleteUserCheckupOrganization(params) {
  return request({
    url: '/api/xtgl/role/deleteUserCheckupOrganization',
    method: 'delete',
    params: params
  })
}
