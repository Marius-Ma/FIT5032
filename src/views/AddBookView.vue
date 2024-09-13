<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
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
          <BookList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import db from '../firebase/init.js'
import { ref } from vue
import { collection, addDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')

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
</script>
