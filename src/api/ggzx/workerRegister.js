import request from '@/utils/request'

export function getWorkerRegisterPaging(data) {
  return request({
    url: '/api/ggzx/workerRegister/getWorkerRegisterPaging',
    method: 'post',
    data
  })
}

export function getFormById(params) {
  return request({
    url: '/api/ggzx/workerRegister/getFormById',
    method: 'get',
    params
  })
}
export function saveData(data) {
  return request({
    url: '/api/ggzx/workerRegister/saveData',
    method: 'post',
    data
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/ggzx/workerRegister/getBillFlow',
    method: 'post',
    data
  })
}
export function deleteData(params) {
  return request({
    url: '/api/ggzx/workerRegister/deleteData',
    method: 'delete',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/ggzx/workerRegister/addAttitude',
    method: 'post',
    data
  })
}
