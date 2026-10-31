import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import FoundationsPage from './pages/FoundationsPage.vue'
import ComponentPage from './pages/ComponentPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/foundations', name: 'foundations', component: FoundationsPage },
    { path: '/components/:slug', name: 'component', component: ComponentPage, props: true },
    { path: '/:rest(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})
