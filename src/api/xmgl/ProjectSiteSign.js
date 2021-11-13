/**
 * 对外签证管理
 */
import request from '@/utils/request'

/**
 * 分页获取对外签证列表
 * @api {POST} /api/XMGL/ProjectSiteSign/GetProjectSiteSignPaging
 * @returns Promise
 */
export const GetProjectSiteSignPaging = data =>
  request.post('/api/XMGL/ProjectSiteSign/GetProjectSiteSignPaging', data)
/**
 * 编辑页面-根据id获取对外签证信息
 * @api {GET} /api/XMGL/ProjectSiteSign/GetProjectSiteSignById
 * @returns Promise
 */
export const GetProjectSiteSignById = params =>
  request.get('/api/XMGL/ProjectSiteSign/GetProjectSiteSignById', { params })
/**
 * 初始化页面数据（下拉选项）
 * @api {GET} /api/XMGL/ProjectSiteSign/InitProjectSiteSign
 */
export const InitProjectSiteSign = () =>
  request.get('/api/XMGL/ProjectSiteSign/InitProjectSiteSign')
/**
 * 添加
 * @api {POST} /api/XMGL/ProjectSiteSign/AddProjectSiteSign
 */
export const AddProjectSiteSign = data =>
  request.post('/api/XMGL/ProjectSiteSign/AddProjectSiteSign', data)
/**
 * 更新
 * @api {PUT} /api/XMGL/ProjectSiteSign/PutProjectSiteSign
 */
export const PutProjectSiteSign = data =>
  request.put('/api/XMGL/ProjectSiteSign/PutProjectSiteSign', data)
/**
 * 作废
 * @api {Delete} /api/XMGL/ProjectSiteSign/DeleteProjectSiteSign
 */
export const DeleteProjectSiteSign = params =>
  request.delete('/api/XMGL/ProjectSiteSign/DeleteProjectSiteSign', { params })
/**
 * 获取生成流程
 * @api {POST} /api/XMGL/ProjectSiteSign/GetBillFlow
 */
export const GetBillFlow = data =>
  request.post('/api/XMGL/ProjectSiteSign/GetBillFlow', data)
/**
 * 审核页面-根据id获取对外签证信息
 * @api {GET} /api/XMGL/ProjectSiteSign/GetProjectSiteSignAttitudeById
 */
export const GetProjectSiteSignAttitudeById = params =>
  request.get('/api/XMGL/ProjectSiteSign/GetProjectSiteSignAttitudeById', { params })
/**
 * 修改保存
 * @api {POST} /api/XMGL/ProjectSiteSign/UpdateProjectSiteSign
 */
export const UpdateProjectSiteSign = data =>
  request.post('/api/XMGL/ProjectSiteSign/UpdateProjectSiteSign', data)
