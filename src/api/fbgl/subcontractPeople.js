import request from '@/utils/request'

/**
  * 分页获取分包人列表
  * @api {POST} /api/FBGL/SubcontractPeople/GetSubcontractPeoplePaging
  */
export const GetSubcontractPeoplePaging = data =>
  request.post('/api/FBGL/SubcontractPeople/GetSubcontractPeoplePaging', data)
/**
 * 初始化页面
 * @api {GET} /api/FBGL/SubcontractPeople/InitSubcontractPeople
 */
export const InitSubcontractPeople = params =>
  request.get('/api/FBGL/SubcontractPeople/InitSubcontractPeople', { params })
/**
  * 分页获取分包人列表
  * @api {POST} /api/FBGL/SubcontractPeople/AddSubcontractPeople
  */
export const AddSubcontractPeople = data =>
  request.post('/api/FBGL/SubcontractPeople/AddSubcontractPeople', data)
/**
 * 修改分包人信息
 * @api {PUT} /api/FBGL/SubcontractPeople/PutSubcontractPeople
 */
export const PutSubcontractPeople = data =>
  request.put('/api/FBGL/SubcontractPeople/PutSubcontractPeople', data)
/**
 * 初始化页面
 * @api {GET} /api/FBGL/SubcontractPeople/GetSubcontractPeopleById
 */
export const GetSubcontractPeopleById = params =>
  request.get('/api/FBGL/SubcontractPeople/GetSubcontractPeopleById', { params })
/**
 * 详情页面-根据id分包人信息
 * @api {GET} /api/FBGL/SubcontractPeople/GetSubcontractPeopleDetailById
 */
export const GetSubcontractPeopleDetailById = params =>
  request.get('/api/FBGL/SubcontractPeople/GetSubcontractPeopleDetailById', { params })
  /**
 * 获取分包人列表
 * @api {GET} /api/FBGL/Subcontractor/GetSubcontractPeopleList
 */
export const GetSubcontractPeopleList = params =>
  request.get('/api/FBGL/SubcontractPeople/GetSubcontractPeopleList', { params })
