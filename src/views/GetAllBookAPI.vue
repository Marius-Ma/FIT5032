<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <h2>All Books in JSON</h2>
        <pre>{{ jsondata }}</pre>
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const error = ref(null)

const getAllBooksAPI = async () => {
  try {
    const response = await axios.get('https://getallbooks-noabevg3ga-uc.a.run.app')
    jsondata.value = response.data
    error.value = null
  } catch (err) {
    console.error('Error fetching all books:', err)
    error.value = err.message
    jsondata.value = null
  }
}

onMounted(() => {
  getAllBooksAPI()
})
</script>
