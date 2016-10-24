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
    data () {
      return {
        emptyArray: []
      }
    },
    props: {
      // 行高度
      rowHeight: {
        type: Number,
        default: 0
      },
      // 行高度
      rowSelector: {
        type: String
      },
      // 每行的数据个数
      itemsPerRow: {
        type: Number,
        default: 1
      },
      // 默认屏显个数
      viewCount: {
        type: Number,
        default: 3
      },
      distance: {
        type: Number,
        default: 0
      },
      records: {
        type: Array,
        default: []
      },
      newRecords: {
        type: Array
      },
      onscroll: {
        type: Function
      },
      displayData: {
        type: Array
      }
    },
    ready () {
      // console.log('infinite ready ...')
    },
    beforeDestroy () {
      // console.log('beforeDestroy')
      this._clearUp()
    },
    methods: {
      _clearUp () {
        this._cleanTimer()
        this.allDataCache = []
        this.records = []
        this.topHolder.pointer = this.bottomHolder.pointer = 0
        setHeight(this.topHolder, 0)
        setHeight(this.bottomHolder, 0)
        this.rowHeight = 0
        this.scrollEventTarget = null
        this.preScrollTop = 0
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
          this.records.splice(0, this.itemsPerView)
          setHeight(this.topHolder, getHeight(this.topHolder) + this.rowsPerView * this.rowHeight)
          this.topHolder.pointer += this.itemsPerView
          // console.log('[top hide]this.records.length:' + this.records.length + 'this.topHolder.pointer' + this.topHolder.pointer)
        } else if ((direction < 0 || viewportScrollTop < 1) && this.topHolder.pointer && (elOffsetTop - getHeight(this.topHolder) < this.viewCount * this.viewportHeight)) {
          // 保证上方有 viewCount 数量的屏幕高度显示数据。
          restoreNum = this.itemsPerView
          topHeight = elOffsetTop - getHeight(this.topHolder)
          while (restoreNum < this.topHolder.pointer && topHeight < this.viewCount * this.viewportHeight) {
            restoreNum += this.itemsPerView
            topHeight += this.rowHeight * this.rowsPerView * 2 // 此消彼长，所以要*2
          }
          // 计算显示数据
          temp = this.allDataCache.slice(this.topHolder.pointer - restoreNum, this.topHolder.pointer)
          // console.log('[top restoreNum]this.topHolder.pointer:' + this.topHolder.pointer + 'temp.length', temp.length)
          if (temp.length > this.viewCount * this.itemsPerView) {
            // 只显示最开始的数据。
            // this.records = temp.splice(0, this.viewCount * this.itemsPerView)
            this.records.splice(0, this.records.length)
            this._mergeArray(this.records, temp.splice(0, this.viewCount * this.itemsPerView))
          } else {
            // this.records = temp.concat(this.records)
            this._unshiftArray(this.records, temp)
          }
          // 设置高度
          setHeight(this.topHolder, getHeight(this.topHolder) - restoreNum / this.itemsPerRow * this.rowHeight)
          this.topHolder.pointer -= restoreNum
          // 保持一致
          if (viewportScrollTop < 1) {
            this.bottomHolder.pointer = this.topHolder.pointer + this.records.length
          }
          // console.log('[top restoreNum]:' + restoreNum + ',this.records.length:' + this.records.length + ',this.topHolder.pointer:' + this.topHolder.pointer)
        }

        // 藏在屏幕下的高度
        var hiddenBottom = element.offsetHeight - this.viewportHeight - elOffsetTop
        if (direction < 0 && hiddenBottom - getHeight(this.bottomHolder) > this.viewCount * this.viewportHeight) {
          hideNum = this.itemsPerView
          // var bVisibleHeight = hiddenBottom - getHeight(this.bottomHolder)
          // while( bVisibleHeight > this.viewCount * this.viewportHeight){
          //     hideNum += this.itemsPerView
          //     bVisibleHeight -= this.rowHeight * this.itemsPerView * 2
          // }

          temp = this.records.length - this.viewCount * this.itemsPerView
          temp = Math.max(0, temp > hideNum ? hideNum : hideNum - hideNum)
          if (temp > 0) {
            this.records.splice(-temp)
          }
          setHeight(this.bottomHolder, getHeight(this.bottomHolder) + hideNum / this.itemsPerRow * this.rowHeight)
          // console.log('[bottom hide]hideNum / this.itemsPerRow' + hideNum / this.itemsPerRow)
          this.bottomHolder.pointer = this.topHolder.pointer + this.records.length
          // console.log('[bottom hide] temp:' + temp + ',bottom hide' + hideNum + 'this.records.length:' + this.records.length)
        } else if (direction > 0 && this.bottomHolder.pointer && hiddenBottom - getHeight(this.bottomHolder) < this.viewCount * this.viewportHeight) {
          hideNum = this.itemsPerView
          bVisibleHeight = hiddenBottom - getHeight(this.bottomHolder)
          while (bVisibleHeight < this.viewCount * this.viewportHeight) {
            hideNum += this.itemsPerView
            bVisibleHeight += this.rowHeight * this.rowsPerView * 2
            // if(hideNum > this.viewCount * this.itemsPerView){
            //     break
            // }
          }

          temp = this.allDataCache.slice(this.bottomHolder.pointer, this.bottomHolder.pointer + hideNum)
          // 防止records更新了，但此时hiddenBottom的计算滞后了，导致重复数据被压入 records
          if (temp.length && this.topHolder.pointer + this.records.length <= this.bottomHolder.pointer) {
            // this.records = this.records.concat(temp)
            // console.log('[bottom restore]temp.length / this.itemsPerRow:' + temp.length / this.itemsPerRow)
            this._mergeArray(this.records, temp)
            setHeight(this.bottomHolder, getHeight(this.bottomHolder) - temp.length / this.itemsPerRow * this.rowHeight)
            this.bottomHolder.pointer = this.topHolder.pointer + this.records.length
            // console.log('[bottom restore]' + temp.length + 'this.records.length:' + this.records.length)
          }
        }
        // console.log('this.records.length:' + this.records.length)
        if (shouldTrigger) {
          this._onScroll()
        }
      },
      _onScroll () {
        if (!this.parseScroll) {
          // call prop function
          this.onscroll()
        }
        this.parseScroll = true
      },
      _cleanTimer () {
        if (this.timer) {
          if (requestAnimationFrame) {
            var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
                            window.webkitCancelAnimationFrame || window.msCancelAnimationFrame
            cancelAnimationFrame(this.timer)
            this.timer = null
          } else {
            clearInterval(this.timer)
          }
        }
        if (typeof this.scrollListener === 'function' && this.scrollEventTarget) {
          this.scrollEventTarget.removeEventListener('scroll', this.scrollListener)
        }
      },
      _initTimer () {
        this.scrollListener = throttle(this._doCheck.bind(this), 200)
        // console.log(this.scrollListener)
        this.scrollEventTarget.addEventListener('scroll', this.scrollListener, false)
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
      _initBase () {
        let el = this.$el
        if (!this.rowHeight) {
          let itemsEl = this.$el.querySelectorAll(this.rowSelector)
          let firstEl = itemsEl[0]
          let secondEl = itemsEl[this.itemsPerRow]
          if (secondEl) {
            this.rowHeight = secondEl.getBoundingClientRect().top - firstEl.getBoundingClientRect().top
          } else {
            this.rowHeight = firstEl.offsetHeight
          }
          console.log(this.rowHeight)
        }
        if (!this.scrollEventTarget) {
          this.scrollEventTarget = getScrollEventTarget(el)
          this.viewportHeight = getVisibleHeight(this.scrollEventTarget)
          this.rowsPerView = Math.floor(this.viewportHeight / this.rowHeight)
          this.itemsPerView = this.rowsPerView * this.itemsPerRow
          // this.viewCount = 4
          // console.log('this.itemsPerView:' + this.itemsPerView + ',this.itemsPerRow:' + this.itemsPerRow + 'this.rowsPerView:' + this.rowsPerView)
          this.topHolder = el.querySelector('.topHolder')
          this.topHolder.pointer = 0

          this.bottomHolder = el.querySelector('.bottomHolder')
          this.bottomHolder.pointer = 0

          this.preScrollTop = getScrollTop(this.scrollEventTarget)
        }
        if (!this.timer && !this.scrollListener) {
          this._initTimer()
        }
        // console.log(this.scrollEventTarget)
        // console.log(getScrollEventTarget, getElementTop, getVisibleHeight, requestAnimationFrame)
      },
      _mergeArray (srcArr, newArr) {
        // vue 只检测被包装过的对象方法。这里如果直接使用 Array.prototype.push 方法，vue无法侦测到变化。
        this.emptyArray.push.apply(srcArr, newArr)
      },
      _unshiftArray (target, arr) {
        while (arr.length) {
          target.unshift(arr.pop())
        }
      }
    },
    watch: {
      newRecords (data) {
        if (data) {
          if (!this.allDataCache) {
            this.allDataCache = []
          }
          this.allDataCache = this.allDataCache.concat(data)
          this._mergeArray(this.records, data)
          // this.$nextTick(() => {
          //   this._mergeArray(this.records, data)
          // })
        }
      },
      records (val) {
        if (val) {
          // console.log('records change')
          this.parseScroll = false
          this.$nextTick(() => {
            this._initBase()
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  .infiniteHolder
    background #ccc
  /*.infiniteScroll
    overflow hidden*/
</style>