import request from '@/utils/request'

/**
  * 分页获取分包合同评审列表
  * @api {POST} /api/FBGL/SubcontractAssesment/GetSubcontractAssesmentPaging
  */
export const GetSubcontractAssesmentPaging = data =>
  request.post('/api/FBGL/SubcontractAssesment/GetSubcontractAssesmentPaging', data)
/**
 * 初始化页面
 * @api {GET} /api/FBGL/SubcontractAssesment/InitSubcontractAssesment
 */
export const InitSubcontractAssesment = params =>
  request.get('/api/FBGL/SubcontractAssesment/InitSubcontractAssesment', { params })
/**
  * 添加分包合同评审
  * @api {POST} /api/FBGL/SubcontractAssesment/AddSubcontractAssesment
  */
export const AddSubcontractAssesment = data =>
  request.post('/api/FBGL/SubcontractAssesment/AddSubcontractAssesment', data)
/**
 * 修改分包单位评审信息
 * @api {PUT} /api/FBGL/SubcontractAssesment/PutSubcontractAssesment
 */
export const PutSubcontractAssesment = data =>
  request.put('/api/FBGL/SubcontractAssesment/PutSubcontractAssesment', data)
/**
 * 作废
 * @api {Delete} /api/FBGL/SubcontractAssesment/DeleteSubcontractAssesment
 */
export const DeleteSubcontractSignSet = params =>
  request.delete('/api/FBGL/SubcontractAssesment/DeleteSubcontractAssesment', { params })
/**
 * 编辑页面-根据id分包合同评审信息
 * @api {GET} /api/FBGL/SubcontractAssesment/GetSubcontractAssesmentById
 */
export const GetSubcontractAssesmentById = params =>
  request.get('/api/FBGL/SubcontractAssesment/GetSubcontractAssesmentById', { params })
/**
 * 详情页面-根据id分包合同评审信息
 * @api {GET} /api/FBGL/SubcontractAssesment/GetSubcontractAssesmentAttitudeById
 */
export const GetSubcontractAssesmentAttitudeById = params =>
  request.get('/api/FBGL/SubcontractAssesment/GetSubcontractAssesmentAttitudeById', { params })
/**
 * 审批——分包合同评审信息
 * @api {POST} /api/FBGL/SubcontractAssesment/CheckSubcontractAssesment
 */
export const CheckSubcontractAssesment = data =>
  request.post('/api/FBGL/SubcontractAssesment/CheckSubcontractAssesment', data)
/**
 * 用章——分包合同评审信息
 * @api {POST} /api/FBGL/SubcontractAssesment/SealSubcontractAssesment
 */
export const SealSubcontractAssesment = data =>
  request.post('/api/FBGL/SubcontractAssesment/SealSubcontractAssesment', data)
/**
 * 用章——分包合同评审信息
 * @api {POST} /api/FBGL/SubcontractAssesment/SaveSubcontractAssesment
 */
export const SaveSubcontractAssesment = data =>
  request.post('/api/FBGL/SubcontractAssesment/SaveSubcontractAssesment', data)
/**
 * 获取流程
  * @api {POST} /api/FBGL/SubcontractAssesment/GetBillFlow
 */
export const GetBillFlow = params =>
  request.post('/api/FBGL/SubcontractAssesment/GetBillFlow', params)

