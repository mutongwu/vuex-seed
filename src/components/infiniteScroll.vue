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
  import Vue from 'vue'
  let eventHub = new Vue()
  var getComputedStyle = document.defaultView.getComputedStyle
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  var throttle = function (fn, delay) {
    var now, lastExec, timer, context, args //eslint-disable-line

    var execute = function () {
      fn.apply(context, args)
      lastExec = now
    }

    return function () {
      context = this
      args = arguments

      now = Date.now()

      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      if (lastExec) {
        var diff = delay - (now - lastExec)
        if (diff < 0) {
          execute()
        } else {
          timer = setTimeout(function () {
            execute()
          }, diff)
        }
      } else {
        execute()
      }
    }
  }
  // alert(requestAnimationFrame)
  var getScrollEventTarget = function (element) {
    var currentNode = element
    // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
      var overflowY = getComputedStyle(currentNode).overflowY
      if (overflowY === 'scroll' || overflowY === 'auto') {
        return currentNode
      }
      currentNode = currentNode.parentNode
    }
    return window
  }

  var getVisibleHeight = function (element) {
    if (element === window) {
      return document.documentElement.clientHeight
    }

    return element.clientHeight
  }

  var getScrollTop = function (element) {
    if (element === window) {
      return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
    }

    return element.scrollTop
  }

  var getElementTop = function (element) {
    if (element === window) {
      return getScrollTop(window)
    }
    // console.log(element.getBoundingClientRect().top + getScrollTop(window) )
    return element.getBoundingClientRect().top + getScrollTop(window)
  }
  
  var getHeight = function (el) {
    return el.offsetHeight
  }

  var setHeight = function (el, h) {
    el.style.height = parseInt(h, 10) + 'px'
  }
  console.log(getHeight, setHeight)

  export default {
    props: {
      rowHeight: {
        type: Number,
        default: 0
      },
      rowSelector: {
        type: String
      },
      distance: {
        type: Number,
        default: 0
      },
      // onScroll: {
      //   type: Function
      // },
      // dataUpdate: {
      //   type: Function
      // },
      kickStart: {
        type: Boolean,
        default: false
      },
      displayData: {
        type: Array
      }
    },
    eventHub: eventHub,
    ready () {
      // console.log('infinite ready ...')
      // console.log(eventHub)
      eventHub.$on('addData', this.recvData)
      eventHub.$on('renderData', this.renderData)
      // console.log(this.onScroll, this.rowHeight)
    },
    methods: {
      recvData (data) {
        console.log('recvData', data)

        if (!this.allDataCache) {
          this.allDataCache = []
        }
        this.allDataCache = this.allDataCache.concat(data)

        if (!this.records) {
          this.records = [].concat(data)
        }
        console.log(data)
        this.dataUpdate(data)
      },
      _doCheck () {
        var scrollEventTarget = this.scrollEventTarget
        var element = this.$el
        var distance = this.distance

        var viewportScrollTop = getScrollTop(scrollEventTarget)
        var viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget)
        var elementBottom = 0
        var shouldTrigger = false
        // debugger
        if (scrollEventTarget === element) {
          shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance
        } else {
          elementBottom = getElementTop(element) + element.offsetHeight
          shouldTrigger = viewportBottom + distance >= elementBottom
        }

        var elOffsetTop = -element.getBoundingClientRect().top
        var temp = null
        var direction = 0
        var hideNum = 0
        var restoreNum = 0
        var topHeight = 0
        var bVisibleHeight = 0
        // 最小变化的侦测高度，防止轻微滚动造成多余的计算
        if (Math.abs(this.preScrollTop - viewportScrollTop) > this.rowHeight) {
          if (this.preScrollTop > viewportScrollTop) {
            direction = -1 // 向上滚动
          } else {
            direction = 1 // 向下滚动
          }
          this.preScrollTop = viewportScrollTop
        } else {
          direction = 0
        }

        if (direction > 0 && elOffsetTop - getHeight(this.topHolder) > this.viewCount * this.viewportHeight) {
          this.records.splice(0, this.itemPerView)
          setHeight(this.topHolder, getHeight(this.topHolder) + this.itemPerView * this.rowHeight)
          this.topHolder.pointer += this.itemPerView
          // console.log('this.records.length:' + this.records.length)
        } else if ((direction < 0 || viewportScrollTop < 1) && this.topHolder.pointer && (elOffsetTop - getHeight(this.topHolder) < this.viewCount * this.viewportHeight)) {
          // 保证上方有 viewCount 数量的屏幕高度显示数据。
          restoreNum = this.itemPerView
          topHeight = elOffsetTop - getHeight(this.topHolder)
          while (restoreNum < this.topHolder.pointer && topHeight < this.viewCount * this.viewportHeight) {
            restoreNum += this.itemPerView
            topHeight += this.rowHeight * this.itemPerView * 2 // 此消彼长，所以要*2
          }
          // 计算显示数据
          temp = this.allDataCache.slice(this.topHolder.pointer - restoreNum, this.topHolder.pointer)
          if (temp.length > this.viewCount * this.itemPerView) {
            // 只显示最开始的数据。
            this.records = temp.splice(0, this.viewCount * this.itemPerView)
          } else {
            this.records = temp.concat(this.records)
          }
          // 设置高度
          setHeight(this.topHolder, getHeight(this.topHolder) - restoreNum * this.rowHeight)
          this.topHolder.pointer -= restoreNum
          // 保持一致
          if (viewportScrollTop < 1) {
            this.bottomHolder.pointer = this.topHolder.pointer + this.records.length
          }
          // console.log('top restore:' + restoreNum + ',this.records.length:' + this.records.length+ ',this.topHolder.pointer:' + this.topHolder.pointer)
        }

        // 藏在屏幕下的高度
        var hiddenBottom = element.offsetHeight - this.viewportHeight - elOffsetTop
        if (direction < 0 && hiddenBottom - getHeight(this.bottomHolder) > this.viewCount * this.viewportHeight) {
          hideNum = this.itemPerView
          // var bVisibleHeight = hiddenBottom - getHeight(this.bottomHolder)
          // while( bVisibleHeight > this.viewCount * this.viewportHeight){
          //     hideNum += this.itemPerView
          //     bVisibleHeight -= this.rowHeight * this.itemPerView * 2
          // }

          temp = this.records.length - this.viewCount * this.itemPerView
          temp = Math.max(0, temp > hideNum ? hideNum : hideNum - hideNum)
          if (temp > 0) {
            this.records.splice(-temp)
          }
          setHeight(this.bottomHolder, getHeight(this.bottomHolder) + hideNum * this.rowHeight)

          this.bottomHolder.pointer = this.topHolder.pointer + this.records.length
            // console.log('temp:' + temp + ',bottom hide' + hideNum + 'this.records.length:' + this.records.length)
        } else if (direction > 0 && this.bottomHolder.pointer && hiddenBottom - getHeight(this.bottomHolder) < this.viewCount * this.viewportHeight) {
          hideNum = this.itemPerView
          bVisibleHeight = hiddenBottom - getHeight(this.bottomHolder)
          while (bVisibleHeight < this.viewCount * this.viewportHeight) {
            hideNum += this.itemPerView
            bVisibleHeight += this.rowHeight * this.itemPerView * 2
            // if(hideNum > this.viewCount * this.itemPerView){
            //     break
            // }
          }

          temp = this.allDataCache.slice(this.bottomHolder.pointer, this.bottomHolder.pointer + hideNum)
          if (temp.length) {
            this.records = this.records.concat(temp)
            setHeight(this.bottomHolder, getHeight(this.bottomHolder) - temp.length * this.rowHeight)
            this.bottomHolder.pointer = this.topHolder.pointer + this.records.length
            // console.log('bottom restore' + temp.length + 'this.records.length:' + this.records.length)
          }
        }
        console.log('this.records.length:' + this.records.length)
        this.dataUpdate(this.records)
        console.log('shouldTrigger', shouldTrigger)
        if (shouldTrigger) {
          this._onScroll()
        }
      },
      dataUpdate (data) {
        // console.log('infiniteScroll dataUpdate')
        eventHub.$emit('updateData', data)
      },
      _onScroll () {
        eventHub.$emit('onScroll')
      },
      _initTimer () {
        this.timer = 1
        console.log(requestAnimationFrame)
        this.scrollEventTarget.addEventListener('scroll', throttle(this._doCheck.bind(this), 200), false)
        // var preTs = 0
        // var self = this
        // function callFn (timestamp) {
        //   if (timestamp - preTs > 100) {
        //     self._doCheck()
        //     preTs = timestamp
        //   }
        //   // self.timer = requestAnimationFrame(callFn)
        // }
        // if (!this.timer) {
        //   if (requestAnimationFrame) {
        //     this.timer = requestAnimationFrame(callFn)
        //   } else {
        //     this.timer = setInterval(this._doCheck.bind(this), 200)
        //   }
        // }
      },
      renderData () {
        let el = this.$el
        if (!this.rowHeight) {
          let itemEl = this.$el.querySelector(this.rowSelector)
          let styleObj = getComputedStyle(itemEl)
          let mt = parseInt(styleObj.marginTop, 10)
          let mb = parseInt(styleObj.marginBottom, 10)
          this.rowHeight = Math.abs(mt - mb) + mt + itemEl.offsetHeight
        }
        if (!this.scrollEventTarget) {
          this.scrollEventTarget = getScrollEventTarget(el)
          this.viewportHeight = getVisibleHeight(this.scrollEventTarget)
          this.itemPerView = Math.floor(this.viewportHeight / this.rowHeight)
          this.viewCount = 4

          console.log('this.itemPerView:' + this.itemPerView)
          this.topHolder = el.querySelector('.topHolder')
          this.topHolder.pointer = 0

          this.bottomHolder = el.querySelector('.bottomHolder')
          this.bottomHolder.pointer = 0

          this.preScrollTop = getScrollTop(this.scrollEventTarget)
        }
        if (!this.timer) {
          this._initTimer()
        }
        // console.log(this.scrollEventTarget)
        // console.log(getScrollEventTarget, getElementTop, getVisibleHeight, requestAnimationFrame)
      }
    },
    watch: {
      kickStart (val) {
        if (val) {
          this._onScroll()
        }
      }
    }
  }
</script>

<style lang="stylus">
  .infiniteHolder
    background #ccc
</style>