export default {
  namespaced: true,
  state: {
    relation: [],
    waitingRoom: {},
    wordFound: []
  },
  mutations: {
    setWordFound(state, payload) {
      state.wordFound = payload
    },
    clearWaitingRoom(state) {
      state.waitingRoom = {}
    },
    addToWaitingRoom(state, { type, value }) {
      const tmp = Object.assign({}, state.waitingRoom)
      tmp[type] = value
      state.waitingRoom = tmp
    },
    deleteFromWaitingRoom(state, { type }) {
      const tmp = Object.assign({}, state.waitingRoom)
      delete tmp[type]
      state.waitingRoom = tmp
    },
    commitWaitingRoom(state) {
      const relation = state.relation
      relation.push(Object.assign({}, state.waitingRoom))
      state.relation = relation
    },
    removeRelation(state, { relationKey }) {
      const relation = state.relation
      delete relation[relationKey]
      state.relation = relation
    }
  },
  actions: {
    commitWaitingRoom({ commit }) {
      commit('commitWaitingRoom')
      commit('clearWaitingRoom')
    }
  },
  getters: {
    isWordFound:
      (state) =>
      ({ from, to }) => {
        let boolResult = false
        Array.prototype.forEach.call(state.wordFound, (v) => {
          if (v.from <= from && v.to >= to) {
            boolResult = true
          }
        })
        return boolResult
      },
    isWordInWaitingRoom:
      (state) =>
      ({ from, to }) => {
        if (Object.prototype.hasOwnProperty.call(state.waitingRoom, 'word')) {
          return (
            state.waitingRoom.word.from <= from &&
            state.waitingRoom.word.to >= to
          )
        }
        return false
      },
    isWordInRelation:
      (state) =>
      ({ from, to }) => {
        let boolResult = false
        Array.prototype.forEach.call(state.relation, (v) => {
          if (Object.prototype.hasOwnProperty.call(v, 'word')) {
            if (v.word.from <= from && v.word.to >= to) {
              boolResult = true
            }
          }
        })
        return boolResult
      },
    isWordActioned:
      (state, getters) =>
      ({ from, to }) => {
        let isActive = getters.isWordInRelation({ from, to })

        if (!isActive) {
          isActive = getters.isWordInWaitingRoom({ from, to })
        }

        if (!isActive) {
          isActive = getters.isWordFound({ from, to })
        }

        return isActive
      },
    isWaitingRoomNotEmpty(state) {
      return Object.keys(state.waitingRoom).length > 0
    },
    isWaitingRoomFilled(state) {
      return (
        Object.keys(state.waitingRoom).length >= 2 &&
        Object.prototype.hasOwnProperty.call(state.waitingRoom, 'word')
      )
    },
    getRelationsKeyListByWordToken:
      (state) =>
      ({ from, to }) => {
        let result = []
        Array.prototype.forEach.call(state.relation, (v, k1) => {
          if (Object.prototype.hasOwnProperty.call(v, 'word')) {
            if (v.word.from <= from && v.word.to >= to) {
              result.push(k1)
            }
          }
        })
        return result.length > 0 ? result : null
      }
  }
}
