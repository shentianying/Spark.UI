import request from '@/utils/request'

/**
  * 分页获取保证金列表
  * @api {POST} /api/CWGL/Deposit/GetDepositPaging
  */
export const GetDepositPaging = data =>
  request.post('/api/CWGL/Deposit/GetDepositPaging', data)
/**
 * 初始化页面获取的数据
 * @api {GET} /api/CWGL/Deposit/InitDeposit
 */
export const InitDeposit = params =>
  request.get('/api/CWGL/Deposit/InitDeposit', { params })
/**
  * 新增保证金申请
  * @api {POST} /api/CWGL/Deposit/AddDeposit
  */
export const AddDeposit = data =>
  request.post('/api/CWGL/Deposit/AddDeposit', data)
/**
 * 修改保证金申请
 * @api {PUT} /api/CWGL/Deposit/PutDeposit
 */
export const PutDeposit = data =>
  request.put('/api/CWGL/Deposit/PutDeposit', data)
/**
 * 作废申请
 * @api {Delete} /api/CWGL/Deposit/DeleteDeposit
 */
export const DeleteDeposit = params =>
  request.delete('/api/CWGL/Deposit/DeleteDeposit', { params })
/**
  * 获取保证金申请流程
  * @api {POST} /api/CWGL/Deposit/GetBillFlow
  */
export const GetBillFlow = data =>
  request.post('/api/CWGL/Deposit/GetBillFlow', data)
/**
 * 编辑单据的时候 根据id获取保证金申请信息
 * @api {GET} /api/CWGL/Deposit/GetDepositById
 */
export const GetDepositById = params =>
  request.get('/api/CWGL/Deposit/GetDepositById', { params })
/**
 * 审核单据的时候 - 根据id获取保证金申请信息
 * @api {GET} /api/CWGL/Deposit/GetDepositAttitudeById
 */
export const GetDepositAttitudeById = params =>
  request.get('/api/CWGL/Deposit/GetDepositAttitudeById', { params })
/**
  * 新增保证金申请
  * @api {POST} /api/CWGL/Deposit/CheckDeposit
  */
export const CheckDeposit = data =>
  request.post('/api/CWGL/Deposit/CheckDeposit', data)
/**
  * 支付保证金
  * @api {POST} /api/CWGL/Deposit/PayFor
  */
export const PayFor = data =>
  request.post('/api/CWGL/Deposit/PayFor', data)
/**
  * 回收保证金
  * @api {POST} /api/CWGL/Deposit/ReturnDeposit
  */
export const ReturnDeposit = data =>
  request.post('/api/CWGL/Deposit/ReturnDeposit', data)
/**
  * 变更申请新增
  * @api {POST} /api/CWGL/Deposit/AddDepositModify
  */
export const AddDepositModify = data =>
  request.post('/api/CWGL/Deposit/AddDepositModify', data)
/**
 * 变更申请修改
 * @api {PUT} /api/CWGL/Deposit/PutDepositModify
 */
export const PutDepositModify = data =>
  request.put('/api/CWGL/Deposit/PutDepositModify', data)
/**
  * 获取保证金申请流程
  * @api {POST} /api/CWGL/Deposit/GetModifyBillFlow
  */
export const GetModifyBillFlow = data =>
  request.post('/api/CWGL/Deposit/GetModifyBillFlow', data)
/**
 * 变更审核单据页 - 根据id获取保证金变更信息
 * @api {GET} /api/CWGL/Deposit/GetDepositModifyAttitudeById
 */
export const GetDepositModifyAttitudeById = params =>
  request.get('/api/CWGL/Deposit/GetDepositModifyAttitudeById', { params })
/**
  * 审批——保证金变更
  * @api {POST} /api/CWGL/Deposit/CheckDepositModify
  */
export const CheckDepositModify = data =>
  request.post('/api/CWGL/Deposit/CheckDepositModify', data)
/**
 * 变更审核单据页 - 根据id获取保证金信息
 * @api {GET} /api/CWGL/Deposit/GetDepositDetailById
 */
export const GetDepositDetailById = params =>
  request.get('/api/CWGL/Deposit/GetDepositDetailById', { params })

export const DeleteDepositModify = params =>
  request.get('/api/CWGL/Deposit/DeleteDepositModify', { params })
