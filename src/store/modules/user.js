import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: localStorage.getItem('username'),
  avatar: '',
  roles: []
}

const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
  setName: (state, name) => {
    state.name = name
  },
  setAvatar: (state, avatar) => {
    state.avatar = avatar
  },
  setRoles: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username, password: password }).then(response => {
        const { datas } = response.data
        const name = datas[0]
        const token = datas[1]
        const avatar = datas[2].avatarUrl
        commit('setName', name)
        commit('setToken', token)
        commit('setAvatar', avatar)
        setToken(token)
        localStorage.setItem('username', name)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ username: state.name }).then(response => {
        const { datas } = response.data
        if (!datas) {
          reject('认证失败, 请重新登录')
        }
        const roles = 'superAdmin'
        // const userBaseInfo = datas[0]
        const userCommonInfo = datas[1]
        commit('setRoles', roles)
        commit('setAvatar', userCommonInfo.avatarUrl)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout({ username: state.name }).then(() => {
        commit('setToken', '')
        commit('setRoles', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('setToken', '')
      commit('setRoles', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'
      commit('setToken', '')
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
