import request from '@/utils/request'

/**
 * 物料分类
 */

export function getAllMaterialCategory(params) {
  return request({
    url: '/api/cggl/material/GetAllMaterialCategory',
    method: 'get',
    params
  })
}

// 批量添加
export function addRangMaterialCategory(data) {
  return request({
    url: '/api/cggl/material/addRangMaterialCategory',
    method: 'post',
    data
  })
}

export function putMaterialCategory(data) {
  return request({
    url: '/api/cggl/material/putMaterialCategory',
    method: 'put',
    data
  })
}
export function patchCompany(params) {
  return request({
    url: '/api/cggl/material/patchCompany',
    method: 'patch',
    params
  })
}
export function deleteMaterialCategory(params) {
  return request({
    url: '/api/cggl/material/deleteMaterialCategory',
    method: 'delete',
    params
  })
}
export function deleteRangeMaterialCategory(params) {
  return request({
    url: '/api/cggl/material/deleteRangeMaterialCategory',
    method: 'delete',
    params
  })
}

/**
 * 物料属性
 */
export function getAllMaterialProperty(params) {
  return request({
    url: '/api/cggl/material/getAllMaterialProperty',
    method: 'get',
    params
  })
}
export function addMaterialProperty(data) {
  return request({
    url: '/api/cggl/material/addMaterialProperty',
    method: 'post',
    data
  })
}
export function addRangMaterialProperty(data) {
  return request({
    url: '/api/cggl/material/addRangMaterialProperty',
    method: 'post',
    data
  })
}

export function putMaterialProperty(data) {
  return request({
    url: '/api/cggl/material/putMaterialProperty',
    method: 'put',
    data
  })
}
export function deleteMaterialProperty(params) {
  return request({
    url: '/api/cggl/material/deleteMaterialProperty',
    method: 'delete',
    params
  })
}

/**
 * 物料分类属性
 */
export function getMaterialCategoryPropertyByCategoryId(params) {
  return request({
    url: '/api/cggl/material/getMaterialCategoryPropertyByCategoryId',
    method: 'get',
    params
  })
}
export function addMaterialCategoryProperty(data) {
  return request({
    url: '/api/cggl/material/addMaterialCategoryProperty',
    method: 'post',
    data
  })
}
export function DeleteMaterialCategoryProperty(params) {
  return request({
    url: '/api/cggl/material/deleteMaterialCategoryProperty',
    method: 'delete',
    params
  })
}
export function putMaterialCategoryProperty(data) {
  return request({
    url: '/api/cggl/material/PutMaterialCategoryProperty',
    method: 'put',
    data
  })
}

export function copyMaterialCategoryProperty(params) {
  return request({
    url: '/api/cggl/material/CopyMaterialCategoryProperty',
    method: 'get',
    params
  })
}

/**
 * 物料分类属性项目
 */
// 批量添加
export function AddMaterialCategoryPropertyItem(data) {
  return request({
    url: '/api/cggl/material/addMaterialCategoryPropertyItem',
    method: 'post',
    data
  })
}
export function getMaterialCategoryPropertyItem(params) {
  return request({
    url: '/api/cggl/material/GetMaterialCategoryPropertyItem',
    method: 'get',
    params
  })
}

export function getMaterialCategoryByIsMain(params) {
  return request({
    url: '/api/cggl/material/getMaterialCategoryByIsMain',
    method: 'get',
    params
  })
}
