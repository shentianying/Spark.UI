import request from '@/utils/request'

export function getFormPaging(params) {
  return request({
    url: '/api/xtgl/form/getFormPaging',
    method: 'get',
    params
  })
}
export function getFormList(params) {
  return request({
    url: '/api/xtgl/form/getFormList',
    method: 'get',
    params
  })
}

export function addForm(data) {
  return request({
    url: '/api/xtgl/Form/addForm',
    method: 'post',
    data
  })
}
export function putForm(data) {
  return request({
    url: '/api/xtgl/form/putForm',
    method: 'put',
    data
  })
}
// FormFlowField
export function getFormFlowFieldPaging(params) {
  return request({
    url: '/api/xtgl/form/getFormFlowFieldPaging',
    method: 'get',
    params
  })
}
export function getFormFlowFieldList(params) {
  return request({
    url: '/api/xtgl/form/getFormFlowFieldList',
    method: 'get',
    params
  })
}

export function addFormFlowField(data) {
  return request({
    url: '/api/xtgl/Form/addFormFlowField',
    method: 'post',
    data
  })
}

export function putFormFlowField(data) {
  return request({
    url: '/api/xtgl/form/putFormFlowField',
    method: 'put',
    data
  })
}

// FormStateList
export function getFormStateList(params) {
  return request({
    url: '/api/xtgl/form/getFormStateList',
    method: 'get',
    params
  })
}

export function PutFormState(data) {
  return request({
    url: '/api/xtgl/form/PutFormState',
    method: 'put',
    data
  })
}
export function addFormState(data) {
  return request({
    url: '/api/xtgl/Form/addFormState',
    method: 'post',
    data
  })
}

// FormStateList

export function getFormStateOption(params) {
  return request({
    url: '/api/xtgl/form/getFormStateOption',
    method: 'get',
    params
  })
}

export function putFormStateOption(data) {
  return request({
    url: '/api/xtgl/form/putFormStateOption',
    method: 'put',
    data
  })
}
export function addFormStateOption(data) {
  return request({
    url: '/api/xtgl/Form/addFormStateOption',
    method: 'post',
    data
  })
}
