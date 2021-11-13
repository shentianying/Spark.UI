import request from '@/utils/request'

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/designOrder/getBillFlow',
    method: 'post',
    data
  })
}

export function getPlanDesignOrderPaging(data) {
  return request({
    url: '/api/cggl/designOrder/getPlanDesignOrderPaging',
    method: 'post',
    data
  })
}

export function getPlanDesignOrderById(params) {
  return request({
    url: '/api/cggl/designOrder/getPlanDesignOrderById',
    method: 'get',
    params
  })
}

// 验证 导入数据，不验证 数据是否可填，可不填
export function checkImportExcel(data) {
  return request({
    url: '/api/cggl/designOrder/checkImportExcel',
    method: 'post',
    data
  })
}
// 验证数据是否合法，是否可以为空，是否必填，等信息
export function checkPlanDesignOrderDetail(data) {
  return request({
    url: '/api/cggl/designOrder/checkPlanDesignOrderDetail',
    method: 'post',
    data
  })
}
export function addPlanDesignOrder(data) {
  return request({
    url: '/api/cggl/designOrder/addPlanDesignOrder',
    method: 'post',
    data
  })
}
export function putPlanDesignOrder(data) {
  return request({
    url: '/api/cggl/designOrder/putPlanDesignOrder',
    method: 'put',
    data
  })
}
export function deleteDesignOrder(params) {
  return request({
    url: '/api/cggl/designOrder/deleteDesignOrder',
    method: 'delete',
    params
  })
}
export function addAttitude(data) {
  return request({
    url: '/api/cggl/designOrder/addAttitude',
    method: 'post',
    data
  })
}
