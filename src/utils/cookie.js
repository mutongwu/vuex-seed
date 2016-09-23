export default {
  set(key, value, options) {
    var days, time, result, decode

    // A key and value were given. Set cookie.
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        // Enforce object
        if (!options){
            options = {};
        }

        if (value === null || value === undefined) {
          options.expires = -1
        }

        if (typeof options.expires === 'number') {
            days = (options.expires * 24 * 60 * 60 * 1000)
            time = options.expires = new Date()

            time.setTime(time.getTime() + days)
        }

        value = String(value)

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''))
    }
    return null
  },
  get(key, options = {} ){

    decode = options.raw ? function (s) { return s } : decodeURIComponent

    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
  }
}