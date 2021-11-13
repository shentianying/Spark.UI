import request from '@/utils/request'

export function getPostPoolList(params) {
  return request({
    url: '/api/rsgl/PersonPost/getPersonPostList',
    method: 'get',
    params
  })
}

export function getAllPersonPostById(params) {
  return request({
    url: '/api/rsgl/PersonPost/getAllPersonPostById',
    method: 'get',
    params
  })
}

export function getPersonPostListById(params) {
  return request({
    url: '/api/rsgl/PersonPost/getPersonPostListById',
    method: 'get',
    params
  })
}

export function getPersonPostById(params) {
  return request({
    url: '/api/rsgl/PersonPost/getPersonPostById',
    method: 'get',
    params
  })
}

export function addPersonPost(data) {
  return request({
    url: '/api/rsgl/PersonPost/addPersonPost',
    method: 'post',
    data
  })
}

export function putPersonPost(data) {
  return request({
    url: '/api/rsgl/PersonPost/putPersonPost',
    method: 'put',
    data
  })
}

export function deletePersonPost(params) {
  return request({
    url: '/api/rsgl/PersonPost/deletePersonPost',
    method: 'delete',
    params
  })
}

export function getPersonPostEditInit(params) {
  return request({
    url: '/api/rsgl/PersonPost/getPersonPostEditInit',
    method: 'get',
    params: params
  })
}
