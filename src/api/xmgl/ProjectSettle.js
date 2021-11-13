/**
 * 	项目结算管理
 */
import request from '@/utils/request'

/**
   * 分页获取项目结算列表
   * @api {POST} /api/XMGL/ProjectSettle/GetProjectSettlePaging
   */
export const GetProjectSettlePaging = data =>
  request.post('/api/XMGL/ProjectSettle/GetProjectSettlePaging', data)
/**
   * 编辑页面,审核页面-根据id获取项目结算信息
   * @api {GET} /api/XMGL/ProjectSettle/GetProjectSettleById
   */
export const GetProjectSettleById = params =>
  request.get('/api/XMGL/ProjectSettle/GetProjectSettleById', { params })
/**
   * 添加
   * @api {POST} /api/XMGL/ProjectSettle/AddProjectSettle
   */
export const AddProjectSettle = data =>
  request.post('/api/XMGL/ProjectSettle/AddProjectSettle', data)
/**
   * 更新
   * @api {PUT} /api/XMGL/ProjectSettle/PutProjectSettle
   */
export const PutProjectSettle = data =>
  request.put('/api/XMGL/ProjectSettle/PutProjectSettle', data)
/**
   * 作废
   * @api {Delete} /api/XMGL/ProjectSettle/DeleteProjectSettle
   */
export const DeleteProjectSettle = data =>
  request.delete('/api/XMGL/ProjectSettle/DeleteProjectSettle', data)
/**
   * 获取生成流程
   * @api {POST} /api/XMGL/ProjectSettle/GetBillFlow
   */
export const GetBillFlow = data =>
  request.post('/api/XMGL/ProjectSettle/GetBillFlow', data)
/**
   * 审核页面-根据id获取项目结算信息
   * @api {GET} /api/XMGL/ProjectSettle/GetProjectSettleAttitudeById
   */
export const GetProjectSettleAttitudeById = params =>
  request.get('/api/XMGL/ProjectSettle/GetProjectSettleAttitudeById', { params })
/**
   * [已废弃]更新项目中结算信息（审核完成）
   * @api {POST} /api/XMGL/ProjectSettle/UpdateSettle
   */
export const UpdateSettle = data =>
  request.post('/api/XMGL/ProjectSettle/UpdateSettle', data)
/**
 * 审批项目开工信息
 * @api {POST} /api/XMGL/ProjectSettle/CheckProjectSettle
 */
export const CheckProjectSettle = data =>
  request.post('/api/XMGL/ProjectSettle/CheckProjectSettle', data)
/**
 * 分页获取备用金申请列表
 * @api {POST} /api/CWGL/Imprest/GetImprestPaging
 */
export const GetImprestPaging = data =>
  request.post('/api/CWGL/Imprest/GetImprestPaging', data)

/**
 * 备用金详情页面（人员详情页的备用金选项卡）
 * @api {POST} /api/CWGL/Imprest/GetImprestListByPersonId
 */
export const GetImprestListByPersonId = params =>
  request.get('/api/CWGL/Imprest/GetImprestListByPersonId', { params })
