<template>
  <app-header text="个人首页"></app-header>
  <!--<h1>个人首页</h1>-->
  <h3><p>Current route path: {{$route.path}}</p></h3>
  <div class="box">a box</div>
  <div v-if="!isLogin"><a v-link="'login'" class="btn btn-primary">登录</a></div>
  <ul>
    <li><a v-link="'order'">我的订单</a></li>
  </ul>

  <infinite-scroll :onscroll="onscroll" :new-records="newRecords" row-selector=".listItem" :distance="distance" :records="listData" :items-per-row="2">
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
  for (let i = 0; i < 20; i++) {
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
      newRecords: null,
      distance: 20
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
          this.newRecords = createData()
          console.log('total:' + counter)
        }, 1000)
      }
    }
  },
  methods: {
    onscroll () {
      console.log('onscroll-onscroll')
      this.loadData()
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
    /*display flex
    justify-content space-between
    flex-wrap wrap*/
    /* 注意，如果使用float来布局元素，要求父元素需要有清除浮动的样式，从而可以正确获得高度计算 */
    &:after
      content: " "
      display: block
      clear: both
      height: 0
    .listItem
      border 1px solid green
      width 49%
      height 100px
      margin 10px 0
      box-sizing border-box
      float left
      &:nth-of-type(even)
        float right

</style>