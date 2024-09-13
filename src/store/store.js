import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: false,
    user: null
  },
  mutations: {
    setAuthentication(state, status) {
      console.log('Setting isAuthenticated:', status)
      state.isAuthenticated = status
    },
    setUser(state, user) {
      console.log('Setting user:', user)
      state.user = user
    }
  },
  actions: {
    login({ commit }, { username }) {
      console.log('login action triggered', username)
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
