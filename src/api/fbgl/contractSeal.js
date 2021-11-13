import request from '@/utils/request'

/**
  * 分页获取合同用章列表
  * @api {POST} /api/FBGL/ContractSeal/GetContractSealPaging
  */
export const GetSubcontractorPaging = data =>
  request.post('/api/FBGL/ContractSeal/GetContractSealPaging', data)

