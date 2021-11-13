const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menus: state => state.user.menus,
  info: state => state.user.info,
  selectOrgId: state => state.user.selectOrgId,
  noReadCount: state => state.user.noReadCount
}
export default getters
