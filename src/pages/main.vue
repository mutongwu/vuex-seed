<template>
  <app-header text="首页" :show-back="false" :show-home="false" :show-profile="true"></app-header>
  <div class="pageBd">
      <swipe class="my-swipe" :auto="5000" :speed="500">
        <swipe-item class="slide1"></swipe-item>
        <swipe-item class="slide2"></swipe-item>
        <swipe-item class="slide3"></swipe-item>
      </swipe>
      <input type="button" v-on:click="initData" value="loadData"/>
      <input type="button" v-on:click="popModal" value="popModal"/>
      <input type="button" v-on:click="popTip" value="popTip"/>
      <!--<input type="button" v-on="click:popTip" value="popTip2"/>-->
      
      <!--<p v-for="item in items">
        {{item.name}}
      </p>-->
      <div v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
        <ul>
          <li v-for="item in lists">
            KKK:{{item.id}}
          </li>
        </ul>
      </div>
  </div>

  <!--<tip></tip>-->
</template>
<script>
import Vue from 'vue'
import {types} from 'store/constants'
// import * as types from 'store/types/address'
import addressApi from 'api/addressApi'
import appHeader from 'components/appHeader'
// import Modal from 'components/modal'
// import Tip from 'components/tip'
import { Swipe, SwipeItem } from 'vue-swipe'
import {actions} from 'store/modules/tip'
import vueScroll from 'vue-infinite-scroll'
Vue.use(vueScroll)

function createData (listData) {
  const temp = []
  for (let i = listData.length + 1; i <= listData.length + 20; i++) {
    temp.push({
      name: i
    })
  }
  listData = listData.concat(temp)
  return listData
}
export default {
  data () {
    return {
      listData: createData([]),
      listHeight: window.innerHeight
    }
  },
  components: {
    appHeader,
    Swipe,
    SwipeItem
  },
  vuex: {
    getters: {
      busy: ({address}) => address.busy,
      lists: ({address}) => address.lists
    },
    actions: {
      listAddress ({ dispatch }) {
        console.log('types.listAddress')
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
      loadMore ({ dispatch }, data) {
        if (this.lists.length > 100) {
          dispatch(types.ADDRESS_NOMORE)
        } else {
          addressApi.list(data => {
            dispatch(types.ADDRESS_LIST, data)
          })
        }
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
  init () {
  },
  ready () {
    this.listAddress()
    // addressApi.list(data => {
    //   console.log(data)
    //   this.$dispatch(types.ADDRESS_LIST, data)
    // })
  },
  computed: {
    items () {
      return this.a
    }
  },
  methods: {
    initData (e) {
      // this.listAddress()
    }
  }
}
</script>
<style lang="stylus">
html,body
  height 100%
.clusterize-row
  height 40px
  background lightblue
  border-bottom 1px solid #000
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