import Login from 'pages/login'

export default {
  path: '/login',
  name: 'login',
  auth: false,
  component: Login // resolve => require(['pages/login'], resolve)
}
