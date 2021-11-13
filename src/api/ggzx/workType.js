import request from '@/utils/request'

export function getAllList(params) {
  return request({
    url: '/api/ggzx/workType/getList',
    method: 'get',
    params
  })
}

export function saveData(data) {
  return request({
    url: '/api/ggzx/workType/saveData',
    method: 'post',
    data
  })
}
