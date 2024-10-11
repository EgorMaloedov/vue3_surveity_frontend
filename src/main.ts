import { createApp } from 'vue'
import './assets/styles/tailwind.css'

import { createPinia } from 'pinia'
import {router} from './routes'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
