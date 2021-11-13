import request from '@/utils/request'

/**
  * 分页获取备用金申请列表
  * @api {POST} /api/CWGL/Imprest/GetImprestAppliactionPaging
  */
export const GetImprestAppliactionPaging = data =>
  request.post('/api/CWGL/Imprest/GetImprestAppliactionPaging', data)
/**
 * 编辑页面——根据id获取备用金申请信息
 * @api {GET} /api/CWGL/Imprest/GetImprestAppliactionById
 */
export const GetImprestAppliactionById = params =>
  request.get('/api/CWGL/Imprest/GetImprestAppliactionById', { params })
/**
 * 编辑页面——根据id获取备用金申请信息
 * @api {GET} /api/CWGL/Imprest/InitImprestAppliaction
 */
export const InitImprestAppliaction = params =>
  request.get('/api/CWGL/Imprest/InitImprestAppliaction', { params })
/**
  * 添加申请
  * @api {POST} /api/CWGL/Imprest/AddImprestAppliaction
  */
export const AddImprestAppliaction = data =>
  request.post('/api/CWGL/Imprest/AddImprestAppliaction', data)
/**
 * 更新申请
 * @api {PUT} /api/CWGL/Imprest/PutImprestAppliaction
 */
export const PutImprestAppliaction = data =>
  request.put('/api/CWGL/Imprest/PutImprestAppliaction', data)
/**
 * 作废申请
 * @api {Delete} /api/CWGL/Imprest/DeleteImprestAppliaction
 */
export const DeleteImprestAppliaction = params =>
  request.delete('/api/CWGL/Imprest/DeleteImprestAppliaction', { params })
/**
  * 获取并生成流程
  * @api {POST} /api/CWGL/Imprest/GetBillFlow
  */
export const GetBillFlow = data =>
  request.post('/api/CWGL/Imprest/GetBillFlow', data)
/**
  * 审批页面——根据id获取备用金申请信息、审批信息
  * @api {POST} /api/CWGL/Imprest/GetImprestAppliactionAttitudeById
  */
export const GetImprestAppliactionAttitudeById = params =>
  request.get('/api/CWGL/Imprest/GetImprestAppliactionAttitudeById', { params })
/**
  * 审批 ——备用金申请
  * @api {POST} /api/CWGL/Imprest/CheckImprestAppliaction
  */
export const CheckImprestAppliaction = data =>
  request.post('/api/CWGL/Imprest/CheckImprestAppliaction', data)
/**
  * 支付
  * @api {POST} /api/CWGL/Imprest/PayFor
  */
export const PayFor = data =>
  request.post('/api/CWGL/Imprest/PayFor', data)
/**
  * 分页获取备用金申请列表
  * @api {POST} /api/CWGL/Imprest/GetImprestWriteOffPaging
  */
export const GetImprestWriteOffPaging = data =>
  request.post('/api/CWGL/Imprest/GetImprestWriteOffPaging', data)
/**
 * 编辑页面——根据id获取备用金冲销信息
 * @api {GET} /api/CWGL/Imprest/GetImprestWriteOffById
 */
export const GetImprestWriteOffById = params =>
  request.get('/api/CWGL/Imprest/GetImprestWriteOffById', { params })
/**
 * 初始化页面-获取冲销方式List
 * @api {GET} /api/CWGL/Imprest/InitImprestWriteOff
 */
export const InitImprestWriteOff = params =>
  request.get('/api/CWGL/Imprest/InitImprestWriteOff', { params })
/**
  * 添加冲销
  * @api {POST} /api/CWGL/Imprest/AddImprestWriteOff
  */
export const AddImprestWriteOff = data =>
  request.post('/api/CWGL/Imprest/AddImprestWriteOff', data)
/**
 * 更新冲销
 * @api {PUT} /api/CWGL/Imprest/PutImprestWriteOff
 */
export const PutImprestWriteOff = data =>
  request.put('/api/CWGL/Imprest/PutImprestWriteOff', data)
/**
* 作废冲销
* @api {Delete} /api/CWGL/Imprest/DeleteImprestWriteOff
*/
export const DeleteImprestWriteOff = params =>
  request.delete('/api/CWGL/Imprest/DeleteImprestWriteOff', { params })
/**
  * 分页获取备用金申请列表
  * @api {POST} /api/CWGL/Imprest/GetImprestPaging
  */
export const GetImprestPaging = data =>
  request.post('/api/CWGL/Imprest/GetImprestPaging', data)
/**
 * 备用金详情页面（人员详情页的备用金选项卡）
 * @api {GET} /api/CWGL/Imprest/GetImprestListByPersonId
 */
export const GetImprestListByPersonId = params =>
  request.get('/api/CWGL/Imprest/GetImprestListByPersonId', { params })
