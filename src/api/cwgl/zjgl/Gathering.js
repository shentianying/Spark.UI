import request from '@/utils/request'

/**
* @description: 分页获取资金收款列表
*/
export const GetGatheringPaging = params => request.post('/api/CWGL/Gathering/GetGatheringPaging', params)

/**
* @description: 根据Id获取资金收款信息
*/
export const GetPaymentById = id => request.get('/api/CWGL/Gathering/GetGatheringById?id=' + id)

/**
* @description: 新增更新资金收款明细
*/
export const SaveGathering = params => request.post('/api/CWGL/Gathering/SaveGathering', params)

/**
* @description: 单据作废
*/
export const InvalidGathering = id => request.get('/api/CWGL/Gathering/InvalidGathering?id=' + id)

/**
  * 获取单子状态列表
  * @api {GET} /api/CWGL/Gathering/GetDefaultOptions
  */
export const GetDefaultOptions = () => request.get('/api/CWGL/Gathering/GetDefaultOptions')
