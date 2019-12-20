function ready (callback) {
  // Android/IOS原生API调用ready事件
  document.addEventListener('plusready', callback, false)
}
function focusInputScrollScreen () {
  // 处理Android页面中输入框获取焦点后键盘遮挡问题
  let elInputs = Array.from(document.querySelectorAll('input'))
  elInputs.forEach(input => {
    input.addEventListener('focus', () => {
      setTimeout(function(){  
        input.scrollIntoView(true);
        input.scrollIntoViewIfNeeded(); 
      }, 500);
    })
  })
}
function longPress (startEvent, callback) {
  // 监听touchstart事件，长按事件触发实现
  let activeEl = startEvent.target
  let timeout = setTimeout(() => {
    clearTimeout(timeout)
    callback()
  }, 800)
  activeEl.addEventListener('touchmove', moveFn, false)
  activeEl.addEventListener('touchend', endFn, false)
  function moveFn () {
    clearTimeout(timeout)
  }
  function endFn (endEvent) {
    clearTimeout(timeout)
    activeEl.removeEventListener('touchmove', moveFn)
    activeEl.removeEventListener('touchend', endFn)
  }
}

export default { ready, focusInputScrollScreen, longPress }
