export default {
  path: '/order',
  name: 'order',
  auth: true,
  component: resolve => require(['pages/order'], resolve)
}
