import request from '@/utils/request'

export function getWorkerTransferPaging(data) {
  return request({
    url: '/api/ggzx/workerTransfer/getWorkerTransferPaging',
    method: 'post',
    data
  })
}

export function getFormById(params) {
  return request({
    url: '/api/ggzx/workerTransfer/getFormById',
    method: 'get',
    params
  })
}
export function saveData(data) {
  return request({
    url: '/api/ggzx/workerTransfer/saveData',
    method: 'post',
    data
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/ggzx/workerTransfer/getBillFlow',
    method: 'post',
    data
  })
}
export function deleteData(params) {
  return request({
    url: '/api/ggzx/workerTransfer/deleteData',
    method: 'delete',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/ggzx/workerTransfer/addAttitude',
    method: 'post',
    data
  })
}
