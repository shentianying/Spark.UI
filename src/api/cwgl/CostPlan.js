import request from '@/utils/request'
/**
  * 分页获取费用计划列表
  * @api {POST} /api/CWGL/CostPlan/GetCostPlanPaging
  */
export const GetCostPlanPaging = data =>
  request.post('/api/CWGL/CostPlan/GetCostPlanPaging', data)
/**
  * 新增费用计划
  * @api {POST} /api/CWGL/CostPlan/AddCostPlan
  */
export const AddCostPlan = data =>
  request.post('/api/CWGL/CostPlan/AddCostPlan', data)
/**
 * 修改费用计划
 * @api {PUT} /api/CWGL/CostPlan/PutCostPlan
 */
export const PutCostPlan = data =>
  request.put('/api/CWGL/CostPlan/PutCostPlan', data)
/**
 * 费用计划作废
 * @api {Delete} /api/CWGL/CostPlan/DeleteCostPlan
 */
export const DeleteCostPlan = params =>
  request.delete('/api/CWGL/CostPlan/DeleteCostPlan', { params })
/**
  * 获取并生成流程
  * @api {POST} /api/CWGL/CostPlan/GetBillFlow
  */
export const GetBillFlow = data =>
  request.post('/api/CWGL/CostPlan/GetBillFlow', data)
/**
 * 初始化页面数据
 * @api {GET} /api/CWGL/CostPlan/InitCostPlan
 */
export const InitCostPlan = params =>
  request.get('/api/CWGL/CostPlan/InitCostPlan', { params })
/**
 * 初始化页面数据
 * @api {GET} /api/CWGL/CostPlan/GetCostPlanById
 */
export const GetCostPlanById = params =>
  request.get('/api/CWGL/CostPlan/GetCostPlanById', { params })
/**
 * 审核页面——根据id获取费用计划信息
 * @api {GET} /api/CWGL/CostPlan/GetCostPlanAttitudeById
 */
export const GetCostPlanAttitudeById = params =>
  request.get('/api/CWGL/CostPlan/GetCostPlanAttitudeById', { params })
/**
  * 审核费用计划
  * @api {POST} /api/CWGL/CostPlan/CheckCostPlan
  */
export const CheckCostPlan = data =>
  request.post('/api/CWGL/CostPlan/CheckCostPlan', data)
/**
  * 验收费用计划
  * @api {POST} /api/CWGL/CostPlan/AcceptCostPlan
  */
export const AcceptCostPlan = data =>
  request.post('/api/CWGL/CostPlan/AcceptCostPlan', data)
