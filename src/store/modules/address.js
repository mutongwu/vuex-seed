import * as types from '../types/address'
const state = {
  lists: [{'title': 1000}]
}

// console.log(types.ADDRESS_LIST)
const mutations = {
  [types.ADDRESS_LIST] (state, data) {
    // console.log('mutations')
    state.lists = state.lists.concat(data)
    console.log(state.lists)
  },
  [types.ADDRESS_DEL] (state, { data }) {
    state.lists = state.lists.filter(item => item.id !== data.id)
  },
  [types.ADDRESS_UPDATE] (state, { data }) {
    state.lists.forEach((item, i) => {
      if (item.id === data.id) {
        state.lists[i] = data
      }
    })
  }
}

export default {
  state,
  mutations
}
