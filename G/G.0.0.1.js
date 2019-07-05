/**
 * 全局变量，用于全局状态存储
 */
class G {
	constructor (isToSessionStorage = true) {
		let _this = this
		_this.isToSessionStorage = isToSessionStorage;
		_this.isEmpty = Symbol('isEmpty');
		// sessionStorage.clear()
		// 循环遍历所有状态字段
		Object.keys(this.state).forEach(key => {

			// 初始化赋值操作
			let _key = Symbol(key);
			
			// 赋值前的周期函数
			_this[key + '_before_set'] = function (callback) {
				_this.beforeCallback = callback;
			}

			// 赋值后的周期函数
			_this[key + '_after_set'] = function (callback) {
				_this.afterCallback = callback;
			}

			_this[_key] = _this.state[key];
			
			_this.state[key] != _this.getSessionStorage(key) && _this.getSessionStorage(key) !== _this.isEmpty ?  
			_this[_key] = _this.getSessionStorage(key) :
			_this.getSessionStorage(key) === _this.isEmpty ? _this.setSessionStorage(key, _this.state[key]) : '';

			// 对全局状态做数据监听
			Object.defineProperty(this.state, key, {
				get () {
					return _this[_key] || _this.getSessionStorage(key);
				},
				set (val) {
					_this.beforeCallback(val, _this[_key], function () {
						_this[_key] = val;
						_this.setSessionStorage(key, val);

						_this.afterCallback(val);
					})
				}
			})
		})
	}
	setSessionStorage (key, val) {
		// sessionStorage赋值方法
		if (!this.isToSessionStorage) return;
		if (sessionStorage) {
			val instanceof Object || val instanceof Array ?
			sessionStorage.setItem(key, JSON.stringify(val)) :
			sessionStorage.setItem(key, String(val));
		} else {
			throw '您的浏览器不支持sessionStorage';
		}
	}
	getSessionStorage (key) {
		// sessionStorage取值方法
		if (!this.isToSessionStorage) return;
		try {
			if (key in sessionStorage) {
				return JSON.parse(sessionStorage.getItem(key));
			} else {
				return this.isEmpty;
			}
		} catch (err) {
			return sessionStorage.getItem(key);
		}
	}
	state = {
		name: 12345,
		age: 32,
		sex: '男'
	}
}

let obj = new G;

obj['name_before_set'](function (val, old, next) {
	console.log(val, old);
	next();
})
obj['name_after_set'](function (val) {
	console.log('after:' + val);
})