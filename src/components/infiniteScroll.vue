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
      listData: {
        type: Array
      },
      loadFn: {
        type: Function
      },
      plainData: {
        type: Array
      }
    },
    ready () {
      console.log('infiniteScroll ready')
      console.log(this.plainData, this.rowHeight)
    },
    watch: {
      plainData (data) {
        console.log('watch plainData')
        console.log(data)
      }
    }
  }
</script>

<style lang="stylus">
  .infiniteHolder
    background #ccc
</style>