// import { logout, getInfo, refreshToken } from '@/api/rsgl/person'
import { login, logout, getInfo, refreshToken } from '@/api/xtgl/user'
import { checkMessage } from '@/api/xtgl/message'
import { putUserOrganizationSelected } from '@/api/xtgl/role'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menus: [],
    uid: 0,
    info: {},
    selectOrgId: 0, // 当前选中的公司id
    noReadCount: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_NOREADCOUNT: (state, noReadCount) => {
    state.noReadCount = noReadCount
  },
  SET_SELECTORGID: (state, selectOrgId) => {
    state.selectOrgId = selectOrgId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { number, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ number: number.trim(), passWord: password }).then(response => {
        const { token } = response.data
        const tokenScheme = 'Bearer ' + token
        commit('SET_TOKEN', tokenScheme)
        setToken(tokenScheme)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 自动登录
  checkMessage({ commit }, msgInfo) {
    const { id, str } = msgInfo
    return new Promise((resolve, reject) => {
      checkMessage({ id: id, str: str }).then(response => {
        const { token } = response.data
        const tokenScheme = 'Bearer ' + token
        commit('SET_TOKEN', tokenScheme)
        setToken(tokenScheme)
        resolve({ pageId: response.pageId, billId: response.billId, billFlowId: response.billFlowId })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { info, pageList, noReadCount } = response.data
        if (!response.data) {
          reject('验证失败，请重新登录')
        }
        commit('SET_NAME', info.name)
        commit('SET_MENUS', pageList)
        commit('SET_UID', info.uid)
        commit('SET_INFO', info)
        commit('SET_NOREADCOUNT', noReadCount)
        commit('SET_SELECTORGID', info.userOrg.find(f => f.selected).companyId)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  refreshToken({ commit }) {
    return new Promise(resolve => {
      refreshToken().then(response => {

      })
    })
  },
  toggleOrg({ commit, state }, selectOrgId) {
    return new Promise((resolve, reject) => {
      putUserOrganizationSelected({ userId: state.uid, companyId: selectOrgId }).then(response => {
        commit('SET_SELECTORGID', selectOrgId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

