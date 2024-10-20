import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import AddBookView from '../views/AddBookView.vue'
import BookListView from '../components/BookListView.vue'
import UpdateBookView from '../components/UpdateBookView.vue'
import DeleteBookView from '@/components/DeleteBookView.vue'
import store from '../store/store'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import GetBookCountView from '@/views/GetBookCountView.vue'
import WeatherView from '@/views/WeatherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'
import GetAllBookAPI from '@/views/GetAllBookAPI.vue'
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
    component: FirebaseSigninView,
    meta: { requiresAuth: false }
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/add-book',
    name: 'AddBook',
    component: AddBookView,
    meta: { requiresAuth: true }
  },
  {
    path: '/book-list',
    name: 'BookList',
    component: BookListView,
    meta: { requiresAuth: false }
  },
  {
    path: '/update-book',
    name: 'UpdateBook',
    component: UpdateBookView,
    meta: { requiresAuth: true }
  },
  {
    path: '/delete-book',
    name: 'DeleteBook',
    component: DeleteBookView,
    meta: { requiresAuth: true }
  },
  {
    path: '/GetBookCount',
    name: 'GetBookCount',
    component: GetBookCountView
  },
  {
    path: '/WeatherCheck',
    name: 'WeatherCheck',
    component: WeatherView
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
  },
  {
    path: '/GetAllBookAPI',
    name: 'GetAllBookAPI',
    component: GetAllBookAPI
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const auth = getAuth()

  if (store.state.isAuthenticated) {
    handleAuthorization(to, next)
  } else {
    try {
      const user = await getCurrentUser()
      if (user) {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()
          const userRole = userData.role

          store.commit('setAuthentication', true)
          store.commit('setUser', { email: user.email, role: userRole })

          handleAuthorization(to, next) // 处理授权逻辑
        } else {
          // 如果用户没有数据，创建默认用户角色
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'user' // 默认角色
          })

          store.commit('setAuthentication', true)
          store.commit('setUser', { email: user.email, role: 'user' })

          handleAuthorization(to, next) // 处理授权逻辑
        }
      } else {
        if (to.matched.some((record) => record.meta.requiresAuth)) {
          next({ name: 'Login' })
        } else {
          next() // 允许访问无需认证的页面
        }
      }
    } catch (error) {
      console.error('Error during auth state check:', error)
      next({ name: 'Login' })
    }
  }
})

// 处理授权逻辑
const handleAuthorization = (to, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果需要特定角色的权限，但当前用户角色不符合，跳转到访问拒绝页面
    if (to.meta.requiresRole && store.state.user?.role !== to.meta.requiresRole) {
      next({ name: 'AccessDenied' })
    } else {
      next() // 用户有权限，正常跳转
    }
  } else {
    next()
  }
}

export default router
