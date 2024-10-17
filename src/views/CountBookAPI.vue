<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <pre>{{ jsondata }}</pre>
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const error = ref('')
const jsondata = ref(null)

const getBookCountAPI = async () => {
  try {
    const response = await axios.get('https://countbooks-noabevg3ga-uc.a.run.app')
    jsondata.value = response.data
    error.value = null
  } catch (err) {
    console.error('Error fetching book count:', err)
    error.value = err
    jsondata.value = null
  }
}

onMounted(() => {
  getBookCountAPI()
})
</script>
