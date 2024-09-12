// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAJ3QuCvfvpyKXvv1hREqSGE0DQouhPEkU',
  authDomain: 'week7-yuema.firebaseapp.com',
  projectId: 'week7-yuema',
  storageBucket: 'week7-yuema.appspot.com',
  messagingSenderId: '346948383686',
  appId: '1:346948383686:web:86d0b112e7ebbcc4eaf8c7'
}

// Initialize Firebase
initializeApp(firebaseConfig)
// init firestore service
const db = getFirestore()
export default db
