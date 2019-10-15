import { depClone, deconstruct } from '../tools/tools'
export const syncToSession = store => {
  window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('state', JSON.stringify(depClone(store.state, {}, true)))
  })
  document.addEventListener('DOMContentLoaded', function () {
    let state = JSON.parse(sessionStorage.getItem('state'))
    sessionStorage.removeItem('state')
    store.replaceState(deconstruct(state))
  })
  store.subscribe((mutation, state) => {
    // 在利用mutation修改状态时，修改后回调此处逻辑
  })
}
