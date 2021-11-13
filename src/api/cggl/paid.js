import request from '@/utils/request'

export function getCGPaidById(params) {
  return request({
    url: '/api/cggl/cGPaid/getCGPaidById',
    method: 'get',
    params
  })
}

export function getCGPaidPaging(data) {
  return request({
    url: '/api/cggl/cGPaid/getCGPaidPaging',
    method: 'post',
    data
  })
}

export function addCGPaid(data) {
  return request({
    url: '/api/cggl/cGPaid/addCGPaid',
    method: 'post',
    data
  })
}

export function putCGPaid(data) {
  return request({
    url: '/api/cggl/cGPaid/putCGPaid',
    method: 'put',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/cGPaid/getBillFlow',
    method: 'post',
    data
  })
}

export function deleteCGPaid(params) {
  return request({
    url: '/api/cggl/cGPaid/deleteCGPaid',
    method: 'delete',
    params
  })
}

// export function getCGPaidDetailPaging(data) {
//   return request({
//     url: '/api/cggl/cGPaid/getCGPaidDetailPaging',
//     method: 'post',
//     data
//   })
// }

export function getContractDetail(params) {
  return request({
    url: '/api/cggl/cGPaid/getContractDetail',
    method: 'get',
    params
  })
}

export function updateCGPaidAttitudeAmount(data) {
  return request({
    url: '/api/cggl/cGPaid/updateCGPaidAttitudeAmount',
    method: 'post',
    data
  })
}

export function payFor(data) {
  return request({
    url: '/api/cggl/cGPaid/payFor',
    method: 'post',
    data
  })
}

export function getCGPaidDetailById(params) {
  return request({
    url: '/api/cggl/cGPaid/getCGPaidDetailById',
    method: 'get',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/cGPaid/addAttitude',
    method: 'post',
    data
  })
}
