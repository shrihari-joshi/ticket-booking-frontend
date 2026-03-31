import axios from 'axios'

const SERVICE_URLS = {
  user: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081',
  event: import.meta.env.VITE_EVENT_SERVICE_URL || 'http://localhost:8082',
  booking: import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:8083',
}

function createServiceClient(baseURL) {
  const client = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  })

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return client
}

export const userApi = createServiceClient(SERVICE_URLS.user)
export const eventApi = createServiceClient(SERVICE_URLS.event)
export const bookingApi = createServiceClient(SERVICE_URLS.booking)
