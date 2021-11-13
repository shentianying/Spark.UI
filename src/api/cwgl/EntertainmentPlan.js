import request from '@/utils/request'

/**
  * 分页获取招待费计划列表
  * @api {POST} /api/CWGL/EntertainmentPlan/GetEntertainmentPlanPaging
  */
export const GetEntertainmentPlanPaging = data =>
  request.post('/api/CWGL/EntertainmentPlan/GetEntertainmentPlanPaging', data)
  /**
  * 新增招待费计划
  * @api {POST} /api/CWGL/EntertainmentPlan/AddEntertainmentPlan
  */
export const AddEntertainmentPlan = data =>
  request.post('/api/CWGL/EntertainmentPlan/AddEntertainmentPlan', data)
/**
 * 修改招待费计划
 * @api {PUT} /api/CWGL/EntertainmentPlan/PutEntertainmentPlan
 */
export const PutEntertainmentPlan = data =>
  request.put('/api/CWGL/EntertainmentPlan/PutEntertainmentPlan', data)
/**
 * 招待费计划作废
 * @api {Delete} /api/CWGL/EntertainmentPlan/DeleteEntertainmentPlan
 */
export const DeleteEntertainmentPlan = params =>
  request.delete('/api/CWGL/EntertainmentPlan/DeleteEntertainmentPlan', { params })
/**
  * 获取并生成流程
  * @api {POST} /api/CWGL/EntertainmentPlan/GetBillFlow
  */
export const GetBillFlow = data =>
  request.post('/api/CWGL/EntertainmentPlan/GetBillFlow', data)
/**
 * 根据id获取招待费计划信息
 * @api {GET} /api/CWGL/EntertainmentPlan/GetEntertainmentPlanById
 */
export const GetDepositById = params =>
  request.get('/api/CWGL/EntertainmentPlan/GetEntertainmentPlanById', { params })
/**
  * 审核招待费计划
  * @api {POST} /api/CWGL/EntertainmentPlan/CheckEntertainmentPlan
  */
export const CheckEntertainmentPlan = data =>
  request.post('/api/CWGL/EntertainmentPlan/CheckEntertainmentPlan', data)
