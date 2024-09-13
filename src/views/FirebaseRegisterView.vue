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

  <!-- when choose admin display the inviting input box -->
  <p v-if="role === 'admin'">
    <input type="text" placeholder="Invite Code" v-model="inviteCode" />
  </p>

  <p><button @click="register">Save to Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('user')
const inviteCode = ref('')
const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const register = async () => {
  try {
    if (role.value === 'admin') {
      const inviteDocRef = doc(db, 'admin_invites', inviteCode.value)
      const inviteDoc = await getDoc(inviteDocRef)

      if (!inviteDoc.exists() || inviteDoc.data().used) {
        alert('Invalid or used invite code.')
        return
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: role.value
    })

    console.log('Firebase Register Successful!')

    if (role.value === 'admin') {
      await updateDoc(doc(db, 'admin_invites', inviteCode.value), {
        used: true
      })
    }
    await signOut(auth)

    router.push('/FireLogin')
  } catch (error) {
    console.error('Failed to register user or store role:', error)
    alert('Registration failed. Please try again.')

    if (auth.currentUser) {
      await auth.currentUser.delete()
    }
  }
}
</script>
