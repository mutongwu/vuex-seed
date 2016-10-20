<template>
  <app-header text="个人首页"></app-header>
  <!--<h1>个人首页</h1>-->
  <h3><p>Current route path: {{$route.path}}</p></h3>
  <div class="box">a box</div>
  <div v-if="!isLogin"><a v-link="'login'" class="btn btn-primary">登录</a></div>
  <ul>
    <li><a v-link="'order'">我的订单</a></li>
  </ul>

  <infinite-scroll :kick-start="kickStart" row-selector=".listItem" :distance="distance">
    <div class="listBox">
      <div class="listItem" v-for="item in listData" track-by='id'>{{item.id}}</div>
    </div>
  </infinite-scroll>
</template>
<script>
import appHeader from 'components/appHeader'
import infiniteScroll from 'components/infiniteScroll'

let counter = 0
function createData () {
  const temp = []
  for (let i = 0; i <= 20; i++) {
    temp.push({
      id: counter++
    })
  }
  return temp
}
// console.log(createData())
export default {
  components: {
    appHeader,
    infiniteScroll
  },
  data () {
    return {
      listData: [],
      distance: 20,
      kickStart: false
    }
  },
  // plainData: null,
  vuex: {
    getters: {
      isLogin: ({auth}) => auth.isLogin
    },
    actions: {
      loadData ({ dispatch }) {
        console.log('loadData')
        setTimeout(() => {
          var org = createData()
          // console.log('org', org)
          infiniteScroll.eventHub.$emit('addData', org)
          this.listData = this.listData.concat(org)
        }, 1000)
      }
    }
  },
  methods: {
    onScroll () {
      console.log('onScroll')
      this.loadData()
    },
    dataUpdate (data) {
      // console.log('data.length', data.length)
      this.listData = data// this.listData.concat(data)
      this.$nextTick(() => {
        infiniteScroll.eventHub.$emit('renderData')
      })
    }
  },
  ready () {
    console.log('profile ready')
    infiniteScroll.eventHub.$on('updateData', this.dataUpdate)
    infiniteScroll.eventHub.$on('onScroll', this.onScroll)
    this.kickStart = true
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

  .listBox
    padding 10px
    .listItem
      border 1px solid green
      height 100px
      margin 10px 0
</style>