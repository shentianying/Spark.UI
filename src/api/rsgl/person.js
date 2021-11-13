import request from '@/utils/request'

export function getPersonPaging(params) {
  return request({
    url: '/api/rsgl/person/getPersonPaging',
    method: 'get',
    params
  })
}
export function getPersonList(params) {
  return request({
    url: '/api/rsgl/person/getPersonList',
    method: 'get',
    params
  })
}
export function addPerson(data) {
  return request({
    url: '/api/rsgl/person/addPerson',
    method: 'post',
    data
  })
}
export function putPerson(data) {
  return request({
    url: '/api/rsgl/person/putPerson',
    method: 'put',
    data
  })
}
export function deletePerson(params) {
  return request({
    url: '/api/rsgl/person/deletePerson',
    method: 'delete',
    params
  })
}

export function resetPassWord(params) {
  return request({
    url: '/api/rsgl/person/resetPassWord',
    method: 'get',
    params: params
  })
}
export function setDefaultPassword(params) {
  return request({
    url: '/api/rsgl/person/setDefaultPassword',
    method: 'patch',
    params: params
  })
}

export function getPersonById(params) {
  return request({
    url: '/api/rsgl/person/getPersonById',
    method: 'get',
    params: params
  })
}
export function getPersonEditInit(params) {
  return request({
    url: '/api/rsgl/person/getPersonEditInit',
    method: 'get',
    params: params
  })
}
