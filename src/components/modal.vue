<template>
<div v-bind:class="{ 'active': isShow,'KIT-dialog-confirm': isConfirm,'KIT-dialog-alert': !isConfirm }">
  <div class="KIT-dialog-confirm_content">
    <div class="KIT-dialog-confirm_text">{{{msg}}}</div>
    <div class="KIT-dialog-footer">
      <button class="KIT-dialog-cancel"  v-on:click="cancel" v-if="isConfirm">{{cancelTxt}}</button>
      <button class="KIT-dialog-ok"  v-on:click="ok">{{okTxt}}</button>
    </div>
  </div>
</div> 
</template>
<script>
import {types} from 'store/constants'
import {gettersDefault} from 'store/modules/modal'
// console.log(actionsDefault)
export default {
  vuex: {
    // getters: {
    //   msg: ({modal}) => modal.msg,
    //   cancelTxt: ({modal}) => modal.cancelTxt,
    //   okTxt: ({modal}) => modal.okTxt,
    //   isShow: ({modal}) => modal.isShow,
    //   isConfirm: ({modal}) => modal.isConfirm
    // },
    getters: gettersDefault,
    actions: {
      cancel: ({dispatch, state}) => {
        dispatch(types.MODAL_HIDE)
        if (state.modal.cancelFn) {
          state.modal.cancelFn()
        }
      },
      ok: ({dispatch, state}) => {
        dispatch(types.MODAL_HIDE)
        if (state.modal.okFn) {
          state.modal.okFn()
        }
      }
    }
  }
}
</script>
<style lang="stylus">
@import '../assets/css/helper.styl'
  
.KIT-dialog-confirm,.KIT-dialog-alert
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom:0;
  top: 0;
  z-index: 999;
  opacity 0
  visibility hidden
  transition all .25s
  background rgba(0,0,0,0.6)
  &.active
    opacity 1
    visibility visible

  .KIT-dialog-confirm_content
    margin 0 auto
    width 70%
    background #fff
    color #000
    line-height 1.8em
    display inline-block
    box-shadow: 0 14px 45px rgba(0,0,0,.25),0 10px 18px rgba(0,0,0,.22);
    border-radius: 2px;
    border-radius 5px
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;

  .KIT-dialog-confirm_text
    font-size: fn-rem(26);
    padding: fn-rem(50) fn-rem(20) fn-rem(40);
    line-height: fn-rem(40);
    border-bottom: 1px solid #ddd;
    white-space: pre-line;
  .KIT-dialog-footer
    font-size 0 // 防止按钮DOM节点之间的空格占用空间
  .KIT-dialog-cancel, .KIT-dialog-ok
    display inline-block
    width 50%
    position relative
    font-size: fn-rem(28);
    height: fn-rem(80)
    line-height: fn-rem(80);
    appearance: none;
    border: none;
    background: transparent;
    outline: none;
    cursor pointer

    &:active
      background-color #f5f5f5;
  .KIT-dialog-ok
    color: #f00;
  .close-btn
    position absolute
    top fn-rem(-16)
    right 0
    padding fn-rem(10)
    font-size fn-rem(40)
    color #666

.KIT-dialog-confirm		
  .KIT-dialog-cancel
    color: #acacac;
    &:after
      content: " ";
      border-right: 1px solid #ddd;
      display: block;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;

.KIT-dialog-alert
  .KIT-dialog-ok
    width 100%  
</style>