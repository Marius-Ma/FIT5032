/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection('books')
      const snapshot = await booksCollection.get()
      const count = snapshot.size

      res.status(200).send({ count })
    } catch (error) {
      console.error('Error counting books:', error.message)
      res.status(500).send('Error counting books')
    }
  })
})

// Cloud Function to get book counts
exports.autoCapitalizeTitle = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { isbn, name } = req.body
      const uppercaseTitle = name.toUpperCase()

      const writeResult = await admin.firestore().collection('books').add({
        isbn: isbn,
        name: uppercaseTitle
      })

      res.status(200).json({ title: uppercaseTitle, id: writeResult.id })
    } catch (error) {
      console.error('Error adding book with capitalization:', error.message)
      res.status(500).send('Error adding book with capitalization')
    }
  })
})

// Cloud Function to get all books
exports.getAllBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection('books')
      const snapshot = await booksCollection.get()

      let books = []
      snapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() })
      })

      res.status(200).json(books)
    } catch (error) {
      console.error('Error getting all books:', error.message)
      res.status(500).send('Error getting all books')
    }
  })
})

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
