import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import ProductsView from '../views/ProductsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: CategoriesView,
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductsView,
    },
  ],
})

export default router
