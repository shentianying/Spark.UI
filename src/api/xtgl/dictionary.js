import request from '@/utils/request'

export function getDictionaryList(params) {
  return request({
    url: '/api/xtgl/dictionary/getDictionaryList',
    method: 'get',
    params
  })
}
export function getDictionaryGroupType(params) {
  return request({
    url: '/api/xtgl/dictionary/getDictionaryGroupType',
    method: 'get',
    params
  })
}

export function initDictionary(params) {
  return request({
    url: '/api/xtgl/dictionary/initDictionary',
    method: 'get',
    params
  })
}

export function getDictionaryPaging(params) {
  return request({
    url: '/api/xtgl/dictionary/getDictionaryPaging',
    method: 'get',
    params
  })
}
export function addDictionary(data) {
  return request({
    url: '/api/xtgl/dictionary/addDictionary',
    method: 'post',
    data
  })
}
export function putDictionary(data) {
  return request({
    url: '/api/xtgl/dictionary/putDictionary',
    method: 'put',
    data
  })
}

export function putDictionaryTypeName(data) {
  return request({
    url: '/api/xtgl/dictionary/putDictionaryTypeName',
    method: 'put',
    data
  })
}
export function deleteDictionary(params) {
  return request({
    url: '/api/xtgl/dictionary/deleteDictionary',
    method: 'delete',
    params
  })
}
export function getDictionarysByTypes(params) {
  return request({
    url: '/api/xtgl/dictionary/getDictionarysByTypes',
    method: 'post',
    params
  })
}

