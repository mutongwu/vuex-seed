<template>
<div class="component-header">
  <a class="back" href="javascript:;" v-if="showBack" v-on:click="doBack()">
    <i class="icon-back"></i>
  </a>
  {{text}}
  <a class="home" v-link="{ name: 'main' }" v-if="showHome">
    <i class="icon-home"></i>
  </a>
  <a class="profile" v-link="{ name: 'profile' }" v-if="showProfile">
    <i class="icon-user"></i>
  </a>
</div>
</template>

<script>
export default {
  props: {
    text: String,
    showBack: {
      type: Boolean,
      default: true
    },
    showHome: Boolean,
    showProfile: Boolean
  },
  methods: {
    doBack (e) {
      window.history.back()
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/css/helper.styl'

.component-header {
    height: rEm(88);
    top 0
    left 0
    width 100%
    line-height: rEm(88);
    background: #E33123;
    color: #fff;
    text-align: center;
    font-size: rEm(36);
    position: fixed;
    z-index 10
    /*padding: 0 rEm(100);*/
    white-space: nowrap; text-overflow: ellipsis; overflow: hidden;
    a {
        position: absolute;
        top: 0;
        height: 100%;
        width: rEm(100);
        color: #fff;
    }
    .back {
        left: 0;
    }
    .share {
        right: rEm(80);
    }
    .home,.profile{
        right: 0;
    }
    .icon-back {
        font-size: rEm(40);
        position: absolute;
        left: rEm(24);
        top: rEm(24);
    }
    .icon-share {
        font-size: rEm(46);
        position: absolute;
        right: rEm(30);
        top: rEm(20);
    }
    .icon-home{
        font-size: rEm(50);
        position: absolute;
        right: rEm(23);
        top: rEm(18);
    }
    .profile {
        font-size: rEm(50);
        position: absolute;
        right: rEm(0);
        top: rEm(4);
    }
}  
</style>