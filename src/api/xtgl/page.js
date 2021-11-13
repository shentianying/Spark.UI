import request from '@/utils/request'

export function GetAllList(params) {
  return request({
    url: '/api/xtgl/Page/GetList',
    method: 'get',
    params
  })
}

export function GetPageAndPermit(params) {
  return request({
    url: '/api/xtgl/Page/GetPageAndPermit',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: '/api/xtgl/Page/Add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/api/xtgl/Page/update',
    method: 'put',
    data
  })
}
export function getPermit(params) {
  return request({
    url: '/api/xtgl/Page/GetPermit',
    method: 'get',
    params
  })
}
export function addPermit(data) {
  return request({
    url: '/api/xtgl/Page/AddPermit',
    method: 'post',
    data
  })
}
export function updatePermit(data) {
  return request({
    url: '/api/xtgl/Page/UpdatePermit',
    method: 'patch',
    data
  })
}
export function deletePermit(params) {
  return request({
    url: '/api/xtgl/Page/DeletePermit',
    method: 'delete',
    params
  })
}
