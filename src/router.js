import { createWebHistory, createRouter } from 'vue-router'
import LandingApp from './views/landing/LandingApp.vue'
import SafariApp from './views/product/SafariApp.vue'
import DetailApp from './views/product/DetailApp.vue'
import RequestApp from './views/request/RequestApp.vue'

const routes = [
    { path: '/', component: LandingApp },
    { path: '/safari', component: SafariApp },
    { path: '/detail', component: DetailApp },
    { path: '/request', component: RequestApp },
  ];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;