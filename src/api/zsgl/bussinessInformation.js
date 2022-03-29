import request from '@/utils/request'

export function getBussinessInformationPaging(data) {
  return request({
    url: '/api/zsgl/BussinessInformation/getBussinessInformationPaging',
    method: 'post',
    data
  })
}
