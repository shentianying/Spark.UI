import request from '@/utils/request'
/**
  * 分页获取发票报销列表
  * @api {POST} /api/CWGL/InvoiceReimburse/GetInvoiceReimbursePaging
  */
export const GetInvoiceReimbursePaging = data =>
  request.post('/api/CWGL/InvoiceReimburse/GetInvoiceReimbursePaging', data)
/**
 * 初始化页面数据
 * @api {GET} /api/CWGL/InvoiceReimburse/InitInvoiceReimburse
 */
export const InitInvoiceReimburse = params =>
  request.get('/api/CWGL/InvoiceReimburse/InitInvoiceReimburse', { params })
/**
  * 新增发票报销
  * @api {POST} /api/CWGL/InvoiceReimburse/AddInvoiceReimburse
  */
export const AddInvoiceReimburse = data =>
  request.post('/api/CWGL/InvoiceReimburse/AddInvoiceReimburse', data)
/**
 * 修改发票报销
 * @api {PUT} /api/CWGL/InvoiceReimburse/PutInvoiceReimburse
 */
export const PutInvoiceReimburse = data =>
  request.put('/api/CWGL/InvoiceReimburse/PutInvoiceReimburse', data)
/**
 * 作废发票报销
 * @api {Delete} /api/CWGL/InvoiceReimburse/DeleteInvoiceReimburse
 */
export const DeleteInvoiceReimburse = params =>
  request.delete('/api/CWGL/InvoiceReimburse/DeleteInvoiceReimburse', { params })
/**
  * 获取并生成流程
  * @api {POST} /api/CWGL/InvoiceReimburse/GetBillFlow
  */
export const GetBillFlow = data =>
  request.post('/api/CWGL/InvoiceReimburse/GetBillFlow', data)
/**
 * 编辑页面——根据id获取发票报销信息
 * @api {GET} /api/CWGL/InvoiceReimburse/GetInvoiceReimburseById
 */
export const GetInvoiceReimburseById = params =>
  request.get('/api/CWGL/InvoiceReimburse/GetInvoiceReimburseById', { params })
/**
 * 审核页面——根据id获取发票报销信息
 * @api {GET} /api/CWGL/InvoiceReimburse/GetInvoiceReimburseAttitudeById
 */
export const GetInvoiceReimburseAttitudeById = params =>
  request.get('/api/CWGL/InvoiceReimburse/GetInvoiceReimburseAttitudeById', { params })
/**
 * 审核发票报销
 * @api {POST} /api/CWGL/InvoiceReimburse/CheckInvoiceReimburse
 */
export const CheckInvoiceReimburse = data =>
  request.post('/api/CWGL/InvoiceReimburse/CheckInvoiceReimburse', data)
/**
 * 支付
 * @api {POST} /api/CWGL/InvoiceReimburse/PayFor
 */
export const PayFor = data =>
  request.post('/api/CWGL/InvoiceReimburse/PayFor', data)
/**
 * NC登记
 * @api {POST} /api/CWGL/InvoiceReimburse/NCRegister
 */
export const NCRegister = data =>
  request.post('/api/CWGL/InvoiceReimburse/NCRegister', data)
/**
 * 审核页面——根据id获取发票报销信息
 * @api {GET} /api/CWGL/InvoiceReimburse/GetInvoiceReimburseDetailById
 */
export const GetInvoiceReimburseDetailById = params =>
  request.get('/api/CWGL/InvoiceReimburse/GetInvoiceReimburseDetailById', { params })
