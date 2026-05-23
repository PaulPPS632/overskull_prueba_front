import axios from 'axios'
import { createToastInterface } from 'vue-toastification'

const toast = createToastInterface()

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() }
  return config
})

const getErrorMessage = (error) => {
  const responseMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.detail

  if (responseMessage) {
    return responseMessage
  }

  const status = error?.response?.status

  if (status >= 500) {
    return 'Error interno del servidor. Intenta nuevamente.'
  }

  if (status >= 400) {
    return 'La solicitud no pudo completarse. Verifica los datos.'
  }

  if (error?.request) {
    return 'No se pudo conectar con la API. Revisa el backend.'
  }

  return 'Ocurrio un error inesperado.'
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if ((status && status >= 400 && status < 600) || !status) {
      toast.error(getErrorMessage(error))
    }

    return Promise.reject(error)
  },
)

export default api
