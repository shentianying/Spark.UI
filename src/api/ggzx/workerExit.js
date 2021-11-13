import request from '@/utils/request'

export function getWorkerExitPaging(data) {
  return request({
    url: '/api/ggzx/WorkerExit/getWorkerExitPaging',
    method: 'post',
    data
  })
}

export function getFormById(params) {
  return request({
    url: '/api/ggzx/WorkerExit/getFormById',
    method: 'get',
    params
  })
}
export function saveData(data) {
  return request({
    url: '/api/ggzx/WorkerExit/saveData',
    method: 'post',
    data
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/ggzx/WorkerExit/getBillFlow',
    method: 'post',
    data
  })
}
export function deleteData(params) {
  return request({
    url: '/api/ggzx/WorkerExit/deleteData',
    method: 'delete',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/ggzx/WorkerExit/addAttitude',
    method: 'post',
    data
  })
}
