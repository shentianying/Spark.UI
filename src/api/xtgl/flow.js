import request from '@/utils/request'

// export function getflowList(params) {
//   return request({
//     url: '/api/xtgl/flow/getflowList',
//     method: 'get',
//     params
//   })
// }
// export function initflow(params) {
//   return request({
//     url: '/api/xtgl/flow/initflow',
//     method: 'get',
//     params
//   })
// }

export function getFlowPaging(params) {
  return request({
    url: '/api/xtgl/flow/getFlowPaging',
    method: 'get',
    params
  })
}
export function getFlowList(params) {
  return request({
    url: '/api/xtgl/flow/getFlowList',
    method: 'get',
    params
  })
}

export function addFlow(data) {
  return request({
    url: '/api/xtgl/flow/addFlow',
    method: 'post',
    data
  })
}
export function addFlowNode(data) {
  return request({
    url: '/api/xtgl/flow/addFlowNode',
    method: 'post',
    data
  })
}

export function getFlowNode(params) {
  return request({
    url: '/api/xtgl/flow/getFlowNode',
    method: 'get',
    params
  })
}

export function putFlow(data) {
  return request({
    url: '/api/xtgl/flow/putflow',
    method: 'put',
    data
  })
}
export function putFlowPrev(data) {
  return request({
    url: '/api/xtgl/flow/putFlowPrev',
    method: 'put',
    data
  })
}
export function putFlowNext(data) {
  return request({
    url: '/api/xtgl/flow/putFlowNext',
    method: 'put',
    data
  })
}
export function putFlowBottom(data) {
  return request({
    url: '/api/xtgl/flow/putFlowBottom',
    method: 'put',
    data
  })
}
export function putFlowTop(data) {
  return request({
    url: '/api/xtgl/flow/putFlowTop',
    method: 'put',
    data
  })
}
// FlowCondition 流程条件

export function getFieldTypeList(params) {
  return request({
    url: '/api/xtgl/flow/getFieldTypeList',
    method: 'get',
    params
  })
}
export function getFlowCondition(params) {
  return request({
    url: '/api/xtgl/flow/getFlowCondition',
    method: 'get',
    params
  })
}
export function addFlowCondition(data) {
  return request({
    url: '/api/xtgl/flow/addFlowCondition',
    method: 'post',
    data
  })
}

