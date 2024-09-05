<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <h2 class="card-header text-center">Login</h2>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" id="username" class="form-control" v-model="username" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  v-model="password"
                  required
                />
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const username = ref('')
const password = ref('')
const store = useStore() // 引入 Vuex store
const router = useRouter() // 引入 Vue Router

const handleLogin = () => {
  const user = { username: username.value, password: password.value }
  store.dispatch('login', user) // 使用 Vuex 的 action 处理登录
  router.push('/')
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
