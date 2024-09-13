<template>
  <h1>Sign In</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const store = useStore()
const auth = getAuth()
const db = getFirestore()

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (data) => {
      const userDoc = await getDoc(doc(db, 'users', data.user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const userRole = userData.role

        store.commit('setAuthentication', true)
        store.commit('setUser', { email: data.user.email, role: userRole })
        console.log('Firebase Sign in Successful!')
        console.log('User Role:', userRole)
        console.log(auth.currentUser)
        if (userRole === 'admin') {
          router.push('/about')
        } else {
          router.push('/')
        }
      } else {
        console.log('User role not found')
      }
    })
    .catch((error) => {
      console.log(error.code)
    })
}
</script>
