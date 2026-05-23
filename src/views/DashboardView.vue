<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '../stores/categories'
import { useProductsStore } from '../stores/products'
import BaseSpinner from '../components/BaseSpinner.vue'

const categoriesStore = useCategoriesStore()
const productsStore = useProductsStore()

const { categories, isLoading: categoriesLoading } = storeToRefs(categoriesStore)
const { products, isLoading: productsLoading } = storeToRefs(productsStore)

const lowStockCount = computed(() =>
  products.value.filter((item) => Number(item.stock ?? item.cantidad ?? 0) <= 5).length,
)

const cards = computed(() => [
  {
    label: 'Categorias activas',
    value: categories.value.length,
    color: 'bg-blue-100 text-blue-900',
  },
  {
    label: 'Productos totales',
    value: products.value.length,
    color: 'bg-emerald-100 text-emerald-900',
  },
  {
    label: 'Productos con stock bajo',
    value: lowStockCount.value,
    color: 'bg-amber-100 text-amber-900',
  },
])

const dashboardLoading = computed(
  () => categoriesLoading.value || productsLoading.value,
)

onMounted(async () => {
  await Promise.all([categoriesStore.fetchCategories(), productsStore.fetchProducts()])
})
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
    <h1 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">Dashboard inicial</h1>
    <p class="mt-3 max-w-2xl text-slate-600">
      Vista general del sistema con resumen de categorias y productos.
    </p>

    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="card in cards"
        :key="card.label"
        :class="['rounded-xl p-5 shadow-md ring-1 ring-black/5', card.color]"
      >
        <p class="text-sm font-medium">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-black">{{ card.value }}</p>
      </article>
    </div>
  </section>

  <BaseSpinner v-if="dashboardLoading" />
</template>
