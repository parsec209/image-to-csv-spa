const state = {
  isSessionChecked: false,
  currentUser: null
}
  
const getters = {
  user: state => state.currentUser,
  sessionChecked: state => state.isSessionChecked
}

const actions = {
  setUser({ commit }, user) {
    commit('setCurrentUser', user)
  },
  confirmSessionChecked({ commit }) {
    commit('confirmSessionIsChecked')
  }
}

const mutations = {
  setCurrentUser: (state, user) => {
    state.currentUser = user
  },
  confirmSessionIsChecked: (state) => {
    state.isSessionChecked = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}