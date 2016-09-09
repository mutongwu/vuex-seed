export default {
  path: '/profile',
  name: 'profile',
  auth: true,
  component: resolve => require(['pages/profile'], resolve)
}
