import reqwest from 'reqwest'

const _addressLists = [
  {'id': 0, 'title': 'iPad 4 Mini', 'num': 500.01, 'street': 2},
  {'id': 0, 'title': 'H&M T-Shirt White', 'num': 10.99, 'street': 10},
  {'id': 0, 'title': 'Charli XCX - Sucker CD', 'num': 19.99, 'street': 5}
]
let idx = 1
export default {
  list (cb) {
    reqwest({
      url: '/wap/user/getBaseInfo?time=1472819069757'
      // type: 'jsonp',
      // jsonpCallback: 'jsonp'
    }).then(res => console.log(res))

    let rnt = _addressLists.reduce((newList, item) => {
      newList.push(Object.assign({}, item, {'id': ++idx}))
      return newList
    }, [])
    setTimeout(() => cb(rnt), 100)
  },

  add (products, cb, errorCb) {
    setTimeout(() => {
      // simulate random checkout failure.
      (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1)
        ? cb()
        : errorCb()
    }, 100)
  }
}
