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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe() // 确保回调只执行一次
        resolve(user) // 当用户状态发生改变时 resolve user
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const auth = getAuth()

  // 如果 Vuex 中已经有认证信息，直接处理授权
  if (store.state.isAuthenticated) {
    handleAuthorization(to, next)
  } else {
    try {
      const user = await getCurrentUser() // 等待 onAuthStateChanged 确定用户状态
      if (user) {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()
          const userRole = userData.role

          // 更新 Vuex 中的用户和认证信息
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
        // 如果没有用户且访问需要认证的页面，重定向到登录页面
        if (to.matched.some((record) => record.meta.requiresAuth)) {
          next({ name: 'Login' })
        } else {
          next() // 允许访问无需认证的页面
        }
      }
    } catch (error) {
      console.error('Error during auth state check:', error)
      next({ name: 'Login' }) // 发生错误时重定向到登录
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
    next() // 页面不需要认证，直接跳转
  }
}

export default router
