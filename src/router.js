import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ './views/home.vue'),
    children: [
      {
        path: 'all',
        name: 'all',
        component: () => import(/* webpackChunkName: "all" */ './views/all.vue')
      },
      {
        path: 'mine',
        name: 'mine',
        component: () => import(/* webpackChunkName: "mine" */ './views/mine.vue')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ './views/userInfo.vue')
      },
      {
        path: '',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ './views/login.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */ './views/register.vue')
      }
    ]
  },
  {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ './views/error.vue')
  }
]

const router = new Router({
  mode: 'history',
  routes
})

const excludeRoutes = ['/', '/all', '/register', '/error']
router.beforeEach((to, from, next) => {
  if (store.state.user.email && to.fullPath === '/') { // 登录状态，跳到ALL页
    next('/all')
  } else if (!store.state.user.email && !excludeRoutes.includes(to.fullPath)) { // 非登录状态，跳到登录页
    next('/')
  } else {
    next()
  }
})

export default router
