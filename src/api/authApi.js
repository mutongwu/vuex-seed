import apiUtil from 'utils/apiUtil'
export default {
  login (data) {
    return apiUtil({
      url: '/wap/user/getBaseInfo',
      data: data
    })
  },
  logout (data) {
    return apiUtil({
      url: '/wap/user/getBaseInfo',
      data: data
    })
  }
}
