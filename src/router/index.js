import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import store from '../store/store'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: () => import('@/views/AccessDeniedView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      store.commit('setAuthentication', true)
      store.commit('setUser', { email: user.email, role: store.state.user?.role || 'user' })
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (to.meta.requiresRole && store.state.user?.role !== to.meta.requiresRole) {
          next({ name: 'AccessDenied' })
        } else {
          next() // 有权限，允许访问
        }
      } else {
        next() // 不需要认证，允许访问
      }
    } else {
      // 用户未登录
      store.commit('setAuthentication', false)
      store.commit('setUser', null)

      // 如果目标路由需要认证，但用户未登录，则跳转到登录页面
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        next({ name: 'Login' })
      } else {
        next() // 目标路由不需要认证，允许访问
      }
    }
  })
})

export default router
