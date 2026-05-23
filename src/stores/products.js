import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../services/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const isLoading = ref(false)
  const toast = useToast()

  const normalizeProduct = (item) => ({
    ...item,
    id: item?.id ?? item?._id,
    name: item?.name ?? item?.nombre ?? '',
    description: item?.description ?? item?.descripcion ?? '',
    price: Number(item?.price ?? item?.precio ?? 0),
    stock: Number(item?.stock ?? item?.cantidad ?? 0),
    category_id:
      item?.category_id ?? item?.categoriaId ?? item?.categoria_id ?? item?.category?.id ?? null,
    category_name:
      item?.category_name ?? item?.categoriaNombre ?? item?.category?.name ?? 'Sin categoria',
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

  const fetchProducts = async () => {
    isLoading.value = true

    try {
      const { data } = await api.get('/products')
      products.value = mapCollection(data).map(normalizeProduct)
      toast.success('Productos cargados correctamente')
    } finally {
      isLoading.value = false
    }
  }

  const createProduct = async (payload) => {
    isLoading.value = true

    try {
      const { data } = await api.post('/products', payload)
      const createdProduct = normalizeProduct(unwrapResource(data))
      products.value = [createdProduct, ...products.value]
      toast.success('Producto creado correctamente')
      return data
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (id, payload) => {
    isLoading.value = true

    try {
      const { data } = await api.put(`/products/${id}`, payload)
      const updatedProduct = normalizeProduct(unwrapResource(data))
      products.value = products.value.map((product) =>
        sameId(product.id, updatedProduct.id) || sameId(product.id, id)
          ? { ...product, ...updatedProduct }
          : product,
      )
      toast.success('Producto actualizado correctamente')
      return data
    } finally {
      isLoading.value = false
    }
  }

  const deleteProduct = async (id) => {
    isLoading.value = true

    try {
      await api.delete(`/products/${id}`)
      products.value = products.value.filter((product) => !sameId(product.id, id))
      toast.success('Producto eliminado correctamente')
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})
