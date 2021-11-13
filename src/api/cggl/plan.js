import request from '@/utils/request'

export function getPlanById(params) {
  return request({
    url: '/api/cggl/Plan/getPlanById',
    method: 'get',
    params
  })
}

export function getPlanPaging(data) {
  return request({
    url: '/api/cggl/Plan/getPlanPaging',
    method: 'post',
    data
  })
}

export function getBillFlow(data) {
  return request({
    url: '/api/cggl/Plan/getBillFlow',
    method: 'post',
    data
  })
}
export function getPlanBillAttitudeById(params) {
  return request({
    url: '/api/cggl/Plan/getPlanBillAttitudeById',
    method: 'get',
    params
  })
}

export function getPlanList(params) {
  return request({
    url: '/api/cggl/Plan/getPlanList',
    method: 'get',
    params
  })
}
export function checkPlanDetail(data) {
  return request({
    url: '/api/cggl/Plan/checkPlanDetail',
    method: 'post',
    data
  })
}

export function addPlan(data) {
  return request({
    url: '/api/cggl/Plan/addPlan',
    method: 'post',
    data
  })
}

export function putPlan(data) {
  return request({
    url: '/api/cggl/Plan/putPlan',
    method: 'put',
    data
  })
}
// export function putPlanState(params) {
//   return request({
//     url: '/api/CGGL/Plan/putPlanState',
//     method: 'get',
//     params
//   })
// }

export function deletePlan(params) {
  return request({
    url: '/api/cggl/Plan/deletePlan',
    method: 'delete',
    params
  })
}
export function checkPlanData(data) {
  return request({
    url: '/api/cggl/Plan/checkPlanData',
    method: 'post',
    data
  })
}
export function cancelPlanDetailsSubmit(data) {
  return request({
    url: '/api/cggl/plan/cancelPlanDetailsSubmit',
    method: 'post',
    data
  })
}
export function getMaterialCancelBillFlow(data) {
  return request({
    url: '/api/cggl/Plan/getMaterialCancelBillFlow',
    method: 'post',
    data
  })
}

export function getPlanDetailCancelPaging(data) {
  return request({
    url: '/api/cggl/Plan/getPlanDetailCancelPaging',
    method: 'post',
    data
  })
}

export function getPlanDetailCancelBillAttitudeById(params) {
  return request({
    url: '/api/cggl/Plan/getPlanDetailCancelBillAttitudeById',
    method: 'get',
    params
  })
}
export function addAttitudeForPlan(data) {
  return request({
    url: '/api/cggl/Plan/addAttitudeForPlan',
    method: 'post',
    data
  })
}
export function addAttitudeForPlanCancel(data) {
  return request({
    url: '/api/cggl/Plan/addAttitudeForPlanCancel',
    method: 'post',
    data
  })
}
