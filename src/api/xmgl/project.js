import request from '@/utils/request'

export function getProjectList(data) {
  return request({
    url: '/api/xmgl/Project/getProjectList',
    method: 'post',
    data
  })
}
// export function initProject(params) {
//   return request({
//     url: '/api/xmgl/Project/initProject',
//     method: 'get',
//     params
//   })
// }

export function getProjectPaging(params) {
  return request({
    url: '/api/xmgl/Project/getProjectPaging',
    method: 'get',
    params
  })
}
export function addProject(data) {
  return request({
    url: '/api/xmgl/Project/addProject',
    method: 'post',
    data
  })
}
export function putProject(data) {
  return request({
    url: '/api/xmgl/Project/putProject',
    method: 'put',
    data
  })
}
export function deleteProject(params) {
  return request({
    url: '/api/xmgl/Project/deleteProject',
    method: 'delete',
    params
  })
}
export function getProjectById(params) {
  return request({
    url: '/api/xmgl/Project/getProjectById',
    method: 'get',
    params
  })
}

export function getProjectLXPaging(data) {
  return request({
    url: '/api/xmgl/Project/getProjectLXPaging',
    method: 'post',
    data
  })
}

export function getProjectAttitudeById(params) {
  return request({
    url: '/api/xmgl/Project/getProjectAttitudeById',
    method: 'get',
    params
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/xmgl/Project/getBillFlow',
    method: 'post',
    data
  })
}

export function addProjectLX(data) {
  return request({
    url: '/api/xmgl/Project/addProjectLX',
    method: 'post',
    data
  })
}

export function addNewProjectToOrg(data) {
  return request({
    url: '/api/xmgl/Project/addNewProjectToOrg',
    method: 'post',
    data
  })
}

export function getProjectWithLXById(params) {
  return request({
    url: '/api/xmgl/Project/getProjectWithLXById',
    method: 'get',
    params
  })
}
