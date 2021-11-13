import request from '@/utils/request'

export function getProjectGatheringPaging(data) {
  return request({
    url: '/api/xmgl/ProjectGathering/getProjectGatheringPaging',
    method: 'post',
    data
  })
}

export function initProjectGathering(params) {
  return request({
    url: '/api/xmgl/ProjectGathering/initProjectGathering',
    method: 'get',
    params
  })
}

export function addProjectGathering(data) {
  return request({
    url: '/api/xmgl/ProjectGathering/addProjectGathering',
    method: 'post',
    data
  })
}

export function putProjectGathering(data) {
  return request({
    url: '/api/xmgl/ProjectGathering/putProjectGathering',
    method: 'put',
    data
  })
}

export function deleteProjectGathering(params) {
  return request({
    url: '/api/xmgl/ProjectGathering/deleteProjectGathering',
    method: 'delete',
    params
  })
}

export function getProjectGatheringById(params) {
  return request({
    url: '/api/xmgl/ProjectGathering/getProjectGatheringById',
    method: 'get',
    params
  })
}

export function getProjectGatheringWithSplitById(params) {
  return request({
    url: '/api/xmgl/ProjectGathering/getProjectGatheringWithSplitById',
    method: 'get',
    params
  })
}

export function getProjectGatheringDetailById(params) {
  return request({
    url: '/api/xmgl/ProjectGathering/getProjectGatheringDetailById',
    method: 'get',
    params
  })
}

export function splitProjectGathering(data) {
  return request({
    url: '/api/xmgl/ProjectGathering/splitProjectGathering',
    method: 'post',
    data
  })
}

export function handInputProjectGathering(data) {
  return request({
    url: '/api/xmgl/ProjectGathering/handInputProjectGathering',
    method: 'post',
    data
  })
}
