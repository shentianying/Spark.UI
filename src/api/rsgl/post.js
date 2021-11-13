import request from '@/utils/request'

export function getPostPaging(data) {
  return request({
    url: '/api/rsgl/post/getPostPaging',
    method: 'post',
    data
  })
}
export function getPostList(params) {
  return request({
    url: '/api/rsgl/post/getPostList',
    method: 'get',
    params
  })
}
export function addPost(data) {
  return request({
    url: '/api/rsgl/post/addPost',
    method: 'post',
    data
  })
}
export function putPost(data) {
  return request({
    url: '/api/rsgl/post/putPost',
    method: 'put',
    data
  })
}
export function deletePost(params) {
  return request({
    url: '/api/rsgl/post/deletePost',
    method: 'delete',
    params
  })
}
export function getPostById(params) {
  return request({
    url: '/api/rsgl/post/getPostById',
    method: 'get',
    params
  })
}
