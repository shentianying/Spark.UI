/**
 * 	项目工期管理
 */
import request from '@/utils/request'

/**
  * 分页获取项目工期列表
  * @api {POST} /api/XMGL/ProjectDuration/GetProjectDurationPaging
  */
export const GetProjectDurationPaging = data =>
  request.post('/api/XMGL/ProjectDuration/GetProjectDurationPaging', data)
/**
  * 编辑页面-根据id获取项目竣工信息
  * @api {GET} /api/XMGL/ProjectDuration/GetProjectDurationById
  */
export const GetProjectDurationById = params =>
  request.get('/api/XMGL/ProjectDuration/GetProjectDurationById', { params })
/**
  * 初始化页面数据（下拉选项）
  * @api {GET} /api/XMGL/ProjectDuration/InitProjectDuration
  */
export const InitProjectDuration = () =>
  request.get('/api/XMGL/ProjectDuration/InitProjectDuration')
/**
  * 添加
  * @api {POST} /api/XMGL/ProjectDuration/AddProjectDuration
  */
export const AddProjectDuration = data =>
  request.post('/api/XMGL/ProjectDuration/AddProjectDuration', data)
/**
  * 更新
  * @api {PUT} /api/XMGL/ProjectDuration/PutProjectDuration
  */
export const PutProjectDuration = data =>
  request.put('/api/XMGL/ProjectDuration/PutProjectDuration', data)
/**
  * 作废
  * @api {Delete} /api/XMGL/ProjectDuration/DeleteProjectDuration
  */
export const DeleteProjectDuration = params =>
  request.delete('/api/XMGL/ProjectDuration/DeleteProjectDuration', { params })
/**
  * 获取生成流程
  * @api {POST} /api/XMGL/ProjectDuration/GetBillFlow
  */
export const GetBillFlow = data =>
  request.post('/api/XMGL/ProjectDuration/GetBillFlow', data)
/**
  * 审核页面-根据id获取项目竣工信息
  * @api {GET} /api/XMGL/ProjectDuration/GetProjectDurationAttitudeById
  */
export const GetProjectDurationAttitudeById = params =>
  request.get('/api/XMGL/ProjectDuration/GetProjectDurationAttitudeById', { params })
/**
  * [已废弃]更新项目中的工期信息（审核完成）
  * @api {POST} /api/XMGL/ProjectDuration/UpdateDuration
  */
export const UpdateDuration = data =>
  request.post('/api/XMGL/ProjectDuration/UpdateDuration', data)
/**
 * 审批项目工期信息
 * @api {POST} /api/XMGL/ProjectDuration/CheckProjectDuration
 */
export const CheckProjectDuration = data =>
  request.post('/api/XMGL/ProjectDuration/CheckProjectDuration', data)
