import request from '@/utils/request'

/**
  * 分页获取分包单位入库列表
  * @api {POST} /api/FBGL/Subcontractor/GetSubcontractorPaging
  */
export const GetSubcontractorPaging = data =>
  request.post('/api/FBGL/Subcontractor/GetSubcontractorPaging', data)
/**
 * 初始化页面
 * @api {GET} /api/FBGL/Subcontractor/InitSubcontractor
 */
export const InitSubcontractor = params =>
  request.get('/api/FBGL/Subcontractor/InitSubcontractor', { params })
/**
 * 添加分包单位
 * @api {POST} /api/FBGL/Subcontractor/AddSubcontractor
 */
export const AddSubcontractor = data =>
  request.post('/api/FBGL/Subcontractor/AddSubcontractor', data)
/**
 * 修改分包单位信息
 * @api {PUT} /api/FBGL/Subcontractor/PutSubcontractor
 */
export const PutSubcontractor = data =>
  request.put('/api/FBGL/Subcontractor/PutSubcontractor', data)
/**
 * 编辑页面-根据id分包单位信息
 * @api {GET} /api/FBGL/Subcontractor/GetSubcontractorById
 */
export const GetSubcontractorById = params =>
  request.get('/api/FBGL/Subcontractor/GetSubcontractorById', { params })
/**
 * 编辑页面-根据id分包单位信息
 * @api {GET} /api/FBGL/Subcontractor/GetSubcontractorDetailById
 */
export const GetSubcontractorDetailById = params =>
  request.get('/api/FBGL/Subcontractor/GetSubcontractorDetailById', { params })
  /**
 * 获取分包单位列表
 * @api {GET} /api/FBGL/Subcontractor/GetSubcontractorList
 */
export const GetSubcontractorList = params =>
  request.get('/api/FBGL/Subcontractor/GetSubcontractorList', { params })
