import * as fb from 'firebase'

class User {
  constructor (id) {
    this.id = id
  }
}

export default {
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async registerUser({ commit }, { email, password }) {
      commit('clearError')//очищаем ошибки которые прийдут с сервера
      commit('setLoading', true)//показываем загрузку

      try {
        const user = await fb.auth().createUserWithEmailAndPassword(email, password)
        commit('setUser', new User(user.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }          
    },
    async loginUser({ commit }, { email, password }) {
      commit('clearError')//очищаем ошибки которые прийдут с сервера
      commit('setLoading', true)//показываем загрузку

      try {
        const user = await fb.auth().signInWithEmailAndPassword(email, password)
        commit('setUser', new User(user.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }          
    },
    //остаемся авторизованными при перезагрузке страницы
    autoLoginUser({ commit }, payload) {
      commit('setUser', new User(payload.uid))
    },
    //выход
    logoutUser({ commit }) {
      fb.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user(state) {
      return state.user
    },
    isUserLoggerIn(state) {
      return state.user !== null
    }
  }
}
