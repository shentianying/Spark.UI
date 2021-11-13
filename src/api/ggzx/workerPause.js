import request from '@/utils/request'

export function getWorkerPausePaging(data) {
  return request({
    url: '/api/ggzx/WorkerPause/getWorkerPausePaging',
    method: 'post',
    data
  })
}

export function getFormById(params) {
  return request({
    url: '/api/ggzx/WorkerPause/getFormById',
    method: 'get',
    params
  })
}
export function saveData(data) {
  return request({
    url: '/api/ggzx/WorkerPause/saveData',
    method: 'post',
    data
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/ggzx/WorkerPause/getBillFlow',
    method: 'post',
    data
  })
}
export function deleteData(params) {
  return request({
    url: '/api/ggzx/WorkerPause/deleteData',
    method: 'delete',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/ggzx/WorkerPause/addAttitude',
    method: 'post',
    data
  })
}
