import request from '@/utils/request'
/**
   * @description: 分页获取资金支出列表； 请求方式：POST； 请求地址：/api/CWGL/Expend/GetExpendPaging ；
   */
export const GetExpendPaging = params =>
  request.post('/api/CWGL/Expend/GetExpendPaging', params)
  /**
   * @description: 根据ID获取资金支出详情； 请求方式：GET； 请求地址：/api/CWGL/Expend/GetExpendById；
   */
export const GetExpendById = id =>
  request.get('/api/CWGL/Expend/GetExpendById?id=' + id)
  /**
   * @description: 保存资金支出单； 请求方式：POST； 请求地址：/api/CWGL/Payment/SaveExpend ；
   */
export const SaveExpend = params => request.post('/api/CWGL/Expend/SaveExpend', params)
/**
   * @description: 单据作废； 请求方式：GET； 请求地址：/api/CWGL/Expend/InvalidExpend ；
   */
export const InvalidExpend = id =>
  request.get('/api/CWGL/Expend/InvalidExpend?id=' + id)
/**
  * 获取单子状态列表
  * @api {GET} /api/CWGL/Expend/GetDefaultOptions
  */
export const GetDefaultOptions = () =>
  request.get('/api/CWGL/Expend/GetDefaultOptions')
