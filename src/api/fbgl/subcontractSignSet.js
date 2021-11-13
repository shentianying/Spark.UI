import request from '@/utils/request'

/**
  * 分页获取合同用章列表
  * @api {POST} /api/FBGL/SubcontractSignSet/GetSubcontractSignSetPaging
  */
export const GetSubcontractSignSetPaging = data =>
  request.post('/api/FBGL/SubcontractSignSet/GetSubcontractSignSetPaging', data)
  /**
  * 初始化页面
  * @api {GET} /api/FBGL/SubcontractSignSet/InitSubcontractSignSet
  */
export const InitSubcontractSignSet = params =>
  request.get('/api/FBGL/SubcontractSignSet/InitSubcontractSignSet', { params })
/**
  * 添加分包签证立项
  * @api {POST} /api/FBGL/SubcontractSignSet/AddSubcontractSignSet
  */
export const AddSubcontractSignSet = data =>
  request.post('/api/FBGL/SubcontractSignSet/AddSubcontractSignSet', data)

/**
 * 修改分包单位信息
 * @api {PUT} /api/FBGL/SubcontractSignSet/PutSubcontractSignSet
 */
export const PutSubcontractSignSet = data =>
  request.put('/api/FBGL/SubcontractSignSet/PutSubcontractSignSet', data)
/**
 * 编辑页面-根据id获取分包签证立项信息
 * @api {GET} /api/FBGL/SubcontractSignSet/GetSubcontractSignSetById
 */
export const GetSubcontractSignSetById = params =>
  request.get('/api/FBGL/SubcontractSignSet/GetSubcontractSignSetById', { params })
/**
 * 详情页面-根据id获取分包签证立项信息
 * @api {GET} /api/FBGL/SubcontractSignSet/GetSubcontractSignSetAttitudeById
 */
export const GetSubcontractSignSetAttitudeById = params =>
  request.get('/api/FBGL/SubcontractSignSet/GetSubcontractSignSetAttitudeById', { params })

/**
 * 获取流程
  * @api {POST} /api/FBGL/SubcontractSignSet/GetBillFlow
 */
export const GetBillFlow = params =>
  request.post('/api/FBGL/SubcontractSignSet/GetBillFlow', params)
/**
 * 作废
 * @api {Delete} /api/FBGL/SubcontractSignSet/DeleteSubcontractSignSet
 */
export const DeleteSubcontractSignSet = params =>
  request.delete('/api/FBGL/SubcontractSignSet/DeleteSubcontractSignSet', { params })

/**
  * 获取项目对外签证列表
  * @api {POST} /api/XMGL/ProjectSiteSign/GetProjectSiteSignList
  */
export const GetProjectSiteSignList = data =>
  request.post('/api/XMGL/ProjectSiteSign/GetProjectSiteSignList', data)
