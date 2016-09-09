import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routeConfig from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  history: true,
  root: '/',
  saveScrollPosition: true,
  suppressTransitionError: true
})
router.map(routeConfig)
router.redirect({
  '*': '/'
})
// sync(store, router)

router.start(Vue.extend(App), '#root')
/* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App }
// })
