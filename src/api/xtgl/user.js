import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/xtgl/user/login',
    method: 'post',
    data
  })
}

export function refreshToken(params) {
  return request({
    url: '/api/xtgl/user/refreshToken',
    method: 'get',
    params: params
  })
}

export function getInfo() {
  return request({
    url: '/api/xtgl/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/xtgl/user/logout',
    method: 'get'
  })
}

