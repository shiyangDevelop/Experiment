// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import Store from './store/index.js'

Vue.config.productionTip = false
Vue.use(Vuex)
const store = new Vuex.Store(Store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
