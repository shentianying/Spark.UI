/**
 * 项目开工管理
 */
import request from '@/utils/request'

/**
 * 分页获取项目开工列表
 * @api {POST} /api/XMGL/ProjectStartManage/GetProjectStartManagePaging
 */
export const GetProjectStartManagePaging = data =>
  request.post('/api/XMGL/ProjectStartManage/GetProjectStartManagePaging', data)
/**
 * 编辑页面-根据id获取项目开工信息
 * @api {GET} /api/XMGL/ProjectStartManage/GetProjectStartManageById
 */
export const GetProjectStartManageById = params =>
  request.get('/api/XMGL/ProjectStartManage/GetProjectStartManageById', { params })
/**
 * 初始化页面数据（下拉选项）
 * @api {GET} /api/XMGL/ProjectStartManage/InitProjectStartManage
 */
export const InitProjectStartManage = params =>
  request.get('/api/XMGL/ProjectStartManage/InitProjectStartManage', { params })
/**
 * 添加
 * @api {POST} /api/XMGL/ProjectStartManage/AddProjectStartManage
 */
export const AddProjectStartManage = data =>
  request.post('/api/XMGL/ProjectStartManage/AddProjectStartManage', data)
/**
 * 更新
 * @api {PUT} /api/XMGL/ProjectStartManage/PutProjectStartManage
 */
export const PutProjectStartManage = data =>
  request.put('/api/XMGL/ProjectStartManage/PutProjectStartManage', data)
/**
 * 作废
 * @api {Delete} /api/XMGL/ProjectStartManage/DeleteProjectStartManage
 */
export const DeleteProjectStartManage = params =>
  request.delete('/api/XMGL/ProjectStartManage/DeleteProjectStartManage', { params })
/**
 * 获取生成流程
 * @api {POST} /api/XMGL/ProjectStartManage/GetBillFlow
 */
export const GetBillFlow = data =>
  request.post('/api/XMGL/ProjectStartManage/GetBillFlow', data)
/**
 * 审核页面-根据id获取项目开工信息
 * @api {GET} /api/XMGL/ProjectStartManage/GetProjectStartManageAttitudeById
 */
export const GetProjectStartManageAttitudeById = params =>
  request.get('/api/XMGL/ProjectStartManage/GetProjectStartManageAttitudeById', { params })
/**
 * [已废弃]更新项目中的日期信息（审核完成）
 * @api {POST} /api/XMGL/ProjectStartManage/UpdateDate
 */
export const UpdateDate = data =>
  request.post('/api/XMGL/ProjectStartManage/UpdateDate', data)
/**
 * 审批项目开工信息
 * @api {POST} /api/XMGL/ProjectStartManage/CheckProjectStartManage
 */
export const CheckProjectStartManage = data =>
  request.post('/api/XMGL/ProjectStartManage/CheckProjectStartManage', data)
