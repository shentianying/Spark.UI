import request from '@/utils/request'

/**
   * @description: 承兑明细分页； 请求方式：POST； 请求地址：/api/CWGL/Acceptance/GetAcceptancePaging；
   */
export const GetAcceptDetailPaging = params =>
  request.post('/api/CWGL/Acceptance/GetAcceptancePaging', params)
  /**
   * @description:未支出承兑明细； 请求方式：POST； 请求地址：/api/CWGL/Acceptance/GetAcceptanceCheckList；
   */
export const GetAcceptDetailCheckList = params =>
  request.post('/api/CWGL/Acceptance/GetAcceptanceCheckList', params)
  /**
   * @description:根据ID获取承兑明细详情； 请求方式：GET； 请求地址：/api/CWGL/Acceptance/GetAcceptanceById；
   */
export const GetAcceptDetailById = id =>
  request.get('/api/CWGL/Acceptance/GetAcceptanceById/?id=' + id)
  /**
   * @description:到期确认； 请求方式：GET； 请求地址：/api/CWGL/Acceptance/EnsureAcceptance；
   */
export const EnsureAcceptDetail = id =>
  request.get('/api/CWGL/Acceptance/EnsureAcceptance?id=' + id)
/**
   * @description: 承兑到期统计
   */
export const GetExpirStatist = params =>
  request.get(`/api/CWGL/Acceptance/GetExpirStatist`, { params })
/**
   * @description: 月份统计承兑详情
   */
export const GetAcceptanceListByMonth = params =>
  request.get(`/api/CWGL/Acceptance/GetAcceptanceListByMonth`, { params })
