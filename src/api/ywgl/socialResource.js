import request from '@/utils/request'

export function getSocialResourcePaging(data) {
  return request({
    url: '/api/ywgl/SocialResource/getSocialResourcePaging',
    method: 'post',
    data
  })
}

export function addSocialResource(data) {
  return request({
    url: '/api/ywgl/SocialResource/addSocialResource',
    method: 'post',
    data
  })
}

export function putSocialResource(data) {
  return request({
    url: '/api/ywgl/SocialResource/putSocialResource',
    method: 'put',
    data
  })
}

export function getSocialResourceById(params) {
  return request({
    url: '/api/ywgl/SocialResource/getSocialResourceById',
    method: 'get',
    params
  })
}
/**
 * 获取社会资源信息列表
 * @api {GET} /api/YWGL/SocialResource/GetSocialResourceList
 */
export function GetSocialResourceList(params) {
  return request({
    url: '/api/YWGL/SocialResource/GetSocialResourceList',
    method: 'get',
    params
  })
}

export function getRelationGraph(params) {
  return request({
    url: '/api/ywgl/SocialResource/getRelationGraph',
    method: 'get',
    params
  })
}

export function SaveRelationship(data) {
  return request({
    url: '/api/ywgl/SocialResource/SaveRelationship',
    method: 'post',
    data
  })
}
