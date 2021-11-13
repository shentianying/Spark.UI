import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, showFormatMoney } = defaultSettings

const state = {
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  showFormatMoney: getLocalStorage('showFormatMoney', showFormatMoney)// 获取并设置
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}
function getLocalStorage(k, v) {
  var item = localStorage.getItem(k)
  if (item) { return item } else {
    localStorage.setItem(k, v)
    return v
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

