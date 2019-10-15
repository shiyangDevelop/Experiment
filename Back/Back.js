class Back {
  constructor (param) {
    this.param = param
    this.addHistoryRecord()
    this.bindEvent()
  }
  addHistoryRecord () {
    let that = this
    let t = new Date().getTime()
    if (that.param.type === 'hash') {
      window.history.pushState({state: `${that.param.path}?t=${t}`}, '', `/#${that.param.path}`)
    } else if (that.param.type === 'history') {
      window.history.pushState({state: that.param.path}, '', `${that.param.path}?t=${t}`)
    } else {
      throw '请在Back创建实例时，传入的参数中添加或修改type类型配置！'
    }
  }
  bindEvent () {
    let that = this
    window.addEventListener('popstate', function () {
      that.addHistoryRecord()
      if (that.param.callback) {
        that.param.callback()
      }
    })
  }
}