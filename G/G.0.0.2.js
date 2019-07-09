class G {
  /**
   * G类初始化时的构造函数
   * @param {*需要监听的目标状态对象} target | Object
   * @param {*是否依赖SessionStorage} isToSessionStorage | Boolean: true
   */
  constructor (target, isToSessionStorage = true) {
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
        if (that.__beforeCallback) {
          return await that.__beforeCallback(target, key, receiver, value, oldVal)
        } else if (that.__afterCallback) {
          return Reflect.set(target, key, value, receiver) && that.__afterCallback(key, value, oldVal)
        } else {
          return Reflect.set(target, key, value, receiver)
        }
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

  /**
   * 向sessionStorage中存值的方法
   * @param {*需要赋值sessionStorage的key值} key | String
   * @param {*需要赋值sessionStorage的value值} val | String
   */
  setSessionStorage (key, val) {
    if (!this.isToSessionStorage) return;
    if (sessionStorage) {
      val instanceof Object || val instanceof Array
        ? sessionStorage.setItem(key, JSON.stringify(val))
        : sessionStorage.setItem(key, String(val));
    } else {
      this.showError("您的浏览器不支持sessionStorage");
    }
  }

  /**
   * 从sessionStorage中取值函数
   * @param {*获取sessionStorage的key值} key | String
   */
  getSessionStorage (key) {
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

  /**
   * 获取属性数据类型并存储在实例types属性中
   * @param {*获取状态对象中数据类型对应的key值} key | String
   */
  getDataType (key) {
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

  /**
   * 赋值前的钩子函数定义
   * @param {*需要监听的状态属性key值} _key | String
   * @param {*赋值前需要执行的回调函数，可支持异步操作} callback | Function
   * callback @param {*获取到更新前的要更新上去的值（新值）} newval | <>
   *          @param {*获取到更新前的被更新的值（旧值）} oldval | <>
   *          @param {*执行更新操作的函数，不调用，不更新} next | Function
   */
  beforeSet (_key, callback) {
    let that = this
    that.__beforeCallback = function (target, key, receiver, newval, oldval) {
      if (_key === key && !!callback) {
        return new Promise(function (resolve, reject) {
          if (newval === oldval) {
            // 如果数据没有变化，不会触发钩子函数的回调
            Reflect.set(target, key, newval, receiver)
            resolve()
          } else {
            callback(newval, oldval, function () {
              Reflect.set(target, key, newval, receiver)
              that.__afterCallback ? that.__afterCallback(key, newval, oldval) : ''
              resolve()
            })
          }
        })
      }
    }
  }

  /**
   * 状态更新后需要执行的钩子函数
   * @param {*赋值后需要监听的属性名key值} _key | String
   * @param {*赋值后需要运行的回调函数} callback | Function
   * callback @param {*赋值后的更新的值（新值）} newval | <>
   *          @param {*赋值后取到的更新前的值（旧值）} oldval | <>
   */
  afterSet (_key, callback) {
    // 赋值后的钩子函数
    let that = this
    that.__afterCallback = function (key, newval, oldVal) {
      if (_key === key && callback) {
        callback(newval, oldVal)
        return true
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
