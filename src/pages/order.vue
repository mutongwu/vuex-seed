<template>
  <app-header text="订单列表"></app-header>
  <h3><p>Current route path: {{$route.path}}</p></h3>
  <div class="box">a box</div>
</template>
<script>
import appHeader from 'components/appHeader'
export default {
  components: {
    appHeader
  }
}
</script>
<style lang="stylus">
  @import '../assets/css/helper.styl'
  p
    font-size: fn-rem(40)
  .box
    border-radius: 5px
    background #ccc
    width 50px
    height 50px
</style>