<template>
  <app-header text="个人首页"></app-header>
  <!--<h1>个人首页</h1>-->
  <h3><p>Current route path: {{$route.path}}</p></h3>
  <div class="box">a box</div>
  <div v-if="!isLogin"><a v-link="'login'" class="btn btn-primary">登录</a></div>
  <ul>
    <li><a v-link="'order'">我的订单</a></li>
  </ul>

  <infinite-scroll v-on:update="dataUpdate" :plain-data="plainData"
   :load-fn="loadData" :list-data="listData">
    <div class="listBox">
      <div class="listItem" v-for="item in listData">{{item.id}}</div>
    </div>
  </infinite-scroll>
</template>
<script>
import appHeader from 'components/appHeader'
import infiniteScroll from 'components/infiniteScroll'

let counter = 0
function createData (listData) {
  const temp = []
  for (let i = listData.length + 1; i <= listData.length + 20; i++) {
    temp.push({
      id: counter++
    })
  }
  listData = listData.concat(temp)
  return listData
}

export default {
  components: {
    appHeader,
    infiniteScroll
  },
  data () {
    return {
      listData: null
    }
  },
  vuex: {
    getters: {
      isLogin: ({auth}) => auth.isLogin
    },
    actions: {
      loadData ({ dispatch }) {
        this.plainData = createData([])
        console.log('loadData')
      }
    }
  },
  methods: {
    dataUpdate (data) {
      console.log('dataUpdate' + data)
    }
  },
  ready () {
    console.log('profile ready')
    this.loadData()
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