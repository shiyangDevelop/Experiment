import Vue from 'vue'
import Router from 'vue-router'
import demo from '@/pages/demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'demo',
      component: demo
    }
  ]
})
