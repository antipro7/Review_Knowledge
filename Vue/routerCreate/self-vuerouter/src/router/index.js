import Vue from 'vue'
import VueRouter from './selfVueRouter'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About')
    },
  ]
})

export default router