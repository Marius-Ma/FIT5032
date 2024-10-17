// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import './firebase/init'

// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(store)
app.use(router)
app.mount('#app')
// app.component('DataTable', DataTable)
