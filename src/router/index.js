import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import store from '../store/store'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.isAuthenticated) {
      next({ name: 'Login' })
    } else if (to.meta.requiresRole && store.state.user.role !== to.meta.requiresRole) {
      next({ name: 'AccessDenied' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
