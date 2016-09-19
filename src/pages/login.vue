<template>
<app-header text="登录"></app-header>
<form>
    <div class="field">
        <input type="text" class="inputField" placeholder="账号" v-model="account">
    </div>
    <div class="field">
        <input type="password" class="inputField" placeholder="密码" v-model="pwd">
    </div>
    <div class="field">
        <input type="button" class="btn btn-primary" value="登录" @click="submit()" :disabled="loading">
    </div>
</form>
</template>
<script>
import appHeader from 'components/appHeader'
import {types} from 'store/constants'
import {actions as tipActions} from 'store/modules/tip'
import {actions as authActions} from 'store/modules/auth'
import utils from 'utils/utils'

export default {
  data () {
    return {
      account: null,
      pwd: null,
      loading: false
    }
  },
  components: {
    appHeader
  },
  vuex: {
    actions: {
      submit (store) {
        let data = {
          account: this.account,
          pwd: this.pwd
        }
        if (!this.account) {
          tipActions[types.TIP_SHOW](store, {
            msg: '账号不能为空'
          })
          return false
        }
        this.loading = true
        authActions[types.AUTH_LOGIN](store, data).then(() => {
          this.loading = false
          let redirect = utils.getUrlParam('redirect')
          if (redirect) {
            if (/^https?:\/\//i.test(redirect)) {
              window.location.href = redirect
            } else {
              window.globalRouter.replace({
                path: redirect
              })
            }
          } else {
            window.history.back()
          }
        }, (res) => {
          tipActions[types.TIP_SHOW](store, {
            msg: res && res.msg || '登录失败'
          })
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang="stylus">
@import '../assets/css/helper.styl'
form
  .field
    margin fn-rem(20)
    .inputField
      display block
      border 1px solid #ccc
</style>
