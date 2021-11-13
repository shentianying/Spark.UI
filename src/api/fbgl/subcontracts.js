import request from '@/utils/request'

/**
  * 分页获取分包合同列表
  * @api {POST} /api/FBGL/Subcontract/GetSubcontractList
  */
export const GetSubcontractList = data =>
  request.post('/api/FBGL/Subcontract/GetSubcontractList', data)
