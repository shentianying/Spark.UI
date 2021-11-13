import request from '@/utils/request'

/**
  * 分页获取分包人列表
  * @api {POST} /api/FBGL/SubcontractorAssesment/GetSubcontractorAssesmentPaging
  */
export const GetSubcontractPeoplePaging = data =>
  request.post('/api/FBGL/SubcontractorAssesment/GetSubcontractorAssesmentPaging', data)
/**
 * 初始化页面
 * @api {GET} /api/FBGL/SubcontractPeople/InitSubcontractPeople
 */
export const InitSubcontractPeople = params =>
  request.get('/api/FBGL/SubcontractPeople/InitSubcontractPeople', { params })
/**
  * 添加分包单位评审
  * @api {POST} /api/FBGL/SubcontractorAssesment/AddSubcontractorAssesment
  */
export const AddSubcontractorAssesment = data =>
  request.post('/api/FBGL/SubcontractorAssesment/AddSubcontractorAssesment', data)
/**
 * 修改分包单位评审信息
 * @api {PUT} /api/FBGL/SubcontractorAssesment/PutSubcontractorAssesment
 */
export const PutSubcontractorAssesment = data =>
  request.put('/api/FBGL/SubcontractorAssesment/PutSubcontractorAssesment', data)
/**
 * 详情页面-根据id分包单位信息
 * @api {GET} /api/FBGL/SubcontractorAssesment/GetSubcontractorAssesmentAttitudeById
 */
export const GetSubcontractorAssesmentAttitudeById = params =>
  request.get('/api/FBGL/SubcontractorAssesment/GetSubcontractorAssesmentAttitudeById', { params })
/**
 * 获取流程
  * @api {POST} /api/FBGL/SubcontractorAssesment/GetBillFlow
 */
export const GetBillFlow = params =>
  request.post('/api/FBGL/SubcontractorAssesment/GetBillFlow', params)
/**
 * 审批
  * @api {POST} /api/FBGL/SubcontractorAssesment/CheckSubcontractorAssesment
 */
export const CheckSubcontractorAssesment = params =>
  request.post('/api/FBGL/SubcontractorAssesment/CheckSubcontractorAssesment', params)
