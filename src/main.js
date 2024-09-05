// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(store)
app.use(router)

// app.component('DataTable', DataTable)
// app.component('Column', Column)
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
app.mount('#app')
