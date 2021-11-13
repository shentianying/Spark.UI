import request from '@/utils/request'
// 余额报表
/**
   * @description: 余额报表分页
   */
export const GetCapitalReport = params =>
  request.post('/api/CWGL/CapitalReport/GetCapitalReport', params)
