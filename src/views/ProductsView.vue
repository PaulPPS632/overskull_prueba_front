<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '../stores/products'
import { useCategoriesStore } from '../stores/categories'
import BaseSpinner from '../components/BaseSpinner.vue'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const { products, isLoading: productsLoading } = storeToRefs(productsStore)
const { categories, isLoading: categoriesLoading } = storeToRefs(categoriesStore)

const form = reactive({
  id: null,
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
})

const errors = ref({})

const isEditing = computed(() => form.id !== null)
const isLoading = computed(() => productsLoading.value || categoriesLoading.value)

const resetForm = () => {
  form.id = null
  form.name = ''
  form.description = ''
  form.price = ''
  form.stock = ''
  form.category_id = ''
  errors.value = {}
}

const validate = () => {
  const nextErrors = {}
  const parsedPrice = Number(form.price)
  const parsedStock = Number(form.stock)

  if (!form.name.trim()) {
    nextErrors.name = 'El nombre es obligatorio.'
  }

  if (!form.description.trim()) {
    nextErrors.description = 'La descripcion es obligatoria.'
  }

  if (!form.price || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    nextErrors.price = 'El precio debe ser numerico y mayor a 0.'
  }

  if (form.stock === '' || Number.isNaN(parsedStock) || parsedStock < 0) {
    nextErrors.stock = 'El stock debe ser numerico y mayor o igual a 0.'
  }

  if (!form.category_id) {
    nextErrors.category_id = 'Debes seleccionar una categoria.'
  }

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const submitProduct = async () => {
  if (!validate()) return

  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    stock: Number(form.stock),
    category_id: Number(form.category_id),
  }

  if (isEditing.value) {
    await productsStore.updateProduct(form.id, payload)
  } else {
    await productsStore.createProduct(payload)
  }

  resetForm()
}

const editProduct = (product) => {
  form.id = product.id
  form.name = product.name
  form.description = product.description ?? ''
  form.price = String(product.price)
  form.stock = String(product.stock)
  form.category_id = String(product.category_id ?? '')
  errors.value = {}
}

const removeProduct = async (product) => {
  const confirmed = window.confirm(
    `Se eliminara el producto "${product.name}". Deseas continuar?`,
  )

  if (!confirmed) return

  await productsStore.deleteProduct(product.id)

  if (isEditing.value && String(form.id) === String(product.id)) {
    resetForm()
  }
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    productsStore.fetchProducts(),
  ])
})
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[360px,1fr]">
    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      <h1 class="text-2xl font-extrabold text-slate-900">Productos</h1>
      <p class="mt-2 text-sm text-slate-600">
        Crea o edita productos con validaciones de cliente.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="submitProduct">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700" for="product-name">
            Nombre del producto
          </label>
          <input
            id="product-name"
            v-model="form.name"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none ring-emerald-300 focus:ring-2"
            placeholder="Ej: Gaming Mouse"
          />
          <p v-if="errors.name" class="mt-1 text-xs font-semibold text-rose-600">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700" for="product-description">
            Descripcion
          </label>
          <textarea
            id="product-description"
            v-model="form.description"
            rows="3"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none ring-emerald-300 focus:ring-2"
            placeholder="Ej: Wireless ergonomic mouse"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-xs font-semibold text-rose-600">
            {{ errors.description }}
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700" for="product-price">
              Precio
            </label>
            <input
              id="product-price"
              v-model="form.price"
              type="number"
              min="0.01"
              step="0.01"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none ring-emerald-300 focus:ring-2"
              placeholder="89.99"
            />
            <p v-if="errors.price" class="mt-1 text-xs font-semibold text-rose-600">
              {{ errors.price }}
            </p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700" for="product-stock">
              Stock
            </label>
            <input
              id="product-stock"
              v-model="form.stock"
              type="number"
              min="0"
              step="1"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none ring-emerald-300 focus:ring-2"
              placeholder="150"
            />
            <p v-if="errors.stock" class="mt-1 text-xs font-semibold text-rose-600">
              {{ errors.stock }}
            </p>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700" for="product-category">
            Categoria
          </label>
          <select
            id="product-category"
            v-model="form.category_id"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none ring-emerald-300 focus:ring-2"
          >
            <option value="">Selecciona una categoria</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="String(category.id)"
            >
              {{ category.name }}
            </option>
          </select>
          <p v-if="errors.category_id" class="mt-1 text-xs font-semibold text-rose-600">
            {{ errors.category_id }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            class="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-emerald-600"
          >
            {{ isEditing ? 'Actualizar' : 'Crear' }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            @click="resetForm"
          >
            Limpiar
          </button>
        </div>
      </form>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-xl font-extrabold text-slate-900">Listado de productos</h2>
        <span class="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-900">
          {{ products.length }} registros
        </span>
      </div>

      <div v-if="products.length" class="mt-5 overflow-x-auto">
        <table class="w-full min-w-[760px] border-separate border-spacing-y-2">
          <thead>
            <tr class="text-left text-xs uppercase tracking-wide text-slate-500">
              <th class="px-3 py-2">Nombre</th>
              <th class="px-3 py-2">Descripcion</th>
              <th class="px-3 py-2">Precio</th>
              <th class="px-3 py-2">Stock</th>
              <th class="px-3 py-2">Categoria</th>
              <th class="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product.id"
              class="rounded-lg bg-slate-50 text-slate-800 shadow-sm"
            >
              <td class="px-3 py-3 font-semibold">{{ product.name }}</td>
              <td class="px-3 py-3 text-sm">{{ product.description }}</td>
              <td class="px-3 py-3 font-medium">{{ formatCurrency(product.price) }}</td>
              <td class="px-3 py-3 text-sm">{{ product.stock }}</td>
              <td class="px-3 py-3 text-sm">{{ product.category_name }}</td>
              <td class="px-3 py-3">
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="rounded-md bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-amber-500"
                    @click="editProduct(product)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="rounded-md bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-rose-600"
                    @click="removeProduct(product)"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600"
      >
        No hay productos registrados.
      </div>
    </article>
  </section>

  <BaseSpinner v-if="isLoading" />
</template>
