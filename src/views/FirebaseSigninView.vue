<template>
  <h1>Sign In</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const router = useRouter()
const store = useStore()
const auth = getAuth()
const signin = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log('Firebase Sign in Successful!')
      store.commit('setAuthentication', true)
      store.commit('setUser', { email: data.user.email })
      router.push('/')
      console.log(auth.currentUser) // To check the current user signed in
    })
    .catch((error) => {
      console.log(error.code)
    })
}
</script>
