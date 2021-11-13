import request from '@/utils/request'

export function getPostPoolPaging(params) {
  return request({
    url: '/api/rsgl/PostPool/getPostPoolPaging',
    method: 'get',
    params
  })
}

export function getPostPoolById(params) {
  return request({
    url: '/api/rsgl/PostPool/getPostPoolById',
    method: 'get',
    params
  })
}

export function getPostPoolDetailList(params) {
  return request({
    url: '/api/rsgl/PostPool/getPostPoolDetailList',
    method: 'get',
    params
  })
}

export function getPostPoolList(params) {
  return request({
    url: '/api/rsgl/PostPool/getPostPoolList',
    method: 'get',
    params
  })
}

export function addPostPool(data) {
  return request({
    url: '/api/rsgl/PostPool/addPostPool',
    method: 'post',
    data
  })
}

export function putPostPool(data) {
  return request({
    url: '/api/rsgl/PostPool/putPostPool',
    method: 'put',
    data
  })
}

export function deletePostPool(params) {
  return request({
    url: '/api/rsgl/PostPool/deletePostPool',
    method: 'delete',
    params
  })
}

export function getPostPoolEditInit(params) {
  return request({
    url: '/api/rsgl/PostPool/getPostPoolEditInit',
    method: 'get',
    params
  })
}

export function getPostPoolDetailById(params) {
  return request({
    url: '/api/rsgl/PostPool/getPostPoolDetailById',
    method: 'get',
    params
  })
}

export function getPostListByOrgId(params) {
  return request({
    url: '/api/rsgl/PostPool/getPostListByOrgId',
    method: 'get',
    params
  })
}
