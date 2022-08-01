import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Learn from '../views/Learn.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[has h].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/learn',
    name: 'Learn',
    component: Learn
  },
  {
    path: '/flashcards',
    name: 'Flashcards',
    component: () => import(/* webpackChunkName: "about" */ '../views/Flashcards.vue')
    // component: Flashcards
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
