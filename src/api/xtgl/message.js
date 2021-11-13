import request from '@/utils/request'

export function getRemindPaging(params) {
  return request({
    url: '/api/xtgl/Message/getRemindPaging',
    method: 'get',
    params
  })
}
export function getNoReadRemindCount(params) {
  return request({
    url: '/api/xtgl/Message/getNoReadRemindCount',
    method: 'get',
    params
  })
}
export function checkRemind(params) {
  return request({
    url: '/api/xtgl/Message/checkRemind',
    method: 'get',
    params
  })
}
export function sendRemind(data) {
  return request({
    url: '/api/xtgl/Message/sendRemind',
    method: 'post',
    data
  })
}

export function putIsRead(data) {
  return request({
    url: '/api/xtgl/Message/putIsRead',
    method: 'put',
    data
  })
}

export function deleteRemind(params) {
  return request({
    url: '/api/xtgl/Message/deleteRemind',
    method: 'delete',
    params
  })
}
// message
export function sendMessage(data) {
  return request({
    url: '/api/xtgl/Message/sendMessage',
    method: 'post',
    data
  })
}

export function getMessageByBillFlowId(params) {
  return request({
    url: '/api/xtgl/Message/getMessageByBillFlowId',
    method: 'get',
    params
  })
}
// exception

export function getExceptionsPaging(params) {
  return request({
    url: '/api/xtgl/Message/getExceptionsPaging',
    method: 'get',
    params
  })
}

