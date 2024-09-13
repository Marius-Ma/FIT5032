<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="card-header text-center">Delete Book</h2>
        <br />
        <div class="card-body">
          <form @submit.prevent="deleteBook">
            <div class="mb-3">
              <label for="docId" class="form-label">Document ID (Book ID):</label>
              <input type="text" id="docId" class="form-control" v-model="docId" required />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-danger">Delete Book</button>
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
import { doc, deleteDoc } from 'firebase/firestore'

const docId = ref('')

// Delete book logic
const deleteBook = async () => {
  try {
    if (!docId.value) {
      alert('Please provide a valid Document ID to delete a book.')
      return
    }

    const bookDocRef = doc(db, 'books', docId.value)

    await deleteDoc(bookDocRef)

    docId.value = ''
    alert('Book deleted successfully!')
  } catch (error) {
    console.error('Error deleting book: ', error)
  }
}
</script>
