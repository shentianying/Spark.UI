import request from '@/utils/request'
// 资金调拨
/**
   * @description:分页获取资金收款列表； 请求方式：POST； 请求地址：/api/CWGL/FundAllocation/GetFundAllocationPaging；
   */
export const GetFundAllocationPaging = params =>
  request.post('/api/CWGL/FundAllocation/GetFundAllocationPaging', params)
  /**
   * @description:根据id获取资金调拨信息； 请求方式：GET； 请求地址：/api/CWGL/FundAllocation/GetFundAllocationById；
   */
export const GetFundAllocationById = id =>
  request.get('/api/CWGL/FundAllocation/GetFundAllocationById?id=' + id)
  /**
   * @description:初始化页面获取的数据（下拉选项List列表）； 请求方式：GET； 请求地址：/api/CWGL/FundAllocation/InitiFundAllocation；
   */
export const InitiFundAllocation = params =>
  request.get('/api/CWGL/FundAllocation/InitiFundAllocation', params)
  /**
   * @description:添加； 请求方式：POST； 请求地址：/api/CWGL/FundAllocation/AddFundAllocation；
   */
export const AddFundAllocation = params =>
  request.post('/api/CWGL/FundAllocation/AddFundAllocation', params)
  /**
   * @description:更新； 请求方式：put； 请求地址：/api/CWGL/FundAllocation/PutFundAllocation；
   */
export const PutFundAllocation = params =>
  request.put('/api/CWGL/FundAllocation/PutFundAllocation', params)
  /**
   * @description:作废； 请求方式：Delete； 请求地址：/api/CWGL/FundAllocation/DeleteFundAllocation；
   */
export const DeleteFundAllocation = id =>
  request.delete('/api/CWGL/FundAllocation/DeleteFundAllocation?id=' + id)
  /**
   * @description:获取生成流程； 请求方式：POST； 请求地址：/api/CWGL/FundAllocation/GetBillFlow
   */
export const GetBillFlow = params => request.post('/api/CWGL/FundAllocation/GetBillFlow', params)
/**
   * @description:支付； 请求方式：POST； 请求地址：/api/CWGL/FundAllocation/PayFor
   */
export const PayFor = params => request.post('/api/CWGL/FundAllocation/PayFor', params)
