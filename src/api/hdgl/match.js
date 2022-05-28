import request from '@/utils/request'

export function getMatchPaging(data) {
  return request({
    url: '/api/hdgl/Match/getMatchPaging',
    method: 'post',
    data
  })
}
export function initMatch(params) {
  return request({
    url: '/api/hdgl/Match/initMatch',
    method: 'get',
    params
  })
}
export function getMatchById(params) {
  return request({
    url: '/api/hdgl/Match/getMatchById',
    method: 'get',
    params
  })
}
export function addMatch(data) {
  return request({
    url: '/api/hdgl/Match/addMatch',
    method: 'post',
    data
  })
}
export function putMatch(data) {
  return request({
    url: '/api/hdgl/Match/putMatch',
    method: 'put',
    data
  })
}
export function deleteMatch(params) {
  return request({
    url: '/api/hdgl/Match/deleteMatch',
    method: 'delete',
    params
  })
}
