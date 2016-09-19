
var Util = {
  /*求一个字符串字节的长度*/
  getBites: function(str){
    var len = str.length;
    var bites = len;
    for (var i=0; i<len; i++){
      if (str.charCodeAt(i)>255){
        bites++;
      }
    }
    return bites;
  },
  /**
   * js截取字符串，中英文都能用
   * @param str：需要截取的字符串
   * @param len: 需要截取的长度
   */
  subAllStr: function(str,len){
    var tempLen = 0;
    var strLen = str.length;
    var cutStr = new String();

    for (var i=0; i<strLen; i++){
      var curChar = str[i];
      tempLen++;
      if (escape(curChar).length > 4){
        tempLen++;
      }
      cutStr += curChar;
      if (tempLen >= len){
        cutStr += '...';
        return cutStr;
      }
    }
    if (tempLen < len){
      return str;
    }
  },

  getUrlParam: function(name,str) {
      var reg = new RegExp("(?:^|&|\\?)" + name + "=([^&]*)(?:&|$)");
      var r = (str || location.search).match(reg);
      if (r != null) {
          return decodeURIComponent(r[1]);
      }
      return "";
  },
  isMobileSafari: function() {
      var ua = navigator.userAgent;
      // IOS系统
      if (/ OS \d/.test(ua)) {
          // 不是Chrome
          if (!~ua.indexOf("CriOS")) {
              // 开头必须为Mozilla
              if (!ua.indexOf("Mozilla")) {
                  // 结尾需为：Safari/xxx.xx
                  if (/Safari\/[\d\.]+$/.test(ua)) {
                      return true;
                  }
              }
          }
      }
      return false;
  },
  isWeiXin: function() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
      } else {
          return false;
      }
  },
  isPc: function() {
      var os = new Array("Android", "iPhone", "Windows Phone", "iPod", "BlackBerry", "MeeGo", "SymbianOS");
      // 其他类型的移动操作系统类型，自行添加
      var info = navigator.userAgent;
      var len = os.length;
      for (var i = 0; i < len; i++) {
          if (info.indexOf(os[i]) > 0) {
              return false;
          }
      }
      return true;
  },
  versions: function() {
      var u = navigator.userAgent, app = navigator.appVersion;
      return {
          //移动终端浏览器版本信息
          trident: u.indexOf("Trident") > -1,
          //IE内核
          presto: u.indexOf("Presto") > -1,
          //opera内核
          webKit: u.indexOf("AppleWebKit") > -1,
          //苹果、谷歌内核
          gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1,
          //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/),
          //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
          //ios终端
          android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
          //android终端或uc浏览器
          iPhone: u.indexOf("iPhone") > -1,
          //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf("iPad") > -1,
          //是否iPad
          webApp: u.indexOf("Safari") == -1
      };
  }()
}

export default Util;
