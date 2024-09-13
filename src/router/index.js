import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import store from '../store/store'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

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
  {
    path: '/addBook',
    name: 'AddBook',
    component: AddBookView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let isAuthChecked = false

router.beforeEach((to, from, next) => {
  const auth = getAuth()

  if (store.state.isAuthenticated) {
    handleAuthorization(to, next)
    return
  }

  // 确保只调用一次
  if (!isAuthChecked) {
    isAuthChecked = true
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const db = getFirestore()
          const userDoc = await getDoc(doc(db, 'users', user.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            const userRole = userData.role

            store.commit('setAuthentication', true)
            store.commit('setUser', { email: user.email, role: userRole })

            handleAuthorization(to, next)
          } else {
            // 如果没有找到用户角色，自动创建一个默认角色
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              role: 'user' // 默认角色为 user
            })

            // 重新设置 Vuex 的状态
            store.commit('setAuthentication', true)
            store.commit('setUser', { email: user.email, role: 'user' })

            handleAuthorization(to, next)
          }
        } catch (error) {
          console.error('Error getting user data:', error)
          store.commit('setAuthentication', false)
          store.commit('setUser', null)
          next({ name: 'Login' })
        }
      } else {
        store.commit('setAuthentication', false)
        store.commit('setUser', null)

        if (to.matched.some((record) => record.meta.requiresAuth)) {
          next({ name: 'Login' })
        } else {
          next()
        }
      }
    })
  } else {
    next()
  }
})

const handleAuthorization = (to, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.meta.requiresRole && store.state.user?.role !== to.meta.requiresRole) {
      next({ name: 'AccessDenied' })
    } else {
      next()
    }
  } else {
    next()
  }
}

export default router
