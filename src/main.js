import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routeConfig from './routes'
import auth from './store/modules/auth'

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

router.beforeEach(function (transition) {
  console.log('route beforeEach:' + transition.to.auth)
  if (transition.to.auth === true && !auth.state.isLogin) {
    let redirect = transition.to.path
    transition.redirect('/login?redirect=' + redirect)
  } else if (auth.state.isLogin && transition.to.name === 'login') {
    transition.redirect('/')
  } else {
    transition.next()
  }
})

router.start(Vue.extend(App), '#root')

window.globalRouter = router
