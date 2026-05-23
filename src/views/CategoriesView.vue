<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '../stores/categories'
import BaseSpinner from '../components/BaseSpinner.vue'

const categoriesStore = useCategoriesStore()
const { categories, isLoading } = storeToRefs(categoriesStore)

const form = reactive({
  id: null,
  name: '',
  description: '',
})

const errors = ref({})

const isEditing = computed(() => form.id !== null)

const resetForm = () => {
  form.id = null
  form.name = ''
  form.description = ''
  errors.value = {}
}

const validate = () => {
  const nextErrors = {}

  if (!form.name.trim()) {
    nextErrors.name = 'El nombre es obligatorio.'
  }

  if (!form.description.trim()) {
    nextErrors.description = 'La descripcion es obligatoria.'
  }

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const submitCategory = async () => {
  if (!validate()) return

  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
  }

  if (isEditing.value) {
    await categoriesStore.updateCategory(form.id, payload)
  } else {
    await categoriesStore.createCategory(payload)
  }

  resetForm()
}

const editCategory = (category) => {
  form.id = category.id
  form.name = category.name
  form.description = category.description ?? ''
  errors.value = {}
}

const removeCategory = async (category) => {
  const confirmed = window.confirm(
    `Se eliminara la categoria "${category.name}". Deseas continuar?`,
  )

  if (!confirmed) return

  await categoriesStore.deleteCategory(category.id)

  if (isEditing.value && String(form.id) === String(category.id)) {
    resetForm()
  }
}

onMounted(async () => {
  await categoriesStore.fetchCategories()
})
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[340px,1fr]">
    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
      <h1 class="text-2xl font-extrabold text-slate-900">Categorias</h1>
      <p class="mt-2 text-sm text-slate-600">
        Crea o edita categorias con validacion en cliente.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="submitCategory">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700" for="category-name">
            Nombre de categoria
          </label>
          <input
            id="category-name"
            v-model="form.name"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none ring-emerald-300 focus:ring-2"
            placeholder="Ej: Tecnologia"
          />
          <p v-if="errors.name" class="mt-1 text-xs font-semibold text-rose-600">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-700" for="category-description">
            Descripcion
          </label>
          <textarea
            id="category-description"
            v-model="form.description"
            rows="3"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none ring-emerald-300 focus:ring-2"
            placeholder="Ej: Computer accessories category"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-xs font-semibold text-rose-600">
            {{ errors.description }}
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
        <h2 class="text-xl font-extrabold text-slate-900">Listado de categorias</h2>
        <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-900">
          {{ categories.length }} registros
        </span>
      </div>

      <div v-if="categories.length" class="mt-5 overflow-x-auto">
        <table class="w-full min-w-[480px] border-separate border-spacing-y-2">
          <thead>
            <tr class="text-left text-xs uppercase tracking-wide text-slate-500">
              <th class="px-3 py-2">Nombre</th>
              <th class="px-3 py-2">Descripcion</th>
              <th class="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in categories"
              :key="category.id"
              class="rounded-lg bg-slate-50 text-slate-800 shadow-sm"
            >
              <td class="px-3 py-3 font-semibold">{{ category.name }}</td>
              <td class="px-3 py-3 text-sm">{{ category.description }}</td>
              <td class="px-3 py-3">
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="rounded-md bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-amber-500"
                    @click="editCategory(category)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="rounded-md bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-rose-600"
                    @click="removeCategory(category)"
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
        No hay categorias registradas.
      </div>
    </article>
  </section>

  <BaseSpinner v-if="isLoading" />
</template>
