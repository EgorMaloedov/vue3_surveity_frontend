import { createRouter, createWebHistory } from 'vue-router'

import PreviewPage from './pages/PreviewPage.vue'
import AuthPage from './pages/AuthPage.vue'

const routes = [
  { path: '/', component: PreviewPage },
  { path: '/auth', component: AuthPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
