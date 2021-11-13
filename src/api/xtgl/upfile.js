import request from '@/utils/request'

// 获取文件
export function getFile(params) {
  return request({
    url: '/api/xtgl/upfile/getFile',
    method: 'get',
    params,
    responseType: 'blob'
    // responseType: 'arraybuffer'
  })
}
// 修改文件名
export function putFileName(data) {
  return request({
    url: '/api/xtgl/upfile/putFileName',
    method: 'put',
    data
  })
}
