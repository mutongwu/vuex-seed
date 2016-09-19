<template>
  <div id="app">
    <!--<a v-link="{ path: '/profile' }">Go to profile</a>
    <a v-link="{ path: '/login' }">Go to login</a>
     <a v-link="{ path: '/' }">Go to main</a>-->
    <router-view></router-view>
    <tip></tip>
    <modal></modal>
  </div>
</template>

<script>
import store from './store'
import Tip from 'components/tip'
import Modal from 'components/modal'
// import auth from './store/modules/auth'
import {types} from 'store/constants'

export default {
  components: {
    Modal,
    Tip
  },
  ready () {
    store.dispatch(types.AUTH_CHECK)
  },
  store
}
</script>

<style lang="stylus">
@import './assets/css/normalize.css'
@import './assets/css/base.styl'
@import './assets/icomoon/style.css'
@import '../node_modules/vue-swipe/dist/vue-swipe.css'
</style>
