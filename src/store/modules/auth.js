import * as types from '../types/auth'
import authApi from 'api/authApi'

const state = {
  isLogin: false
}

export const gettersDefault = Object.keys(state).reduce((pre, cur) => {
  pre[cur] = ({auth}) => auth[cur]
  return pre
}, {})

export const actions = {
  [types.AUTH_LOGIN] ({dispatch, state}, data) {
    return authApi.login(data).then((data) => {
      dispatch(types.AUTH_LOGIN, data)
      return data
    })
  },
  [types.AUTH_CHECK] ({dispatch, state}) {
    console.log('actions____types.AUTH_CHECK')
    dispatch(types.AUTH_CHECK)
  }
}

const mutations = {
  [types.AUTH_LOGIN] (state, data) {
    state.isLogin = true
    window.sessionStorage.setItem('isLogin', true)
    console.log(['AUTH_LOGIN', state.isLogin])
  },
  [types.AUTH_LOGOUT] (state, data) {
    state.isLogin = false
    window.sessionStorage.removeItem('isLogin')
  },
  [types.AUTH_CHECK] (state) {
    console.log('types.AUTH_CHECK')
    state.isLogin = !!window.sessionStorage.getItem('isLogin')
  }
}

export default {
  state,
  mutations
}
