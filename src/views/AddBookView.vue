<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h2 class="card-header text-center">Add Book</h2>
        <div class="card-body">
          <form @submit.prevent="addBook">
            <div class="mb-3">
              <label for="isbn" class="form-label">ISBN:</label>
              <input type="text" id="isbn" class="form-control" v-model="isbn" required />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Name:</label>
              <input type="text" id="name" class="form-control" v-model="name" required />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Add Book</button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-md-5">
        <h2 class="card-header text-center">Add Book (Auto Capitalize)</h2>
        <div class="card-body">
          <form @submit.prevent="addBookWithCapitalization">
            <div class="mb-3">
              <label for="isbn-auto" class="form-label">ISBN:</label>
              <input type="text" id="isbn-auto" class="form-control" v-model="isbnAuto" required />
            </div>
            <div class="mb-3">
              <label for="name-auto" class="form-label">Book Name:</label>
              <input type="text" id="name-auto" class="form-control" v-model="nameAuto" required />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Add Book</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import axios from 'axios'
import db from '../firebase/init.js'

const isbn = ref('')
const name = ref('')

const isbnAuto = ref('')
const nameAuto = ref('')

const addBook = async () => {
  try {
    const isbnNumber = Number(isbn.value)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }

    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value
    })

    isbn.value = ''
    name.value = ''
    alert('Book added successfully!')
  } catch (error) {
    console.error('Error adding book: ', error)
  }
}

const addBookWithCapitalization = async () => {
  try {
    const isbnNumber = Number(isbnAuto.value)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }

    const response = await axios.post('https://autocapitalizetitle-noabevg3ga-uc.a.run.app', {
      isbn: isbnNumber,
      name: nameAuto.value
    })

    isbnAuto.value = ''
    nameAuto.value = ''
    alert(`Book added successfully: ${response.data.title}`)
  } catch (error) {
    console.error('Error adding book with capitalization: ', error)
  }
}
</script>
