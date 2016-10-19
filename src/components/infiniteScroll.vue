<template>
  <div class="infiniteScroll">
    <div class="infiniteHolder topHolder"></div>
    <slot>
      未定义列表数据
    </slot>
    <div class="infiniteHolder bottomHolder"></div>
  </div>
</template>

<script>
  export default {
    props: {
      rowHeight: {
        type: Number,
        default: 0
      },
      dataFn: {
        type: Function
      }
    },
    init () {
      console.log('init ...')
      console.log(this.dataFn, this.rowHeight)
    },
    watch: {
      dataFn (fn) {
        console.log('watch dataFn')
        console.log(fn)
      }
    }
  }
</script>

<style lang="stylus">
  .infiniteHolder
    background #ccc
</style>