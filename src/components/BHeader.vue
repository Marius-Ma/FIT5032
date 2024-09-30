<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home (Week 5)</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <button @click="logout" class="btn btn-danger">Logout</button>
        </li>
        <li class="nav-item">
          <router-link to="/FireLogin" class="nav-link" active-class="active"
            >Firebase Login</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/FireRegister" class="nav-link" active-class="active"
            >Firebase Register</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/add-book" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/book-list" class="nav-link" active-class="active"
            >Query Book</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/update-book" class="nav-link" active-class="active">
            Update Book
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/delete-book" class="nav-link" active-class="active">
            Delete Book
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/GetBookCount" class="nav-link" active-class="active"
            >Get Book Count</router-link
          >
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

const store = useStore()
const router = useRouter()
const auth = getAuth()

const isAuthenticated = computed(() => store.state.isAuthenticated)

const logout = () => {
  signOut(auth)
    .then(() => {
      // 成功登出后，更新 Vuex 的状态
      store.dispatch('logout')
      router.push('/login') // 重定向到登录页面
    })
    .catch((error) => {
      console.log('Error signing out:', error)
    })
}
</script>
