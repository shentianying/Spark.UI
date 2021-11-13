import request from '@/utils/request'

export function getListPaging(data) {
  return request({
    url: '/api/ggzx/workerAttendance/getListPaging',
    method: 'post',
    data
  })
}
export function getDefaultOptions(params) {
  return request({
    url: '/api/ggzx/workerAttendance/getDefaultOptions',
    method: 'get',
    params
  })
}
export function getFormDefaultTableDate(data) {
  return request({
    url: '/api/ggzx/workerAttendance/getFormDefaultTableDate',
    method: 'post',
    data
  })
}
