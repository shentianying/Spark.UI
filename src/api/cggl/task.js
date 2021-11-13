import request from '@/utils/request'

export function addCGTask(data) {
  return request({
    url: '/api/cggl/cGTask/addCGTask',
    method: 'post',
    data
  })
}
export function getCGTaskPaging(data) {
  return request({
    url: '/api/cggl/cGTask/getCGTaskPaging',
    method: 'post',
    data
  })
}
export function getCGTaskById(params) {
  return request({
    url: '/api/cggl/cGTask/getCGTaskById',
    method: 'get',
    params
  })
}
export function getPlanDetailByTaskId(params) {
  return request({
    url: '/api/cggl/cGTask/getPlanDetailByTaskId',
    method: 'get',
    params
  })
}
export function putCGTask(data) {
  return request({
    url: '/api/cggl/cGTask/putCGTask',
    method: 'put',
    data
  })
}
export function deleteCGTask(params) {
  return request({
    url: '/api/cggl/cGTask/deleteCGTask',
    method: 'delete',
    params
  })
}
export function getBillFlow(data) {
  return request({
    url: '/api/cggl/cGTask/getBillFlow',
    method: 'post',
    data
  })
}
export function getCGTaskNumber(params) {
  return request({
    url: '/api/cggl/cGTask/getCGTaskNumber',
    method: 'get',
    params
  })
}
export function checkCGTaskById(params) {
  return request({
    url: '/api/cggl/cGTask/checkCGTaskById',
    method: 'get',
    params
  })
}
export function getALLCGTask(params) {
  return request({
    url: '/api/cggl/cGTask/getALLCGTask',
    method: 'get',
    params
  })
}
export function getCGTaskByNum(params) {
  return request({
    url: '/api/cggl/cGTask/getCGTaskByNum',
    method: 'get',
    params
  })
}
