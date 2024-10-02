<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h1 class="card-header text-center">Book Counter</h1>
        <div class="card-body text-center">
          <button type="button" class="btn btn-primary" @click="getBookCount">
            Get Book Count
          </button>
          <p v-if="count !== null" class="mt-3">Total number of books: {{ count }}</p>
          <p v-else="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
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
