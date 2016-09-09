<template>
  <app-header text="首页" :show-back="false" :show-home="false" :show-profile="true"></app-header>
  <swipe class="my-swipe" :auto="5000" :speed="500">
    <swipe-item class="slide1"></swipe-item>
    <swipe-item class="slide2"></swipe-item>
    <swipe-item class="slide3"></swipe-item>
  </swipe>
  <input type="button" v-on:click="initData" value="loadData"/>
  <input type="button" v-on:click="popModal" value="popModal"/>
   <input type="button" v-on:click="popTip" value="popTip"/>
  <ul>
    <li v-for="item in lists">
      {{item.title}}
    </li>
  </ul>
  
  <!--<tip></tip>-->
</template>
<script>
import {types} from 'store/constants'
// import * as types from 'store/types/address'
import addressApi from 'api/addressApi'
import appHeader from 'components/appHeader'
// import Modal from 'components/modal'
// import Tip from 'components/tip'
import { Swipe, SwipeItem } from 'vue-swipe'
import {actions} from 'store/modules/tip'
// console.log('types:')
// console.log(types)

export default {
  components: {
    appHeader,
    // Modal,
    // Tip,
    Swipe,
    SwipeItem
  },
  vuex: {
    getters: {
      lists: ({address}) => address.lists
    },
    actions: {
      listAddress ({ dispatch }) {
        addressApi.list(data => {
          dispatch(types.ADDRESS_LIST, data)
        })
      },
      popModal ({ dispatch }, data) {
        console.log('actions: popModal')
        dispatch(types.MODAL_CONFIRM, {
          msg: '<h3>这个一个modal</h3>',
          cancelFn: () => {
            console.log('cancel')
          },
          okFn: () => {
            console.log('ok')
          }
        })
      },
      popTip (store, data) {
        actions[types.TIP_SHOW](store, {
          msg: 'this is a tip' + Date.now()
        })
        // actions[types.TIP_SHOW]()
        // console.log(Tip.actions)
        // dispatch(types.TIP_SHOW, {
        //   msg: 'this is a tip' + Date.now()
        // })
      }
    }
  },
  methods: {
    initData (e) {
      this.listAddress()
    // },
    // popModal () {
    //   this.popModal()
    }
  }
}
</script>
<style lang="stylus">

.my-swipe {
  height: 200px;
  color: #fff;
  font-size: 30px;
  text-align: center;
}

.slide1 {
  background-color: blue;
  color: #fff;
}

.slide2 {
  background-color: green;
  color: #000;
}

.slide3 {
  background-color: #ccc;
  color: #fff;
}
</style>