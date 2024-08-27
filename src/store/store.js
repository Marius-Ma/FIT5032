import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: false,
    user: null
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit }, { username }) {
      commit('setAuthentication', true)
      commit('setUser', { username, role: username === 'admin' ? 'admin' : 'user' })
      return true
    },
    logout({ commit }) {
      commit('setAuthentication', false)
      commit('setUser', null)
    }
  }
})
