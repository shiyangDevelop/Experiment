class G {
  constructor (target, isToSessionStorage = true) {
    // 构造函数，传入要监听的目标对象
    let that = this;
    that.isToSessionStorage = isToSessionStorage;
    that.types = {};
    that.isEmpty = Symbol("isEmpty");
    that.isIE = navigator.userAgent.toLowerCase().indexOf("trident") !== -1;
    that.OriginTarget = JSON.parse(JSON.stringify(target));

    // 浏览器兼容性判断
    if (!that.isIE && !!window.addEventListener) {
      that.winBindEvent = window.addEventListener;
      that.docBindEvent = document.addEventListener;
    } else if (!!window.docBindEvent) {
      that.winBindEvent = window.attachEvent;
      that.docBindEvent = document.attachEvent;
    } else {
      that.showError("您的浏览器不支持G变量");
    }
    // 设置观察者模式
    that.state = new Proxy(target, {
      async set(target, key, value, receiver) {
        let oldVal = Reflect.get(target, key, receiver)
        return await that.__beforeCallback(target, key, receiver, value, oldVal)
      },
      get(target, key, receiver) {
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key, receiver);
        } else {
          that.showError('您访问的' + key + '属性不存在,请在状态中注册后使用！')
        }
      }
    });
    
    // 刷新页面时
    that.winBindEvent.call(window, "beforeunload", function() {
      Object.keys(that.state).forEach(key => {
        that.getDataType(key);
        that.setSessionStorage(key, that.state[key]);
      });
      that.setSessionStorage("__types", that.types);
    });
    // 页面加载时
    that.docBindEvent.call(document, "DOMContentLoaded", function() {
      that.types = that.getSessionStorage("__types");
      // 判断是否是第一次加载页面
      if (that.types === that.isEmpty) {
        that.types = {};
        return;
      }
      Object.keys(that.state).forEach(key => {
        if (that.types[key] !== "string") {
          that.state[key] = that.getSessionStorage(key);
        } else {
          that.state[key] = String(that.getSessionStorage(key));
        }
        sessionStorage.removeItem(key);
      });
      sessionStorage.removeItem("__types");
    });
  }
  setSessionStorage (key, val) {
    // sessionStorage赋值方法
    if (!this.isToSessionStorage) return;
    if (sessionStorage) {
      val instanceof Object || val instanceof Array
        ? sessionStorage.setItem(key, JSON.stringify(val))
        : sessionStorage.setItem(key, String(val));
    } else {
      this.showError("您的浏览器不支持sessionStorage");
    }
  }
  getSessionStorage (key) {
    // sessionStorage取值方法
    if (!this.isToSessionStorage) return;
    try {
      if (key in sessionStorage) {
        if (this.types[key] !== "undefined") {
          return JSON.parse(sessionStorage.getItem(key));
        } else {
          return undefined;
        }
      } else {
        return this.isEmpty;
      }
    } catch (err) {
      return sessionStorage.getItem(key);
    }
  }
  getDataType (key) {
    // 获取属性数据类型并存储在实例types中
    let that = this;
    try {
      if (typeof that.state[key] !== "object") {
        that.types[key] = typeof that.state[key];
      } else if (that.state[key] !== null && Array.isArray(that.state[key])) {
        that.types[key] = "array";
      } else if (that.state[key] === null) {
        that.types[key] = "null";
      } else {
        that.types[key] = "object";
      }
    } catch (err) {
      that.showError("获取数据类型错误，错误原因：" + err);
    }
  }
  beforeSet (_key, callback) {
    // 赋值前的钩子函数
    let that = this
    that.__beforeCallback = function (target, key, receiver, newval, oldval) {
      if (_key === key && !!callback) {
        return new Promise(function (resolve, reject) {
          callback(newval, oldval, function () {
            Reflect.set(target, key, newval, receiver)
            that.__afterCallback(key, newval, oldval)
            resolve()
          })
        })
      }
    }
  }
  afterSet (_key, callback) {
    // 赋值后的钩子函数
    let that = this
    that.__afterCallback = function (key, newval, oldVal) {
      if (_key === key && callback) {
        callback(newval, oldVal)
      }
    }
  }
  showError (error) {
    throw error;
  }
}

var g = new G(state);
g.beforeSet('name', function (newval, oldval, next) {
  // setTimeout(function () {
    console.log('before:' + newval, oldval)
    next()
  // }, 3000)
})
g.afterSet('name', function (newval, oldval) {
  console.log('after:' + newval, oldval)
})
