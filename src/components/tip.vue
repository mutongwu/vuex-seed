<template>
  <div class="KIT-dialog-tip" v-bind:class="{'active': isShow}"><div class="KIT-dialog-tip_content">{{{msg}}}</div></div>
</template>
<script>
// import {types} from 'store/constants'
import {gettersDefault, actions} from 'store/modules/tip'
export default {
  data: () => {
    return {
      timer: null
    }
  },
  vuex: {
    getters: gettersDefault,
    actions: actions
    // actions: {
    //   activeTimer: ({dispatch, state}, timer) => {
    //     if (timer) {
    //       window.clearTimeout(timer)
    //     }
    //     return window.setTimeout(() => { dispatch(types.TIP_HIDE) }, state.tip.duration)
    //   },
    //   [types.TIP_SHOW]: () => {
    //     console.log('action tip_show')
    //   }
    // }
  },
  // watch: {
  //   isShow (val) {
  //     console.log('isShow: ' + val)
  //     if (!val) {
  //       this.timer = null
  //     }
  //   },
  //   msg () {
  //     this.timer = this.activeTimer(this.timer)
  //     console.log('callback: ' + this.timer)
  //   }
  // }
  subscribe: {

  }
}
</script>
<style lang="stylus">
@import '../assets/css/helper.styl'
    
.KIT-dialog-tip
  text-align: center;
  position: fixed;
  width: 100%;
  height: 50%;
  left: 0;
  top: 50%;
  z-index: 999;
  opacity 0
  visibility hidden
  transition all .25s

  .KIT-dialog-tip_content
    margin-top: -29px;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding:5px 10px;
    line-height: 1.8em;
    display: inline-block;
    border-radius: 5px;

  &.active
    opacity 1
    visibility visible  
</style>
