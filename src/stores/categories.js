import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../services/api'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])
  const isLoading = ref(false)
  const toast = useToast()

  const normalizeCategory = (item) => ({
    ...item,
    id: item?.id ?? item?._id,
    name: item?.name ?? item?.nombre ?? '',
    description: item?.description ?? item?.descripcion ?? '',
  })

  const mapCollection = (data) => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.items)) return data.items
    return []
  }

  const unwrapResource = (data) => {
    if (data?.data && !Array.isArray(data.data)) return data.data
    return data
  }

  const sameId = (a, b) => String(a) === String(b)

  const fetchCategories = async () => {
    isLoading.value = true

    try {
      const { data } = await api.get('/categories')
      categories.value = mapCollection(data).map(normalizeCategory)
      toast.success('Categorias cargadas correctamente')
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (payload) => {
    isLoading.value = true

    try {
      const { data } = await api.post('/categories', payload)
      const createdCategory = normalizeCategory(unwrapResource(data))
      categories.value = [createdCategory, ...categories.value]
      toast.success('Categoria creada correctamente')
      return data
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (id, payload) => {
    isLoading.value = true

    try {
      const { data } = await api.put(`/categories/${id}`, payload)
      const updatedCategory = normalizeCategory(unwrapResource(data))
      categories.value = categories.value.map((category) =>
        sameId(category.id, updatedCategory.id) || sameId(category.id, id)
          ? { ...category, ...updatedCategory }
          : category,
      )
      toast.success('Categoria actualizada correctamente')
      return data
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (id) => {
    isLoading.value = true

    try {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter((category) => !sameId(category.id, id))
      toast.success('Categoria eliminada correctamente')
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
