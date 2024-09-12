<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p>
    <select v-model="role">
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  </p>
  <p><button @click="register">Save to Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('user') // 默认注册为普通用户
const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (data) => {
      try {
        // 尝试将用户角色信息存储到 Firestore
        await setDoc(doc(db, 'users', data.user.uid), {
          email: data.user.email,
          role: role.value // 存储角色信息
        })
        console.log('Firebase Register Successful!')
        router.push('/FireLogin')
      } catch (error) {
        console.error('Failed to store role information in Firestore:', error)
        // 在 Firestore 操作失败时，注销创建的用户，以避免不完整的用户信息
        await auth.currentUser.delete()
        alert('Failed to register user. Please try again.')
      }
    })
    .catch((error) => {
      console.log(error.code)
    })
}
</script>
