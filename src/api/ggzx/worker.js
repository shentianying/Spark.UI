import request from '@/utils/request'

export function getDefaultOptions(params) {
  return request({
    url: '/api/ggzx/worker/getDefaultOptions',
    method: 'get',
    params
  })
}

export function getWorkerPaging(data) {
  return request({
    url: '/api/ggzx/worker/getWorkerPaging',
    method: 'post',
    data
  })
}

export function getWorkerList(data) {
  return request({
    url: '/api/ggzx/worker/getWorkerList',
    method: 'post',
    data
  })
}

export function getFormById(params) {
  return request({
    url: '/api/ggzx/worker/getFormById',
    method: 'get',
    params
  })
}

export function saveData(data) {
  return request({
    url: '/api/ggzx/worker/saveData',
    method: 'post',
    data
  })
}
