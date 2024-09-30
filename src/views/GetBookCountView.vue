<template>
  <h1>Book counter</h1>
  <button type="button" @click="getBookCount">Get Book Count</button>
  <p v-if="count !== null">Total number of books: {{ count }}</p>
  <p v-else="error">{{ error }}</p>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref('')
const error = ref('')

const getBookCount = async () => {
  try {
    const response = await axios.get('https://countbooks-noabevg3ga-uc.a.run.app')
    count.value = response.data.count
    error.value = null
  } catch (err) {
    console.error('Error fetching book count:', err)
    error.value = err
    count.value = null
  }
}
</script>
