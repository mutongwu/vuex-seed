import * as types from '../types/tip'

const state = {
  isShow: false,
  duration: 2000,
  msg: ''
}

let timer = null
export const gettersDefault = Object.keys(state).reduce((pre, cur) => {
  pre[cur] = ({tip}) => tip[cur]
  return pre
}, {})

export const actions = {
  [types.TIP_SHOW] ({dispatch, state}, data) {
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = setTimeout(() => dispatch(types.TIP_HIDE), state.tip.duration)
    dispatch(types.TIP_SHOW, data)
  }
}

const mutations = {
  [types.TIP_SHOW] (state, data) {
    Object.assign(state, data, {isShow: true})
  },
  [types.TIP_HIDE] (state, data) {
    state.isShow = false
  }
}

export default {
  state,
  mutations
}
