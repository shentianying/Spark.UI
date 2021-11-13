/**
 * 项目竣工管理
 */
import request from '@/utils/request'

/**
  * 分页获取项目竣工列表
  * @api {POST} /api/XMGL/ProjectCompleteManage/GetProjectCompleteManagePaging
  */
export const GetProjectCompleteManagePaging = data =>
  request.post('/api/XMGL/ProjectCompleteManage/GetProjectCompleteManagePaging', data)
/**
  * 编辑页面-根据id获取项目竣工信息
  * @api {GET} /api/XMGL/ProjectCompleteManage/GetProjectCompleteManageById
  */
export const GetProjectCompleteManageById = params =>
  request.get('/api/XMGL/ProjectCompleteManage/GetProjectCompleteManageById', { params })
/**
  * 初始化页面数据（下拉选项）
  * @api {GET} /api/XMGL/ProjectCompleteManage/InitProjectCompleteManage
  */
export const InitProjectCompleteManage = () =>
  request.get('/api/XMGL/ProjectCompleteManage/InitProjectCompleteManage')
/**
  * 添加
  * @api {POST} /api/XMGL/ProjectCompleteManage/AddProjectCompleteManage
  */
export const AddProjectCompleteManage = data =>
  request.post('/api/XMGL/ProjectCompleteManage/AddProjectCompleteManage', data)
/**
  * 更新
  * @api {PUT} /api/XMGL/ProjectCompleteManage/PutProjectCompleteManage
  */
export const PutProjectCompleteManage = data =>
  request.put('/api/XMGL/ProjectCompleteManage/PutProjectCompleteManage', data)
/**
  * 作废
  * @api {Delete} /api/XMGL/ProjectCompleteManage/DeleteProjectCompleteManage
  */
export const DeleteProjectCompleteManage = params =>
  request.delete('/api/XMGL/ProjectCompleteManage/DeleteProjectCompleteManage', { params })
/**
  * 获取生成流程
  * @api {POST} /api/XMGL/ProjectCompleteManage/GetBillFlow
  */
export const GetBillFlow = data =>
  request.post('/api/XMGL/ProjectCompleteManage/GetBillFlow', data)
/**
  * 审核页面-根据id获取项目竣工信息
  * @api {GET} /api/XMGL/ProjectCompleteManage/GetProjectCompleteManageAttitudeById
  */
export const GetProjectCompleteManageAttitudeById = params =>
  request.get('/api/XMGL/ProjectCompleteManage/GetProjectCompleteManageAttitudeById', { params })
/**
  * (已废弃)更新项目中的日期信息（审核完成）
  * @api {POST} /api/XMGL/ProjectCompleteManage/UpdateDate
  */
export const UpdateDate = data =>
  request.post('/api/XMGL/ProjectCompleteManage/UpdateDate', data)
/**
 * 审批项目竣工信息
 * @api {POST} /api/XMGL/ProjectCompleteManage/CheckProjectCompleteManage
 */
export const CheckProjectCompleteManage = data =>
  request.post('/api/XMGL/ProjectCompleteManage/CheckProjectCompleteManage', data)
