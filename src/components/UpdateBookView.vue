<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="card-header text-center">Update Book</h2>
        <br />
        <div class="card-body">
          <form @submit.prevent="updateBook">
            <div class="mb-3">
              <label for="docId" class="form-label">Document ID (Book ID):</label>
              <input type="text" id="docId" class="form-control" v-model="docId" required />
            </div>
            <div class="mb-3">
              <label for="isbn" class="form-label">ISBN:</label>
              <input type="text" id="isbn" class="form-control" v-model="isbn" required />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Name:</label>
              <input type="text" id="name" class="form-control" v-model="name" required />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Update Book</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import db from '../firebase/init.js'
import { ref } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'

const docId = ref('')
const isbn = ref('')
const name = ref('')

// Update book logic
const updateBook = async () => {
  try {
    const isbnNumber = Number(isbn.value)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }

    const bookDocRef = doc(db, 'books', docId.value)

    await updateDoc(bookDocRef, {
      isbn: isbnNumber,
      name: name.value
    })

    isbn.value = ''
    name.value = ''
    docId.value = ''
    alert('Book updated successfully!')
  } catch (error) {
    console.error('Error updating book: ', error)
  }
}
</script>
