function ready (callback) {
  document.addEventListener('plusready', callback, false)
}
function focusInputScrollScreen () {
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

export default { ready, focusInputScrollScreen }