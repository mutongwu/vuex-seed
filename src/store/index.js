import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
// import address from 'modules/address'
import plugins from '../plugins'

const __DEV__ = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
// console.log(address)
export default new Vuex.Store({
  strict: __DEV__,
  modules,
  // modules: {
  //   address
  // },
  plugins
})
