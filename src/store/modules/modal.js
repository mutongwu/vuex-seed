import * as types from '../types/modal'
const state = {
  isShow: false,
  cancelTxt: '取消',
  okTxt: '确定',
  msg: '',
  fx: '',
  isConfirm: true
  // okFn: null,
  // cancelFn: null
}

export const gettersDefault = Object.keys(state).reduce((pre, cur) => {
  pre[cur] = ({modal}) => modal[cur]
  return pre
}, {})

// console.log(types.MODAL_SHOW)
const mutations = {
  [types.MODAL_SHOW] (state, data) {
    Object.assign(state, data, {isShow: true})
  },
  [types.MODAL_HIDE] (state, data) {
    state.isShow = false
  },
  [types.MODAL_CONFIRM] (state, data) {
    Object.assign(state, data, {isShow: true})
  },
  [types.MODAL_ALERT] (state, data) {
    Object.assign(state, data, {isShow: true, isConfirm: false})
  }
}

export default {
  state,
  mutations
}
